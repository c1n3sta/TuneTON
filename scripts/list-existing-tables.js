#!/usr/bin/env node

// Script to list existing tables in the database
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
    console.log('Listing existing tables...');
    
    // Try to get a list of tables by querying different common table names
    const tableNames = ['tracks', 'playbacks', 'playlists', 'users', 'profiles'];
    
    for (const tableName of tableNames) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('id')
          .limit(1);
        
        if (error) {
          console.log(`Table '${tableName}': NOT FOUND - ${error.message}`);
        } else {
          console.log(`Table '${tableName}': EXISTS`);
        }
      } catch (error) {
        console.log(`Table '${tableName}': ERROR - ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('Error listing tables:', error);
  }
}

listTables();