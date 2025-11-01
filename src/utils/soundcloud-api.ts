// SoundCloud API integration for TuneTON music streaming
// TODO: Replace with actual SoundCloud API credentials
const SOUNDCLOUD_CLIENT_ID = process.env.SOUNDCLOUD_CLIENT_ID || 'YOUR_SOUNDCLOUD_CLIENT_ID';
const SOUNDCLOUD_CLIENT_SECRET = process.env.SOUNDCLOUD_CLIENT_SECRET || 'YOUR_SOUNDCLOUD_CLIENT_SECRET';
const SOUNDCLOUD_BASE_URL = 'https://api.soundcloud.com';

// SoundCloud track interface
export interface SoundCloudTrack {
  id: number;
  title: string;
  permalink_url: string;
  uri: string;
  stream_url: string;
  artwork_url: string | null;
  user: {
    id: number;
    username: string;
    permalink_url: string;
    uri: string;
  };
  duration: number;
  description: string | null;
  genre: string | null;
  tag_list: string;
  sharing: 'public' | 'private';
  embeddable_by: string;
  downloadable: boolean;
  streamable: boolean;
  playback_count: number;
  download_count: number;
  favoritings_count: number;
  comment_count: number;
  created_at: string;
  original_format: string;
  original_content_size: number;
  license: string;
}

// SoundCloud user interface
export interface SoundCloudUser {
  id: number;
  username: string;
  permalink: string;
  permalink_url: string;
  uri: string;
  avatar_url: string | null;
  country: string | null;
  full_name: string | null;
  city: string | null;
  description: string | null;
  discogs_name: string | null;
  myspace_name: string | null;
  website: string | null;
  website_title: string | null;
  online: boolean;
  track_count: number;
  playlist_count: number;
  followers_count: number;
  followings_count: number;
  public_favorites_count: number;
  avatar_data?: string;
}

// SoundCloud playlist interface
export interface SoundCloudPlaylist {
  id: number;
  title: string;
  permalink_url: string;
  uri: string;
  artwork_url: string | null;
  user: SoundCloudUser;
  description: string | null;
  duration: number;
  genre: string | null;
  tag_list: string;
  sharing: 'public' | 'private';
  embeddable_by: string;
  downloadable: boolean;
  streamable: boolean;
  playlist_type: string;
  tracks: SoundCloudTrack[];
  track_count: number;
}

// Search parameters
export interface SoundCloudSearchParams {
  q?: string;
  limit?: number;
  offset?: number;
  linked_partitioning?: number;
  tags?: string;
  filter?: 'public' | 'private' | 'all';
  license?: string;
  bpm_from?: number;
  bpm_to?: number;
  duration_from?: number;
  duration_to?: number;
  created_at_from?: string;
  created_at_to?: string;
  ids?: string;
  genres?: string;
}

// OAuth response interface
interface OAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  refresh_token?: string;
}

// Custom error classes
export class SoundCloudAPIError extends Error {
  constructor(message: string, public status?: number, public retryAfter?: number) {
    super(message);
    this.name = 'SoundCloudAPIError';
  }
}

export class RateLimitError extends SoundCloudAPIError {
  constructor(retryAfter?: number) {
    super('Rate limit exceeded', 429, retryAfter);
    this.name = 'RateLimitError';
  }
}

export class AuthenticationError extends SoundCloudAPIError {
  constructor() {
    super('Authentication failed', 401);
    this.name = 'AuthenticationError';
  }
}

export class NotFoundError extends SoundCloudAPIError {
  constructor() {
    super('Resource not found', 404);
    this.name = 'NotFoundError';
  }
}

export class StreamUnavailableError extends SoundCloudAPIError {
  constructor() {
    super('Stream unavailable for this track', 403);
    this.name = 'StreamUnavailableError';
  }
}

export class SoundCloudAPI {
  private clientId: string;
  private clientSecret: string;
  private baseUrl: string;
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;
  private apiAvailable: boolean = true;
  private lastFailTime: number = 0;
  private retryDelay: number = 60000; // 1 minute retry delay
  private requestQueue: Array<{resolve: Function, reject: Function, timestamp: number}> = [];
  private maxConcurrentRequests: number = 5;
  private activeRequests: number = 0;

  constructor(clientId: string = SOUNDCLOUD_CLIENT_ID, clientSecret: string = SOUNDCLOUD_CLIENT_SECRET) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.baseUrl = SOUNDCLOUD_BASE_URL;
  }

  // Get OAuth token using Client Credentials Flow
  private async getOAuthToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await fetch(`${this.baseUrl}/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'client_credentials',
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new AuthenticationError();
        }
        throw new SoundCloudAPIError(`OAuth token request failed: ${response.status} ${response.statusText}`, response.status);
      }

      const data: OAuthResponse = await response.json();
      
      this.accessToken = data.access_token;
      // Set expiry time with 1 minute buffer
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000;
      
      return this.accessToken;
    } catch (error) {
      console.error('Failed to get OAuth token:', error);
      throw error;
    }
  }

  // Rate limiting implementation
  private async waitForRateLimit(): Promise<void> {
    return new Promise((resolve) => {
      const now = Date.now();
      
      // Clear old requests from queue
      this.requestQueue = this.requestQueue.filter(req => now - req.timestamp < 60000);
      
      // If we're at the limit, wait
      if (this.requestQueue.length >= this.maxConcurrentRequests) {
        const oldest = this.requestQueue[0];
        const waitTime = 60000 - (now - oldest.timestamp);
        setTimeout(() => {
          this.requestQueue.shift();
          resolve();
        }, Math.max(0, waitTime));
      } else {
        // Add to queue and proceed
        this.requestQueue.push({resolve, reject: () => {}, timestamp: now});
        resolve();
      }
    });
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, any> = {}, useOAuth: boolean = true): Promise<T> {
    await this.waitForRateLimit();
    
    // Check if we should retry the API after some time
    const now = Date.now();
    if (!this.apiAvailable && (now - this.lastFailTime) > this.retryDelay) {
      console.log('Retrying SoundCloud API after delay...');
      this.apiAvailable = true;
    }

    // If API previously failed and retry delay hasn't passed, throw error
    if (!this.apiAvailable) {
      throw new SoundCloudAPIError('SoundCloud API unavailable, retry later');
    }

    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    // Add parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    // For public endpoints, we can use client_id
    if (!useOAuth) {
      url.searchParams.append('client_id', this.clientId);
    }

    try {
      console.log('Making SoundCloud API request:', url.toString());
      
      const headers: Record<string, string> = {
        'Accept': 'application/json',
      };

      // Add OAuth header if required
      if (useOAuth) {
        const token = await this.getOAuthToken();
        headers['Authorization'] = `OAuth ${token}`;
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers,
      });
      
      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : 60000;
        console.log(`Rate limited. Retry after ${delay}ms`);
        throw new RateLimitError(delay);
      }
      
      // Handle other HTTP errors
      if (!response.ok) {
        switch (response.status) {
          case 401:
            throw new AuthenticationError();
          case 404:
            throw new NotFoundError();
          case 403:
            throw new StreamUnavailableError();
          default:
            throw new SoundCloudAPIError(`SoundCloud API error: ${response.status} ${response.statusText}`, response.status);
        }
      }
      
      const data = await response.json();
      console.log('SoundCloud API response:', data);
      
      return data;
    } catch (error: unknown) {
      console.error('SoundCloud API request failed:', error);
      console.error('Failed URL:', url.toString());
      
      // Handle specific error types
      if (error instanceof RateLimitError || error instanceof AuthenticationError) {
        throw error;
      }
      
      // Mark API as unavailable and set retry time for network errors
      if (!(error instanceof SoundCloudAPIError)) {
        this.apiAvailable = false;
        this.lastFailTime = Date.now();
      }
      
      throw error;
    }
  }

  // Exponential backoff for retries
  private async makeRequestWithRetry<T>(endpoint: string, params: Record<string, any> = {}, useOAuth: boolean = true, maxRetries: number = 3): Promise<T> {
    let lastError: unknown;
    
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await this.makeRequest<T>(endpoint, params, useOAuth);
      } catch (error) {
        lastError = error;
        
        // Don't retry for certain errors
        if (error instanceof AuthenticationError || 
            error instanceof NotFoundError || 
            error instanceof StreamUnavailableError) {
          throw error;
        }
        
        // For rate limiting, wait for the specified time
        if (error instanceof RateLimitError) {
          if (error.retryAfter) {
            console.log(`Rate limited, waiting ${error.retryAfter}ms before retry`);
            await new Promise(resolve => setTimeout(resolve, error.retryAfter));
            continue;
          }
        }
        
        // For other errors, use exponential backoff
        if (i < maxRetries) {
          const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s, etc.
          console.log(`Request failed, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError;
  }

  // Search for tracks
  async searchTracks(params: SoundCloudSearchParams = {}): Promise<{ collection: SoundCloudTrack[]; next_href?: string }> {
    const defaultParams = {
      limit: 20,
      linked_partitioning: 1,
      ...params
    };
    
    return this.makeRequestWithRetry<{ collection: SoundCloudTrack[]; next_href?: string }>('/tracks', defaultParams, false);
  }

  // Get track by ID
  async getTrack(trackId: number): Promise<SoundCloudTrack> {
    return this.makeRequestWithRetry<SoundCloudTrack>(`/tracks/${trackId}`, {}, false);
  }

  // Get stream URL for a track (requires OAuth)
  async getStreamUrl(trackId: number): Promise<string> {
    try {
      const response = await this.makeRequestWithRetry<{ location: string }>(`/tracks/${trackId}/stream`, {}, true);
      return response.location;
    } catch (error) {
      console.error('Failed to get stream URL:', error);
      throw error;
    }
  }

  // Search for users
  async searchUsers(params: Partial<SoundCloudSearchParams> = {}): Promise<{ collection: SoundCloudUser[]; next_href?: string }> {
    const defaultParams = {
      limit: 20,
      linked_partitioning: 1,
      ...params
    };
    
    return this.makeRequestWithRetry<{ collection: SoundCloudUser[]; next_href?: string }>('/users', defaultParams, false);
  }

  // Get user by ID
  async getUser(userId: number): Promise<SoundCloudUser> {
    return this.makeRequestWithRetry<SoundCloudUser>(`/users/${userId}`, {}, false);
  }

  // Get user's tracks
  async getUserTracks(userId: number, limit: number = 20): Promise<{ collection: SoundCloudTrack[]; next_href?: string }> {
    return this.makeRequestWithRetry<{ collection: SoundCloudTrack[]; next_href?: string }>(`/users/${userId}/tracks`, { limit, linked_partitioning: 1 }, false);
  }

  // Search for playlists
  async searchPlaylists(params: Partial<SoundCloudSearchParams> = {}): Promise<{ collection: SoundCloudPlaylist[]; next_href?: string }> {
    const defaultParams = {
      limit: 20,
      linked_partitioning: 1,
      ...params
    };
    
    return this.makeRequestWithRetry<{ collection: SoundCloudPlaylist[]; next_href?: string }>('/playlists', defaultParams, false);
  }

  // Get playlist by ID
  async getPlaylist(playlistId: number): Promise<SoundCloudPlaylist> {
    return this.makeRequestWithRetry<SoundCloudPlaylist>(`/playlists/${playlistId}`, {}, false);
  }

  // Get popular tracks (trending)
  async getPopularTracks(limit: number = 20): Promise<{ collection: SoundCloudTrack[]; next_href?: string }> {
    return this.searchTracks({
      limit,
      order: 'hotness' // SoundCloud uses 'hotness' for trending
    });
  }

  // Text search
  async textSearch(query: string, limit: number = 20): Promise<{ collection: SoundCloudTrack[]; next_href?: string }> {
    return this.searchTracks({
      q: query,
      limit
    });
  }

  // Check if API is available
  isApiAvailable(): boolean {
    return this.apiAvailable;
  }

  // Reset API availability (for retry)
  resetApiAvailability(): void {
    this.apiAvailable = true;
  }

  // Get track info with stream URL
  async getTrackWithStream(trackId: number): Promise<{ track: SoundCloudTrack; streamUrl: string }> {
    try {
      const track = await this.getTrack(trackId);
      const streamUrl = await this.getStreamUrl(trackId);
      return { track, streamUrl };
    } catch (error) {
      console.error('Failed to get track with stream:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const soundcloudAPI = new SoundCloudAPI();