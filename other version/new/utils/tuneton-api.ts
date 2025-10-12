// TuneTON API integration for playlists, library, and social features
import { projectId, publicAnonKey } from './supabase/info';
import { JamendoTrack } from './jamendo-api';

export interface TuneTONUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  isVerified: boolean;
  isArtist: boolean;
  totalStars: number;
  level: number;
  experiencePoints: number;
}

export interface TuneTONPlaylist {
  id: string;
  name: string;
  description?: string;
  cover?: string;
  tracks: JamendoTrack[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  userEmail?: string;
  isPrivate: boolean;
}

export interface TuneTONLikedTrack {
  track: JamendoTrack;
  likedAt: string;
  userId: string;
}

export interface LibraryStats {
  playlistCount: number;
  likedTracksCount: number;
  totalTracks: number;
}

interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class TuneTONAPI {
  private baseUrl: string;
  private accessToken: string | null = null;
  
  constructor() {
    this.baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-82f19583`;
  }
  
  setAccessToken(token: string | null) {
    this.accessToken = token;
  }
  
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const authToken = this.accessToken ? `Bearer ${this.accessToken}` : `Bearer ${publicAnonKey}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': authToken,
      ...options.headers,
    };
    
    console.log(`🔗 TuneTONAPI: Making request to ${endpoint}`, {
      method: options.method || 'GET',
      authToken: authToken.substring(0, 20) + '...',
      headers: Object.keys(headers)
    });
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });
    
    console.log(`🔗 TuneTONAPI: Response from ${endpoint}`, {
      status: response.status,
      ok: response.ok
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error(`🔗 TuneTONAPI: Error response from ${endpoint}:`, errorData);
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<APIResponse<T>> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        ...options.headers
      };

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers
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
  async fixRLS(): Promise<APIResponse> {
    return this.request('/fix-rls', {
      method: 'POST'
    });
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

  // ========================
  // NEW PLAYLIST & LIBRARY API METHODS
  // ========================
  
  // Playlist management
  async getUserPlaylists(): Promise<TuneTONPlaylist[]> {
    try {
      if (!this.accessToken) {
        console.warn('No access token set for getUserPlaylists');
        return [];
      }
      const response = await this.makeRequest<{ playlists: TuneTONPlaylist[] }>('/playlists');
      return response.playlists;
    } catch (error) {
      console.error('Failed to get user playlists:', error);
      return [];
    }
  }
  
  async createPlaylist(playlist: {
    name: string;
    description?: string;
    isPrivate?: boolean;
    cover?: string;
  }): Promise<TuneTONPlaylist | null> {
    try {
      const response = await this.makeRequest<{ playlist: TuneTONPlaylist }>('/playlists', {
        method: 'POST',
        body: JSON.stringify(playlist),
      });
      return response.playlist;
    } catch (error) {
      console.error('Failed to create playlist:', error);
      return null;
    }
  }
  
  async getPlaylist(playlistId: string): Promise<TuneTONPlaylist | null> {
    try {
      const response = await this.makeRequest<{ playlist: TuneTONPlaylist }>(`/playlists/${playlistId}`);
      return response.playlist;
    } catch (error) {
      console.error('Failed to get playlist:', error);
      return null;
    }
  }
  
  async updatePlaylist(playlistId: string, updates: Partial<TuneTONPlaylist>): Promise<TuneTONPlaylist | null> {
    try {
      const response = await this.makeRequest<{ playlist: TuneTONPlaylist }>(`/playlists/${playlistId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      return response.playlist;
    } catch (error) {
      console.error('Failed to update playlist:', error);
      return null;
    }
  }
  
  async deletePlaylist(playlistId: string): Promise<boolean> {
    try {
      await this.makeRequest(`/playlists/${playlistId}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      console.error('Failed to delete playlist:', error);
      return false;
    }
  }
  
  async addTrackToPlaylist(playlistId: string, jamendoTrack: JamendoTrack): Promise<TuneTONPlaylist | null> {
    try {
      const response = await this.makeRequest<{ playlist: TuneTONPlaylist }>(`/playlists/${playlistId}/tracks`, {
        method: 'POST',
        body: JSON.stringify({ jamendoTrack }),
      });
      return response.playlist;
    } catch (error) {
      console.error('Failed to add track to playlist:', error);
      return null;
    }
  }
  
  async removeTrackFromPlaylist(playlistId: string, trackId: string): Promise<TuneTONPlaylist | null> {
    try {
      const response = await this.makeRequest<{ playlist: TuneTONPlaylist }>(`/playlists/${playlistId}/tracks/${trackId}`, {
        method: 'DELETE',
      });
      return response.playlist;
    } catch (error) {
      console.error('Failed to remove track from playlist:', error);
      return null;
    }
  }
  
  // Liked tracks management
  async getLikedTracks(): Promise<JamendoTrack[]> {
    try {
      if (!this.accessToken) {
        console.warn('No access token set for getLikedTracks');
        return [];
      }
      const response = await this.makeRequest<{ likedTracks: TuneTONLikedTrack[] }>('/liked-tracks');
      // Extract just the track data with liked metadata
      return response.likedTracks.map(item => ({
        ...item,
        likedAt: item.likedAt,
        isLiked: true
      }));
    } catch (error) {
      console.error('Failed to get liked tracks:', error);
      return [];
    }
  }
  
  async toggleTrackLike(jamendoTrack: JamendoTrack, isLiked: boolean): Promise<boolean> {
    try {
      const response = await this.makeRequest<{ success: boolean; isLiked: boolean }>(`/tracks/${jamendoTrack.id}/like`, {
        method: 'POST',
        body: JSON.stringify({ jamendoTrack, isLiked }),
      });
      return response.isLiked;
    } catch (error) {
      console.error('Failed to toggle track like:', error);
      return !isLiked; // Return opposite of intended state to indicate failure
    }
  }
  
  // Library stats
  async getLibraryStats(): Promise<LibraryStats> {
    try {
      if (!this.accessToken) {
        console.warn('No access token set for getLibraryStats');
        return {
          playlistCount: 0,
          likedTracksCount: 0,
          totalTracks: 0
        };
      }
      const response = await this.makeRequest<LibraryStats>('/library/stats');
      return response;
    } catch (error) {
      console.error('Failed to get library stats:', error);
      return {
        playlistCount: 0,
        likedTracksCount: 0,
        totalTracks: 0
      };
    }
  }
  
  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest('/health');
      return true;
    } catch (error) {
      console.error('TuneTON API connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const tuneTONAPI = new TuneTONAPI();

// Also maintain old naming for backward compatibility
export const tuneTonAPI = tuneTONAPI;

// Helper functions for common operations
export const createPlaylistFromTracks = async (name: string, tracks: JamendoTrack[], description?: string) => {
  const playlist = await tuneTONAPI.createPlaylist({
    name,
    description,
    isPrivate: false
  });
  
  if (!playlist) return null;
  
  // Add tracks to the playlist
  for (const track of tracks) {
    await tuneTONAPI.addTrackToPlaylist(playlist.id, track);
  }
  
  return playlist;
};

export const getPlaylistDuration = (tracks: JamendoTrack[]): string => {
  const totalSeconds = tracks.reduce((sum, track) => sum + (track.duration || 0), 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export const formatDateAdded = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
};