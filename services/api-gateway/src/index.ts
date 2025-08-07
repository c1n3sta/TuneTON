import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { StatusCodes } from 'http-status-codes';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { config } from '@tuneton/shared';
import { logger } from './utils/logger';

const app = express();
const PORT = config.port;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
const { services } = config;

// Auth Service
app.use('/api/auth', createProxyMiddleware({
  target: services.auth.url,
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': services.auth.basePath,
  },
  onError: (err, req, res) => {
    logger.error(`Auth Service Error: ${err.message}`, { error: err });
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
      error: 'Service Unavailable',
      message: 'Authentication service is currently unavailable',
    });
  },
}));

// User Service
app.use('/api/users', createProxyMiddleware({
  target: services.user.url,
  changeOrigin: true,
  pathRewrite: {
    '^/api/users': services.user.basePath,
  },
  onError: (err, req, res) => {
    logger.error(`User Service Error: ${err.message}`, { error: err });
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
      error: 'Service Unavailable',
      message: 'User service is currently unavailable',
    });
  },
}));

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack });
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    error: 'Not Found',
    message: `The requested resource ${req.originalUrl} was not found`,
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
