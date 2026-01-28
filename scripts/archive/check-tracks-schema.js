#!/usr/bin/env node

// Script to check the actual schema of the tracks table
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

async function checkTracksSchema() {
  try {
    console.log('Checking tracks table schema...');
    
    // Insert a test record to see what the actual schema is
    const testRecord = {
      id: 'schema-test-1',
      title: 'Schema Test Track',
      duration: 180,
      play_count: 0,
      slug: 'schema-test-track',
      file_url: '/audio/schema-test.mp3'
    };
    
    const { data, error } = await supabase
      .from('tracks')
      .insert([testRecord])
      .select();
    
    if (error) {
      console.error('Error inserting test record:', error);
    } else {
      console.log('Test record inserted successfully:', data);
      
      // Check the actual data type of the id field
      const { data: schemaData, error: schemaError } = await supabase
        .from('tracks')
        .select('id')
        .eq('id', 'schema-test-1')
        .limit(1);
      
      if (schemaError) {
        console.error('Error querying schema:', schemaError);
      } else {
        console.log('Schema data:', schemaData);
        console.log('ID type appears to be:', typeof schemaData[0].id);
        
        // Clean up
        await supabase
          .from('tracks')
          .delete()
          .eq('id', 'schema-test-1');
      }
    }
    
  } catch (error) {
    console.error('Error checking tracks schema:', error);
  }
}

checkTracksSchema();