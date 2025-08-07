import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createConnection } from 'typeorm';
import { createLogger } from 'winston';
import { config } from '@tuneton/shared';
import { errorHandler } from './middleware/errorHandler';
import { auth } from './middleware/auth';
import trackRoutes from './routes/trackRoutes';

const app = express();
const port = config.services.track.port;
const logger = createLogger({
  level: 'info',
  format: config.logging.format,
  transports: [
    new config.logging.transports.Console(),
    new config.logging.transports.File({ filename: 'logs/track-service.log' })
  ]
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Routes
app.use('/api/v1/tracks', auth, trackRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use(errorHandler);

// Initialize database connection and start server
const startServer = async () => {
  try {
    await createConnection({
      type: 'postgres',
      url: config.database.url,
      entities: [`${__dirname}/entities/*.ts`],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
    });
    
    app.listen(port, () => {
      logger.info(`Track Service running on port ${port}`);
    });
  } catch (error) {
    logger.error('Failed to start Track Service:', error);
    process.exit(1);
  }
};

startServer();
