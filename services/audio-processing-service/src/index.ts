import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createConnection } from 'typeorm';
import { createLogger } from 'winston';
import { config } from '@tuneton/shared';
import { errorHandler } from './middleware/errorHandler';
import { initQueue, processQueue } from './services/queue';
import { processAudio } from './services/audioProcessor';
import audioRoutes from './routes/audioRoutes';
import healthRoutes from './routes/healthRoutes';

// Initialize Express app
const app = express();
const port = config.services.audioProcessing.port;

// Configure logger
const logger = createLogger({
  level: config.logging.level || 'info',
  format: config.logging.format,
  transports: [
    new config.logging.transports.Console(),
    new config.logging.transports.File({ 
      filename: 'logs/audio-service.log',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      tailable: true,
    })
  ],
  exitOnError: false,
});

// Global error handler for uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  // Don't exit in development to allow for debugging
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.cors.origins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim()), 
    },
  }));
}

// API Routes
app.use('/api/v1/audio', audioRoutes);
app.use('/health', healthRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Not Found',
  });});

// Error handling middleware (must be last)
app.use(errorHandler);

// Initialize database connection and start server
const startServer = async () => {
  try {
    // Initialize database connection
    const connection = await createConnection({
      type: 'postgres',
      url: config.database.url,
      entities: [`${__dirname}/entities/*.ts`],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
      extra: {
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      },
    });
    
    logger.info(`Connected to database: ${connection.options.database}`);
    
    // Initialize the queue
    const queue = await initQueue();
    logger.info('Connected to Redis message queue');
    
    // Start processing jobs
    await processQueue(queue);
    
    // Start the server
    const server = app.listen(port, () => {
      logger.info(`Audio Processing Service running in ${process.env.NODE_ENV} mode on port ${port}`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      logger.info('Shutting down gracefully...');
      
      // Close HTTP server
      server.close(async () => {
        logger.info('HTTP server closed');
        
        // Close database connection
        if (connection.isConnected) {
          await connection.close();
          logger.info('Database connection closed');
        }
        
        // Close Redis connection
        await queue.close();
        logger.info('Redis connection closed');
        
        process.exit(0);
      });

      // Force shutdown after timeout
      setTimeout(() => {
        logger.error('Force shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Handle signals
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
    
  } catch (error) {
    logger.error('Failed to start Audio Processing Service:', error);
    process.exit(1);
  }
};

// Only start the server if this file is run directly
if (require.main === module) {
  startServer();
}

export { app };
