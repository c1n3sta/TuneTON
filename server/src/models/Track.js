// Track model for PostgreSQL database
import db from '../config/database.js';

class Track {
  // Create a new track
  static async create(trackData) {
    const {
      id, title, artist, album_id, album_name, duration, file_url, cover_url,
      genre, bpm, key_signature, energy_level, audio_features, license_info,
      play_count, like_count, remix_count, slug
    } = trackData;
    
    const query = `
      INSERT INTO tracks (
        id, title, artist, album_id, album_name, duration, file_url, cover_url,
        genre, bpm, key_signature, energy_level, audio_features, license_info,
        play_count, like_count, remix_count, slug
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *
    `;
    
    const values = [
      id, title, artist, album_id, album_name, duration, file_url, cover_url,
      genre, bpm, key_signature, energy_level, audio_features, license_info,
      play_count, like_count, remix_count, slug
    ];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating track: ${error.message}`);
    }
  }
  
  // Find track by ID
  static async findById(id) {
    const query = 'SELECT * FROM tracks WHERE id = $1';
    const values = [id];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding track: ${error.message}`);
    }
  }
  
  // Get all tracks
  static async findAll() {
    const query = 'SELECT * FROM tracks ORDER BY created_at DESC';
    
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching tracks: ${error.message}`);
    }
  }
  
  // Update play count
  static async incrementPlayCount(id) {
    const query = `
      UPDATE tracks 
      SET play_count = play_count + 1
      WHERE id = $1
      RETURNING *
    `;
    
    const values = [id];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating track play count: ${error.message}`);
    }
  }
}

export default Track;