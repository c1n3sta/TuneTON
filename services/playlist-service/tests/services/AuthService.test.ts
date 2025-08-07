import axios from 'axios';
import { authService } from '../../src/services/AuthService';
import { logger } from '../../src/utils/logger';

// Mock axios and logger
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock logger to avoid console output during tests
jest.mock('../../src/utils/logger', () => ({
  logger: {
    debug: jest.fn(),
    error: jest.fn(),
  },
}));

describe('AuthService', () => {
  const testToken = 'test-token';
  const testUserId = 'test-user-id';
  const testUser = {
    id: testUserId,
    telegramId: 12345,
    isAdmin: false,
    isActive: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    authService.setAuthToken(''); // Reset auth token before each test
  });

  describe('setAuthToken', () => {
    it('should set the authorization header', () => {
      authService.setAuthToken(testToken);
      expect(mockedAxios.defaults.headers.common['Authorization']).toBe(
        `Bearer ${testToken}`
      );
    });
  });

  describe('validateToken', () => {
    it('should validate a token successfully', async () => {
      const mockResponse = {
        data: {
          valid: true,
          user: testUser,
        },
      };
      
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await authService.validateToken(testToken);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/v1/auth/validate-token',
        { token: testToken }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle invalid token', async () => {
      const mockResponse = {
        data: {
          valid: false,
          error: 'Invalid token',
        },
      };
      
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await authService.validateToken('invalid-token');

      expect(result).toEqual({
        valid: false,
        error: 'Invalid token',
      });
    });

    it('should handle validation errors', async () => {
      const error = new Error('Network error');
      mockedAxios.post.mockRejectedValueOnce(error);

      const result = await authService.validateToken(testToken);

      expect(result).toEqual({
        valid: false,
        error: 'Failed to validate token',
      });
      expect(logger.error).toHaveBeenCalledWith(
        'Failed to validate token:',
        error
      );
    });
  });

  describe('checkPermission', () => {
    it('should check user permission successfully', async () => {
      const permission = 'playlist:edit';
      const resource = 'playlist';
      const resourceId = '123';
      
      const mockResponse = {
        data: {
          allowed: true,
        },
      };
      
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await authService.checkPermission(
        testUserId,
        permission,
        resource,
        resourceId
      );

      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/v1/auth/check-permission',
        {
          userId: testUserId,
          permission,
          resource,
          resourceId,
        }
      );
      expect(result).toEqual({
        allowed: true,
      });
    });

    it('should handle permission denied', async () => {
      const mockResponse = {
        data: {
          allowed: false,
          reason: 'Insufficient permissions',
        },
      };
      
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await authService.checkPermission(
        testUserId,
        'playlist:delete',
        'playlist',
        '123'
      );

      expect(result).toEqual({
        allowed: false,
        reason: 'Insufficient permissions',
      });
    });
  });

  describe('getUserPermissions', () => {
    it('should get user permissions', async () => {
      const permissions = ['playlist:read', 'playlist:create'];
      const mockResponse = {
        data: {
          permissions,
        },
      };
      
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await authService.getUserPermissions(testUserId);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/api/v1/auth/users/${testUserId}/permissions`
      );
      expect(result).toEqual({
        permissions,
      });
    });

    it('should handle empty permissions on error', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      const result = await authService.getUserPermissions(testUserId);

      expect(result).toEqual({
        permissions: [],
      });
      expect(logger.error).toHaveBeenCalledWith(
        `Failed to get permissions for user ${testUserId}:`,
        expect.any(Error)
      );
    });
  });

  describe('isAdmin', () => {
    it('should check if user is admin', async () => {
      const mockResponse = {
        data: {
          isAdmin: true,
        },
      };
      
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await authService.isAdmin(testUserId);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/api/v1/auth/users/${testUserId}/is-admin`
      );
      expect(result).toBe(true);
    });

    it('should handle non-admin users', async () => {
      const mockResponse = {
        data: {
          isAdmin: false,
        },
      };
      
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await authService.isAdmin(testUserId);
      expect(result).toBe(false);
    });

    it('should handle errors and return false', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      const result = await authService.isAdmin(testUserId);

      expect(result).toBe(false);
      expect(logger.error).toHaveBeenCalledWith(
        `Failed to check admin status for user ${testUserId}:`,
        expect.any(Error)
      );
    });
  });
});
