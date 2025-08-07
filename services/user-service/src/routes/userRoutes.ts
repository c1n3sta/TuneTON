import { Router } from 'express';
import { body } from 'express-validator';
import userController from '../controllers/userController';
import { catchAsync } from '../middleware/errorHandler';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get current user's profile
router.get('/me', catchAsync(userController.getMe));

// Update current user's profile
router.patch(
  '/me',
  [
    body('email').optional().isEmail().withMessage('Please provide a valid email'),
    body('firstName').optional().trim().isLength({ min: 1 }).withMessage('First name cannot be empty'),
    body('lastName').optional().trim().isLength({ min: 1 }).withMessage('Last name cannot be empty'),
    body('photoUrl').optional().isURL().withMessage('Photo URL must be a valid URL'),
  ],
  catchAsync(userController.updateMe)
);

// Delete current user's account
router.delete('/me', catchAsync(userController.deleteMe));

// Admin routes
router.use(authorize('admin'));

// Get all users (admin only)
router.get('/', catchAsync(userController.getAllUsers));

// Get user by ID (admin only)
router.get('/:id', catchAsync(userController.getUser));

export default router;
