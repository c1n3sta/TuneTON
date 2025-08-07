import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from '@tuneton/shared';
import { errorHandler } from './middleware/errorHandler';
import { AppDataSource } from './config/data-source';
import userRoutes from './routes/userRoutes';

// Initialize Express application
const app = express();
const PORT = config.userService.port || 3002;

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: config.cors.origins,
  credentials: true
}));
app.use(express.json()); // Parse JSON bodies
app.use(morgan('dev')); // Request logging

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'user-service' });
});

// Routes
app.use('/api/v1/users', userRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Initialize database connection and start server
const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully');
    
    app.listen(PORT, () => {
      console.log(`User Service running on port ${PORT}`);
      console.log(`Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: Error | any, promise: Promise<any>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Consider whether to exit the process here
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
startServer();

export default app;
