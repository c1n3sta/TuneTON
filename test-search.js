// Simple test script to verify search functionality
const testSearch = async () => {
  try {
    // Test the Jamendo API proxy directly
    const proxyUrl = 'https://dthrpvpuzinmevrvqlhv.supabase.co/functions/v1/jamendo-proxy';
    
    // Test a simple tracks request
    const testUrl = `${proxyUrl}?endpoint=tracks&params=${encodeURIComponent(JSON.stringify({limit: 3}))}`;
    console.log('Testing URL:', testUrl);
    
    const response = await fetch(testUrl);
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success! Received data:', data);
      
      // Test a search request
      const searchUrl = `${proxyUrl}?endpoint=tracks&params=${encodeURIComponent(JSON.stringify({search: 'rock', limit: 3}))}`;
      console.log('Testing search URL:', searchUrl);
      
      const searchResponse = await fetch(searchUrl);
      console.log('Search response status:', searchResponse.status);
      
      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        console.log('Search success! Received data:', searchData);
      } else {
        console.error('Search failed with status:', searchResponse.status);
      }
    } else {
      console.error('Test failed with status:', response.status);
    }
  } catch (error) {
    console.error('Test failed with error:', error);
  }
};

testSearch();