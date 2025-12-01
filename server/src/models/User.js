// User model for PostgreSQL database
import db from '../config/database.js';

class User {
  // Create a new user
  static async create(userData) {
    const { telegram_id, username, first_name, last_name, photo_url, is_premium } = userData;
    
    const query = `
      INSERT INTO users (telegram_id, username, first_name, last_name, photo_url, is_premium)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [telegram_id, username, first_name, last_name, photo_url, is_premium];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }
  
  // Find user by Telegram ID
  static async findByTelegramId(telegramId) {
    const query = 'SELECT * FROM users WHERE telegram_id = $1';
    const values = [telegramId];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding user: ${error.message}`);
    }
  }
  
  // Update user
  static async update(id, userData) {
    const { username, first_name, last_name, photo_url, is_premium } = userData;
    
    const query = `
      UPDATE users 
      SET username = $1, first_name = $2, last_name = $3, photo_url = $4, is_premium = $5, updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `;
    
    const values = [username, first_name, last_name, photo_url, is_premium, id];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }
  
  // Get all users
  static async findAll() {
    const query = 'SELECT * FROM users ORDER BY created_at DESC';
    
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }
}

export default User;