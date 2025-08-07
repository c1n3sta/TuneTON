import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { config } from '@tuneton/shared';
import { AppError, catchAsync } from '../middleware/errorHandler';

export const initTelegramAuth = (app: any) => {
  const router = Router();
  
  // Validate Telegram WebApp initData
  router.post(
    '/telegram/auth',
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const { initData } = req.body;

      if (!initData) {
        throw new AppError('No initData provided', 400);
      }

      // Parse the URL-encoded initData
      const params = new URLSearchParams(initData);
      const hash = params.get('hash');
      
      if (!hash) {
        throw new AppError('Invalid initData: No hash provided', 400);
      }

      // Remove hash from params for validation
      params.delete('hash');
      
      // Sort all parameters alphabetically by key
      const dataToCheck = Array.from(params.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

      // Create a SHA256 HMAC with the bot token as the key
      const secret = crypto
        .createHmac('sha256', 'WebAppData')
        .update(config.telegram.botToken);
      
      const calculatedHash = crypto
        .createHmac('sha256', secret.digest())
        .update(dataToCheck)
        .digest('hex');

      // Compare the calculated hash with the provided hash
      if (calculatedHash !== hash) {
        throw new AppError('Invalid Telegram authentication data', 401);
      }

      // At this point, the request is authenticated
      // Extract user data from the initData
      const userData = params.get('user');
      if (!userData) {
        throw new AppError('No user data in initData', 400);
      }

      const user = JSON.parse(userData);
      
      // Here you would typically:
      // 1. Find or create the user in your database
      // 2. Generate a JWT token for the user session
      // 3. Return the token to the client
      
      // For now, we'll just return the user data
      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            username: user.username,
            photoUrl: user.photo_url,
            authDate: new Date(parseInt(user.auth_date) * 1000),
          },
        },
      });
    })
  );

  // Apply the router to the app
  app.use('/api/v1/auth', router);
};
