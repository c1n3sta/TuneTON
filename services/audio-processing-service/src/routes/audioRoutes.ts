import { Router } from 'express';
import multer from 'multer';
import { body } from 'express-validator';
import { auth } from '../middleware/auth';
import audioController from '../controllers/audioController';
import { validate } from '../middleware/validation';
import { config } from '@tuneton/shared';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.storage.tempPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'audio/aac',
      'audio/flac',
      'audio/x-wav',
      'audio/x-aiff',
      'audio/x-m4a',
    ];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio files are allowed.'));
    }
  },
});

// Process audio file
router.post(
  '/process',
  auth,
  upload.single('audio'),
  [
    body('trackId').isString().notEmpty().withMessage('trackId is required'),
    body('format')
      .optional()
      .isIn(['mp3', 'aac', 'ogg', 'wav', 'flac'])
      .withMessage('Invalid format. Must be one of: mp3, aac, ogg, wav, flac'),
    body('options').optional().isObject(),
    body('options.pitchShift')
      .optional()
      .isInt({ min: -12, max: 12 })
      .withMessage('Pitch shift must be between -12 and 12 semitones'),
    body('options.tempo')
      .optional()
      .isFloat({ min: 0.5, max: 2.0 })
      .withMessage('Tempo must be between 0.5 and 2.0'),
    body('options.bitrate')
      .optional()
      .isInt({ min: 64, max: 320 })
      .withMessage('Bitrate must be between 64 and 320 kbps'),
  ],
  validate,
  audioController.processAudio
);

// Get job status
router.get(
  '/status/:jobId',
  auth,
  audioController.getJobStatus
);

// List user's jobs
router.get(
  '/jobs',
  auth,
  [
    query('status')
      .optional()
      .isIn(['waiting', 'active', 'completed', 'failed', 'delayed'])
      .withMessage('Invalid status'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('offset')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Offset must be a positive integer'),
  ],
  validate,
  audioController.listJobs
);

export default router;
