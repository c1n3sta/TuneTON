#!/usr/bin/env node

// Script to migrate data from JSON files to Supabase database
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env files
import dotenv from 'dotenv';
dotenv.config();

// Load environment variables
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

// Function to transform track data to match actual table structure
function transformTrackData(track) {
  // Create a slug from the title (simple implementation)
  const slug = track.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  return {
    id: parseInt(track.id), // Convert to integer
    title: track.title,
    duration: track.duration || 0,
    play_count: track.playCount || 0,
    slug: slug,
    file_url: track.audioUrl || `/audio/${track.title}.mp3`
    // Other fields will be null by default
  };
}

async function migrateTracks() {
  try {
    console.log('Migrating tracks data...');
    
    // Read tracks from JSON file
    const tracksFilePath = path.join(__dirname, '../data/tracks.json');
    if (!fs.existsSync(tracksFilePath)) {
      console.log('Tracks file not found, skipping tracks migration');
      return;
    }
    
    const tracksData = JSON.parse(fs.readFileSync(tracksFilePath, 'utf8'));
    console.log(`Found ${tracksData.length} tracks to migrate`);
    
    if (tracksData.length === 0) {
      console.log('No tracks to migrate');
      return true;
    }
    
    // Transform tracks data to match actual table structure
    const transformedTracks = tracksData.map(track => transformTrackData(track));
    
    // Process tracks one by one (update if exists, insert if not)
    let successCount = 0;
    for (const track of transformedTracks) {
      try {
        // First check if track already exists
        const { data: existingData, error: checkError } = await supabase
          .from('tracks')
          .select('id')
          .eq('id', track.id);
        
        if (checkError) {
          console.error(`Error checking existing track ${track.id}:`, checkError);
          continue;
        }
        
        if (existingData && existingData.length > 0) {
          // Update existing track
          const { error: updateError } = await supabase
            .from('tracks')
            .update({
              title: track.title,
              duration: track.duration,
              play_count: track.play_count,
              slug: track.slug,
              file_url: track.file_url
            })
            .eq('id', track.id);
          
          if (updateError) {
            console.error(`Error updating track ${track.id}:`, updateError);
          } else {
            successCount++;
          }
        } else {
          // Insert new track
          const { error: insertError } = await supabase
            .from('tracks')
            .insert([track]);
          
          if (insertError) {
            console.error(`Error inserting track ${track.id}:`, insertError);
          } else {
            successCount++;
          }
        }
      } catch (singleError) {
        console.error(`Error processing track ${track.id}:`, singleError);
      }
    }
    
    console.log(`Successfully processed ${successCount} out of ${transformedTracks.length} tracks`);
    return successCount > 0;
  } catch (error) {
    console.error('Error in migrateTracks:', error);
    return false;
  }
}

async function migratePlaybacks() {
  try {
    console.log('Migrating playbacks data...');
    
    // Read playbacks from JSON file
    const playbacksFilePath = path.join(__dirname, '../data/playbacks.json');
    if (!fs.existsSync(playbacksFilePath)) {
      console.log('Playbacks file not found, skipping playbacks migration');
      return true; // Return true to continue
    }
    
    const playbacksDataRaw = JSON.parse(fs.readFileSync(playbacksFilePath, 'utf8'));
    
    // Convert playbacks data to array format for database insertion
    const playbacksData = Object.entries(playbacksDataRaw).map(([trackId, count]) => ({
      track_id: parseInt(trackId), // Convert to integer to match tracks.id
      count: count
    }));
    
    console.log(`Found ${playbacksData.length} playback records to migrate`);
    
    if (playbacksData.length === 0) {
      console.log('No playback data to migrate');
      return true;
    }
    
    // Process playbacks one by one (update if exists, insert if not)
    let successCount = 0;
    for (const playback of playbacksData) {
      try {
        // First check if record already exists
        const { data: existingData, error: checkError } = await supabase
          .from('playbacks')
          .select('id')
          .eq('track_id', playback.track_id);
        
        if (checkError) {
          console.error(`Error checking existing playback for track ${playback.track_id}:`, checkError);
          continue;
        }
        
        if (existingData && existingData.length > 0) {
          // Update existing record
          const { error: updateError } = await supabase
            .from('playbacks')
            .update({ count: playback.count })
            .eq('track_id', playback.track_id);
          
          if (updateError) {
            console.error(`Error updating playback for track ${playback.track_id}:`, updateError);
          } else {
            successCount++;
          }
        } else {
          // Insert new record
          const { error: insertError } = await supabase
            .from('playbacks')
            .insert([playback]);
          
          if (insertError) {
            console.error(`Error inserting playback for track ${playback.track_id}:`, insertError);
          } else {
            successCount++;
          }
        }
      } catch (singleError) {
        console.error(`Error processing playback for track ${playback.track_id}:`, singleError);
      }
    }
    
    console.log(`Successfully processed ${successCount} out of ${playbacksData.length} playbacks`);
    return successCount > 0;
  } catch (error) {
    console.error('Error in migratePlaybacks:', error);
    return false;
  }
}

async function main() {
  console.log('Starting data migration from JSON files to Supabase database...');
  console.log('Using Supabase URL:', supabaseUrl);
  
  try {
    // Migrate tracks
    const tracksSuccess = await migrateTracks();
    if (!tracksSuccess) {
      console.error('Tracks migration failed');
      process.exit(1);
    }
    
    // Migrate playbacks
    const playbacksSuccess = await migratePlaybacks();
    if (!playbacksSuccess) {
      console.error('Playbacks migration failed');
      process.exit(1);
    }
    
    console.log('Data migration completed successfully!');
    console.log('Tracks have been migrated successfully.');
    console.log('Playbacks data has been migrated successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
main();