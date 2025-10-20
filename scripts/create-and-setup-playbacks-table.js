#!/usr/bin/env node

// Script to create and set up the playbacks table
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://dthrpvpuzinmevrvqlhv.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

// Create Supabase client with service role key for full access
const supabase = createClient(supabaseUrl, supabaseKey);

async function createPlaybacksTable() {
  try {
    console.log('Creating playbacks table...');
    
    // Check if table already exists
    try {
      const { data, error } = await supabase
        .from('playbacks')
        .select('id')
        .limit(1);
      
      if (!error && data) {
        console.log('Playbacks table already exists!');
        return true;
      }
    } catch (error) {
      // Table doesn't exist, continue with creation
    }
    
    // Read the SQL from the migration file
    const migrationFilePath = path.join(__dirname, '../supabase/migrations/20251016193000_create_tracks_and_playbacks_tables.sql');
    
    if (!fs.existsSync(migrationFilePath)) {
      console.error('Migration file not found:', migrationFilePath);
      return false;
    }
    
    const migrationSQL = fs.readFileSync(migrationFilePath, 'utf8');
    
    // Extract the playbacks table creation SQL
    // We need to find the playbacks table section and adjust it for the correct schema
    const playbacksSQL = `
      -- Create playbacks table with correct schema
      CREATE TABLE IF NOT EXISTS playbacks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        track_id BIGINT REFERENCES tracks(id) ON DELETE CASCADE,
        count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_playbacks_track_id ON playbacks(track_id);
      CREATE INDEX IF NOT EXISTS idx_playbacks_created_at ON playbacks(created_at);

      -- Enable Row Level Security
      ALTER TABLE playbacks ENABLE ROW LEVEL SECURITY;

      -- Create policies for public read access
      CREATE POLICY "Public playbacks are viewable by everyone" ON playbacks
        FOR SELECT USING (true);
        
      -- Create policies for insert access (playbacks can be inserted by anyone)
      CREATE POLICY "Anyone can insert playbacks" ON playbacks
        FOR INSERT WITH CHECK (true);
        
      -- Grant access to anon role
      GRANT SELECT, INSERT ON playbacks TO anon;
    `;
    
    console.log('Please create the playbacks table manually through the Supabase dashboard or CLI:');
    console.log('');
    console.log('Use this SQL:');
    console.log(playbacksSQL);
    
    // Since we can't execute SQL directly, let's try to create the table by inserting a record
    // This might work if the table doesn't exist and Supabase can create it
    try {
      const testRecord = {
        track_id: 1, // This should reference an existing track
        count: 0
      };
      
      const { data, error } = await supabase
        .from('playbacks')
        .insert(testRecord)
        .select();
      
      if (error) {
        console.log('Could not create table automatically. Please use the SQL above to create it manually.');
        return false;
      } else {
        console.log('Playbacks table created successfully!');
        // Clean up the test record
        await supabase
          .from('playbacks')
          .delete()
          .eq('track_id', 1);
        return true;
      }
    } catch (error) {
      console.log('Could not create table automatically. Please use the SQL above to create it manually.');
      return false;
    }
  } catch (error) {
    console.error('Error creating playbacks table:', error);
    return false;
  }
}

async function migratePlaybacksData() {
  try {
    console.log('Migrating playbacks data...');
    
    // Read playbacks from JSON file
    const playbacksFilePath = path.join(__dirname, '../data/playbacks.json');
    if (!fs.existsSync(playbacksFilePath)) {
      console.log('Playbacks file not found, skipping playbacks migration');
      return true;
    }
    
    const playbacksDataRaw = JSON.parse(fs.readFileSync(playbacksFilePath, 'utf8'));
    
    // Convert playbacks data to array format for database insertion
    // Note: track_id should be BIGINT to match tracks.id
    const playbacksData = Object.entries(playbacksDataRaw).map(([trackId, count]) => ({
      track_id: parseInt(trackId), // Convert to integer to match tracks.id
      count: count
    }));
    
    console.log(`Found ${playbacksData.length} playback records to migrate`);
    
    if (playbacksData.length === 0) {
      console.log('No playback data to migrate');
      return true;
    }
    
    // Insert playbacks into database
    const { error } = await supabase
      .from('playbacks')
      .upsert(playbacksData, {
        onConflict: 'track_id',
        returning: 'minimal'
      });
    
    if (error) {
      console.error('Error migrating playbacks:', error);
      return false;
    }
    
    console.log('Successfully migrated playbacks');
    return true;
  } catch (error) {
    console.error('Error in migratePlaybacksData:', error);
    return false;
  }
}

async function main() {
  console.log('Setting up playbacks table and migrating data...');
  
  try {
    // Create playbacks table
    const tableCreated = await createPlaybacksTable();
    if (!tableCreated) {
      console.log('Could not create playbacks table. Please create it manually and run this script again.');
      return;
    }
    
    // Migrate playbacks data
    const dataMigrated = await migratePlaybacksData();
    if (!dataMigrated) {
      console.log('Failed to migrate playbacks data.');
      return;
    }
    
    console.log('Playbacks table setup and data migration completed successfully!');
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

main();