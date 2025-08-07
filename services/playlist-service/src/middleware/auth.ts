import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@tuneton/shared';
import { AppError } from './errorHandler';

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        telegramId: number;
        isAdmin: boolean;
      };
    }
  }
}

/**
 * Middleware to authenticate JWT token
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AppError('No token provided', 401);
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret) as {
      userId: string;
      telegramId: number;
      isAdmin: boolean;
    };

    // Add user to request object
    req.user = {
      id: decoded.userId,
      telegramId: decoded.telegramId,
      isAdmin: decoded.isAdmin,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('Token expired', 401));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token', 401));
    } else {
      next(error);
    }
  }
};

/**
 * Middleware to check if user is admin
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) {
    throw new AppError('Unauthorized - Admin access required', 403);
  }
  next();
};

/**
 * Middleware to check if user is the owner of the resource
 */
export const isOwner = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  
  // Allow admins to access any resource
  if (req.user?.isAdmin) {
    return next();
  }

  // Check if the requested user ID matches the authenticated user's ID
  if (req.user?.id !== userId) {
    throw new AppError('Unauthorized - Access to this resource is forbidden', 403);
  }
  
  next();
};

/**
 * Middleware to check if user is the owner or admin
 */
export const isOwnerOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  
  // Allow admins to access any resource
  if (req.user?.isAdmin) {
    return next();
  }

  // Check if the requested user ID matches the authenticated user's ID
  if (req.user?.id !== userId) {
    throw new AppError('Unauthorized - Access to this resource is forbidden', 403);
  }
  
  next();
};
