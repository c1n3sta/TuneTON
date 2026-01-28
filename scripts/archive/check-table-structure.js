#!/usr/bin/env node

// Script to check the actual table structure in Supabase
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

async function checkTableStructure() {
  try {
    console.log('Checking tracks table structure...');
    
    // Get table info
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error querying tracks table:', error);
      
      // Try to get table schema
      const { data: schemaData, error: schemaError } = await supabase
        .rpc('get_table_schema', { table_name: 'tracks' });
      
      if (schemaError) {
        console.error('Error getting table schema:', schemaError);
      } else {
        console.log('Table schema:', schemaData);
      }
    } else {
      console.log('Sample data from tracks table:', data);
    }
    
    console.log('Checking playbacks table structure...');
    
    // Get playbacks table info
    const { data: playbacksData, error: playbacksError } = await supabase
      .from('playbacks')
      .select('*')
      .limit(1);
    
    if (playbacksError) {
      console.error('Error querying playbacks table:', playbacksError);
    } else {
      console.log('Sample data from playbacks table:', playbacksData);
    }
    
  } catch (error) {
    console.error('Error checking table structure:', error);
  }
}

checkTableStructure();