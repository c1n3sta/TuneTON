import { getRepository } from 'typeorm';
import { Playlist } from '../../src/entities/Playlist';
import { v4 as uuidv4 } from 'uuid';

describe('Playlist Entity', () => {
  let playlist: Playlist;

  beforeEach(() => {
    playlist = new Playlist();
    playlist.name = 'Test Playlist';
    playlist.description = 'A test playlist';
    playlist.isPublic = true;
    playlist.userId = uuidv4();
    playlist.trackCount = 0;
    playlist.playCount = 0;
    playlist.duration = 0;
  });

  it('should be defined', () => {
    expect(playlist).toBeDefined();
  });

  it('should have valid properties', () => {
    expect(playlist.name).toBe('Test Playlist');
    expect(playlist.description).toBe('A test playlist');
    expect(playlist.isPublic).toBe(true);
    expect(playlist.userId).toBeDefined();
    expect(playlist.trackCount).toBe(0);
    expect(playlist.playCount).toBe(0);
    expect(playlist.duration).toBe(0);
  });

  it('should validate name length', () => {
    // Test name is too long
    playlist.name = 'a'.repeat(101);
    expect(() => playlist.validate()).toThrow('Name must be less than 100 characters');

    // Test valid name
    playlist.name = 'Valid Name';
    expect(() => playlist.validate()).not.toThrow();
  });

  it('should validate description length', () => {
    // Test description is too long
    playlist.description = 'a'.repeat(501);
    expect(() => playlist.validate()).toThrow('Description must be less than 500 characters');

    // Test valid description
    playlist.description = 'A valid description';
    expect(() => playlist.validate()).not.toThrow();
  });

  it('should generate UUID if not provided', () => {
    const playlist = new Playlist();
    playlist.name = 'New Playlist';
    playlist.userId = uuidv4();
    
    // ID should be generated in the beforeInsert hook
    expect(playlist.id).toBeUndefined();
    (playlist as any).generateId();
    expect(playlist.id).toBeDefined();
    expect(typeof playlist.id).toBe('string');
    expect(playlist.id.length).toBeGreaterThan(0);
  });

  it('should serialize to JSON correctly', () => {
    const json = playlist.toJSON();
    
    expect(json).toHaveProperty('id');
    expect(json).toHaveProperty('name', 'Test Playlist');
    expect(json).toHaveProperty('description', 'A test playlist');
    expect(json).toHaveProperty('isPublic', true);
    expect(json).toHaveProperty('userId', playlist.userId);
    expect(json).toHaveProperty('trackCount', 0);
    expect(json).toHaveProperty('playCount', 0);
    expect(json).toHaveProperty('duration', 0);
    expect(json).toHaveProperty('createdAt');
    expect(json).toHaveProperty('updatedAt');
    
    // Should not include relations by default
    expect(json).not.toHaveProperty('playlistTracks');
  });
});
