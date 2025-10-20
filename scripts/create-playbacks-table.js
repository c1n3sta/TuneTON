#!/usr/bin/env node

// Script to create the playbacks table
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

async function createPlaybacksTable() {
  try {
    console.log('Creating playbacks table...');
    
    // Note: We need to use the correct column types based on what we discovered
    // From our exploration, tracks.id is a bigint, so track_id should be bigint too
    
    const { data, error } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS playbacks (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          track_id BIGINT REFERENCES tracks(id) ON DELETE CASCADE,
          count INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_playbacks_track_id ON playbacks(track_id);
        CREATE INDEX IF NOT EXISTS idx_playbacks_created_at ON playbacks(created_at);
        
        ALTER TABLE playbacks ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Public playbacks are viewable by everyone" ON playbacks
          FOR SELECT USING (true);
          
        CREATE POLICY "Anyone can insert playbacks" ON playbacks
          FOR INSERT WITH CHECK (true);
          
        GRANT SELECT, INSERT ON playbacks TO anon;
      `
    });
    
    if (error) {
      console.error('Error creating playbacks table:', error);
    } else {
      console.log('Playbacks table created successfully!');
    }
    
  } catch (error) {
    console.error('Error creating playbacks table:', error);
  }
}

createPlaybacksTable();