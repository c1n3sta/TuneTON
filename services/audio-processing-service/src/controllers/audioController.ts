import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';
import { createLogger } from 'winston';
import { config } from '@tuneton/shared';
import { addAudioJob, AudioJobData } from '../services/queue';
import { ProcessAudioOptions } from '../services/audioProcessor';

const logger = createLogger({
  level: 'info',
  format: config.logging.format,
  transports: [
    new config.logging.transports.Console(),
    new config.logging.transports.File({ filename: 'logs/audio-controller.log' })
  ]
});

const mkdir = util.promisify(fs.mkdir);
const exists = util.promisify(fs.exists);

class AudioController {
  /**
   * Process an audio file with the specified options
   */
  async processAudio(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { trackId, format, options } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      if (!trackId) {
        return res.status(400).json({ error: 'trackId is required' });
      }

      // Create uploads directory if it doesn't exist
      const uploadDir = path.join(config.storage.uploadPath, userId);
      if (!(await exists(uploadDir))) {
        await mkdir(uploadDir, { recursive: true });
      }

      // Move the uploaded file to a permanent location
      const fileExt = path.extname(req.file.originalname);
      const filename = `${uuidv4()}${fileExt}`;
      const filePath = path.join(uploadDir, filename);
      
      await fs.promises.rename(req.file.path, filePath);

      // Prepare job data
      const jobData: Omit<AudioJobData, 'jobId'> = {
        userId,
        trackId,
        originalFilePath: filePath,
        outputFormats: [
          {
            format: format || 'mp3',
            options: options || {}
          }
        ]
      };

      // Add job to the queue
      const jobId = await addAudioJob(jobData);

      res.status(202).json({
        message: 'Audio processing started',
        jobId,
        trackId,
        statusUrl: `/api/v1/audio/status/${jobId}`
      });

    } catch (error) {
      logger.error('Error in processAudio:', error);
      res.status(500).json({
        error: 'Failed to process audio',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get the status of an audio processing job
   */
  async getJobStatus(req: Request, res: Response) {
    try {
      const { jobId } = req.params;
      const jobStatus = await getJobStatus(jobId);

      if (!jobStatus) {
        return res.status(404).json({ error: 'Job not found' });
      }

      // Don't expose internal paths in the response
      const { data, ...status } = jobStatus;
      const response = {
        ...status,
        data: {
          ...data,
          originalFilePath: undefined, // Don't expose internal paths
          outputPath: undefined
        }
      };

      res.json(response);
    } catch (error) {
      logger.error('Error in getJobStatus:', error);
      res.status(500).json({
        error: 'Failed to get job status',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * List all audio processing jobs for the authenticated user
   */
  async listJobs(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { status, limit = 10, offset = 0 } = req.query;

      // Get jobs from the queue
      const jobs = await audioQueue.getJobs([
        'waiting',
        'active',
        'completed',
        'failed',
        'delayed'
      ], offset as number, (offset as number) + (limit as number));

      // Filter jobs by user ID and status
      const userJobs = jobs
        .filter(job => job.data.userId === userId)
        .filter(job => !status || (await job.getState()) === status)
        .map(job => ({
          id: job.id,
          name: job.name,
          data: {
            trackId: job.data.trackId,
            // Don't expose internal paths
            originalFilePath: undefined,
            outputFormats: job.data.outputFormats
          },
          progress: job.progress(),
          status: job.getState()
        }));

      res.json({
        jobs: userJobs,
        pagination: {
          total: userJobs.length,
          limit: Number(limit),
          offset: Number(offset)
        }
      });
    } catch (error) {
      logger.error('Error in listJobs:', error);
      res.status(500).json({
        error: 'Failed to list jobs',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export default new AudioController();
