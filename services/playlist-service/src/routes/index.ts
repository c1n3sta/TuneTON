import { Router } from 'express';
import { playlistRoutes } from './playlistRoutes';
import { healthCheck } from '../controllers/healthController';

const router = Router();

// Health check endpoint
router.get('/health', healthCheck);

// API routes
router.use('/api/v1/playlists', playlistRoutes);

export { router as routes };
