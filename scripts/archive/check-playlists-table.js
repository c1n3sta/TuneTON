#!/usr/bin/env node

// Script to check the playlists table structure
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

async function checkPlaylistsTable() {
  try {
    console.log('Checking playlists table structure...');
    
    // Try to get a record from playlists table
    const { data, error } = await supabase
      .from('playlists')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error querying playlists table:', error);
    } else {
      console.log('Sample record from playlists table:', data[0]);
    }
    
  } catch (error) {
    console.error('Error checking playlists table:', error);
  }
}

checkPlaylistsTable();