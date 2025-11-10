// Debug script to test actual Jamendo URLs
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Since we're in Node.js, we need to handle the ES module imports differently
const { isValidAudioUrl } = require('./dist/src/components/player/utils.js');

// Sample Jamendo track data based on the interface
const sampleJamendoTracks = [
  {
    id: "12345",
    name: "Test Track",
    duration: 180,
    artist_id: "67890",
    artist_name: "Test Artist",
    artist_idstr: "testartist",
    album_id: "54321",
    album_name: "Test Album",
    album_image: "https://example.com/album.jpg",
    audio: "https://api.jamendo.com/v3.0/tracks/file?track_id=12345&format=mp3",
    audiodownload: "https://api.jamendo.com/v3.0/tracks/download/12345",
    prourl: "https://www.jamendo.com/track/12345",
    shorturl: "https://jamen.do/t/12345",
    shareurl: "https://www.jamendo.com/track/12345/test-track",
    waveform: "https://img.jamendo.com/waveform/12345.png",
    image: "https://img.jamendo.com/albums/54321/covers/1.300.jpg"
  },
  {
    id: "67890",
    name: "Another Track",
    duration: 240,
    artist_id: "11111",
    artist_name: "Another Artist",
    artist_idstr: "anotherartist",
    album_id: "22222",
    album_name: "Another Album",
    album_image: "https://example.com/album2.jpg",
    audio: "https://api.jamendo.com/v3.0/tracks/file?track_id=67890&format=ogg",
    audiodownload: "https://api.jamendo.com/v3.0/tracks/download/67890",
    prourl: "https://www.jamendo.com/track/67890",
    shorturl: "https://jamen.do/t/67890",
    shareurl: "https://www.jamendo.com/track/67890/another-track",
    waveform: "https://img.jamendo.com/waveform/67890.png",
    image: "https://img.jamendo.com/albums/22222/covers/1.300.jpg"
  },
  {
    id: "11111",
    name: "Problem Track",
    duration: 120,
    artist_id: "33333",
    artist_name: "Problem Artist",
    artist_idstr: "problemartist",
    album_id: "44444",
    album_name: "Problem Album",
    album_image: "https://example.com/album3.jpg",
    audio: "", // Empty audio URL
    audiodownload: "https://api.jamendo.com/v3.0/tracks/download/11111",
    prourl: "https://www.jamendo.com/track/11111",
    shorturl: "https://jamen.do/t/11111",
    shareurl: "https://www.jamendo.com/track/11111/problem-track",
    waveform: "https://img.jamendo.com/waveform/11111.png",
    image: "https://img.jamendo.com/albums/44444/covers/1.300.jpg"
  }
];

console.log('=== Debugging Jamendo URL Validation ===\n');

// Test individual URLs
sampleJamendoTracks.forEach((track, index) => {
  console.log(`Track ${index + 1}: ${track.name}`);
  console.log(`  Audio URL: ${track.audio || 'EMPTY'}`);
  console.log(`  Download URL: ${track.audiodownload}`);
  
  // Test individual URL validation
  if (track.audio) {
    const audioValid = isValidAudioUrl(track.audio);
    console.log(`  Audio URL valid: ${audioValid}`);
  }
  
  if (track.audiodownload) {
    const downloadValid = isValidAudioUrl(track.audiodownload);
    console.log(`  Download URL valid: ${downloadValid}`);
  }
  
  // Test URL selection logic manually
  const primaryUrl = track.audio || track.audiodownload || '';
  const fallbackUrl = track.audiodownload || track.audio || '';
  
  console.log(`  Primary URL: ${primaryUrl || 'NONE'}`);
  console.log(`  Fallback URL: ${fallbackUrl || 'NONE'}`);
  
  let selectedUrl = '';
  if (primaryUrl && isValidAudioUrl(primaryUrl)) {
    selectedUrl = primaryUrl;
  } else if (fallbackUrl && isValidAudioUrl(fallbackUrl)) {
    selectedUrl = fallbackUrl;
  } else if (primaryUrl && primaryUrl.includes('jamendo.com') && primaryUrl.includes('tracks/file')) {
    selectedUrl = primaryUrl;
  } else if (fallbackUrl && fallbackUrl.includes('jamendo.com') && fallbackUrl.includes('tracks/file')) {
    selectedUrl = fallbackUrl;
  } else {
    selectedUrl = primaryUrl;
  }
  
  console.log(`  Selected URL: ${selectedUrl || 'NONE'}`);
  console.log('');
});

console.log('=== Testing Edge Cases ===\n');

// Test edge cases
const edgeCases = [
  {
    name: "Empty URLs",
    audio: "",
    audiodownload: ""
  },
  {
    name: "Invalid URLs",
    audio: "not-a-url",
    audiodownload: "also-not-a-url"
  },
  {
    name: "Mixed valid/invalid",
    audio: "not-a-url",
    audiodownload: "https://api.jamendo.com/v3.0/tracks/file?track_id=99999&format=mp3"
  },
  {
    name: "Standard audio URL",
    audio: "https://example.com/audio.mp3",
    audiodownload: ""
  }
];

edgeCases.forEach((testCase, index) => {
  console.log(`Edge Case ${index + 1}: ${testCase.name}`);
  console.log(`  Audio URL: ${testCase.audio || 'EMPTY'}`);
  console.log(`  Download URL: ${testCase.audiodownload || 'EMPTY'}`);
  
  // Test URL selection logic manually
  const primaryUrl = testCase.audio || testCase.audiodownload || '';
  const fallbackUrl = testCase.audiodownload || testCase.audio || '';
  
  console.log(`  Primary URL: ${primaryUrl || 'NONE'}`);
  console.log(`  Fallback URL: ${fallbackUrl || 'NONE'}`);
  
  let selectedUrl = '';
  if (primaryUrl && isValidAudioUrl(primaryUrl)) {
    selectedUrl = primaryUrl;
  } else if (fallbackUrl && isValidAudioUrl(fallbackUrl)) {
    selectedUrl = fallbackUrl;
  } else if (primaryUrl && primaryUrl.includes('jamendo.com') && primaryUrl.includes('tracks/file')) {
    selectedUrl = primaryUrl;
  } else if (fallbackUrl && fallbackUrl.includes('jamendo.com') && fallbackUrl.includes('tracks/file')) {
    selectedUrl = fallbackUrl;
  } else {
    selectedUrl = primaryUrl;
  }
  
  console.log(`  Selected URL: ${selectedUrl || 'NONE'}`);
  console.log('');
});