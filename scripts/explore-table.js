#!/usr/bin/env node

// Script to explore the actual table structure
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

async function exploreTable() {
  try {
    console.log('Exploring tracks table structure...');
    
    // Try inserting a minimal record with required fields
    const testRecord = {
      id: 999999,
      title: 'Explore Track',
      duration: 180,
      play_count: 0,
      slug: 'explore-track',
      file_url: '/audio/explore.mp3'
    };
    
    const { data, error } = await supabase
      .from('tracks')
      .insert(testRecord)
      .select();
    
    if (error) {
      console.error('Error inserting test record:', error);
    } else {
      console.log('Test insert successful:', data);
      
      // Now try to get the record back to see all columns
      const { data: retrievedData, error: retrieveError } = await supabase
        .from('tracks')
        .select('*')
        .eq('id', 999999);
      
      if (retrieveError) {
        console.error('Error retrieving record:', retrieveError);
      } else {
        console.log('Retrieved record:', retrievedData[0]);
        
        // Clean up
        await supabase
          .from('tracks')
          .delete()
          .eq('id', 999999);
      }
    }
    
  } catch (error) {
    console.error('Error exploring table:', error);
  }
}

exploreTable();