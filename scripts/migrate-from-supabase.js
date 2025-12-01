#!/usr/bin/env node

// Script to migrate data from Supabase to self-hosted PostgreSQL
import { createClient } from '@supabase/supabase-js';
import pg from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// PostgreSQL client
const { Client } = pg;
const pgClient = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'tuneton',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'tuneton'
});

async function migrateUsers() {
  console.log('Migrating users...');
  
  try {
    // Fetch users from Supabase
    const { data: users, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) {
      throw new Error(`Error fetching users from Supabase: ${error.message}`);
    }
    
    // Insert users into PostgreSQL
    for (const user of users) {
      const query = `
        INSERT INTO users (id, telegram_id, username, first_name, last_name, photo_url, is_premium, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (telegram_id) DO UPDATE SET
          username = EXCLUDED.username,
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name,
          photo_url = EXCLUDED.photo_url,
          is_premium = EXCLUDED.is_premium,
          updated_at = EXCLUDED.updated_at
      `;
      
      const values = [
        user.id,
        user.telegram_id,
        user.username,
        user.first_name,
        user.last_name,
        user.photo_url,
        user.is_premium,
        user.created_at,
        user.updated_at
      ];
      
      await pgClient.query(query, values);
    }
    
    console.log(`Migrated ${users.length} users`);
  } catch (error) {
    console.error('Error migrating users:', error);
    throw error;
  }
}

async function migrateTracks() {
  console.log('Migrating tracks...');
  
  try {
    // Fetch tracks from Supabase
    const { data: tracks, error } = await supabase
      .from('tracks')
      .select('*');
    
    if (error) {
      throw new Error(`Error fetching tracks from Supabase: ${error.message}`);
    }
    
    // Insert tracks into PostgreSQL
    for (const track of tracks) {
      const query = `
        INSERT INTO tracks (
          id, title, artist, album_id, album_name, duration, file_url, cover_url,
          genre, bpm, key_signature, energy_level, audio_features, license_info,
          play_count, like_count, remix_count, slug, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          artist = EXCLUDED.artist,
          album_id = EXCLUDED.album_id,
          album_name = EXCLUDED.album_name,
          duration = EXCLUDED.duration,
          file_url = EXCLUDED.file_url,
          cover_url = EXCLUDED.cover_url,
          genre = EXCLUDED.genre,
          bpm = EXCLUDED.bpm,
          key_signature = EXCLUDED.key_signature,
          energy_level = EXCLUDED.energy_level,
          audio_features = EXCLUDED.audio_features,
          license_info = EXCLUDED.license_info,
          play_count = EXCLUDED.play_count,
          like_count = EXCLUDED.like_count,
          remix_count = EXCLUDED.remix_count,
          slug = EXCLUDED.slug,
          updated_at = EXCLUDED.updated_at
      `;
      
      const values = [
        track.id,
        track.title,
        track.artist,
        track.album_id,
        track.album_name,
        track.duration,
        track.file_url,
        track.cover_url,
        track.genre,
        track.bpm,
        track.key_signature,
        track.energy_level,
        track.audio_features,
        track.license_info,
        track.play_count,
        track.like_count,
        track.remix_count,
        track.slug,
        track.created_at,
        track.updated_at
      ];
      
      await pgClient.query(query, values);
    }
    
    console.log(`Migrated ${tracks.length} tracks`);
  } catch (error) {
    console.error('Error migrating tracks:', error);
    throw error;
  }
}

async function migratePlaybacks() {
  console.log('Migrating playbacks...');
  
  try {
    // Fetch playbacks from Supabase
    const { data: playbacks, error } = await supabase
      .from('playbacks')
      .select('*');
    
    if (error) {
      throw new Error(`Error fetching playbacks from Supabase: ${error.message}`);
    }
    
    // Insert playbacks into PostgreSQL
    for (const playback of playbacks) {
      const query = `
        INSERT INTO playbacks (id, track_id, count, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO UPDATE SET
          track_id = EXCLUDED.track_id,
          count = EXCLUDED.count,
          updated_at = EXCLUDED.updated_at
      `;
      
      const values = [
        playback.id,
        playback.track_id,
        playback.count,
        playback.created_at,
        playback.updated_at
      ];
      
      await pgClient.query(query, values);
    }
    
    console.log(`Migrated ${playbacks.length} playbacks`);
  } catch (error) {
    console.error('Error migrating playbacks:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('Starting data migration from Supabase to PostgreSQL...');
    
    // Connect to PostgreSQL
    await pgClient.connect();
    console.log('Connected to PostgreSQL');
    
    // Migrate data
    await migrateUsers();
    await migrateTracks();
    await migratePlaybacks();
    
    console.log('Data migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pgClient.end();
  }
}

// Run the migration
main();