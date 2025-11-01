import { JamendoTrack } from "../../utils/jamendo-api";
import type { AudioTrack } from "../../types/audio";

export const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Validate if a URL is a valid HTTP/HTTPS URL
 */
export const isValidAudioUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    // Check if it's a valid HTTP/HTTPS URL
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch (e) {
    return false;
  }
};

export const convertJamendoToTrack = (
  jamendoTrack: JamendoTrack | null, 
  currentTrack: string, 
  currentTime: number,
  isLiked: boolean,
  isDisliked: boolean
): AudioTrack => {
  if (!jamendoTrack) {
    console.log('Using fallback track');
    return {
      id: "fallback",
      title: currentTrack,
      artist: "TuneTON Artist",
      duration: 203, // 3:23 in seconds
      source: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAA", // Silent audio
    };
  }

  console.log('Converting Jamendo track:', {
    id: jamendoTrack.id,
    name: jamendoTrack.name,
    audio: jamendoTrack.audio,
    audiodownload: jamendoTrack.audiodownload,
    duration: jamendoTrack.duration
  });

  // Try using the audio URL first, fallback to audiodownload if audio is not available
  const audioSource = jamendoTrack.audio || jamendoTrack.audiodownload;
  
  console.log('Selected audio source:', audioSource);
  
  // Validate that we have a valid audio source
  if (!audioSource) {
    console.error('No valid audio source found for track:', jamendoTrack);
  }

  return {
    id: jamendoTrack.id,
    title: jamendoTrack.name,
    artist: jamendoTrack.artist_name,
    duration: jamendoTrack.duration,
    source: audioSource || '',
    cover: jamendoTrack.image,
    album: jamendoTrack.album_name,
    audioUrl: audioSource || '',
  };
};

export const checkMixModeActive = (
  lofiIntensity: number,
  backgroundNoise: string,
  vinylCrackle: number,
  tapeWow: number,
  radioCutoff: number,
  tempo: number,
  pitch: number
): boolean => {
  return lofiIntensity > 0 || backgroundNoise !== 'none' || vinylCrackle > 0 || 
         tapeWow > 0 || radioCutoff > 0 || tempo !== 100 || pitch !== 0;
};