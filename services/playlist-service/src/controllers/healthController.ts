import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { asyncHandler } from '../middleware/errorHandler';

/**
 * Health check endpoint handler
 */
export const healthCheck = asyncHandler(async (req: Request, res: Response) => {
  // Check database connection
  const db = getConnection();
  const isDbConnected = db.isConnected;

  const healthStatus = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'playlist-service',
    database: isDbConnected ? 'connected' : 'disconnected',
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
  };

  // Set status code based on database connection status
  const statusCode = isDbConnected ? 200 : 503;

  res.status(statusCode).json(healthStatus);
});

/**
 * Simple ping endpoint
 */
export const ping = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'pong',
    timestamp: new Date().toISOString(),
  });
};
