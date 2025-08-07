import { Router } from 'express';
import { PlaylistController } from '../controllers/PlaylistController';
import { authenticate, isOwnerOrAdmin } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { playlistValidations, commonValidations } from '../middleware/validation';

export const playlistRoutes = Router();

// Apply authentication middleware to all routes
playlistRoutes.use(authenticate);

// Create a new playlist
playlistRoutes.post(
  '/',
  validate(playlistValidations.create),
  PlaylistController.createPlaylist
);

// Get a playlist by ID
playlistRoutes.get(
  '/:id',
  validate([commonValidations.id]),
  PlaylistController.getPlaylist
);

// Update a playlist
playlistRoutes.patch(
  '/:id',
  validate([commonValidations.id, ...playlistValidations.update]),
  isOwnerOrAdmin,
  PlaylistController.updatePlaylist
);

// Delete a playlist
playlistRoutes.delete(
  '/:id',
  validate([commonValidations.id]),
  isOwnerOrAdmin,
  PlaylistController.deletePlaylist
);

// Get user's playlists
playlistRoutes.get(
  '/user/:userId',
  validate([commonValidations.pagination]),
  PlaylistController.getUserPlaylists
);

// Get public playlists
playlistRoutes.get(
  '/public',
  validate([commonValidations.pagination]),
  PlaylistController.getPublicPlaylists
);

// Add tracks to a playlist
playlistRoutes.post(
  '/:id/tracks',
  validate([commonValidations.id, ...playlistValidations.addTracks]),
  isOwnerOrAdmin,
  PlaylistController.addTracks
);

// Remove tracks from a playlist
playlistRoutes.delete(
  '/:id/tracks',
  validate([commonValidations.id, ...playlistValidations.addTracks]),
  isOwnerOrAdmin,
  PlaylistController.removeTracks
);

// Reorder tracks in a playlist
playlistRoutes.patch(
  '/:id/reorder',
  validate([commonValidations.id, ...playlistValidations.reorderTracks]),
  isOwnerOrAdmin,
  PlaylistController.reorderTracks
);

// Search playlists
playlistRoutes.get(
  '/search',
  validate(playlistValidations.search),
  PlaylistController.searchPlaylists
);

// Increment play count for a playlist
playlistRoutes.post(
  '/:id/play',
  validate([commonValidations.id]),
  PlaylistController.incrementPlayCount
);

export default playlistRoutes;
