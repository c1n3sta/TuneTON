import fetch from 'node-fetch';

async function testDirectSearch() {
  console.log('=== Testing Direct Search Functionality ===');
  
  try {
    // Test the proxy function directly
    const proxyUrl = 'https://dthrpvpuzinmevrvqlhv.supabase.co/functions/v1/jamendo-proxy';
    const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0aHJwdnB1emlubWV2cnZxbGh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyOTU3ODUsImV4cCI6MjA3MDg3MTc4NX0.Ts_PJLD0zEHjEg3iSFJfpqpIOm1FLAhEuzKud3ZFUjg';
    
    // Test with a simple search query
    const params = {
      search: 'rock',
      limit: 10,
      include: ['musicinfo']
    };
    
    const url = `${proxyUrl}?endpoint=tracks&params=${encodeURIComponent(JSON.stringify(params))}`;
    console.log('Testing URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    const data = await response.json();
    console.log('Search results received:', data.results.length);
    
    if (data.results && data.results.length > 0) {
      console.log('First few results:');
      data.results.slice(0, 3).forEach((track, index) => {
        console.log(`${index + 1}. ${track.name} by ${track.artist_name} (ID: ${track.id})`);
        
        // Test the transformation that happens in SearchPage
        const duration = `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}`;
        console.log(`   Duration: ${duration}`);
      });
    } else {
      console.log('No results found');
    }
  } catch (error) {
    console.error('Search test failed:', error);
  }
  
  try {
    console.log('\nTesting search with query "electronic"');
    const proxyUrl = 'https://dthrpvpuzinmevrvqlhv.supabase.co/functions/v1/jamendo-proxy';
    const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0aHJwdnB1emlubWV2cnZxbGh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyOTU3ODUsImV4cCI6MjA3MDg3MTc4NX0.Ts_PJLD0zEHjEg3iSFJfpqpIOm1FLAhEuzKud3ZFUjg';
    
    const params = {
      search: 'electronic',
      limit: 10,
      include: ['musicinfo']
    };
    
    const url = `${proxyUrl}?endpoint=tracks&params=${encodeURIComponent(JSON.stringify(params))}`;
    console.log('Testing URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    const data = await response.json();
    console.log('Search results received:', data.results.length);
  } catch (error) {
    console.error('Search test failed:', error);
  }
}

testDirectSearch();