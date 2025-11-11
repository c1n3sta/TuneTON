import { jamendoAPI } from '../src/utils/jamendo-api.js';

async function testSearchPageFunctionality() {
  console.log('=== Testing Search Page Functionality ===');
  
  try {
    console.log('Testing search with query "rock"');
    const results = await jamendoAPI.textSearch('rock', 10);
    console.log('Search results received:', results.results.length);
    
    if (results.results.length > 0) {
      console.log('First few results:');
      results.results.slice(0, 3).forEach((track, index) => {
        console.log(`${index + 1}. ${track.name} by ${track.artist_name} (ID: ${track.id})`);
      });
      
      // Test the transformation that happens in SearchPage
      const transformedResults = results.results.map((track) => ({
        id: track.id,
        title: track.name,
        artist: track.artist_name,
        cover: track.album_image || track.image,
        duration: `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}`,
        plays: `${Math.floor(track.duration / 1000)}K`,
        isLiked: false
      }));
      
      console.log('Transformed results:');
      transformedResults.slice(0, 3).forEach((track, index) => {
        console.log(`${index + 1}. ${track.title} by ${track.artist} (${track.duration})`);
      });
    } else {
      console.log('No results found');
    }
  } catch (error) {
    console.error('Search failed:', error);
  }
  
  try {
    console.log('\nTesting search with query "electronic"');
    const results = await jamendoAPI.textSearch('electronic', 10);
    console.log('Search results received:', results.results.length);
  } catch (error) {
    console.error('Search failed:', error);
  }
}

testSearchPageFunctionality();