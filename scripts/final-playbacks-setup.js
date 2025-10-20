#!/usr/bin/env node

// Final script to create playbacks table and migrate data
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

// SQL to create playbacks table
const createPlaybacksTableSQL = `
  CREATE TABLE IF NOT EXISTS playbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    track_id BIGINT REFERENCES tracks(id) ON DELETE CASCADE,
    count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS idx_playbacks_track_id ON playbacks(track_id);
  CREATE INDEX IF NOT EXISTS idx_playbacks_created_at ON playbacks(created_at);

  ALTER TABLE playbacks ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Public playbacks are viewable by everyone" ON playbacks
    FOR SELECT USING (true);
    
  CREATE POLICY "Anyone can insert playbacks" ON playbacks
    FOR INSERT WITH CHECK (true);
    
  GRANT SELECT, INSERT ON playbacks TO anon;
`;

async function createPlaybacksTable() {
  try {
    console.log('Creating playbacks table...');
    
    // Since we can't execute raw SQL, let's try to create the table by inserting a record
    // First, check if table exists by trying to query it
    try {
      const { data, error } = await supabase
        .from('playbacks')
        .select('id')
        .limit(1);
      
      if (!error) {
        console.log('Playbacks table already exists!');
        return true;
      }
    } catch (error) {
      // Table doesn't exist, continue with creation
    }
    
    // Try to create table by inserting a test record
    // We need to use a track_id that exists
    const { data: tracksData, error: tracksError } = await supabase
      .from('tracks')
      .select('id')
      .limit(1);
    
    if (tracksError) {
      console.error('Error fetching tracks:', tracksError);
      return false;
    }
    
    if (!tracksData || tracksData.length === 0) {
      console.error('No tracks found in database. Please migrate tracks first.');
      return false;
    }
    
    const testTrackId = tracksData[0].id;
    console.log(`Using track ID ${testTrackId} for table creation test`);
    
    const testRecord = {
      track_id: testTrackId,
      count: 0
    };
    
    const { data, error } = await supabase
      .from('playbacks')
      .insert([testRecord])
      .select();
    
    if (error) {
      console.error('Failed to create playbacks table:', error);
      return false;
    } else {
      console.log('Playbacks table created successfully!');
      // Clean up test record
      await supabase
        .from('playbacks')
        .delete()
        .eq('track_id', testTrackId);
      return true;
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
    const playbacksData = Object.entries(playbacksDataRaw).map(([trackId, count]) => ({
      track_id: parseInt(trackId),
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
      .insert(playbacksData);
    
    if (error) {
      console.error('Error migrating playbacks:', error);
      return false;
    }
    
    console.log('Successfully migrated playbacks data');
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
      console.log('Failed to create playbacks table.');
      process.exit(1);
    }
    
    // Migrate playbacks data
    const dataMigrated = await migratePlaybacksData();
    if (!dataMigrated) {
      console.log('Failed to migrate playbacks data.');
      process.exit(1);
    }
    
    console.log('Playbacks table setup and data migration completed successfully!');
    
    // Verify the data
    console.log('Verifying data...');
    const { data, error } = await supabase
      .from('playbacks')
      .select('*');
    
    if (error) {
      console.error('Error verifying data:', error);
    } else {
      console.log(`Successfully verified ${data.length} playback records in database`);
    }
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
}

main();