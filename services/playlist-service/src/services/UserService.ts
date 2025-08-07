import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { config } from '@tuneton/shared';
import { logger } from '../utils/logger';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  isVerified: boolean;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
  };
  privacy: {
    profile: 'public' | 'private' | 'friends';
    activity: 'public' | 'private' | 'friends';
  };
}

export class UserService {
  private client: AxiosInstance;
  private static instance: UserService;

  private constructor() {
    this.client = axios.create({
      baseURL: config.services.user.url,
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
        });
        return response;
      },
      (error) => {
        logger.error('Response error:', {
          message: error.message,
          status: error.response?.status,
          url: error.config?.url,
        });
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  /**
   * Set the authentication token for user service requests
   */
  public setAuthToken(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Get user profile by ID
   */
  public async getUserProfile(
    userId: string,
    authToken?: string
  ): Promise<UserProfile> {
    try {
      if (authToken) {
        this.setAuthToken(authToken);
      }

      const response: AxiosResponse<{ data: UserProfile }> = await this.client.get(
        `/api/v1/users/${userId}/profile`
      );
      return response.data.data;
    } catch (error) {
      logger.error(`Failed to get user profile ${userId}:`, error);
      throw new Error('Failed to fetch user profile');
    }
  }

  /**
   * Get multiple user profiles by their IDs
   */
  public async getUserProfiles(
    userIds: string[],
    authToken?: string
  ): Promise<UserProfile[]> {
    try {
      if (authToken) {
        this.setAuthToken(authToken);
      }

      // For a small number of users, use individual requests
      if (userIds.length <= 5) {
        const users = await Promise.all(
          userIds.map((id) => this.getUserProfile(id, authToken))
        );
        return users;
      }

      // For a larger number of users, use a batch endpoint if available
      const response: AxiosResponse<{ data: UserProfile[] }> =
        await this.client.post('/api/v1/users/batch', { ids: userIds });
      return response.data.data;
    } catch (error) {
      logger.error('Failed to get user profiles:', error);
      throw new Error('Failed to fetch user profiles');
    }
  }

  /**
   * Get user preferences
   */
  public async getUserPreferences(
    userId: string,
    authToken?: string
  ): Promise<UserPreferences> {
    try {
      if (authToken) {
        this.setAuthToken(authToken);
      }

      const response: AxiosResponse<{ data: UserPreferences }> =
        await this.client.get(`/api/v1/users/${userId}/preferences`);
      return response.data.data;
    } catch (error) {
      logger.error(`Failed to get preferences for user ${userId}:`, error);
      // Return default preferences if unable to fetch
      return {
        theme: 'system',
        language: 'en',
        notifications: {
          email: true,
          push: true,
        },
        privacy: {
          profile: 'public',
          activity: 'public',
        },
      };
    }
  }

  /**
   * Check if users exist and are accessible
   */
  public async validateUsers(
    userIds: string[],
    authToken?: string
  ): Promise<{ valid: boolean; invalidIds?: string[] }> {
    try {
      if (authToken) {
        this.setAuthToken(authToken);
      }

      const response: AxiosResponse<{
        data: { valid: boolean; invalidIds?: string[] };
      }> = await this.client.post('/api/v1/users/validate', { ids: userIds });

      return response.data.data;
    } catch (error) {
      logger.error('Failed to validate users:', error);
      // If validation fails, assume users are invalid
      return { valid: false, invalidIds: userIds };
    }
  }

  /**
   * Search for users
   */
  public async searchUsers(
    query: string,
    page: number = 1,
    limit: number = 20,
    authToken?: string
  ): Promise<{ data: UserProfile[]; total: number }> {
    try {
      if (authToken) {
        this.setAuthToken(authToken);
      }

      const response: AxiosResponse<{ data: UserProfile[]; total: number }> =
        await this.client.get('/api/v1/users/search', {
          params: { q: query, page, limit },
        });

      return response.data;
    } catch (error) {
      logger.error('Failed to search users:', error);
      return { data: [], total: 0 };
    }
  }
}

export const userService = UserService.getInstance();
