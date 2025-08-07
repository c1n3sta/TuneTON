import { Request, Response } from 'express';
import { playlistService } from '../services/PlaylistService';
import { asyncHandler } from '../middleware/errorHandler';

export class PlaylistController {
  /**
   * Create a new playlist
   */
  static createPlaylist = asyncHandler(async (req: Request, res: Response) => {
    const playlist = await playlistService.createPlaylist({
      name: req.body.name,
      description: req.body.description,
      isPublic: req.body.isPublic,
      coverImageUrl: req.body.coverImageUrl,
      userId: req.user!.id,
    });

    res.status(201).json({
      status: 'success',
      data: {
        playlist,
      },
    });
  });

  /**
   * Get a playlist by ID
   */
  static getPlaylist = asyncHandler(async (req: Request, res: Response) => {
    const playlist = await playlistService.getPlaylistById(
      req.params.id,
      req.user?.id
    );

    res.status(200).json({
      status: 'success',
      data: {
        playlist,
      },
    });
  });

  /**
   * Update a playlist
   */
  static updatePlaylist = asyncHandler(async (req: Request, res: Response) => {
    const playlist = await playlistService.updatePlaylist(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        isPublic: req.body.isPublic,
        coverImageUrl: req.body.coverImageUrl,
      },
      req.user!.id
    );

    res.status(200).json({
      status: 'success',
      data: {
        playlist,
      },
    });
  });

  /**
   * Delete a playlist
   */
  static deletePlaylist = asyncHandler(async (req: Request, res: Response) => {
    await playlistService.deletePlaylist(req.params.id, req.user!.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

  /**
   * Get user's playlists
   */
  static getUserPlaylists = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const { playlists, total } = await playlistService.getUserPlaylists(
      req.params.userId,
      page,
      limit
    );

    res.status(200).json({
      status: 'success',
      results: playlists.length,
      total,
      page,
      limit,
      data: {
        playlists,
      },
    });
  });

  /**
   * Get public playlists
   */
  static getPublicPlaylists = asyncHandler(
    async (req: Request, res: Response) => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const { playlists, total } = await playlistService.getPublicPlaylists(
        page,
        limit
      );

      res.status(200).json({
        status: 'success',
        results: playlists.length,
        total,
        page,
        limit,
        data: {
          playlists,
        },
      });
    }
  );

  /**
   * Add tracks to a playlist
   */
  static addTracks = asyncHandler(async (req: Request, res: Response) => {
    const playlistTracks = await playlistService.addTracks(
      req.params.id,
      {
        trackIds: req.body.trackIds,
        userId: req.user!.id,
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        playlistTracks,
      },
    });
  });

  /**
   * Remove tracks from a playlist
   */
  static removeTracks = asyncHandler(async (req: Request, res: Response) => {
    await playlistService.removeTracks(
      req.params.id,
      req.body.trackIds,
      req.user!.id
    );

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

  /**
   * Reorder tracks in a playlist
   */
  static reorderTracks = asyncHandler(async (req: Request, res: Response) => {
    await playlistService.reorderTracks(req.params.id, {
      userId: req.user!.id,
      newOrder: req.body.trackOrder,
    });

    res.status(200).json({
      status: 'success',
      data: null,
    });
  });

  /**
   * Search playlists
   */
  static searchPlaylists = asyncHandler(async (req: Request, res: Response) => {
    const { q: query } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    if (!query) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query is required',
      });
    }

    const { playlists, total } = await playlistService.searchPlaylists(
      query as string,
      req.user?.id,
      page,
      limit
    );

    res.status(200).json({
      status: 'success',
      results: playlists.length,
      total,
      page,
      limit,
      data: {
        playlists,
      },
    });
  });

  /**
   * Increment play count for a playlist
   */
  static incrementPlayCount = asyncHandler(
    async (req: Request, res: Response) => {
      await playlistService.incrementPlayCount(req.params.id);

      res.status(200).json({
        status: 'success',
        data: null,
      });
    }
  );
}

export default PlaylistController;
