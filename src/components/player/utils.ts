// Utility functions for the player component
import type { AudioTrack } from '../../types/audio';
import type { JamendoTrack } from '../../utils/jamendo-api';

// Convert Jamendo track to AudioTrack
export function convertJamendoToTrack(
  track: JamendoTrack | null
): AudioTrack | null {
  if (!track) return null;
  
  console.log('Converting Jamendo track:', track);
  
  // Validate required fields
  if (!track.id || !track.name) {
    console.error('Invalid Jamendo track: missing required fields (id or name)', track);
    return null;
  }
  
  // Validate that we have at least one audio URL
  if (!track.audio && !track.audiodownload) {
    console.error('Invalid Jamendo track: no audio URLs available', track);
    return null;
  }
  
  // Try multiple sources for cover art
  const coverArt = track.image || track.album_image || '';
  
  // Prioritize audiodownload over audio for better reliability
  const audioUrl = track.audiodownload || track.audio;
  
  // Add a fallback URL for Jamendo tracks
  let fallbackUrl = '';
  if (track.audio && track.audiodownload) {
    // If we have both, use the one not selected as primary as fallback
    fallbackUrl = audioUrl === track.audio ? track.audiodownload : track.audio;
  }
  
  console.log('Selected audio URL:', audioUrl);
  console.log('Track audio property:', track.audio);
  console.log('Track audiodownload property:', track.audiodownload);
  console.log('Fallback URL:', fallbackUrl);
  
  const result: AudioTrack = {
    id: track.id.toString(),
    title: track.name,
    artist: track.artist_name || '',
    duration: track.duration || 0,
    source: audioUrl,
    coverArt,
    audioUrl,
    album: track.album_name || '',
    cover: coverArt
  };
  
  // Add fallback URL if available
  if (fallbackUrl) {
    (result as any).fallbackUrl = fallbackUrl;
  }
  
  console.log('Converted track result:', result);
  
  return result;
}

// Validate and select the best audio URL
function validateAndSelectAudioUrl(audio?: string, audiodownload?: string): string {
  console.log('Validating audio URLs:', { audio, audiodownload });
  
  // Prefer audio URL (streaming) over audiodownload (direct download)
  const primaryUrl = audio || audiodownload || '';
  const fallbackUrl = audiodownload || audio || '';
  
  console.log('Primary URL:', primaryUrl);
  console.log('Fallback URL:', fallbackUrl);
  
  // Validate primary URL first
  if (primaryUrl && isValidAudioUrl(primaryUrl)) {
    console.log('Primary URL is valid');
    return primaryUrl;
  }
  
  // Try fallback URL
  if (fallbackUrl && isValidAudioUrl(fallbackUrl)) {
    console.log('Fallback URL is valid');
    return fallbackUrl;
  }
  
  // For Jamendo URLs, even if they don't validate perfectly, they might still work
  if (primaryUrl && primaryUrl.includes('jamendo.com')) {
    console.log('Using primary Jamendo URL despite validation');
    return primaryUrl;
  }
  
  if (fallbackUrl && fallbackUrl.includes('jamendo.com')) {
    console.log('Using fallback Jamendo URL despite validation');
    return fallbackUrl;
  }
  
  // Return whatever we have if no valid URL found (may be empty)
  console.log('No valid URL found, returning primary URL');
  return primaryUrl;
}

// Check if audio URL is valid
export function isValidAudioUrl(url: string): boolean {
  if (!url) return false;
  
  // For Jamendo URLs, be more permissive since they might not always match the exact pattern
  // but are still valid streaming URLs
  if (url.includes('jamendo.com')) {
    // Just check that it's a valid HTTP/HTTPS URL
    const isValidHttp = url.startsWith('http://') || url.startsWith('https://');
    console.log('Validating Jamendo URL:', url, 'isValidHttp:', isValidHttp);
    return isValidHttp;
  }
  
  // For other URLs, check for common audio extensions or streaming endpoints
  return (url.startsWith('http://') || url.startsWith('https://')) && (
    url.includes('.mp3') || 
    url.includes('.wav') || 
    url.includes('.ogg') || 
    url.includes('.m4a') || 
    url.includes('.flac') ||
    url.includes('/stream') ||
    url.includes('/audio') ||
    // Also allow URLs that look like API endpoints for streaming
    url.includes('api') ||
    url.includes('stream')
  );
}

// Format time in seconds to MM:SS format
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Check if mix mode is active
export function checkMixModeActive(): boolean {
  // Mix mode implementation
  return false;
}