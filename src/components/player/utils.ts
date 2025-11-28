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

  // Select the best audio URL (proxied through audio-proxy)
  const audioUrl = validateAndSelectAudioUrl(track.audio, track.audiodownload);
  const fallbackUrl = track.audiodownload || track.audio || '';

  const result: AudioTrack = {
    id: track.id,
    title: track.name,
    artist: track.artist_name,
    album: track.album_name,
    duration: track.duration,
    coverArt: track.image,
    source: audioUrl,
    fallbackUrl: fallbackUrl !== audioUrl ? fallbackUrl : undefined,
  };

  console.log('Converted track result:', result);
  return result;
}

// Validate and select the best audio URL, wrapping with audio-proxy if needed
export function validateAndSelectAudioUrl(audio?: string, audiodownload?: string): string {
  console.log('Validating audio URLs:', { audio, audiodownload });

  // Prefer streaming URL over download URL
  const primaryUrl = audio || audiodownload || '';
  const fallbackUrl = audiodownload || audio || '';

  console.log('Primary URL:', primaryUrl);
  console.log('Fallback URL:', fallbackUrl);

  // Helper to proxy Jamendo URLs through our Edge Function
  const proxify = (url: string) => {
    if (!url) return url;
    // If already proxied, return as is
    if (url.includes('/audio-proxy?url=')) return url;
    
    const encoded = encodeURIComponent(url);
    
    // Use VITE_API_URL which is defined in .env.production as .../functions/v1
    // Fallback to the known URL if env var is missing (though it should be there)
    const baseUrl = import.meta.env.VITE_API_URL || 'https://dthrpvpuzinmevrvqlhv.supabase.co/functions/v1';
    
    return `${baseUrl}/audio-proxy?url=${encoded}`;
  };

  // Validate primary URL first
  if (primaryUrl && isValidAudioUrl(primaryUrl)) {
    console.log('Primary URL is valid');
    return proxify(primaryUrl);
  }

  // Try fallback URL
  if (fallbackUrl && isValidAudioUrl(fallbackUrl)) {
    console.log('Fallback URL is valid');
    return proxify(fallbackUrl);
  }

  // Jamendo URLs may work even if validation fails
  if (primaryUrl && primaryUrl.includes('jamendo.com')) {
    console.log('Using primary Jamendo URL despite validation');
    return proxify(primaryUrl);
  }
  if (fallbackUrl && fallbackUrl.includes('jamendo.com')) {
    console.log('Using fallback Jamendo URL despite validation');
    return proxify(fallbackUrl);
  }

  console.log('No valid URL found, returning primary URL');
  return proxify(primaryUrl);
}

// Check if audio URL is valid (basic checks)
export function isValidAudioUrl(url: string): boolean {
  if (!url) return false;

  // Allow Jamendo URLs with proper protocol
  if (url.includes('jamendo.com')) {
    const isValidHttp = url.startsWith('http://') || url.startsWith('https://');
    console.log('Validating Jamendo URL:', url, 'isValidHttp:', isValidHttp);
    return isValidHttp;
  }

  // Other URLs: check protocol and common audio extensions
  return (url.startsWith('http://') || url.startsWith('https://')) && (
    url.includes('.mp3') ||
    url.includes('.wav') ||
    url.includes('.ogg') ||
    url.includes('.m4a') ||
    url.includes('.flac') ||
    url.includes('/stream') ||
    url.includes('/audio') ||
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

// Placeholder for mix mode detection
export function checkMixModeActive(): boolean {
  return false;
}