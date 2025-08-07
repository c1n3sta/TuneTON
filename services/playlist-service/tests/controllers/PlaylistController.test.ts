import request from 'supertest';
import { getRepository } from 'typeorm';
import { app } from '../../src/index';
import { Playlist } from '../../src/entities/Playlist';
import { PlaylistTrack } from '../../src/entities/PlaylistTrack';
import { v4 as uuidv4 } from 'uuid';

// Mock the authentication middleware
jest.mock('../../src/middleware/auth', () => ({
  authenticate: jest.fn((req, res, next) => {
    // Mock user for testing
    req.user = { id: req.headers['test-user-id'] || 'test-user-id', isAdmin: false };
    next();
  }),
  isOwnerOrAdmin: jest.fn((req, res, next) => {
    // Simple ownership check for testing
    if (req.params.userId && req.params.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  }),
}));

describe('PlaylistController', () => {
  const testUserId = 'test-user-id';
  let testPlaylist: Playlist;
  let testTrackId: string;

  beforeAll(async () => {
    // Wait for app to be ready (database connection, etc.)
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  beforeEach(async () => {
    // Clear all test data
    await getRepository(PlaylistTrack).delete({});
    await getRepository(Playlist).delete({});

    // Create a test playlist
    testPlaylist = await getRepository(Playlist).save({
      name: 'Test Playlist',
      description: 'A test playlist',
      isPublic: true,
      userId: testUserId,
    });

    testTrackId = uuidv4();
  });

  describe('POST /api/v1/playlists', () => {
    it('should create a new playlist', async () => {
      const playlistData = {
        name: 'New Playlist',
        description: 'A new playlist',
        isPublic: false,
      };

      const response = await request(app)
        .post('/api/v1/playlists')
        .set('test-user-id', testUserId)
        .send(playlistData);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.playlist).toMatchObject({
        name: playlistData.name,
        description: playlistData.description,
        isPublic: playlistData.isPublic,
        userId: testUserId,
      });
    });

    it('should return 400 for invalid data', async () => {
      const response = await request(app)
        .post('/api/v1/playlists')
        .set('test-user-id', testUserId)
        .send({}); // Missing required fields

      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });
  });

  describe('GET /api/v1/playlists/:id', () => {
    it('should get a playlist by id', async () => {
      const response = await request(app)
        .get(`/api/v1/playlists/${testPlaylist.id}`)
        .set('test-user-id', testUserId);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.playlist.id).toBe(testPlaylist.id);
    });

    it('should return 404 for non-existent playlist', async () => {
      const response = await request(app)
        .get(`/api/v1/playlists/${uuidv4()}`)
        .set('test-user-id', testUserId);

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/v1/playlists/:id', () => {
    it('should update a playlist', async () => {
      const updateData = {
        name: 'Updated Playlist',
        description: 'Updated description',
        isPublic: false,
      };

      const response = await request(app)
        .patch(`/api/v1/playlists/${testPlaylist.id}`)
        .set('test-user-id', testUserId)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data.playlist).toMatchObject(updateData);
    });

    it('should return 403 if user is not the owner', async () => {
      const response = await request(app)
        .patch(`/api/v1/playlists/${testPlaylist.id}`)
        .set('test-user-id', 'different-user-id')
        .send({ name: 'Should Fail' });

      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/v1/playlists/:id/tracks', () => {
    it('should add tracks to a playlist', async () => {
      const response = await request(app)
        .post(`/api/v1/playlists/${testPlaylist.id}/tracks`)
        .set('test-user-id', testUserId)
        .send({ trackIds: [testTrackId] });

      expect(response.status).toBe(200);
      expect(response.body.data.playlistTracks).toHaveLength(1);
      expect(response.body.data.playlistTracks[0].trackId).toBe(testTrackId);
    });
  });

  describe('DELETE /api/v1/playlists/:id/tracks', () => {
    beforeEach(async () => {
      // Add a track to the playlist
      await request(app)
        .post(`/api/v1/playlists/${testPlaylist.id}/tracks`)
        .set('test-user-id', testUserId)
        .send({ trackIds: [testTrackId] });
    });

    it('should remove tracks from a playlist', async () => {
      const response = await request(app)
        .delete(`/api/v1/playlists/${testPlaylist.id}/tracks`)
        .set('test-user-id', testUserId)
        .send({ trackIds: [testTrackId] });

      expect(response.status).toBe(204);
    });
  });

  describe('GET /api/v1/playlists/user/:userId', () => {
    it('should get playlists for a user', async () => {
      const response = await request(app)
        .get(`/api/v1/playlists/user/${testUserId}`)
        .set('test-user-id', testUserId);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data.playlists)).toBe(true);
      expect(response.body.data.playlists.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/v1/playlists/public', () => {
    it('should get public playlists', async () => {
      const response = await request(app)
        .get('/api/v1/playlists/public')
        .set('test-user-id', testUserId);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data.playlists)).toBe(true);
    });
  });

  describe('POST /api/v1/playlists/:id/play', () => {
    it('should increment play count', async () => {
      const beforeResponse = await request(app)
        .get(`/api/v1/playlists/${testPlaylist.id}`)
        .set('test-user-id', testUserId);
      
      const initialCount = beforeResponse.body.data.playlist.playCount;

      const response = await request(app)
        .post(`/api/v1/playlists/${testPlaylist.id}/play`)
        .set('test-user-id', testUserId);

      expect(response.status).toBe(200);

      const afterResponse = await request(app)
        .get(`/api/v1/playlists/${testPlaylist.id}`)
        .set('test-user-id', testUserId);
      
      expect(afterResponse.body.data.playlist.playCount).toBe(initialCount + 1);
    });
  });

  describe('GET /api/v1/playlists/search', () => {
    beforeEach(async () => {
      // Create test playlists
      await getRepository(Playlist).save([
        {
          name: 'Rock Playlist',
          description: 'Best rock songs',
          isPublic: true,
          userId: testUserId,
        },
        {
          name: 'Jazz Mix',
          description: 'Smooth jazz',
          isPublic: true,
          userId: testUserId,
        },
      ]);
    });

    it('should search playlists by name', async () => {
      const response = await request(app)
        .get('/api/v1/playlists/search?q=rock')
        .set('test-user-id', testUserId);

      expect(response.status).toBe(200);
      expect(response.body.data.playlists.length).toBe(1);
      expect(response.body.data.playlists[0].name).toBe('Rock Playlist');
    });
  });
});
