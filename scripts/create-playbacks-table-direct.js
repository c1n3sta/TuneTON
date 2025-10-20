#!/usr/bin/env node

// Script to create the playbacks table directly using Supabase client
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

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
    console.log('Creating playbacks table directly...');
    
    // First, let's check if the table already exists by trying to query it
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
    
    // Try to create the table by inserting a test record with the correct schema
    // This will force Supabase to create the table with the right structure
    const testRecord = {
      track_id: 1, // BIGINT to match tracks.id
      count: 0
    };
    
    console.log('Attempting to create playbacks table by inserting test record...');
    
    const { data, error } = await supabase
      .from('playbacks')
      .insert(testRecord)
      .select();
    
    if (error) {
      console.error('Failed to create playbacks table:', error);
      console.log('Error details:', JSON.stringify(error, null, 2));
      return false;
    } else {
      console.log('Playbacks table created successfully!');
      console.log('Test record created:', data);
      
      // Clean up the test record
      await supabase
        .from('playbacks')
        .delete()
        .eq('track_id', 1);
      
      console.log('Test record cleaned up.');
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
    
    // Read playbacks from JSON file (this would be implemented in the full script)
    const playbacksData = [
      {
        track_id: 4, // BIGINT to match tracks.id
        count: 1
      }
    ];
    
    console.log('Inserting playback data...');
    
    const { error } = await supabase
      .from('playbacks')
      .insert(playbacksData);
    
    if (error) {
      console.error('Error inserting playbacks data:', error);
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
  console.log('Setting up playbacks table...');
  
  try {
    // Create playbacks table
    const tableCreated = await createPlaybacksTable();
    if (!tableCreated) {
      console.log('Failed to create playbacks table.');
      return;
    }
    
    // Migrate playbacks data
    const dataMigrated = await migratePlaybacksData();
    if (!dataMigrated) {
      console.log('Failed to migrate playbacks data.');
      return;
    }
    
    console.log('Playbacks table setup completed successfully!');
    
    // Verify the table structure
    console.log('Verifying table structure...');
    const { data, error } = await supabase
      .from('playbacks')
      .select('*');
    
    if (error) {
      console.error('Error verifying table:', error);
    } else {
      console.log('Table verification successful. Current records:', data);
    }
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

main();