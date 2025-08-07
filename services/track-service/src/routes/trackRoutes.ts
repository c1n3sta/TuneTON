import { Router } from 'express';
import { body } from 'express-validator';
import { auth, admin } from '../middleware/auth';
import trackController from '../controllers/trackController';
import { validate } from '../middleware/validation';

const router = Router();

// Public routes
router.get('/', trackController.getTracks);
router.get('/:id', trackController.getTrackById);

// Protected routes (require authentication)
router.post(
  '/',
  auth,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('filePath').trim().notEmpty().withMessage('File path is required'),
    body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive number'),
    body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean'),
  ],
  validate,
  trackController.createTrack
);

router.put(
  '/:id',
  auth,
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().trim(),
    body('genre').optional().trim(),
    body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean'),
  ],
  validate,
  trackController.updateTrack
);

router.delete('/:id', auth, trackController.deleteTrack);

// Admin routes
router.get('/admin/all', auth, admin, trackController.getTracks);

export default router;
