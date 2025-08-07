import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain, body, param, query } from 'express-validator';
import { AppError } from './errorHandler';

/**
 * Validates the request and throws an error if validation fails
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    throw new AppError('Validation failed', 400, true, errors.array());
  };
};

// Common validation rules
export const commonValidations = {
  id: param('id')
    .trim()
    .isUUID(4)
    .withMessage('Invalid ID format'),
  
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer')
      .toInt(),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
      .toInt(),
  ],
};

// Playlist validation rules
export const playlistValidations = {
  create: [
    body('name')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Name must be between 1 and 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description must be less than 500 characters'),
    body('isPublic')
      .optional()
      .isBoolean()
      .withMessage('isPublic must be a boolean'),
    body('coverImageUrl')
      .optional()
      .isURL()
      .withMessage('Cover image must be a valid URL'),
  ],

  update: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Name must be between 1 and 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description must be less than 500 characters'),
    body('isPublic')
      .optional()
      .isBoolean()
      .withMessage('isPublic must be a boolean'),
    body('coverImageUrl')
      .optional()
      .isURL()
      .withMessage('Cover image must be a valid URL'),
  ],

  addTracks: [
    body('trackIds')
      .isArray({ min: 1 })
      .withMessage('At least one track ID is required'),
    body('trackIds.*')
      .isUUID(4)
      .withMessage('Invalid track ID format'),
  ],

  reorderTracks: [
    body('trackOrder')
      .isArray({ min: 1 })
      .withMessage('Track order must be an array'),
    body('trackOrder.*.trackId')
      .isUUID(4)
      .withMessage('Invalid track ID format'),
    body('trackOrder.*.position')
      .isInt({ min: 0 })
      .withMessage('Position must be a non-negative integer'),
  ],
};

// User validation rules
export const userValidations = {
  userId: param('userId')
    .trim()
    .isUUID(4)
    .withMessage('Invalid user ID format'),
};

// Search validation rules
export const searchValidations = {
  search: [
    query('q')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Search query must be between 1 and 100 characters'),
    ...commonValidations.pagination,
  ],
};
