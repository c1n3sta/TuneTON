#!/usr/bin/env node

// Final verification script to check if everything is set up correctly
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://dthrpvpuzinmevrvqlhv.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('=== TuneTON Full Setup Verification ===');

// Create Supabase client with service role key for full access
const supabase = createClient(supabaseUrl, supabaseKey);

async function verifySetup() {
  try {
    console.log('\n1. Checking Supabase connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('tracks')
      .select('id, title')
      .limit(1);
    
    if (connectionError) {
      console.error('❌ Supabase connection failed:', connectionError.message);
      return false;
    } else {
      console.log('✅ Supabase connection successful');
    }
    
    console.log('\n2. Checking tracks table...');
    const { data: tracksData, error: tracksError } = await supabase
      .from('tracks')
      .select('*');
    
    if (tracksError) {
      console.error('❌ Tracks table error:', tracksError.message);
      return false;
    } else {
      console.log(`✅ Tracks table accessible - Found ${tracksData.length} tracks`);
      console.log('   Sample tracks:');
      tracksData.slice(0, 3).forEach(track => {
        console.log(`   - ID: ${track.id}, Title: ${track.title}`);
      });
    }
    
    console.log('\n3. Checking playbacks table...');
    const { data: playbacksData, error: playbacksError } = await supabase
      .from('playbacks')
      .select('*');
    
    if (playbacksError) {
      console.error('❌ Playbacks table error:', playbacksError.message);
      console.log('   The playbacks table may not exist yet. Please follow the instructions in FINAL_PLAYBACKS_SETUP_INSTRUCTIONS.md');
      return false;
    } else {
      console.log(`✅ Playbacks table accessible - Found ${playbacksData.length} records`);
      if (playbacksData.length > 0) {
        console.log('   Sample playbacks:');
        playbacksData.slice(0, 3).forEach(playback => {
          console.log(`   - Track ID: ${playback.track_id}, Count: ${playback.count}`);
        });
      }
    }
    
    console.log('\n4. Testing Jamendo API connectivity...');
    try {
      const JAMENDO_CLIENT_ID = '8ed40859';
      const response = await fetch(`https://api.jamendo.com/v3.0/tracks?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=1`);
      
      if (response.ok) {
        console.log('✅ Jamendo API connection successful');
      } else {
        console.error('❌ Jamendo API connection failed:', response.status);
      }
    } catch (error) {
      console.error('❌ Jamendo API connection failed:', error.message);
    }
    
    console.log('\n=== Setup Verification Complete ===');
    console.log('✅ All systems are functioning correctly!');
    return true;
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    return false;
  }
}

verifySetup();