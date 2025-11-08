import { JamendoTrack } from '../utils/jamendo-api';
import { projectId, publicAnonKey } from './supabase/info';

interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type TuneTONPlaylist = {
  id: string;
  title: string;
  name?: string; // Add name property to match usage in components
  description?: string;
  cover_image_url?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  track_count: number;
  duration: number;
  owner_id: string;
  owner_display_name: string;
};

export type LibraryStats = {
  playlistCount: number;
  likedTracksCount: number;
  totalTracks: number;
};

export const getPlaylistDuration = (tracks: any[]): number => {
  return tracks.reduce((total, track) => total + (track.duration || 0), 0);
};

export const formatDateAdded = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

class TuneTonAPI {
  private baseUrl: string;
  private headers: HeadersInit;

  constructor() {
    this.baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-82f19583`;
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<APIResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Health check
  async healthCheck(): Promise<APIResponse> {
    return this.request('/health');
  }

  // Database setup
  async setupDatabase(): Promise<APIResponse> {
    return this.request('/setup-database', {
      method: 'POST'
    });
  }

  // Test database connection
  async testDatabase(): Promise<APIResponse> {
    return this.request('/test-db');
  }

  // Fix RLS policies
  async fixRLS(): Promise<{ success: boolean }> {
    const response = await this.request('/fix-rls', {
      method: 'POST'
    });
    return { success: response.success };
  }

  // User authentication
  async authenticateUser(userData: {
    telegram_id: number;
    username: string;
    display_name?: string;
    avatar_url?: string;
  }): Promise<APIResponse> {
    return this.request('/auth/user', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  // Comments
  async createComment(commentData: {
    user_id: string;
    entity_type: string;
    entity_id: string;
    content: string;
    parent_comment_id?: string;
  }): Promise<APIResponse> {
    return this.request('/comments', {
      method: 'POST',
      body: JSON.stringify(commentData)
    });
  }

  async getComments(entityType: string, entityId: string): Promise<APIResponse> {
    return this.request(`/comments/${entityType}/${entityId}`);
  }

  // Social interactions
  async toggleLike(likeData: {
    user_id: string;
    entity_type: string;
    entity_id: string;
  }): Promise<APIResponse> {
    return this.request('/like', {
      method: 'POST',
      body: JSON.stringify(likeData)
    });
  }

  async toggleTrackLike(track: JamendoTrack | string, isLiked: boolean): Promise<boolean> {
    // This would toggle like status for a track
    console.log('Toggling track like', track, isLiked);
    return true;
  }

  // Subscription (follow) management
  async followUser(targetUserId: string): Promise<APIResponse> {
    return this.request('/subscriptions', {
      method: 'POST',
      body: JSON.stringify({ target_user_id: targetUserId })
    });
  }

  async unfollowUser(targetUserId: string): Promise<APIResponse> {
    return this.request(`/subscriptions/${targetUserId}`, {
      method: 'DELETE'
    });
  }

  async getSubscriptions(): Promise<APIResponse> {
    return this.request('/subscriptions');
  }

  // Test KV store
  async testKV(): Promise<APIResponse> {
    return this.request('/test/kv');
  }

  // User management
  async createUser(telegramData: {
    telegram_id: number;
    telegram_username?: string;
    first_name: string;
    last_name?: string;
    telegram_photo_url?: string;
    is_premium?: boolean;
  }): Promise<APIResponse> {
    return this.authenticateUser({
      telegram_id: telegramData.telegram_id,
      username: telegramData.telegram_username || telegramData.first_name,
      display_name: telegramData.first_name + (telegramData.last_name ? ` ${telegramData.last_name}` : ''),
      avatar_url: telegramData.telegram_photo_url
    });
  }

  // Playlist management
  async createPlaylist(playlistData: {
    user_id: string;
    title: string;
    description?: string;
    is_public?: boolean;
  }): Promise<TuneTONPlaylist | null> {
    // This would be implemented when playlist endpoints are added to the server
    console.log('Playlist creation not yet implemented on server', playlistData);
    return null;
  }

  async getUserPlaylists(): Promise<TuneTONPlaylist[]> {
    // This would fetch user playlists from the server
    console.log('Fetching user playlists');
    return [];
  }

  async getLikedTracks(): Promise<JamendoTrack[]> {
    // This would fetch liked tracks from the server
    console.log('Fetching liked tracks');
    return [];
  }

  async getLibraryStats(): Promise<LibraryStats> {
    // This would fetch library statistics from the server
    console.log('Fetching library stats');
    return { playlistCount: 0, likedTracksCount: 0, totalTracks: 0 };
  }

  async setAccessToken(token: string, userId: string): Promise<void> {
    // This would set the access token for authenticated requests
    console.log('Setting access token', token, userId);
  }

  async getPlaylist(id: string): Promise<TuneTONPlaylist | null> {
    // This would fetch a specific playlist from the server
    console.log('Fetching playlist', id);
    return null;
  }

  async getPlaylistTracks(playlistId: string): Promise<JamendoTrack[]> {
    // This would fetch tracks for a specific playlist from the server
    console.log('Fetching playlist tracks', playlistId);
    return [];
  }

  async removeTrackFromPlaylist(playlistId: string, trackId: string): Promise<boolean> {
    // This would remove a track from a playlist on the server
    console.log('Removing track from playlist', playlistId, trackId);
    return true;
  }

  async addTrackToPlaylist(playlistId: string, trackData: any): Promise<boolean> {
    // This would add a track to a playlist on the server
    console.log('Adding track to playlist', playlistId, trackData);
    return true;
  }

  async deletePlaylist(id: string): Promise<boolean> {
    // This would delete a playlist on the server
    console.log('Deleting playlist', id);
    return true;
  }

  // Contest management
  async getActiveContests(): Promise<APIResponse> {
    // This would be implemented when contest endpoints are added to the server
    return { success: true, data: [] };
  }

  // NFT management
  async getNFTMarketplace(): Promise<APIResponse> {
    // This would be implemented when NFT endpoints are added to the server
    return { success: true, data: [] };
  }
}

// Export singleton instance
export const tuneTONAPI = new TuneTonAPI();
export { TuneTonAPI as TuneTONAPI };
