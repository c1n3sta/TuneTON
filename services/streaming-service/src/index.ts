import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { StatusCodes } from 'http-status-codes';
import { config } from '@tuneton/shared';

// Import routes
import { streamRoutes } from './routes/streamRoutes';
import { healthCheck } from './controllers/healthController';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

const app = express();
const PORT = config.services.streaming.port;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(
  morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  })
);

// Routes
app.get('/', (req, res) => {
  res.status(StatusCodes.OK).json({
    service: 'TuneTON Streaming Service',
    status: 'running',
    documentation: '/api-docs',
  });
});

// API Routes
app.use('/api/stream', streamRoutes);
app.get('/health', healthCheck);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Streaming Service running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export { app };
