import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../utils/logger';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    logger.warn('Validation failed', { errors: errors.array() });
    
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      errors: errors.array(),
    });
  };
};

export const validateRequest = (validations: ValidationChain[]) => {
  return [
    ...validations,
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.warn('Request validation failed', { errors: errors.array() });
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
      }
      next();
    },
  ];
};

// Common validation rules
export const commonValidations = {
  email: {
    isEmail: {
      errorMessage: 'Please provide a valid email address',
    },
    normalizeEmail: true,
  },
  password: {
    isLength: {
      options: { min: 8 },
      errorMessage: 'Password must be at least 8 characters long',
    },
  },
  id: {
    isMongoId: {
      errorMessage: 'Invalid ID format',
    },
  },
};
