// Playback model for PostgreSQL database
import db from '../config/database.js';

class Playback {
  // Create a new playback record
  static async create(playbackData) {
    const { track_id, count } = playbackData;
    
    const query = `
      INSERT INTO playbacks (track_id, count)
      VALUES ($1, $2)
      RETURNING *
    `;
    
    const values = [track_id, count];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating playback: ${error.message}`);
    }
  }
  
  // Find playback by track ID
  static async findByTrackId(trackId) {
    const query = 'SELECT * FROM playbacks WHERE track_id = $1';
    const values = [trackId];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding playback: ${error.message}`);
    }
  }
  
  // Increment playback count
  static async incrementCount(id) {
    const query = `
      UPDATE playbacks 
      SET count = count + 1, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    const values = [id];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error incrementing playback count: ${error.message}`);
    }
  }
  
  // Get all playbacks
  static async findAll() {
    const query = 'SELECT * FROM playbacks ORDER BY created_at DESC';
    
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching playbacks: ${error.message}`);
    }
  }
}

export default Playback;