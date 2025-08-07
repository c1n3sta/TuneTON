import { getRepository, Repository, In, Not, IsNull } from 'typeorm';
import { Playlist } from '../entities/Playlist';
import { PlaylistTrack } from '../entities/PlaylistTrack';
import { AppError } from '../middleware/errorHandler';

type CreatePlaylistData = {
  name: string;
  description?: string;
  isPublic?: boolean;
  coverImageUrl?: string;
  userId: string;
};

type UpdatePlaylistData = {
  name?: string;
  description?: string | null;
  isPublic?: boolean;
  coverImageUrl?: string | null;
};

type AddTracksData = {
  trackIds: string[];
  userId: string;
};

type ReorderTracksData = {
  trackOrder: Array<{ trackId: string; position: number }>;
};

export class PlaylistService {
  private playlistRepository: Repository<Playlist>;
  private playlistTrackRepository: Repository<PlaylistTrack>;

  constructor() {
    this.playlistRepository = getRepository(Playlist);
    this.playlistTrackRepository = getRepository(PlaylistTrack);
  }

  /**
   * Create a new playlist
   */
  async createPlaylist(data: CreatePlaylistData): Promise<Playlist> {
    const playlist = this.playlistRepository.create({
      name: data.name,
      description: data.description,
      isPublic: data.isPublic ?? false,
      coverImageUrl: data.coverImageUrl,
      userId: data.userId,
    });

    return await this.playlistRepository.save(playlist);
  }

  /**
   * Get a playlist by ID
   */
  async getPlaylistById(id: string, userId?: string): Promise<Playlist> {
    const playlist = await this.playlistRepository.findOne({
      where: { id },
      relations: ['playlistTracks'],
    });

    if (!playlist) {
      throw new AppError('Playlist not found', 404);
    }

    // Check if user has access to the playlist
    if (!playlist.isPublic && playlist.userId !== userId) {
      throw new AppError('Access to this playlist is forbidden', 403);
    }

    return playlist;
  }

  /**
   * Update a playlist
   */
  async updatePlaylist(
    id: string,
    data: UpdatePlaylistData,
    userId: string
  ): Promise<Playlist> {
    const playlist = await this.getPlaylistById(id);

    // Check if user is the owner
    if (playlist.userId !== userId) {
      throw new AppError('Only the playlist owner can update it', 403);
    }

    // Update fields
    if (data.name !== undefined) playlist.name = data.name;
    if (data.description !== undefined) playlist.description = data.description;
    if (data.isPublic !== undefined) playlist.isPublic = data.isPublic;
    if (data.coverImageUrl !== undefined) {
      playlist.coverImageUrl = data.coverImageUrl;
    }

    return await this.playlistRepository.save(playlist);
  }

  /**
   * Delete a playlist
   */
  async deletePlaylist(id: string, userId: string): Promise<void> {
    const playlist = await this.getPlaylistById(id);

    // Check if user is the owner
    if (playlist.userId !== userId) {
      throw new AppError('Only the playlist owner can delete it', 403);
    }

    await this.playlistRepository.remove(playlist);
  }

  /**
   * Get user's playlists
   */
  async getUserPlaylists(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ playlists: Playlist[]; total: number }> {
    const [playlists, total] = await this.playlistRepository.findAndCount({
      where: { userId },
      order: { updatedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { playlists, total };
  }

  /**
   * Get public playlists
   */
  async getPublicPlaylists(
    page: number = 1,
    limit: number = 20
  ): Promise<{ playlists: Playlist[]; total: number }> {
    const [playlists, total] = await this.playlistRepository.findAndCount({
      where: { isPublic: true },
      order: { updatedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { playlists, total };
  }

  /**
   * Add tracks to a playlist
   */
  async addTracks(
    playlistId: string,
    data: AddTracksData
  ): Promise<PlaylistTrack[]> {
    const playlist = await this.getPlaylistById(playlistId, data.userId);

    // Check if user is the owner
    if (playlist.userId !== data.userId) {
      throw new AppError('Only the playlist owner can add tracks', 403);
    }

    // Get current max position
    const lastTrack = await this.playlistTrackRepository.findOne({
      where: { playlistId },
      order: { position: 'DESC' },
    });

    let position = lastTrack ? lastTrack.position + 1 : 0;
    const playlistTracks: PlaylistTrack[] = [];

    // Create playlist track entries
    for (const trackId of data.trackIds) {
      const playlistTrack = this.playlistTrackRepository.create({
        playlistId,
        trackId,
        position: position++,
        addedBy: data.userId,
      });
      playlistTracks.push(playlistTrack);
    }

    // Save all tracks
    const savedTracks = await this.playlistTrackRepository.save(playlistTracks);

    // Update track count
    await this.updateTrackCount(playlist);

    return savedTracks;
  }

  /**
   * Remove tracks from a playlist
   */
  async removeTracks(
    playlistId: string,
    trackIds: string[],
    userId: string
  ): Promise<void> {
    const playlist = await this.getPlaylistById(playlistId, userId);

    // Check if user is the owner
    if (playlist.userId !== userId) {
      throw new AppError('Only the playlist owner can remove tracks', 403);
    }

    // Delete the tracks
    await this.playlistTrackRepository.delete({
      playlistId,
      trackId: In(trackIds),
    });

    // Update track count
    await this.updateTrackCount(playlist);

    // Reorder remaining tracks
    await this.reorderTracks(playlistId, { userId });
  }

  /**
   * Reorder tracks in a playlist
   */
  async reorderTracks(
    playlistId: string,
    options: { userId: string; newOrder?: Array<{ trackId: string; position: number }> }
  ): Promise<void> {
    const playlist = await this.getPlaylistById(playlistId, options.userId);

    // Check if user is the owner
    if (playlist.userId !== options.userId) {
      throw new AppError('Only the playlist owner can reorder tracks', 403);
    }

    if (options.newOrder) {
      // Update with new order
      const updates = options.newOrder.map(({ trackId, position }) =>
        this.playlistTrackRepository.update(
          { playlistId, trackId },
          { position }
        )
      );
      await Promise.all(updates);
    } else {
      // Reorder sequentially (after deletions)
      const tracks = await this.playlistTrackRepository.find({
        where: { playlistId },
        order: { position: 'ASC' },
      });

      const updates = tracks.map((track, index) =>
        this.playlistTrackRepository.update(
          { id: track.id },
          { position: index }
        )
      );
      await Promise.all(updates);
    }
  }

  /**
   * Search playlists
   */
  async searchPlaylists(
    query: string,
    userId?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ playlists: Playlist[]; total: number }> {
    const queryBuilder = this.playlistRepository
      .createQueryBuilder('playlist')
      .where('playlist.name ILIKE :query', { query: `%${query}%` })
      .orWhere('playlist.description ILIKE :query', { query: `%${query}%` })
      .orderBy('playlist.updatedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    // If user is not provided, only return public playlists
    if (!userId) {
      queryBuilder.andWhere('playlist.isPublic = :isPublic', { isPublic: true });
    } else {
      // Return user's playlists and public playlists
      queryBuilder.andWhere('(playlist.userId = :userId OR playlist.isPublic = :isPublic)', {
        userId,
        isPublic: true,
      });
    }

    const [playlists, total] = await queryBuilder.getManyAndCount();
    return { playlists, total };
  }

  /**
   * Increment play count for a playlist
   */
  async incrementPlayCount(playlistId: string): Promise<void> {
    await this.playlistRepository.increment(
      { id: playlistId },
      'playCount',
      1
    );
  }

  /**
   * Update track count for a playlist
   */
  private async updateTrackCount(playlist: Playlist): Promise<void> {
    const count = await this.playlistTrackRepository.count({
      where: { playlistId: playlist.id },
    });

    await this.playlistRepository.update(playlist.id, {
      trackCount: count,
    });
  }
}

export const playlistService = new PlaylistService();
