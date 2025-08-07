import { Request, Response, NextFunction } from 'express';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';

export interface AppError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
  code?: string | number;
  errors?: any[];
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  // Default error status and message
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle specific error types
  if (err.name === 'JsonWebTokenError') {
    err.message = 'Invalid token. Please log in again!';
    err.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    err.message = 'Your token has expired! Please log in again.';
    err.statusCode = 401;
  }

  // Handle TypeORM errors
  if (err instanceof QueryFailedError) {
    // Handle unique constraint violation
    if (err.driverError?.code === '23505') { // Unique violation
      const match = err.driverError.detail.match(/\(([^)]+)\)/);
      const field = match ? match[1] : 'field';
      err.message = `${field} already exists`;
      err.statusCode = 409; // Conflict
    }
    // Handle other database errors
    else {
      err.message = 'Database error occurred';
    }
  }

  if (err instanceof EntityNotFoundError) {
    err.message = 'The requested resource was not found';
    err.statusCode = 404;
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values((err as any).errors).map((val: any) => val.message);
    err.message = `Invalid input data: ${messages.join('. ')}`;
    err.statusCode = 400;
  }

  // Handle duplicate field errors (MongoDB style)
  if (err.code === 11000) {
    const value = (err as any).errmsg?.match(/(["'])(\\?.)*?\1/)?.[0];
    err.message = `Duplicate field value: ${value || 'field'}. Please use another value!`;
    err.statusCode = 400;
  }

  // Handle invalid ObjectId (MongoDB style)
  if (err.name === 'CastError') {
    err.message = `Invalid ${(err as any).path}: ${(err as any).value}.`;
    err.statusCode = 400;
  }

  // Log the error for development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // Send error response
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
