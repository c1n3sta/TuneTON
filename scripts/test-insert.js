#!/usr/bin/env node

// Script to test inserting a simple record to see what columns exist
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

async function testInsert() {
  try {
    console.log('Testing insert into tracks table...');
    
    // Try inserting a minimal record
    const testRecord = {
      id: 'test-1',
      title: 'Test Track',
      artist: 'Test Artist'
    };
    
    const { data, error } = await supabase
      .from('tracks')
      .insert(testRecord);
    
    if (error) {
      console.error('Error inserting test record:', error);
      
      // Try with different column names
      console.log('Trying with different column names...');
      const testRecord2 = {
        id: 'test-2',
        name: 'Test Track',
        artist: 'Test Artist'
      };
      
      const { data: data2, error: error2 } = await supabase
        .from('tracks')
        .insert(testRecord2);
      
      if (error2) {
        console.error('Error with alternative column names:', error2);
      } else {
        console.log('Alternative column names worked:', data2);
      }
    } else {
      console.log('Test insert successful:', data);
    }
    
  } catch (error) {
    console.error('Error testing insert:', error);
  }
}

testInsert();