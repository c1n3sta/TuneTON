// Test script to verify search functionality
import { jamendoAPI } from '../src/utils/jamendo-api';

async function testSearch() {
  console.log('=== Testing Search Functionality ===');
  
  try {
    // Test basic search
    console.log('Testing text search for "rock"...');
    const results = await jamendoAPI.textSearch('rock', 5);
    console.log('Search successful!');
    console.log(`Found ${results.results.length} results`);
    
    if (results.results.length > 0) {
      console.log('First result:', {
        id: results.results[0].id,
        name: results.results[0].name,
        artist: results.results[0].artist_name,
        duration: results.results[0].duration
      });
    }
    
    return true;
  } catch (error) {
    console.error('Search test failed:', error);
    return false;
  }
}

testSearch().then(success => {
  console.log('\n=== Test Result ===');
  console.log(success ? 'Search functionality is working!' : 'Search functionality failed!');
});