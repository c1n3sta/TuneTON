#!/usr/bin/env node

// Script to check what columns exist in the tracks table
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

async function checkColumns() {
  try {
    console.log('Checking what columns exist in tracks table...');
    
    // Try selecting different columns to see which ones exist
    const columnsToTry = ['id', 'title', 'name', 'artist', 'author', 'duration', 'playCount', 'play_count', 'audioUrl', 'audio_url', 'slug'];
    
    for (const column of columnsToTry) {
      try {
        const { data, error } = await supabase
          .from('tracks')
          .select(column)
          .limit(1);
        
        if (error) {
          console.log(`Column '${column}': NOT FOUND - ${error.message}`);
        } else {
          console.log(`Column '${column}': EXISTS`);
        }
      } catch (error) {
        console.log(`Column '${column}': ERROR - ${error.message}`);
      }
    }
    
    // Try to get a full record to see all columns
    console.log('\nTrying to get a full record to see all columns...');
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('Error getting full record:', error);
    } else {
      console.log('Sample record structure:', data[0]);
    }
    
  } catch (error) {
    console.error('Error checking columns:', error);
  }
}

checkColumns();