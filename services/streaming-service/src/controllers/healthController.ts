import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../utils/logger';

/**
 * Health check endpoint
 * @route GET /health
 * @returns {Object} Status of the service
 */
export const healthCheck = async (req: Request, res: Response): Promise<void> => {
  try {
    // TODO: Add service health checks (e.g., database connection, cache, etc.)
    const healthStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      env: process.env.NODE_ENV || 'development',
    };

    res.status(StatusCodes.OK).json(healthStatus);
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
      status: 'error',
      message: 'Service unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
