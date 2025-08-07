import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { config } from '@tuneton/shared';
import { logger } from '../utils/logger';

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any; // Replace 'any' with your User type
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header
 */
export const auth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: 'error',
        message: 'No token provided',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    
    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwt.secret) as any; // Replace 'any' with your JWT payload type
      
      // Add user to request object
      req.user = decoded;
      
      next();
    } catch (error) {
      logger.error('Token verification failed:', error);
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: 'error',
        message: 'Invalid or expired token',
      });
    }
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Authentication failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
