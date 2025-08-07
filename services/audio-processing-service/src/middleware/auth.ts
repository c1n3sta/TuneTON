import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@tuneton/shared';
import { AppError } from './errorHandler';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Check if no token
  if (!token) {
    return next(new AppError(401, 'No token, authorization denied'));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret) as { userId: string };
    
    // Add user from payload
    (req as any).user = { id: decoded.userId };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError(401, 'Token expired'));
    }
    if (err.name === 'JsonWebTokenError') {
      return next(new AppError(401, 'Invalid token'));
    }
    next(err);
  }
};

export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (!(req as any).user?.isAdmin) {
    return next(new AppError(403, 'Admin access required'));
  }
  next();
};
