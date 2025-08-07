import { Router } from 'express';
import { streamAudio, getTrackMetadata } from '../controllers/streamController';
import { auth } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/stream/{trackId}:
 *   get:
 *     summary: Stream audio file by track ID
 *     description: Streams the audio file for the specified track with support for range requests
 *     parameters:
 *       - in: path
 *         name: trackId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the track to stream
 *     responses:
 *       200:
 *         description: Audio stream
 *         content:
 *           audio/mpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       206:
 *         description: Partial content (for seeking)
 *         content:
 *           audio/mpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Audio file not found
 *       500:
 *         description: Server error
 */
router.get('/:trackId', auth, streamAudio);

/**
 * @swagger
 * /api/stream/{trackId}/metadata:
 *   get:
 *     summary: Get track metadata
 *     description: Retrieves metadata for the specified track
 *     parameters:
 *       - in: path
 *         name: trackId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the track
 *     responses:
 *       200:
 *         description: Track metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/TrackMetadata'
 *       500:
 *         description: Server error
 */
router.get('/:trackId/metadata', auth, getTrackMetadata);

export { router as streamRoutes };
