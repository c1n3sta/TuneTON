import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@tuneton/shared';
import { AppError, catchAsync } from '../middleware/errorHandler';

// Define token payload interface
export interface TokenPayload {
  userId: string;
  telegramId: number;
  iat: number;
  exp: number;
}

export const initJwtAuth = (app: any) => {
  const router = Router();

  // Generate JWT tokens
  const signToken = (userId: string, telegramId: number) => {
    return jwt.sign(
      { userId, telegramId },
      config.jwt.secret,
      { 
        expiresIn: config.jwt.accessExpirationMinutes * 60, // in seconds
        issuer: config.jwt.issuer,
        audience: config.jwt.audience,
      }
    );
  };

  // Generate refresh token
  const generateRefreshToken = (userId: string, telegramId: number) => {
    return jwt.sign(
      { userId, telegramId },
      config.jwt.refreshSecret,
      {
        expiresIn: config.jwt.refreshExpirationDays * 24 * 60 * 60, // in seconds
        issuer: config.jwt.issuer,
        audience: config.jwt.audience,
      }
    );
  };

  // Create and send JWT tokens
  const createSendToken = (
    userId: string,
    telegramId: number,
    statusCode: number,
    res: Response
  ) => {
    const accessToken = signToken(userId, telegramId);
    const refreshToken = generateRefreshToken(userId, telegramId);

    // Set JWT as HTTP-only cookie
    const cookieOptions = {
      expires: new Date(
        Date.now() + config.jwt.refreshExpirationDays * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only HTTPS in production
      sameSite: 'strict' as const,
    };

    res.cookie('jwt', refreshToken, cookieOptions);

    // Remove password from output
    res.status(statusCode).json({
      status: 'success',
      accessToken,
      expiresIn: config.jwt.accessExpirationMinutes * 60, // in seconds
      tokenType: 'Bearer',
    });
  };

  // Login route - generates new tokens
  router.post(
    '/login',
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const { userId, telegramId } = req.body;

      if (!userId || !telegramId) {
        throw new AppError('Please provide userId and telegramId', 400);
      }

      // In a real app, you would verify the user's credentials here
      // For now, we'll just use the provided IDs
      
      createSendToken(userId, telegramId, 200, res);
    })
  );

  // Refresh token route
  router.post(
    '/refresh-token',
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const refreshToken = req.cookies.jwt;

      if (!refreshToken) {
        throw new AppError('No refresh token provided', 401);
      }

      // Verify refresh token
      const decoded = jwt.verify(
        refreshToken,
        config.jwt.refreshSecret
      ) as TokenPayload;

      // In a real app, you would check if the user still exists
      // and if the refresh token hasn't been revoked
      
      // Issue new tokens
      createSendToken(decoded.userId, decoded.telegramId, 200, res);
    })
  );

  // Logout route
  router.post(
    '/logout',
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      // Clear the JWT cookie
      res.clearCookie('jwt');
      
      res.status(200).json({
        status: 'success',
        message: 'Successfully logged out',
      });
    })
  );

  // Protected route example - requires valid JWT
  router.get(
    '/protected',
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      // Get token from header
      let token;
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        token = req.headers.authorization.split(' ')[1];
      }

      if (!token) {
        throw new AppError('You are not logged in! Please log in to get access.', 401);
      }

      // Verify token
      const decoded = jwt.verify(token, config.jwt.secret) as TokenPayload;

      // In a real app, you would check if the user still exists
      
      // Grant access to protected route
      res.status(200).json({
        status: 'success',
        data: {
          userId: decoded.userId,
          telegramId: decoded.telegramId,
        },
      });
    })
  );

  // Apply the router to the app
  app.use('/api/v1/auth', router);
};
