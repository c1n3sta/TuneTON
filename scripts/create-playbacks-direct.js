#!/usr/bin/env node

// Script to create playbacks table directly using the correct schema
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
    console.log('Creating playbacks table with correct schema...');
    
    // First, check if table already exists
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
    
    // Try to create the table by inserting a record with the correct schema
    // We know tracks.id is BIGINT, so track_id should be BIGINT too
    const existingTrackId = 1; // We know this exists from our earlier checks
    
    const testRecord = {
      track_id: existingTrackId, // BIGINT to match tracks.id
      count: 0
    };
    
    console.log('Attempting to create playbacks table by inserting test record...');
    
    const { data, error } = await supabase
      .from('playbacks')
      .insert([testRecord])
      .select();
    
    if (error) {
      console.error('Failed to create playbacks table:', error);
      // Let's try to understand what's wrong by checking if the tracks table has the right schema
      console.log('Checking tracks table schema...');
      
      const { data: trackData, error: trackError } = await supabase
        .from('tracks')
        .select('id')
        .limit(1);
      
      if (trackError) {
        console.error('Error checking tracks table:', trackError);
      } else {
        console.log('Tracks table sample data:', trackData);
        console.log('First track ID type:', typeof trackData[0].id);
      }
      
      return false;
    } else {
      console.log('Playbacks table created successfully!');
      console.log('Test record created:', data);
      
      // Clean up the test record
      await supabase
        .from('playbacks')
        .delete()
        .eq('track_id', existingTrackId);
      
      console.log('Test record cleaned up.');
      return true;
    }
  } catch (error) {
    console.error('Error creating playbacks table:', error);
    return false;
  }
}

createPlaybacksTable();