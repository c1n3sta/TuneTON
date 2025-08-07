import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import * as ffmpeg from 'fluent-ffmpeg';
import { v4 as uuidv4 } from 'uuid';
import { createLogger } from 'winston';
import { config } from '@tuneton/shared';

const logger = createLogger({
  level: 'info',
  format: config.logging.format,
  transports: [
    new config.logging.transports.Console(),
    new config.logging.transports.File({ filename: 'logs/audio-processor.log' })
  ]
});

const mkdir = util.promisify(fs.mkdir);
const unlink = util.promisify(fs.unlink);
const exists = util.promisify(fs.exists);

export interface ProcessAudioOptions {
  jobId: string;
  userId: string;
  trackId: string;
  originalFilePath: string;
  format: string;
  options: {
    pitchShift?: number;
    tempo?: number;
    bitrate?: number;
  };
}

export interface ProcessAudioResult {
  jobId: string;
  trackId: string;
  format: string;
  outputPath: string;
  duration: number;
  size: number;
  metadata: Record<string, any>;
  processingTime: number;
  status: 'success' | 'failed';
  error?: string;
}

const OUTPUT_FORMATS: Record<string, { extension: string; mimeType: string; defaultBitrate: number }> = {
  'mp3': { extension: 'mp3', mimeType: 'audio/mpeg', defaultBitrate: 192 },
  'aac': { extension: 'aac', mimeType: 'audio/aac', defaultBitrate: 128 },
  'ogg': { extension: 'ogg', mimeType: 'audio/ogg', defaultBitrate: 160 },
  'wav': { extension: 'wav', mimeType: 'audio/wav', defaultBitrate: 1411 },
  'flac': { extension: 'flac', mimeType: 'audio/flac', defaultBitrate: 0 },
};

export const processAudio = async ({
  jobId,
  userId,
  trackId,
  originalFilePath,
  format,
  options,
}: ProcessAudioOptions): Promise<ProcessAudioResult> => {
  const startTime = Date.now();
  const result: Partial<ProcessAudioResult> = {
    jobId,
    trackId,
    format,
    status: 'failed',
  };

  try {
    // Validate format
    const formatInfo = OUTPUT_FORMATS[format];
    if (!formatInfo) {
      throw new Error(`Unsupported audio format: ${format}`);
    }

    // Create output directory if it doesn't exist
    const outputDir = path.join(
      config.storage.processedAudioPath,
      userId,
      trackId
    );
    
    if (!(await exists(outputDir))) {
      await mkdir(outputDir, { recursive: true });
    }

    // Generate output filename
    const outputFilename = `${uuidv4()}.${formatInfo.extension}`;
    const outputPath = path.join(outputDir, outputFilename);
    
    // Set up FFmpeg command
    const command = ffmpeg(originalFilePath);
    
    // Apply audio filters
    const filters: string[] = [];
    
    // Apply pitch shift if specified
    if (options.pitchShift) {
      filters.push(`asetrate=44100*${Math.pow(2, options.pitchShift / 12)},aresample=44100`);
    }
    
    // Apply tempo change if specified
    if (options.tempo && options.tempo !== 1.0) {
      filters.push(`atempo=${options.tempo}`);
    }
    
    // Apply filters if any
    if (filters.length > 0) {
      command.audioFilters(filters.join(','));
    }
    
    // Set output format and quality
    const bitrate = options.bitrate || formatInfo.defaultBitrate;
    
    // Process the audio
    await new Promise<void>((resolve, reject) => {
      command
        .audioBitrate(bitrate)
        .audioChannels(2) // Convert to stereo
        .audioFrequency(44100) // 44.1kHz sample rate
        .on('start', (commandLine) => {
          logger.debug(`Started processing job ${jobId}: ${commandLine}`);
        })
        .on('progress', (progress) => {
          logger.debug(`Processing job ${jobId}: ${Math.round(progress.percent || 0)}%`);
        })
        .on('end', () => {
          logger.info(`Successfully processed job ${jobId} to ${format}`);
          resolve();
        })
        .on('error', (err) => {
          logger.error(`Error processing job ${jobId}:`, err);
          reject(err);
        })
        .save(outputPath);
    });

    // Get file stats
    const stats = await fs.promises.stat(outputPath);
    
    // Get duration using FFprobe
    const metadata = await new Promise<any>((resolve, reject) => {
      ffmpeg.ffprobe(outputPath, (err, metadata) => {
        if (err) reject(err);
        else resolve(metadata);
      });
    });;

    // Update result with success data
    result.status = 'success';
    result.outputPath = outputPath;
    result.duration = metadata.format.duration || 0;
    result.size = stats.size;
    result.metadata = metadata;
    result.processingTime = Date.now() - startTime;

  } catch (error) {
    logger.error(`Error in processAudio for job ${jobId}:`, error);
    result.error = error instanceof Error ? error.message : 'Unknown error';
    result.status = 'failed';
    result.processingTime = Date.now() - startTime;
  }

  return result as ProcessAudioResult;
};

// Cleanup temporary files
export const cleanupTempFiles = async (filePaths: string[]): Promise<void> => {
  try {
    for (const filePath of filePaths) {
      try {
        if (await exists(filePath)) {
          await unlink(filePath);
          logger.debug(`Cleaned up temporary file: ${filePath}`);
        }
      } catch (error) {
        logger.error(`Error cleaning up file ${filePath}:`, error);
      }
    }
  } catch (error) {
    logger.error('Error in cleanupTempFiles:', error);
  }
};
