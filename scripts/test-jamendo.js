#!/usr/bin/env node

// Simple script to test Jamendo API
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testJamendoAPI() {
  try {
    console.log('Testing Jamendo API connectivity...');
    
    const JAMENDO_CLIENT_ID = '8ed40859';
    const JAMENDO_BASE_URL = 'https://api.jamendo.com/v3.0';
    
    // Test direct fetch to Jamendo API - simple tracks call
    const testUrl = `${JAMENDO_BASE_URL}/tracks?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=1`;
    console.log('Test URL:', testUrl);
    
    const response = await fetch(testUrl);
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Response data:', JSON.stringify(data, null, 2));
      console.log('Jamendo API is working!');
      return true;
    } else {
      console.error('API Error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error body:', errorText);
      return false;
    }
  } catch (error) {
    console.error('Fetch error:', error);
    return false;
  }
}

testJamendoAPI();