#!/usr/bin/env node

// Script to check if Jamendo tracks are available
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { debugJamendoAPI, jamendoAPI, testJamendoAPI } from '../src/utils/jamendo-api.ts';

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

async function checkJamendoTracks() {
  try {
    console.log('Checking for Jamendo tracks...');
    
    // First, check local tracks
    const { data: localTracks, error: localError } = await supabase
      .from('tracks')
      .select('*');
    
    if (localError) {
      console.error('Error querying local tracks:', localError);
    } else {
      console.log(`Found ${localTracks.length} local tracks in database:`);
      localTracks.forEach(track => {
        console.log(`- ID: ${track.id}, Title: ${track.title}, Slug: ${track.slug}`);
      });
    }
    
    // Now test Jamendo API
    console.log('\nTesting Jamendo API connectivity...');
    const isApiAvailable = await testJamendoAPI();
    console.log('Jamendo API available:', isApiAvailable);
    
    if (isApiAvailable) {
      console.log('\nFetching popular tracks from Jamendo...');
      const popularTracks = await jamendoAPI.getPopularTracks(5);
      console.log(`Found ${popularTracks.results.length} popular tracks from Jamendo:`);
      popularTracks.results.forEach(track => {
        console.log(`- ID: ${track.id}, Name: ${track.name}, Artist: ${track.artist_name}`);
      });
    } else {
      console.log('Jamendo API is not available. Using mock data.');
      
      // Debug the API connection
      console.log('\nDebugging Jamendo API connection...');
      const debugResult = await debugJamendoAPI();
      console.log('Debug result:', debugResult);
    }
    
  } catch (error) {
    console.error('Error checking Jamendo tracks:', error);
  }
}

checkJamendoTracks();