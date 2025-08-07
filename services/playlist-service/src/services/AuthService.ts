import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { config } from '@tuneton/shared';
import { logger } from '../utils/logger';

interface TokenValidationResponse {
  valid: boolean;
  user?: {
    id: string;
    telegramId: number;
    isAdmin: boolean;
    isActive: boolean;
  };
  error?: string;
}

interface PermissionCheckResponse {
  allowed: boolean;
  reason?: string;
}

export class AuthService {
  private client: AxiosInstance;
  private static instance: AuthService;

  private constructor() {
    this.client = axios.create({
      baseURL: config.services.auth.url,
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

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Set the authentication token for auth service requests
   */
  public setAuthToken(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Validate a JWT token
   */
  public async validateToken(token: string): Promise<TokenValidationResponse> {
    try {
      const response: AxiosResponse<TokenValidationResponse> =
        await this.client.post('/api/v1/auth/validate-token', { token });
      return response.data;
    } catch (error) {
      logger.error('Failed to validate token:', error);
      return { valid: false, error: 'Failed to validate token' };
    }
  }

  /**
   * Check if a user has a specific permission
   */
  public async checkPermission(
    userId: string,
    permission: string,
    resource?: string,
    resourceId?: string
  ): Promise<PermissionCheckResponse> {
    try {
      const response: AxiosResponse<PermissionCheckResponse> =
        await this.client.post('/api/v1/auth/check-permission', {
          userId,
          permission,
          resource,
          resourceId,
        });
      return response.data;
    } catch (error) {
      logger.error('Failed to check permission:', {
        userId,
        permission,
        error,
      });
      return { allowed: false, reason: 'Failed to verify permissions' };
    }
  }

  /**
   * Get all permissions for a user
   */
  public async getUserPermissions(
    userId: string
  ): Promise<{ permissions: string[] }> {
    try {
      const response: AxiosResponse<{ permissions: string[] }> =
        await this.client.get(`/api/v1/auth/users/${userId}/permissions`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to get permissions for user ${userId}:`, error);
      return { permissions: [] };
    }
  }

  /**
   * Verify if a user is an admin
   */
  public async isAdmin(userId: string): Promise<boolean> {
    try {
      const response: AxiosResponse<{ isAdmin: boolean }> = await this.client.get(
        `/api/v1/auth/users/${userId}/is-admin`
      );
      return response.data.isAdmin;
    } catch (error) {
      logger.error(`Failed to check admin status for user ${userId}:`, error);
      return false;
    }
  }
}

export const authService = AuthService.getInstance();
