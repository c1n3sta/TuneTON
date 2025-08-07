import axios from 'axios';
import { userService } from '../../src/services/UserService';
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

describe('UserService', () => {
  const testToken = 'test-token';
  const testUserId = 'test-user-id';
  const testUserProfile = {
    id: testUserId,
    username: 'testuser',
    email: 'test@example.com',
    displayName: 'Test User',
    isVerified: true,
    isAdmin: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    userService.setAuthToken(''); // Reset auth token before each test
  });

  describe('setAuthToken', () => {
    it('should set the authorization header', () => {
      userService.setAuthToken(testToken);
      expect(mockedAxios.defaults.headers.common['Authorization']).toBe(
        `Bearer ${testToken}`
      );
    });
  });

  describe('getUserProfile', () => {
    it('should fetch a user profile by ID', async () => {
      const mockResponse = {
        data: {
          data: testUserProfile,
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await userService.getUserProfile(testUserId);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/api/v1/users/${testUserId}/profile`
      );
      expect(result).toEqual(testUserProfile);
    });

    it('should include auth token when provided', async () => {
      const mockResponse = {
        data: {
          data: testUserProfile,
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      await userService.getUserProfile(testUserId, testToken);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/api/v1/users/${testUserId}/profile`,
        {
          headers: {
            Authorization: `Bearer ${testToken}`,
          },
        }
      );
    });

    it('should handle errors', async () => {
      const error = new Error('Network error');
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(userService.getUserProfile(testUserId)).rejects.toThrow(
        'Failed to fetch user profile'
      );
      expect(logger.error).toHaveBeenCalledWith(
        `Failed to get user profile ${testUserId}:`,
        error
      );
    });
  });

  describe('getUserPreferences', () => {
    it('should fetch user preferences', async () => {
      const mockPreferences = {
        theme: 'dark',
        language: 'en',
        notifications: {
          email: true,
          push: true,
        },
        privacy: {
          profile: 'public',
          activity: 'friends',
        },
      };
      
      const mockResponse = {
        data: {
          data: mockPreferences,
        },
      };
      
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await userService.getUserPreferences(testUserId);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/api/v1/users/${testUserId}/preferences`
      );
      expect(result).toEqual(mockPreferences);
    });

    it('should return default preferences on error', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      const result = await userService.getUserPreferences(testUserId);

      expect(result).toEqual({
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
      });
    });
  });

  describe('validateUsers', () => {
    it('should validate user IDs', async () => {
      const userIds = [testUserId, 'user-2', 'user-3'];
      const mockResponse = {
        data: {
          data: {
            valid: true,
            invalidIds: [],
          },
        },
      };
      
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await userService.validateUsers(userIds);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/v1/users/validate',
        { ids: userIds }
      );
      expect(result).toEqual({
        valid: true,
        invalidIds: [],
      });
    });

    it('should handle validation errors', async () => {
      const userIds = ['invalid-user'];
      const error = new Error('Validation failed');
      mockedAxios.post.mockRejectedValueOnce(error);

      const result = await userService.validateUsers(userIds);

      expect(result).toEqual({
        valid: false,
        invalidIds: userIds,
      });
      expect(logger.error).toHaveBeenCalledWith(
        'Failed to validate users:',
        error
      );
    });
  });

  describe('searchUsers', () => {
    it('should search for users', async () => {
      const query = 'test';
      const page = 1;
      const limit = 10;
      
      const mockResponse = {
        data: {
          data: [testUserProfile],
          total: 1,
        },
      };
      
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await userService.searchUsers(query, page, limit);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/api/v1/users/search',
        {
          params: { q: query, page, limit },
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle search errors', async () => {
      const error = new Error('Search failed');
      mockedAxios.get.mockRejectedValueOnce(error);

      const result = await userService.searchUsers('test');

      expect(result).toEqual({
        data: [],
        total: 0,
      });
      expect(logger.error).toHaveBeenCalledWith('Failed to search users:', error);
    });
  });
});
