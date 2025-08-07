import { Request, Response } from 'express';
import { createClient } from 'redis';
import { createLogger } from 'winston';
import { config } from '@tuneton/shared';

const logger = createLogger({
  level: 'info',
  format: config.logging.format,
  transports: [
    new config.logging.transports.Console(),
    new config.logging.transports.File({ filename: 'logs/health.log' })
  ]
});

class HealthController {
  /**
   * Health check endpoint
   */
  async checkHealth(req: Request, res: Response) {
    const healthcheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now(),
      checks: {
        redis: 'pending',
        storage: 'pending',
      },
    };

    // Check Redis connection
    try {
      const redisClient = createClient({
        url: `redis://${config.redis.host}:${config.redis.port}`,
        ...(config.redis.password && { password: config.redis.password }),
      });
      
      await redisClient.connect();
      await redisClient.ping();
      await redisClient.quit();
      healthcheck.checks.redis = 'healthy';
    } catch (error) {
      logger.error('Redis health check failed:', error);
      healthcheck.checks.redis = 'unhealthy';
      healthcheck.message = 'Redis connection failed';
    }

    // Check storage paths
    try {
      const fs = require('fs').promises;
      const paths = [
        config.storage.uploadPath,
        config.storage.processedPath,
        config.storage.tempPath,
      ];

      await Promise.all(
        paths.map(async (path) => {
          try {
            await fs.access(path, fs.constants.W_OK);
          } catch (error) {
            throw new Error(`No write access to ${path}`);
          }
        })
      );
      healthcheck.checks.storage = 'healthy';
    } catch (error) {
      logger.error('Storage health check failed:', error);
      healthcheck.checks.storage = 'unhealthy';
      healthcheck.message = 'Storage access failed';
    }

    // Determine overall status
    const isHealthy = Object.values(healthcheck.checks).every(
      (status) => status === 'healthy'
    );

    const statusCode = isHealthy ? 200 : 503;
    res.status(statusCode).json(healthcheck);
  }

  /**
   * Simple ping endpoint for load balancers
   */
  ping(req: Request, res: Response) {
    res.status(200).json({ status: 'ok', timestamp: Date.now() });
  }
}

export default new HealthController();
