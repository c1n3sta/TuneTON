// Audio player hook with playback tracking for self-hosted backend
import { useEffect, useState } from 'react';
import apiClient from '../utils/apiClient';
import { useAudioPlayer } from './useAudioPlayer';

export const useAudioPlayerWithTracking = () => {
  // Use the existing audio player hook
  const audioPlayer = useAudioPlayer();
  
  // Track playback state
  const [currentTrackId, setCurrentTrackId] = useState(null);
  const [playbackStartTime, setPlaybackStartTime] = useState(null);
  const [hasSentPlayback, setHasSentPlayback] = useState(false);
  
  // Load track with tracking
  const loadTrackWithTracking = async (track) => {
    // Load the track using the base audio player
    await audioPlayer.loadTrack(track);
    
    // Set the current track ID for tracking
    setCurrentTrackId(track.id || track.trackId);
    
    // Reset tracking state
    setPlaybackStartTime(null);
    setHasSentPlayback(false);
  };
  
  // Toggle play/pause with tracking
  const togglePlayPauseWithTracking = async () => {
    // Toggle play/pause using the base audio player
    await audioPlayer.togglePlayPause();
    
    // Handle playback tracking
    if (audioPlayer.isPlaying && currentTrackId && !playbackStartTime) {
      // Start tracking playback time
      setPlaybackStartTime(Date.now());
    } else if (!audioPlayer.isPlaying && playbackStartTime) {
      // Calculate playback duration and send to backend
      const playbackDuration = Date.now() - playbackStartTime;
      
      // Only send if played for more than 30 seconds
      if (playbackDuration > 30000 && !hasSentPlayback) {
        try {
          await apiClient.incrementPlayCount(currentTrackId);
          setHasSentPlayback(true);
        } catch (error) {
          console.error('Failed to send playback data:', error);
        }
      }
      
      // Reset tracking
      setPlaybackStartTime(null);
    }
  };
  
  // Handle track completion
  useEffect(() => {
    // If track has finished playing, send playback data
    if (!audioPlayer.isPlaying && playbackStartTime && currentTrackId && !hasSentPlayback) {
      const playbackDuration = Date.now() - playbackStartTime;
      
      // Send playback data if played for more than 30 seconds
      if (playbackDuration > 30000) {
        const sendPlaybackData = async () => {
          try {
            await apiClient.incrementPlayCount(currentTrackId);
            setHasSentPlayback(true);
          } catch (error) {
            console.error('Failed to send playback data:', error);
          }
        };
        
        sendPlaybackData();
      }
    }
  }, [audioPlayer.isPlaying, playbackStartTime, currentTrackId, hasSentPlayback]);
  
  // Reset tracking when track changes
  useEffect(() => {
    return () => {
      // Cleanup function to reset tracking when component unmounts
      if (playbackStartTime && currentTrackId && !hasSentPlayback) {
        const playbackDuration = Date.now() - playbackStartTime;
        
        // Send playback data if played for more than 30 seconds
        if (playbackDuration > 30000) {
          const sendPlaybackData = async () => {
            try {
              await apiClient.incrementPlayCount(currentTrackId);
            } catch (error) {
              console.error('Failed to send playback data:', error);
            }
          };
          
          sendPlaybackData();
        }
      }
    };
  }, [playbackStartTime, currentTrackId, hasSentPlayback]);
  
  return {
    ...audioPlayer,
    loadTrack: loadTrackWithTracking,
    togglePlayPause: togglePlayPauseWithTracking
  };
};