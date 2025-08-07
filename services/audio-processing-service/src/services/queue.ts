import { Queue, Worker, Job } from 'bullmq';
import { createLogger } from 'winston';
import { config } from '@tuneton/shared';
import { processAudio } from './audioProcessor';

export interface AudioJobData {
  jobId: string;
  userId: string;
  trackId: string;
  originalFilePath: string;
  outputFormats: {
    format: string;
    options: {
      pitchShift?: number;
      tempo?: number;
      bitrate?: number;
    };
  }[];
}

const logger = createLogger({
  level: 'info',
  format: config.logging.format,
  transports: [
    new config.logging.transports.Console(),
    new config.logging.transports.File({ filename: 'logs/audio-queue.log' })
  ]
});

let audioQueue: Queue<AudioJobData>;

export const initQueue = async (): Promise<Queue<AudioJobData>> => {
  audioQueue = new Queue<AudioJobData>('audio-processing', {
    connection: {
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
    },
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
    },
  });

  return audioQueue;
};

export const addAudioJob = async (jobData: Omit<AudioJobData, 'jobId'>) => {
  const job = await audioQueue.add('process-audio', {
    ...jobData,
    jobId: `audio-${Date.now()}`,
  });
  return job.id;
};

export const processQueue = async (queue: Queue<AudioJobData>) => {
  const worker = new Worker<AudioJobData>(
    'audio-processing',
    async (job: Job<AudioJobData>) => {
      const { jobId, userId, trackId, originalFilePath, outputFormats } = job.data;
      
      logger.info(`Starting audio processing job ${jobId} for track ${trackId}`);
      
      try {
        const results = await Promise.all(
          outputFormats.map(format => 
            processAudio({
              jobId,
              userId,
              trackId,
              originalFilePath,
              format: format.format,
              options: format.options,
            })
          )
        );
        
        logger.info(`Completed audio processing job ${jobId} for track ${trackId}`);
        return { success: true, results };
      } catch (error) {
        logger.error(`Error processing audio job ${jobId}:`, error);
        throw error;
      }
    },
    {
      connection: {
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password,
      },
      concurrency: 2, // Process 2 jobs at a time
      removeOnComplete: {
        age: 86400, // Keep completed jobs for 24 hours
        count: 1000, // Keep maximum 1000 completed jobs
      },
      removeOnFail: {
        age: 7 * 86400, // Keep failed jobs for 7 days
      },
    }
  );

  worker.on('completed', (job) => {
    logger.info(`Job ${job.id} completed`);
  });

  worker.on('failed', (job, error) => {
    logger.error(`Job ${job?.id} failed:`, error);
  });

  worker.on('error', (error) => {
    logger.error('Worker error:', error);
  });

  return worker;
};

export const getJobStatus = async (jobId: string) => {
  const job = await audioQueue.getJob(jobId);
  if (!job) {
    return null;
  }
  
  const state = await job.getState();
  const progress = job.progress();
  
  return {
    id: job.id,
    state,
    progress,
    data: job.data,
    returnValue: job.returnvalue,
    failedReason: job.failedReason,
    timestamp: job.timestamp,
    processedOn: job.processedOn,
    finishedOn: job.finishedOn,
  };
};
