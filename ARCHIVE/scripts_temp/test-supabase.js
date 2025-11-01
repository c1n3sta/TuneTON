// Simple test script to verify Supabase configuration
import { createClient } from '@supabase/supabase-js';

// Get configuration from environment variables
const supabaseUrl = "https://dthrpvpuzinmevrvqlhv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0aHJwdnB1emlubWV2cnZxbGh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyOTU3ODUsImV4cCI6MjA3MDg3MTc4NX0.Ts_PJLD0zEHjEg3iSFJfpqpIOm1FLAhEuzKud3ZFUjg";

console.log('Testing Supabase configuration...');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key exists:', !!supabaseAnonKey);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('Supabase client created successfully');

// Test health check function
async function testHealthCheck() {
  try {
    console.log('Testing health check function...');
    const response = await fetch('https://dthrpvpuzinmevrvqlhv.supabase.co/functions/v1/health', {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    });
    
    console.log('Health check response status:', response.status);
    const data = await response.json();
    console.log('Health check response data:', data);
  } catch (error) {
    console.error('Health check failed:', error.message);
  }
}

// Run the test
testHealthCheck();