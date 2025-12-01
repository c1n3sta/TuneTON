// API routes
import express from 'express';
import { telegramAuth } from '../controllers/authController.js';
import { getAllTracks, getTrackById, incrementPlayCount } from '../controllers/trackController.js';

const router = express.Router();

// Authentication routes
router.post('/auth/telegram', telegramAuth);

// Track routes
router.get('/tracks', getAllTracks);
router.get('/tracks/:id', getTrackById);
router.post('/tracks/:id/play', incrementPlayCount);

export default router;