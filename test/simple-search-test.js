import fetch from 'node-fetch';

async function testSearch() {
  try {
    // Test the proxy function directly
    const proxyUrl = 'https://dthrpvpuzinmevrvqlhv.supabase.co/functions/v1/jamendo-proxy';
    const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0aHJwdnB1emlubWV2cnZxbGh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyOTU3ODUsImV4cCI6MjA3MDg3MTc4NX0.Ts_PJLD0zEHjEg3iSFJfpqpIOm1FLAhEuzKud3ZFUjg';
    
    // Test with a simple search query
    const params = {
      search: 'rock',
      limit: 5,
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
    console.log('Search results:', JSON.stringify(data, null, 2));
    
    if (data.results && data.results.length > 0) {
      console.log(`Found ${data.results.length} tracks`);
      console.log('First track:', {
        id: data.results[0].id,
        name: data.results[0].name,
        artist: data.results[0].artist_name,
        duration: data.results[0].duration
      });
    } else {
      console.log('No results found');
    }
  } catch (error) {
    console.error('Search test failed:', error);
  }
}

testSearch();