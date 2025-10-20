#!/usr/bin/env node

// Script to check existing tracks data
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

async function checkExistingTracks() {
  try {
    console.log('Checking existing tracks data...');
    
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .limit(3);
    
    if (error) {
      console.error('Error querying tracks:', error);
    } else {
      console.log('Existing tracks:');
      data.forEach(track => {
        console.log(`- ID: ${track.id} (type: ${typeof track.id})`);
        console.log(`  Title: ${track.title}`);
        console.log(`  Play Count: ${track.play_count}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('Error checking existing tracks:', error);
  }
}

checkExistingTracks();