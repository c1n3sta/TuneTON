// Utility functions for the player component
import type { AudioTrack } from '../../types/audio';
import type { JamendoTrack } from '../../utils/jamendo-api';

// Convert Jamendo track to AudioTrack
export function convertJamendoToTrack(
  track: JamendoTrack | null, 
  fallbackName: string = 'Unknown Track',
  currentTime: number = 0,
  isLiked: boolean = false,
  isDisliked: boolean = false
): AudioTrack | null {
  if (!track) return null;
  
  // Handle missing data gracefully
  const trackName = track.name || fallbackName;
  const artistName = track.artist_name || 'Unknown Artist';
  const duration = track.duration || 0;
  const coverArt = track.image || track.album_image || '';
  // Prioritize audio over audiodownload for streaming URLs and validate
  const audioUrl = validateAndSelectAudioUrl(track.audio, track.audiodownload);
  
  return {
    id: track.id || 'unknown',
    title: trackName,
    artist: artistName,
    duration,
    source: audioUrl,
    coverArt,
    audioUrl,
    album: track.album_name || 'Unknown Album',
    cover: coverArt
    // Note: currentTime is not part of AudioTrack interface, it's managed by the player
  };
}

// Validate and select the best audio URL
function validateAndSelectAudioUrl(audio?: string, audiodownload?: string): string {
  // Prefer audio URL (streaming) over audiodownload (direct download)
  const primaryUrl = audio || audiodownload || '';
  const fallbackUrl = audiodownload || audio || '';
  
  // Validate primary URL first
  if (primaryUrl && isValidAudioUrl(primaryUrl)) {
    return primaryUrl;
  }
  
  // Try fallback URL
  if (fallbackUrl && isValidAudioUrl(fallbackUrl)) {
    return fallbackUrl;
  }
  
  // Return whatever we have if no valid URL found (may be empty)
  return primaryUrl;
}

// Check if audio URL is valid
export function isValidAudioUrl(url: string): boolean {
  if (!url) return false;
  
  // For Jamendo URLs, we need to be more flexible
  // Jamendo streaming URLs often don't have file extensions
  if (url.includes('jamendo.com')) {
    return url.startsWith('http');
  }
  
  // For other URLs, check for common audio extensions
  return url.startsWith('http') && (url.includes('.mp3') || url.includes('.wav') || url.includes('.ogg') || url.includes('.m4a') || url.includes('.flac'));
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