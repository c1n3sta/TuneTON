import { authService } from './AuthService';
import { trackService } from './TrackService';
import { userService } from './UserService';
import { logger } from '../utils/logger';

/**
 * ServiceCoordinator handles coordination between different services
 * and provides a unified interface for common operations.
 */
export class ServiceCoordinator {
  private static instance: ServiceCoordinator;
  private authToken: string | null = null;

  private constructor() {}

  public static getInstance(): ServiceCoordinator {
    if (!ServiceCoordinator.instance) {
      ServiceCoordinator.instance = new ServiceCoordinator();
    }
    return ServiceCoordinator.instance;
  }

  /**
   * Set the authentication token for all service requests
   */
  public setAuthToken(token: string): void {
    this.authToken = token;
    authService.setAuthToken(token);
    trackService.setAuthToken(token);
    userService.setAuthToken(token);
  }

  /**
   * Validate user authentication and permissions
   */
  public async validateAuth(token: string): Promise<{
    userId: string;
    isAdmin: boolean;
    isValid: boolean;
  }> {
    try {
      const result = await authService.validateToken(token);
      
      if (!result.valid || !result.user) {
        return { userId: '', isAdmin: false, isValid: false };
      }

      return {
        userId: result.user.id,
        isAdmin: result.user.isAdmin,
        isValid: true,
      };
    } catch (error) {
      logger.error('Failed to validate authentication:', error);
      return { userId: '', isAdmin: false, isValid: false };
    }
  }

  /**
   * Validate track IDs and return valid ones
   */
  public async validateTracks(
    trackIds: string[],
    userId: string
  ): Promise<{ valid: string[]; invalid: string[] }> {
    try {
      const { valid, invalidIds = [] } = await trackService.validateTracks(
        trackIds,
        userId,
        this.authToken || undefined
      );

      if (!valid) {
        return { valid: [], invalid: trackIds };
      }

      const validIds = trackIds.filter((id) => !invalidIds.includes(id));
      return { valid: validIds, invalid: invalidIds };
    } catch (error) {
      logger.error('Failed to validate tracks:', error);
      return { valid: [], invalid: trackIds };
    }
  }

  /**
   * Get enriched playlist data with user and track information
   */
  public async enrichPlaylist(playlist: any): Promise<any> {
    try {
      // Get user profile for the playlist owner
      const [ownerProfile, tracks] = await Promise.all([
        userService.getUserProfile(
          playlist.userId,
          this.authToken || undefined
        ),
        playlist.trackIds?.length
          ? trackService.getTracks(
              playlist.trackIds,
              this.authToken || undefined
            )
          : [],
      ]);

      return {
        ...playlist,
        owner: ownerProfile,
        tracks,
      };
    } catch (error) {
      logger.error('Failed to enrich playlist:', error);
      return {
        ...playlist,
        owner: { id: playlist.userId, error: 'Failed to load user profile' },
        tracks: [],
      };
    }
  }

  /**
   * Check if a user has permission to perform an action on a resource
   */
  public async checkPermission(
    userId: string,
    permission: string,
    resource?: string,
    resourceId?: string
  ): Promise<{ allowed: boolean; reason?: string }> {
    try {
      return await authService.checkPermission(
        userId,
        permission,
        resource,
        resourceId
      );
    } catch (error) {
      logger.error('Failed to check permission:', {
        userId,
        permission,
        resource,
        error,
      });
      return { allowed: false, reason: 'Failed to verify permissions' };
    }
  }

  /**
   * Search across multiple services
   */
  public async search(
    query: string,
    types: string[] = ['tracks', 'users', 'playlists'],
    page: number = 1,
    limit: number = 10
  ): Promise<{
    tracks: any[];
    users: any[];
    playlists: any[];
    total: number;
  }> {
    const results = {
      tracks: [],
      users: [],
      playlists: [],
      total: 0,
    };

    try {
      // Search tracks
      if (types.includes('tracks')) {
        const tracks = await trackService.searchTracks(
          query,
          page,
          limit,
          this.authToken || undefined
        );
        results.tracks = tracks.data;
        results.total += tracks.total;
      }

      // Search users
      if (types.includes('users')) {
        const users = await userService.searchUsers(
          query,
          page,
          limit,
          this.authToken || undefined
        );
        results.users = users.data;
        results.total += users.total;
      }

      // Note: Playlist search is handled by the playlist service itself
      // and is included here for completeness in the response
      if (types.includes('playlists')) {
        // This would be populated by the playlist controller
        results.playlists = [];
      }

      return results;
    } catch (error) {
      logger.error('Failed to perform global search:', error);
      return results;
    }
  }
}

export const serviceCoordinator = ServiceCoordinator.getInstance();
