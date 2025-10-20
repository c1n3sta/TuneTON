#!/usr/bin/env node

// Script to list all tables in Supabase using raw SQL
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

async function listTables() {
  try {
    console.log('Listing all tables using raw SQL...');
    
    // Use raw SQL to get table names
    const { data, error } = await supabase.rpc('execute_sql', {
      sql: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    });
    
    if (error) {
      console.error('Error listing tables:', error);
      
      // Try a simpler approach - check if our expected tables exist
      console.log('Checking if tracks table exists...');
      const { data: tracksData, error: tracksError } = await supabase.rpc('execute_sql', {
        sql: "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'tracks' AND table_schema = 'public'"
      });
      
      if (tracksError) {
        console.error('Error checking tracks table:', tracksError);
      } else {
        console.log('Tracks table columns:', tracksData);
      }
      
      console.log('Checking if playbacks table exists...');
      const { data: playbacksData, error: playbacksError } = await supabase.rpc('execute_sql', {
        sql: "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'playbacks' AND table_schema = 'public'"
      });
      
      if (playbacksError) {
        console.error('Error checking playbacks table:', playbacksError);
      } else {
        console.log('Playbacks table columns:', playbacksData);
      }
    } else {
      console.log('Tables in public schema:', data);
    }
    
  } catch (error) {
    console.error('Error listing tables:', error);
  }
}

listTables();