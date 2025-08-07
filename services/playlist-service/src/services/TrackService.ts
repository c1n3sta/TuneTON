import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { config } from '@tuneton/shared';
import { logger } from '../utils/logger';

interface Track {
  id: string;
  title: string;
  duration: number;
  artist: string;
  album?: string;
  coverUrl?: string;
  audioUrl: string;
  isPublic: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export class TrackService {
  private client: AxiosInstance;
  private static instance: TrackService;

  private constructor() {
    this.client = axios.create({
      baseURL: config.services.track.url,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        logger.debug(`Sending request to ${config.url}`, {
          method: config.method,
          url: config.url,
          data: config.data,
        });
        return config;
      },
      (error) => {
        logger.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        logger.debug(`Received response from ${response.config.url}`, {
          status: response.status,
          data: response.data,
        });
        return response;
      },
      (error) => {
        logger.error('Response error:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): TrackService {
    if (!TrackService.instance) {
      TrackService.instance = new TrackService();
    }
    return TrackService.instance;
  }

  /**
   * Set the authentication token for track service requests
   */
  public setAuthToken(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Get a track by ID
   */
  public async getTrack(trackId: string, authToken?: string): Promise<Track> {
    try {
      if (authToken) {
        this.setAuthToken(authToken);
      }

      const response: AxiosResponse<{ data: Track }> = await this.client.get(
        `/api/v1/tracks/${trackId}`
      );
      return response.data.data;
    } catch (error) {
      logger.error(`Failed to get track ${trackId}:`, error);
      throw new Error('Failed to fetch track information');
    }
  }

  /**
   * Get multiple tracks by their IDs
   */
  public async getTracks(
    trackIds: string[],
    authToken?: string
  ): Promise<Track[]> {
    try {
      if (authToken) {
        this.setAuthToken(authToken);
      }

      // For a small number of tracks, use individual requests
      if (trackIds.length <= 5) {
        const tracks = await Promise.all(
          trackIds.map((id) => this.getTrack(id, authToken))
        );
        return tracks;
      }

      // For a larger number of tracks, use a batch endpoint if available
      const response: AxiosResponse<{ data: Track[] }> = await this.client.post(
        '/api/v1/tracks/batch',
        { ids: trackIds }
      );
      return response.data.data;
    } catch (error) {
      logger.error('Failed to get tracks:', error);
      throw new Error('Failed to fetch tracks');
    }
  }

  /**
   * Check if tracks exist and are accessible
   */
  public async validateTracks(
    trackIds: string[],
    userId: string,
    authToken?: string
  ): Promise<{ valid: boolean; invalidIds?: string[] }> {
    try {
      if (authToken) {
        this.setAuthToken(authToken);
      }

      const response: AxiosResponse<{
        data: { valid: boolean; invalidIds?: string[] };
      }> = await this.client.post('/api/v1/tracks/validate', {
        ids: trackIds,
        userId,
      });

      return response.data.data;
    } catch (error) {
      logger.error('Failed to validate tracks:', error);
      // If validation fails, assume tracks are invalid
      return { valid: false, invalidIds: trackIds };
    }
  }

  /**
   * Search for tracks
   */
  public async searchTracks(
    query: string,
    page: number = 1,
    limit: number = 20,
    authToken?: string
  ): Promise<PaginatedResponse<Track>> {
    try {
      if (authToken) {
        this.setAuthToken(authToken);
      }

      const response: AxiosResponse<PaginatedResponse<Track>> =
        await this.client.get('/api/v1/tracks/search', {
          params: { q: query, page, limit },
        });

      return response.data;
    } catch (error) {
      logger.error('Failed to search tracks:', error);
      return { data: [], total: 0, page, limit };
    }
  }
}

export const trackService = TrackService.getInstance();
