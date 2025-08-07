import { serviceCoordinator } from '../../src/services/ServiceCoordinator';
import { authService } from '../../src/services/AuthService';
import { trackService } from '../../src/services/TrackService';
import { userService } from '../../src/services/UserService';
import { v4 as uuidv4 } from 'uuid';

// Mock the service dependencies
jest.mock('../../src/services/AuthService');
jest.mock('../../src/services/TrackService');
jest.mock('../../src/services/UserService');

describe('ServiceCoordinator', () => {
  const testToken = 'test-token';
  const testUserId = uuidv4();
  const testTrackId = uuidv4();
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
  const testTrack = {
    id: testTrackId,
    title: 'Test Track',
    duration: 180,
    artist: 'Test Artist',
    audioUrl: 'http://example.com/audio.mp3',
    isPublic: true,
    userId: testUserId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Set up mock implementations
    (authService.validateToken as jest.Mock).mockResolvedValue({
      valid: true,
      user: {
        id: testUserId,
        telegramId: 12345,
        isAdmin: false,
        isActive: true,
      },
    });

    (trackService.validateTracks as jest.Mock).mockResolvedValue({
      valid: true,
      invalidIds: [],
    });

    (trackService.getTracks as jest.Mock).mockResolvedValue([testTrack]);
    (userService.getUserProfile as jest.Mock).mockResolvedValue(testUserProfile);
    (authService.checkPermission as jest.Mock).mockResolvedValue({
      allowed: true,
    });
  });

  describe('setAuthToken', () => {
    it('should set the auth token for all services', () => {
      serviceCoordinator.setAuthToken(testToken);
      
      expect(authService.setAuthToken).toHaveBeenCalledWith(testToken);
      expect(trackService.setAuthToken).toHaveBeenCalledWith(testToken);
      expect(userService.setAuthToken).toHaveBeenCalledWith(testToken);
    });
  });

  describe('validateAuth', () => {
    it('should validate authentication token', async () => {
      const result = await serviceCoordinator.validateAuth(testToken);
      
      expect(authService.validateToken).toHaveBeenCalledWith(testToken);
      expect(result).toEqual({
        userId: testUserId,
        isAdmin: false,
        isValid: true,
      });
    });

    it('should handle invalid token', async () => {
      (authService.validateToken as jest.Mock).mockResolvedValueOnce({
        valid: false,
      });
      
      const result = await serviceCoordinator.validateAuth('invalid-token');
      
      expect(result).toEqual({
        userId: '',
        isAdmin: false,
        isValid: false,
      });
    });
  });

  describe('validateTracks', () => {
    it('should validate track IDs', async () => {
      const trackIds = [testTrackId];
      const result = await serviceCoordinator.validateTracks(trackIds, testUserId);
      
      expect(trackService.validateTracks).toHaveBeenCalledWith(
        trackIds,
        testUserId,
        undefined
      );
      expect(result).toEqual({
        valid: [testTrackId],
        invalid: [],
      });
    });

    it('should handle invalid track IDs', async () => {
      const invalidTrackId = uuidv4();
      (trackService.validateTracks as jest.Mock).mockResolvedValueOnce({
        valid: false,
        invalidIds: [invalidTrackId],
      });
      
      const result = await serviceCoordinator.validateTracks(
        [invalidTrackId],
        testUserId
      );
      
      expect(result).toEqual({
        valid: [],
        invalid: [invalidTrackId],
      });
    });
  });

  describe('enrichPlaylist', () => {
    it('should enrich playlist with owner and tracks', async () => {
      const playlist = {
        id: uuidv4(),
        name: 'Test Playlist',
        userId: testUserId,
        trackIds: [testTrackId],
      };
      
      const result = await serviceCoordinator.enrichPlaylist(playlist);
      
      expect(userService.getUserProfile).toHaveBeenCalledWith(
        testUserId,
        undefined
      );
      expect(trackService.getTracks).toHaveBeenCalledWith(
        [testTrackId],
        undefined
      );
      expect(result).toEqual({
        ...playlist,
        owner: testUserProfile,
        tracks: [testTrack],
      });
    });

    it('should handle missing track IDs', async () => {
      const playlist = {
        id: uuidv4(),
        name: 'Empty Playlist',
        userId: testUserId,
        trackIds: [],
      };
      
      const result = await serviceCoordinator.enrichPlaylist(playlist);
      
      expect(trackService.getTracks).not.toHaveBeenCalled();
      expect(result).toEqual({
        ...playlist,
        owner: testUserProfile,
        tracks: [],
      });
    });

    it('should handle errors when fetching data', async () => {
      const playlist = {
        id: uuidv4(),
        name: 'Error Playlist',
        userId: testUserId,
        trackIds: [testTrackId],
      };
      
      (userService.getUserProfile as jest.Mock).mockRejectedValueOnce(
        new Error('Failed to fetch user')
      );
      
      const result = await serviceCoordinator.enrichPlaylist(playlist);
      
      expect(result).toEqual({
        ...playlist,
        owner: { id: testUserId, error: 'Failed to load user profile' },
        tracks: [],
      });
    });
  });

  describe('checkPermission', () => {
    it('should check user permission', async () => {
      const permission = 'playlist:edit';
      const resource = 'playlist';
      const resourceId = uuidv4();
      
      const result = await serviceCoordinator.checkPermission(
        testUserId,
        permission,
        resource,
        resourceId
      );
      
      expect(authService.checkPermission).toHaveBeenCalledWith(
        testUserId,
        permission,
        resource,
        resourceId
      );
      expect(result).toEqual({ allowed: true });
    });
  });

  describe('search', () => {
    it('should search across multiple services', async () => {
      const query = 'test';
      const mockTracks = {
        data: [testTrack],
        total: 1,
        page: 1,
        limit: 10,
      };
      const mockUsers = {
        data: [testUserProfile],
        total: 1,
      };
      
      (trackService.searchTracks as jest.Mock).mockResolvedValue(mockTracks);
      (userService.searchUsers as jest.Mock).mockResolvedValue(mockUsers);
      
      const result = await serviceCoordinator.search(query, ['tracks', 'users']);
      
      expect(trackService.searchTracks).toHaveBeenCalledWith(
        query,
        1,
        10,
        undefined
      );
      expect(userService.searchUsers).toHaveBeenCalledWith(
        query,
        1,
        10,
        undefined
      );
      expect(result).toEqual({
        tracks: [testTrack],
        users: [testUserProfile],
        playlists: [],
        total: 2,
      });
    });

    it('should handle empty search types', async () => {
      const result = await serviceCoordinator.search('test', []);
      
      expect(trackService.searchTracks).not.toHaveBeenCalled();
      expect(userService.searchUsers).not.toHaveBeenCalled();
      expect(result).toEqual({
        tracks: [],
        users: [],
        playlists: [],
        total: 0,
      });
    });
  });
});
