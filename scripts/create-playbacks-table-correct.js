#!/usr/bin/env node

// Script to create the playbacks table with the correct schema
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
    console.log('Creating playbacks table with correct schema...');
    
    // First, let's try to check if the table already exists
    try {
      const { data, error } = await supabase
        .from('playbacks')
        .select('id')
        .limit(1);
      
      if (!error) {
        console.log('Playbacks table already exists!');
        return;
      }
    } catch (error) {
      // Table doesn't exist, continue with creation
    }
    
    // Create the playbacks table with the correct schema
    // Based on our exploration, tracks.id is BIGINT, so track_id should be BIGINT too
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS playbacks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        track_id BIGINT REFERENCES tracks(id) ON DELETE CASCADE,
        count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_playbacks_track_id ON playbacks(track_id);
      CREATE INDEX IF NOT EXISTS idx_playbacks_created_at ON playbacks(created_at);
      
      -- Enable Row Level Security
      ALTER TABLE playbacks ENABLE ROW LEVEL SECURITY;
      
      -- Create policies for public read access
      CREATE POLICY "Public playbacks are viewable by everyone" ON playbacks
        FOR SELECT USING (true);
        
      -- Create policies for insert access (playbacks can be inserted by anyone)
      CREATE POLICY "Anyone can insert playbacks" ON playbacks
        FOR INSERT WITH CHECK (true);
        
      -- Grant access to anon role
      GRANT SELECT, INSERT ON playbacks TO anon;
    `;
    
    // Since we can't use execute_sql, let's try a different approach
    // We'll create the table by attempting to insert a record and let Supabase create it implicitly
    // But that's not reliable, so let's just inform the user to create it manually
    
    console.log('Please create the playbacks table manually through the Supabase dashboard:');
    console.log('');
    console.log('Use this SQL:');
    console.log(createTableSQL);
    console.log('');
    console.log('Alternatively, you can use the Supabase CLI:');
    console.log('npx supabase db reset');
    console.log('or');
    console.log('npx supabase db push');
    
  } catch (error) {
    console.error('Error creating playbacks table:', error);
  }
}

createPlaybacksTable();