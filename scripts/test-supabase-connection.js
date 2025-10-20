#!/usr/bin/env node

// Simple script to test Supabase connection
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://dthrpvpuzinmevrvqlhv.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
  process.exit(1);
}

// Create Supabase client with service role key for full access
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Simple query to test connection
    const { data, error } = await supabase
      .from('tracks')
      .select('id, title')
      .limit(1);
    
    if (error) {
      console.error('Connection test failed:', error);
      return false;
    } else {
      console.log('Connection test successful!');
      console.log('Sample data:', data);
      return true;
    }
  } catch (error) {
    console.error('Connection test error:', error);
    return false;
  }
}

testConnection();