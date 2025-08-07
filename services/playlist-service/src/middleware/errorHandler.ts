import { Request, Response, NextFunction } from 'express';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';
import { ValidationError } from 'class-validator';
import { logger } from '../utils/logger';

/**
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  errors?: Record<string, any>[];

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    errors?: Record<string, any>[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error handling middleware
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default error response
  let error = {
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  let statusCode = 500;
  let logError = true;

  // Handle different types of errors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    error = { ...error, ...err };
    logError = !err.isOperational;
  } else if (err instanceof SyntaxError && 'body' in err) {
    // Handle JSON parse errors
    statusCode = 400;
    error.message = 'Invalid JSON payload';
  } else if (err instanceof QueryFailedError) {
    // Handle database query errors
    statusCode = 400;
    error.message = 'Database query failed';
    
    // Add more specific error details for common database errors
    if (err.message.includes('duplicate key value')) {
      statusCode = 409; // Conflict
      error.message = 'Resource already exists';
    } else if (err.message.includes('violates not-null constraint')) {
      statusCode = 400;
      error.message = 'Missing required fields';
    }
  } else if (err instanceof EntityNotFoundError) {
    // Handle entity not found errors
    statusCode = 404;
    error.message = 'Requested resource not found';
  } else if (Array.isArray((err as any).errors) && (err as any).errors[0] instanceof ValidationError) {
    // Handle class-validator errors
    statusCode = 400;
    const validationErrors = (err as any).errors as ValidationError[];
    error.message = 'Validation failed';
    error['errors'] = validationErrors.map(e => ({
      property: e.property,
      constraints: e.constraints,
      value: e.value,
    }));
  }

  // Log the error if needed
  if (logError) {
    logger.error({
      message: err.message,
      stack: err.stack,
      statusCode,
      path: req.path,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query,
      user: (req as any).user?.id || 'anonymous',
    }, 'Unhandled error occurred');
  } else if (statusCode >= 500) {
    logger.error({
      message: err.message,
      stack: err.stack,
      statusCode,
      path: req.path,
      method: req.method,
    }, 'Operational error occurred');
  }

  // Send error response
  res.status(statusCode).json(error);
};

/**
 * Catch 404 and forward to error handler
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const err = new AppError(`Not Found - ${req.originalUrl}`, 404);
  next(err);
};

/**
 * Async handler to wrap async/await route handlers
 */
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
