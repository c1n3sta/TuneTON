import { JamendoTrack } from '../utils/jamendo-api';
import { projectId, publicAnonKey } from './supabase/info';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client
const supabase = createClient(`https://${projectId}.supabase.co`, publicAnonKey);

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

  // Telegram authentication
  async authenticateUser(telegramData: {
    telegram_id: number;
    first_name: string;
    last_name?: string;
    telegram_username?: string;
    telegram_photo_url?: string;
  }): Promise<APIResponse> {
    return this.request('/auth/telegram', {
      method: 'POST',
      body: JSON.stringify(telegramData)
    });
  }

  // Playlist management
  async createPlaylist(playlistData: {
    user_id: string;
    title: string;
    description?: string;
    is_public?: boolean;
  }): Promise<TuneTONPlaylist | null> {
    try {
      const { data, error } = await supabase
        .from('playlists')
        .insert([
          {
            user_id: playlistData.user_id,
            name: playlistData.title,
            description: playlistData.description,
            is_private: !playlistData.is_public,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating playlist:', error);
        return null;
      }

      return data as TuneTONPlaylist;
    } catch (error) {
      console.error('Error creating playlist:', error);
      return null;
    }
  }

  async getUserPlaylists(): Promise<TuneTONPlaylist[]> {
    try {
      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user playlists:', error);
        return [];
      }

      return data as TuneTONPlaylist[];
    } catch (error) {
      console.error('Error fetching user playlists:', error);
      return [];
    }
  }

  async getPlaylist(id: string): Promise<TuneTONPlaylist | null> {
    try {
      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching playlist:', error);
        return null;
      }

      return data as TuneTONPlaylist;
    } catch (error) {
      console.error('Error fetching playlist:', error);
      return null;
    }
  }

  async getPlaylistTracks(playlistId: string): Promise<JamendoTrack[]> {
    try {
      // First get track IDs from playlist_tracks table
      const { data: playlistTracks, error: tracksError } = await supabase
        .from('playlist_tracks')
        .select('track_id, track_data')
        .eq('playlist_id', playlistId)
        .order('position', { ascending: true });

      if (tracksError) {
        console.error('Error fetching playlist tracks:', tracksError);
        return [];
      }

      // Convert stored track data to JamendoTrack format
      const tracks: JamendoTrack[] = playlistTracks.map((pt: any) => {
        if (pt.track_data) {
          return pt.track_data as JamendoTrack;
        }
        // Return a minimal track if no data is stored
        return {
          id: pt.track_id,
          name: 'Unknown Track',
          artist_name: 'Unknown Artist',
          duration: 0,
          artist_id: '',
          artist_idstr: '',
          album_id: '',
          album_name: '',
          album_image: '',
          audio: '',
          audiodownload: '',
          prourl: '',
          shorturl: '',
          shareurl: '',
          waveform: '',
          image: ''
        } as JamendoTrack;
      });

      return tracks;
    } catch (error) {
      console.error('Error fetching playlist tracks:', error);
      return [];
    }
  }

  async removeTrackFromPlaylist(playlistId: string, trackId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('playlist_tracks')
        .delete()
        .match({ playlist_id: playlistId, track_id: trackId });

      if (error) {
        console.error('Error removing track from playlist:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error removing track from playlist:', error);
      return false;
    }
  }

  async addTrackToPlaylist(playlistId: string, trackData: JamendoTrack): Promise<boolean> {
    try {
      // First check if track already exists in playlist
      const { data: existing, error: checkError } = await supabase
        .from('playlist_tracks')
        .select('id')
        .match({ playlist_id: playlistId, track_id: trackData.id })
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows returned
        console.error('Error checking existing track in playlist:', checkError);
        return false;
      }

      // If track already exists, don't add it again
      if (existing) {
        return true;
      }

      // Get the next position for the track
      const { data: maxPositionData, error: positionError } = await supabase
        .from('playlist_tracks')
        .select('position')
        .eq('playlist_id', playlistId)
        .order('position', { ascending: false })
        .limit(1)
        .single();

      const nextPosition = positionError ? 0 : (maxPositionData?.position || 0) + 1;

      const { error } = await supabase
        .from('playlist_tracks')
        .insert([
          {
            playlist_id: playlistId,
            track_id: trackData.id,
            track_data: trackData,
            position: nextPosition,
            added_at: new Date().toISOString()
          }
        ]);

      if (error) {
        console.error('Error adding track to playlist:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error adding track to playlist:', error);
      return false;
    }
  }

  async deletePlaylist(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('playlists')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting playlist:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting playlist:', error);
      return false;
    }
  }

  async toggleTrackLike(track: JamendoTrack, isLiked: boolean): Promise<boolean> {
    try {
      if (isLiked) {
        // Add track to liked tracks
        const { error } = await supabase
          .from('liked_tracks')
          .insert([
            {
              track_id: track.id,
              track_data: track,
              liked_at: new Date().toISOString()
            }
          ]);

        if (error) {
          console.error('Error adding track to liked tracks:', error);
          return false;
        }
      } else {
        // Remove track from liked tracks
        const { error } = await supabase
          .from('liked_tracks')
          .delete()
          .eq('track_id', track.id);

        if (error) {
          console.error('Error removing track from liked tracks:', error);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error toggling track like:', error);
      return false;
    }
  }

  async getLikedTracks(): Promise<JamendoTrack[]> {
    try {
      const { data, error } = await supabase
        .from('liked_tracks')
        .select('track_data')
        .order('liked_at', { ascending: false });

      if (error) {
        console.error('Error fetching liked tracks:', error);
        return [];
      }

      // Convert stored track data to JamendoTrack format
      const tracks: JamendoTrack[] = data.map((lt: any) => {
        if (lt.track_data) {
          return lt.track_data as JamendoTrack;
        }
        // Return empty track if no data is stored
        return {
          id: '',
          name: '',
          artist_name: '',
          duration: 0,
          artist_id: '',
          artist_idstr: '',
          album_id: '',
          album_name: '',
          album_image: '',
          audio: '',
          audiodownload: '',
          prourl: '',
          shorturl: '',
          shareurl: '',
          waveform: '',
          image: ''
        } as JamendoTrack;
      });

      return tracks;
    } catch (error) {
      console.error('Error fetching liked tracks:', error);
      return [];
    }
  }

  async getLibraryStats(): Promise<LibraryStats> {
    try {
      // Get playlist count
      const { count: playlistCount, error: playlistError } = await supabase
        .from('playlists')
        .select('*', { count: 'exact', head: true });

      // Get liked tracks count
      const { count: likedTracksCount, error: likedError } = await supabase
        .from('liked_tracks')
        .select('*', { count: 'exact', head: true });

      if (playlistError) {
        console.error('Error fetching playlist count:', playlistError);
      }

      if (likedError) {
        console.error('Error fetching liked tracks count:', likedError);
      }

      return {
        playlistCount: playlistCount || 0,
        likedTracksCount: likedTracksCount || 0,
        totalTracks: (playlistCount || 0) + (likedTracksCount || 0)
      };
    } catch (error) {
      console.error('Error fetching library stats:', error);
      return { playlistCount: 0, likedTracksCount: 0, totalTracks: 0 };
    }
  }

  async setAccessToken(token: string, userId: string): Promise<void> {
    // This would set the access token for authenticated requests
    console.log('Setting access token', token, userId);
  }

  // Comment management
  async addComment(entityType: string, entityId: string, content: string, parentCommentId?: string): Promise<boolean> {
    try {
      const commentData: any = {
        entity_type: entityType,
        entity_id: entityId,
        content: content
      };

      if (parentCommentId) {
        commentData.parent_comment_id = parentCommentId;
      }

      const { error } = await supabase
        .from('comments')
        .insert([commentData]);

      if (error) {
        console.error('Error adding comment:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error adding comment:', error);
      return false;
    }
  }

  async getEntityComments(entityType: string, entityId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          users:first_name, username, photo_url
        `)
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comments:', error);
        return [];
      }

      return data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  }

  async deleteComment(commentId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) {
        console.error('Error deleting comment:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      return false;
    }
  }

  // NFT management
  async getNFTMarketplace(): Promise<APIResponse> {
    // This would be implemented when NFT endpoints are added to the server
    return { success: true, data: [] };
  }

  // Playback history management
  async addPlaybackHistory(trackData: JamendoTrack, durationPlayed: number = 0, isCompleted: boolean = false): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('playback_history')
        .insert([
          {
            track_id: trackData.id,
            track_data: trackData,
            played_at: new Date().toISOString(),
            duration_played: durationPlayed,
            is_completed: isCompleted
          }
        ]);

      if (error) {
        console.error('Error adding playback history:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error adding playback history:', error);
      return false;
    }
  }

  async getRecentPlaybackHistory(limit: number = 20): Promise<JamendoTrack[]> {
    try {
      const { data, error } = await supabase
        .from('playback_history')
        .select('track_data')
        .order('played_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching playback history:', error);
        return [];
      }

      // Convert stored track data to JamendoTrack format
      const tracks: JamendoTrack[] = data.map((ph: any) => {
        if (ph.track_data) {
          return ph.track_data as JamendoTrack;
        }
        // Return empty track if no data is stored
        return {
          id: '',
          name: '',
          artist_name: '',
          duration: 0,
          artist_id: '',
          artist_idstr: '',
          album_id: '',
          album_name: '',
          album_image: '',
          audio: '',
          audiodownload: '',
          prourl: '',
          shorturl: '',
          shareurl: '',
          waveform: '',
          image: ''
        } as JamendoTrack;
      });

      return tracks;
    } catch (error) {
      console.error('Error fetching playback history:', error);
      return [];
    }
  }

  async getLastPlayedTrack(): Promise<JamendoTrack | null> {
    try {
      const { data, error } = await supabase
        .from('playback_history')
        .select('track_data')
        .order('played_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching last played track:', error);
        return null;
      }

      if (data && data.track_data) {
        return data.track_data as JamendoTrack;
      }

      return null;
    } catch (error) {
      console.error('Error fetching last played track:', error);
      return null;
    }
  }

  // Social feed management
  // User activity tracking
  async recordUserActivity(activityType: string, targetId?: string, targetType?: string, content?: string): Promise<boolean> {
    try {
      if (!this.userId) {
        console.warn('User ID not set, cannot record user activity');
        return false;
      }
      
      const { error } = await supabase
        .from('user_activities')
        .insert([
          {
            user_id: this.userId,
            activity_type: activityType,
            target_id: targetId,
            target_type: targetType,
            content: content,
            timestamp: new Date().toISOString()
          }
        ]);
      
      if (error) {
        console.error('Error recording user activity:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error recording user activity:', error);
      return false;
    }
  }
  
  async getSocialFeed(userId: string, limit: number = 20): Promise<any[]> {
    try {
      // This would fetch a social feed of activities from followed users
      // For now, we'll return an empty array as this would require more complex queries
      console.log('Fetching social feed for user:', userId);
      return [];
    } catch (error) {
      console.error('Error fetching social feed:', error);
      return [];
    }
  }

  // Subscription (follow) management
  async followUser(targetUserId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .insert([
          {
            target_user_id: targetUserId,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) {
        console.error('Error following user:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error following user:', error);
      return false;
    }
  }

  async unfollowUser(targetUserId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .match({ target_user_id: targetUserId });

      if (error) {
        console.error('Error unfollowing user:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error unfollowing user:', error);
      return false;
    }
  }

  async getFollowing(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          target_user_id,
          users:id,first_name,username,photo_url
        `)
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching following:', error);
        return [];
      }

      return data;
    } catch (error) {
      console.error('Error fetching following:', error);
      return [];
    }
  }

  async getFollowers(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          user_id,
          users:id,first_name,username,photo_url
        `)
        .eq('target_user_id', userId);

      if (error) {
        console.error('Error fetching followers:', error);
        return [];
      }

      return data;
    } catch (error) {
      console.error('Error fetching followers:', error);
      return [];
    }
  }

  async isFollowing(targetUserId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('id')
        .match({ target_user_id: targetUserId })
        .limit(1);

      if (error) {
        console.error('Error checking follow status:', error);
        return false;
      }

      return data.length > 0;
    } catch (error) {
      console.error('Error checking follow status:', error);
      return false;
    }
  }
}

// Export singleton instance
export const tuneTONAPI = new TuneTonAPI();
export { TuneTonAPI as TuneTONAPI };