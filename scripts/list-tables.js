#!/usr/bin/env node

// Script to list all tables in Supabase
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
    console.log('Listing all tables...');
    
    // Query information schema to get table names
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name, table_schema')
      .eq('table_schema', 'public');
    
    if (error) {
      console.error('Error listing tables:', error);
    } else {
      console.log('Tables in public schema:');
      data.forEach(table => {
        console.log(`- ${table.table_name}`);
      });
    }
    
  } catch (error) {
    console.error('Error listing tables:', error);
  }
}

listTables();