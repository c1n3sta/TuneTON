import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from '@tuneton/shared';
import { errorHandler } from './middleware/errorHandler';
import { initTelegramAuth } from './routes/telegramAuth';
import { initJwtAuth } from './routes/jwtAuth';

// Initialize Express application
const app = express();
const PORT = config.authService.port || 3001;

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
  res.status(200).json({ status: 'ok', service: 'auth-service' });
});

// Initialize routes
initTelegramAuth(app);
initJwtAuth(app);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
  console.log(`Environment: ${config.nodeEnv}`);
}).on('error', (error: NodeJS.ErrnoException) => {
  console.error('Server startup error:', error);
  process.exit(1);
});

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

export default app;
