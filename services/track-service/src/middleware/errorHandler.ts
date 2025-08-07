import { Request, Response, NextFunction } from 'express';
import { createLogger } from 'winston';
import { config } from '@tuneton/shared';

const logger = createLogger({
  level: 'error',
  format: config.logging.format,
  transports: [
    new config.logging.transports.Console(),
    new config.logging.transports.File({ filename: 'logs/track-service-error.log' })
  ]
});

class AppError extends Error {
  constructor(
    public statusCode: number = 500,
    public message: string = 'Internal Server Error',
    public isOperational: boolean = true,
    public stack: string = ''
  ) {
    super(message);
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    logger.error('Error:', {
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    // Handle specific error types
    if (err.name === 'CastError') {
      const message = `Resource not found. Invalid: ${err.path}`;
      error = new AppError(400, message);
    }

    if (err.code === 11000) {
      const message = 'Duplicate field value entered';
      error = new AppError(400, message);
    }

    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors)
        .map((val: any) => val.message)
        .join('. ');
      error = new AppError(400, message);
    }

    logger.error('Error:', {
      status: error.status,
      message: error.message,
    });
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message || 'Something went wrong',
  });
};

export default AppError;
