#!/usr/bin/env node

// Script to fetch tracks from Jamendo API
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function fetchJamendoTracks() {
  try {
    console.log('Fetching tracks from Jamendo API...');
    
    const JAMENDO_CLIENT_ID = '8ed40859';
    const JAMENDO_BASE_URL = 'https://api.jamendo.com/v3.0';
    
    // Fetch popular tracks
    const tracksUrl = `${JAMENDO_BASE_URL}/tracks?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=10&include=musicinfo`;
    console.log('Fetching from:', tracksUrl);
    
    const response = await fetch(tracksUrl);
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`Found ${data.headers.results_count} tracks:`);
      
      data.results.forEach((track, index) => {
        console.log(`${index + 1}. ${track.name} by ${track.artist_name} (${track.duration} seconds)`);
        console.log(`   ID: ${track.id}`);
        console.log(`   Album: ${track.album_name}`);
        if (track.musicinfo) {
          console.log(`   Genre: ${track.musicinfo.tags?.genres?.join(', ') || 'N/A'}`);
          console.log(`   Speed: ${track.musicinfo.speed || 'N/A'}`);
        }
        console.log('');
      });
      
      return data.results;
    } else {
      console.error('API Error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error body:', errorText);
      return [];
    }
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}

fetchJamendoTracks();