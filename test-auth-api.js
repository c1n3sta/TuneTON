// Test script to verify the authenticated Jamendo API
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0aHJwdnB1emlubWV2cnZxbGh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyOTU3ODUsImV4cCI6MjA3MDg3MTc4NX0.Ts_PJLD0zEHjEg3iSFJfpqpIOm1FLAhEuzKud3ZFUjg';
const JAMENDO_PROXY_URL = 'https://dthrpvpuzinmevrvqlhv.supabase.co/functions/v1/jamendo-proxy';

async function testAPI() {
  console.log('=== Testing Authenticated Jamendo API ===');
  
  try {
    // Test basic tracks request
    const testUrl = `${JAMENDO_PROXY_URL}?endpoint=tracks&params=${encodeURIComponent(JSON.stringify({limit: 1}))}`;
    console.log('Testing URL:', testUrl);
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success! Received data:', JSON.stringify(data, null, 2));
      
      // Test search request
      console.log('\n=== Testing Search ===');
      const searchUrl = `${JAMENDO_PROXY_URL}?endpoint=tracks&params=${encodeURIComponent(JSON.stringify({search: 'rock', limit: 3}))}`;
      console.log('Search URL:', searchUrl);
      
      const searchResponse = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      
      console.log('Search response status:', searchResponse.status);
      
      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        console.log('Search success! Received data:', JSON.stringify(searchData, null, 2));
        return true;
      } else {
        const errorText = await searchResponse.text();
        console.error('Search failed:', searchResponse.status, errorText);
        return false;
      }
    } else {
      const errorText = await response.text();
      console.error('Test failed:', response.status, errorText);
      return false;
    }
  } catch (error) {
    console.error('Test failed with error:', error);
    return false;
  }
}

testAPI().then(success => {
  console.log('\n=== Test Result ===');
  console.log(success ? 'All tests passed!' : 'Some tests failed!');
});