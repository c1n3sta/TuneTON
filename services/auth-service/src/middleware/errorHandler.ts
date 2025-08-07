import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
  code?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    err.message = 'Invalid token. Please log in again!';
    err.statusCode = 401;
  }
  if (err.name === 'TokenExpiredError') {
    err.message = 'Your token has expired! Please log in again.';
    err.statusCode = 401;
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values((err as any).errors).map((val: any) => val.message);
    err.message = `Invalid input data: ${messages.join('. ')}`;
    err.statusCode = 400;
  }

  // Handle duplicate field errors (MongoDB)
  if (err.code === 11000) {
    const value = (err as any).errmsg.match(/(["'])(\\?.)*?\1/)[0];
    err.message = `Duplicate field value: ${value}. Please use another value!`;
    err.statusCode = 400;
  }

  // Handle invalid ObjectId (MongoDB)
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
