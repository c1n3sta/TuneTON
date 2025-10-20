#!/usr/bin/env node

// Script to verify that the data migration was successful
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

async function verifyMigration() {
  try {
    console.log('Verifying data migration...');
    
    // Check tracks data
    const { data: tracksData, error: tracksError } = await supabase
      .from('tracks')
      .select('*');
    
    if (tracksError) {
      console.error('Error querying tracks:', tracksError);
    } else {
      console.log(`Found ${tracksData.length} tracks in database:`);
      tracksData.forEach(track => {
        console.log(`- ID: ${track.id}, Title: ${track.title}, Play Count: ${track.play_count}, Slug: ${track.slug}`);
      });
    }
    
    // Check if playbacks table exists
    try {
      const { data: playbacksData, error: playbacksError } = await supabase
        .from('playbacks')
        .select('*');
      
      if (playbacksError) {
        console.log('Playbacks table does not exist or is not accessible.');
      } else {
        console.log(`Found ${playbacksData.length} playback records in database:`);
        playbacksData.forEach(playback => {
          console.log(`- Track ID: ${playback.track_id}, Count: ${playback.count}`);
        });
      }
    } catch (error) {
      console.log('Playbacks table does not exist or is not accessible.');
    }
    
  } catch (error) {
    console.error('Error verifying migration:', error);
  }
}

verifyMigration();