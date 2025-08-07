import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../utils/logger';
import { config } from '@tuneton/shared';

// Define the base directory where audio files are stored
const AUDIO_FILES_DIR = process.env.AUDIO_FILES_DIR || './uploads/audio';

/**
 * Stream audio file by track ID
 * @route GET /api/stream/:trackId
 * @param {string} trackId - The ID of the track to stream
 * @returns {Stream} Audio stream
 */
export const streamAudio = async (req: Request, res: Response): Promise<void> => {
  try {
    const { trackId } = req.params;
    const filePath = path.join(AUDIO_FILES_DIR, `${trackId}.mp3`);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      res.status(StatusCodes.NOT_FOUND).json({
        status: 'error',
        message: 'Audio file not found',
      });
      return;
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      // Handle range requests for seeking
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'audio/mpeg',
      };

      res.writeHead(StatusCodes.PARTIAL_CONTENT, head);
      file.pipe(res);
    } else {
      // Handle full file request
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'audio/mpeg',
      };
      
      res.writeHead(StatusCodes.OK, head);
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (error) {
    logger.error('Streaming error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Error streaming audio',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Get track metadata
 * @route GET /api/stream/:trackId/metadata
 * @param {string} trackId - The ID of the track
 * @returns {Object} Track metadata
 */
export const getTrackMetadata = async (req: Request, res: Response): Promise<void> => {
  try {
    const { trackId } = req.params;
    // TODO: Fetch actual metadata from database or metadata service
    
    // Mock metadata for now
    const metadata = {
      id: trackId,
      title: 'Sample Track',
      artist: 'Unknown Artist',
      duration: 180, // in seconds
      bitrate: 192, // in kbps
      format: 'mp3',
      size: 1024 * 1024 * 5, // 5MB
    };

    res.status(StatusCodes.OK).json({
      status: 'success',
      data: metadata,
    });
  } catch (error) {
    logger.error('Error fetching track metadata:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Error fetching track metadata',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
