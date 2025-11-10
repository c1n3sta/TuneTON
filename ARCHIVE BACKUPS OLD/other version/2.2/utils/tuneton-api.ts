import { projectId, publicAnonKey } from './supabase/info';

interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

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

  // Playlist management
  async createPlaylist(playlistData: {
    user_id: string;
    title: string;
    description?: string;
    is_public?: boolean;
  }): Promise<APIResponse> {
    // This would be implemented when playlist endpoints are added to the server
    console.log('Playlist creation not yet implemented on server', playlistData);
    return { success: false, error: 'Not implemented' };
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
export const tuneTonAPI = new TuneTonAPI();