import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AppError } from './errorHandler';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => ({
      field: err.param,
      message: err.msg,
    }));
    throw new AppError(400, 'Validation failed', false, JSON.stringify(errorMessages));
  }
  next();
};

export const validateFile = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    throw new AppError(400, 'No file uploaded');
  }
  next();
};
