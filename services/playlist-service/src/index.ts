import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import { createConnection } from 'typeorm';
import { createLogger, format, transports } from 'winston';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { config } from '@tuneton/shared';
import { errorHandler } from './middleware/errorHandler';

// Initialize Express app
const app = express();
const port = config.services.playlist.port || 3004;

// Configure logger
const logger = createLogger({
  level: config.logging.level || 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'playlist-service' },
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(
          ({ level, message, timestamp, ...meta }) =>
            `${timestamp} [${level}]: ${message} ${
              Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
            }`
        )
      ),
    }),
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: config.cors.origins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(
    morgan('combined', {
      stream: {
        write: (message: string) => logger.info(message.trim()),
      },
    })
  );
}

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'playlist-service',
  });
});

// API Routes will be added here
// app.use('/api/v1/playlists', playlistRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Not Found',
  });
});

// Error handling middleware
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

    // Start the server
    const server = app.listen(port, () => {
      logger.info(`Playlist Service running in ${process.env.NODE_ENV} mode on port ${port}`);
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
    logger.error('Failed to start Playlist Service:', error);
    process.exit(1);
  }
};

// Only start the server if this file is run directly
if (require.main === module) {
  startServer();
}

export { app };
