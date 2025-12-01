#!/usr/bin/env node

// Script to test the self-hosted backend
import fetch from 'node-fetch';

async function testBackend() {
  const baseUrl = process.env.BACKEND_URL || 'http://localhost:3001';
  
  console.log(`Testing backend at ${baseUrl}...\n`);
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${baseUrl}/health`);
    const healthData = await healthResponse.json();
    
    if (healthResponse.ok) {
      console.log('   ✓ Health check passed');
      console.log(`   Status: ${healthData.status}`);
      console.log(`   Uptime: ${healthData.uptime}s\n`);
    } else {
      console.log('   ✗ Health check failed');
      console.log(`   Status: ${healthResponse.status}`);
      console.log(`   Error: ${healthData.error}\n`);
      return;
    }
    
    // Test API endpoints
    console.log('2. Testing API endpoints...');
    
    // Test tracks endpoint
    console.log('   Testing tracks endpoint...');
    const tracksResponse = await fetch(`${baseUrl}/api/tracks`);
    
    if (tracksResponse.ok) {
      console.log('   ✓ Tracks endpoint accessible');
    } else {
      console.log('   ✗ Tracks endpoint failed');
      console.log(`   Status: ${tracksResponse.status}\n`);
    }
    
    console.log('\nBackend test completed successfully!');
    
  } catch (error) {
    console.error('Backend test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testBackend();