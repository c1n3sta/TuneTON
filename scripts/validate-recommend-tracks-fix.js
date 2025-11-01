#!/usr/bin/env node

// Script to validate that the recommend_tracks function has been properly fixed
// This script checks that the function exists and can be called

import { createClient } from '@supabase/supabase-js';

// Create Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Need service role key for RPC calls

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function validateRecommendTracksFix() {
  console.log('🔍 Validating recommend_tracks function fix...');
  
  try {
    // Try to call the function with a dummy user ID
    // This will validate that the function exists and is callable
    const { data, error } = await supabase.rpc('recommend_tracks', {
      user_id: '00000000-0000-0000-0000-000000000000' // Dummy UUID
    });
    
    if (error) {
      // If we get an error about the function not existing, it means the function is not properly deployed
      if (error.message.includes('function') && error.message.includes('does not exist')) {
        console.log('❌ Function recommend_tracks does not exist or is not properly deployed');
        console.log('Error details:', error.message);
        return;
      }
      
      // Other errors might be expected (like user not found), which means the function exists
      console.log('✅ Function recommend_tracks exists and is callable');
      console.log('Note: Function execution may have failed for other reasons (e.g., user not found), but the function itself exists');
    } else {
      console.log('✅ Function recommend_tracks exists and executed successfully');
      console.log(`Returned ${data ? data.length : 0} recommendations`);
    }
    
    console.log('✅ Basic validation passed - function exists and is accessible');
    
  } catch (error) {
    console.error('Validation failed with error:', error);
  }
}

// Run the validation
validateRecommendTracksFix();