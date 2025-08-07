import { getRepository } from 'typeorm';
import { PlaylistService } from '../../src/services/PlaylistService';
import { Playlist } from '../../src/entities/Playlist';
import { PlaylistTrack } from '../../src/entities/PlaylistTrack';
import { v4 as uuidv4 } from 'uuid';

describe('PlaylistService', () => {
  let playlistService: PlaylistService;
  let testPlaylist: Playlist;
  const testUserId = uuidv4();
  const testTrackId = uuidv4();

  beforeAll(() => {
    playlistService = new PlaylistService();
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
      trackCount: 0,
      playCount: 0,
      duration: 0,
    });
  });

  describe('createPlaylist', () => {
    it('should create a new playlist', async () => {
      const playlistData = {
        name: 'New Playlist',
        description: 'A new playlist',
        isPublic: false,
        userId: testUserId,
      };

      const playlist = await playlistService.createPlaylist(playlistData);

      expect(playlist).toBeDefined();
      expect(playlist.name).toBe(playlistData.name);
      expect(playlist.description).toBe(playlistData.description);
      expect(playlist.isPublic).toBe(playlistData.isPublic);
      expect(playlist.userId).toBe(playlistData.userId);
    });
  });

  describe('getPlaylistById', () => {
    it('should return a playlist by id', async () => {
      const playlist = await playlistService.getPlaylistById(testPlaylist.id, testUserId);
      
      expect(playlist).toBeDefined();
      expect(playlist.id).toBe(testPlaylist.id);
    });

    it('should throw error if playlist not found', async () => {
      await expect(
        playlistService.getPlaylistById(uuidv4(), testUserId)
      ).rejects.toThrow('Playlist not found');
    });

    it('should throw error if user has no access to private playlist', async () => {
      // Create a private playlist
      const privatePlaylist = await getRepository(Playlist).save({
        name: 'Private Playlist',
        isPublic: false,
        userId: uuidv4(), // Different user
      });

      await expect(
        playlistService.getPlaylistById(privatePlaylist.id, testUserId)
      ).rejects.toThrow('Access to this playlist is forbidden');
    });
  });

  describe('updatePlaylist', () => {
    it('should update a playlist', async () => {
      const updateData = {
        name: 'Updated Playlist',
        description: 'Updated description',
        isPublic: false,
      };

      const updatedPlaylist = await playlistService.updatePlaylist(
        testPlaylist.id,
        updateData,
        testUserId
      );

      expect(updatedPlaylist.name).toBe(updateData.name);
      expect(updatedPlaylist.description).toBe(updateData.description);
      expect(updatedPlaylist.isPublic).toBe(updateData.isPublic);
    });

    it('should throw error if user is not the owner', async () => {
      await expect(
        playlistService.updatePlaylist(
          testPlaylist.id,
          { name: 'Should Fail' },
          uuidv4() // Different user ID
        )
      ).rejects.toThrow('Only the playlist owner can update it');
    });
  });

  describe('addTracks', () => {
    it('should add tracks to a playlist', async () => {
      const trackIds = [uuidv4(), uuidv4()];
      
      const result = await playlistService.addTracks(testPlaylist.id, {
        trackIds,
        userId: testUserId,
      });

      expect(result).toHaveLength(2);
      expect(result[0].trackId).toBe(trackIds[0]);
      expect(result[1].trackId).toBe(trackIds[1]);

      // Verify track count was updated
      const updatedPlaylist = await getRepository(Playlist).findOne(testPlaylist.id);
      expect(updatedPlaylist?.trackCount).toBe(2);
    });
  });

  describe('removeTracks', () => {
    beforeEach(async () => {
      // Add some tracks to the playlist
      await playlistService.addTracks(testPlaylist.id, {
        trackIds: [testTrackId],
        userId: testUserId,
      });
    });

    it('should remove tracks from a playlist', async () => {
      await playlistService.removeTracks(
        testPlaylist.id,
        [testTrackId],
        testUserId
      );

      // Verify track was removed
      const playlistTracks = await getRepository(PlaylistTrack).find({
        where: { playlistId: testPlaylist.id },
      });
      
      expect(playlistTracks).toHaveLength(0);
      
      // Verify track count was updated
      const updatedPlaylist = await getRepository(Playlist).findOne(testPlaylist.id);
      expect(updatedPlaylist?.trackCount).toBe(0);
    });
  });

  describe('reorderTracks', () => {
    let track1: string;
    let track2: string;
    let track3: string;

    beforeEach(async () => {
      // Add tracks to the playlist
      track1 = uuidv4();
      track2 = uuidv4();
      track3 = uuidv4();
      
      await playlistService.addTracks(testPlaylist.id, {
        trackIds: [track1, track2, track3],
        userId: testUserId,
      });
    });

    it('should reorder tracks in a playlist', async () => {
      // Reorder tracks: move track3 to position 0
      await playlistService.reorderTracks(testPlaylist.id, {
        userId: testUserId,
        newOrder: [
          { trackId: track3, position: 0 },
          { trackId: track1, position: 1 },
          { trackId: track2, position: 2 },
        ],
      });

      // Verify new order
      const playlistTracks = await getRepository(PlaylistTrack).find({
        where: { playlistId: testPlaylist.id },
        order: { position: 'ASC' },
      });

      expect(playlistTracks[0].trackId).toBe(track3);
      expect(playlistTracks[1].trackId).toBe(track1);
      expect(playlistTracks[2].trackId).toBe(track2);
    });
  });

  describe('searchPlaylists', () => {
    beforeEach(async () => {
      // Create test playlists
      await getRepository(Playlist).save([
        {
          name: 'Rock Classics',
          description: 'The best rock classics',
          isPublic: true,
          userId: uuidv4(),
        },
        {
          name: 'Jazz Vibes',
          description: 'Smooth jazz for relaxing',
          isPublic: true,
          userId: uuidv4(),
        },
        {
          name: 'Private Mix',
          description: 'My private mix',
          isPublic: false,
          userId: testUserId, // Owned by test user
        },
      ]);
    });

    it('should return public playlists matching search query', async () => {
      const { playlists } = await playlistService.searchPlaylists('rock', undefined, 1, 10);
      
      expect(playlists).toHaveLength(1);
      expect(playlists[0].name).toBe('Rock Classics');
    });

    it('should include private playlists for the owner', async () => {
      const { playlists } = await playlistService.searchPlaylists('mix', testUserId, 1, 10);
      
      expect(playlists).toHaveLength(1);
      expect(playlists[0].name).toBe('Private Mix');
    });
  });

  describe('incrementPlayCount', () => {
    it('should increment play count', async () => {
      const initialCount = testPlaylist.playCount;
      
      await playlistService.incrementPlayCount(testPlaylist.id);
      
      const updatedPlaylist = await getRepository(Playlist).findOne(testPlaylist.id);
      expect(updatedPlaylist?.playCount).toBe(initialCount + 1);
    });
  });
});
