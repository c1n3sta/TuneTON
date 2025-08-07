import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../utils/logger';

interface JwtPayload {
  userId: string;
  telegramId: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

    jwt.verify(token, secret, (err, user) => {
      if (err) {
        logger.warn('JWT verification failed', { error: err.message });
        return res.sendStatus(StatusCodes.FORBIDDEN);
      }
      
      req.user = user as JwtPayload;
      next();
    });
  } else {
    logger.warn('No authorization header provided');
    res.sendStatus(StatusCodes.UNAUTHORIZED);
  }
};

export const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      logger.warn('Unauthorized access attempt - no user in request');
      return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(`Forbidden: User ${req.user.userId} with role ${req.user.role} attempted to access restricted resource`);
      return res.sendStatus(StatusCodes.FORBIDDEN);
    }

    next();
  };
};
