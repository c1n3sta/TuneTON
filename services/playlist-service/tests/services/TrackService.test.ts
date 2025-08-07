import axios from 'axios';
import { trackService } from '../../src/services/TrackService';
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

describe('TrackService', () => {
  const testToken = 'test-token';
  const testTrackId = 'test-track-id';
  const testUserId = 'test-user-id';
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
    jest.clearAllMocks();
    trackService.setAuthToken(''); // Reset auth token before each test
  });

  describe('setAuthToken', () => {
    it('should set the authorization header', () => {
      trackService.setAuthToken(testToken);
      expect(mockedAxios.defaults.headers.common['Authorization']).toBe(
        `Bearer ${testToken}`
      );
    });
  });

  describe('getTrack', () => {
    it('should fetch a track by ID', async () => {
      const mockResponse = {
        data: {
          data: testTrack,
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await trackService.getTrack(testTrackId);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/api/v1/tracks/${testTrackId}`
      );
      expect(result).toEqual(testTrack);
    });

    it('should include auth token when provided', async () => {
      const mockResponse = {
        data: {
          data: testTrack,
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      await trackService.getTrack(testTrackId, testToken);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/api/v1/tracks/${testTrackId}`,
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

      await expect(trackService.getTrack(testTrackId)).rejects.toThrow(
        'Failed to fetch track information'
      );
      expect(logger.error).toHaveBeenCalledWith(
        `Failed to get track ${testTrackId}:`,
        error
      );
    });
  });

  describe('getTracks', () => {
    const trackIds = [testTrackId, 'track-2', 'track-3'];
    const tracks = [testTrack, { ...testTrack, id: 'track-2' }, { ...testTrack, id: 'track-3' }];

    it('should fetch multiple tracks by IDs using individual requests for small batches', async () => {
      trackIds.forEach((id, index) => {
        mockedAxios.get.mockResolvedValueOnce({
          data: { data: { ...testTrack, id } },
        });
      });

      const result = await trackService.getTracks(trackIds);

      expect(mockedAxios.get).toHaveBeenCalledTimes(3);
      expect(mockedAxios.post).not.toHaveBeenCalled();
      expect(result).toHaveLength(3);
      expect(result[0].id).toBe(trackIds[0]);
      expect(result[1].id).toBe(trackIds[1]);
      expect(result[2].id).toBe(trackIds[2]);
    });

    it('should use batch endpoint for large number of tracks', async () => {
      const manyTrackIds = Array(10).fill(0).map((_, i) => `track-${i}`);
      const mockResponse = {
        data: {
          data: manyTrackIds.map(id => ({ ...testTrack, id })),
        },
      };
      
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await trackService.getTracks(manyTrackIds);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/v1/tracks/batch',
        { ids: manyTrackIds }
      );
      expect(result).toHaveLength(10);
    });
  });

  describe('validateTracks', () => {
    it('should validate track IDs', async () => {
      const mockResponse = {
        data: {
          data: {
            valid: true,
            invalidIds: [],
          },
        },
      };
      
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await trackService.validateTracks(
        [testTrackId],
        testUserId
      );

      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/v1/tracks/validate',
        {
          ids: [testTrackId],
          userId: testUserId,
        }
      );
      expect(result).toEqual({
        valid: true,
        invalidIds: [],
      });
    });

    it('should handle validation errors', async () => {
      const error = new Error('Validation failed');
      mockedAxios.post.mockRejectedValueOnce(error);

      const result = await trackService.validateTracks(
        [testTrackId],
        testUserId
      );

      expect(result).toEqual({
        valid: false,
        invalidIds: [testTrackId],
      });
      expect(logger.error).toHaveBeenCalledWith(
        'Failed to validate tracks:',
        error
      );
    });
  });

  describe('searchTracks', () => {
    it('should search for tracks', async () => {
      const query = 'test';
      const page = 1;
      const limit = 10;
      
      const mockResponse = {
        data: {
          data: [testTrack],
          total: 1,
          page,
          limit,
        },
      };
      
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await trackService.searchTracks(query, page, limit);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/api/v1/tracks/search',
        {
          params: { q: query, page, limit },
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle search errors', async () => {
      const error = new Error('Search failed');
      mockedAxios.get.mockRejectedValueOnce(error);

      const result = await trackService.searchTracks('test');

      expect(result).toEqual({
        data: [],
        total: 0,
        page: 1,
        limit: 20,
      });
      expect(logger.error).toHaveBeenCalledWith('Failed to search tracks:', error);
    });
  });
});
