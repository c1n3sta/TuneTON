import { useState, useEffect, useRef, useCallback } from 'react';
import { WebAudioEngine } from '../core/audio/AudioEngine';
import { AudioTrack, AudioState, AudioEffect } from '../types/audio';

export const useAudioPlayer = () => {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [eqSettings, setEqSettings] = useState({
    low: 0,
    mid: 0,
    high: 0
  });

  const audioEngineRef = useRef<WebAudioEngine | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const previousVolumeRef = useRef(volume);

  // Initialize audio engine on mount
  useEffect(() => {
    audioEngineRef.current = new WebAudioEngine();
    
    // Set initial volume
    audioEngineRef.current.setVolume(volume);
    
    return () => {
      // Cleanup on unmount
      if (audioEngineRef.current) {
        audioEngineRef.current.destroy();
        audioEngineRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Update current time for UI
  const updateTime = useCallback(() => {
    if (!audioEngineRef.current) return;
    
    const time = audioEngineRef.current.getCurrentTime();
    setCurrentTime(time);
    
    // Continue the animation loop
    animationFrameRef.current = requestAnimationFrame(updateTime);
  }, []);

  // Start/stop the time update loop based on playback state
  useEffect(() => {
    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(updateTime);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, updateTime]);

  // Load a new track
  const loadTrack = useCallback(async (track: AudioTrack) => {
    if (!audioEngineRef.current) return false;
    
    try {
      // Create a copy of the track to ensure we trigger a state update
      const trackToLoad = { ...track };
      
      // Load the track and wait for metadata to be extracted
      await audioEngineRef.current.loadTrack(trackToLoad);
      
      // Get the updated track with metadata from the audio engine
      const updatedTrack = audioEngineRef.current.getCurrentTrack();
      
      // Update the state with the track that now includes metadata
      setCurrentTrack(updatedTrack || trackToLoad);
      setDuration(audioEngineRef.current.getDuration());
      setCurrentTime(0);
      
      return true;
    } catch (error) {
      console.error('Error loading track:', error);
      return false;
    }
  }, []);

  // Toggle play/pause
  const togglePlayPause = useCallback(async () => {
    if (!audioEngineRef.current) return;
    
    if (isPlaying) {
      audioEngineRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioEngineRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      }
    }
  }, [isPlaying]);

  // Seek to a specific time
  const seek = useCallback((time: number) => {
    if (!audioEngineRef.current) return;
    
    audioEngineRef.current.seek(time);
    setCurrentTime(time);
  }, []);

  // Handle volume change
  const handleVolumeChange = useCallback((newVolume: number) => {
    if (!audioEngineRef.current) return;
    
    const volumeValue = Math.max(0, Math.min(1, newVolume));
    audioEngineRef.current.setVolume(volumeValue);
    setVolume(volumeValue);
    
    // If volume was 0 and is being increased, unmute
    if (isMuted && volumeValue > 0) {
      setIsMuted(false);
    }
  }, [isMuted]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (!audioEngineRef.current) return;
    
    if (isMuted) {
      // Unmute by restoring previous volume
      audioEngineRef.current.setVolume(previousVolumeRef.current);
      setVolume(previousVolumeRef.current);
    } else {
      // Mute by setting volume to 0 and storing current volume
      previousVolumeRef.current = volume;
      audioEngineRef.current.setVolume(0);
      setVolume(0);
    }
    
    setIsMuted(!isMuted);
  }, [isMuted, volume]);

  // Handle playback rate change
  const handlePlaybackRateChange = useCallback((rate: number) => {
    if (!audioEngineRef.current) return;
    
    const newRate = Math.max(0.5, Math.min(2, rate));
    audioEngineRef.current.setPlaybackRate(newRate);
    setPlaybackRate(newRate);
  }, []);

  // Handle pitch change
  const handlePitchChange = useCallback((newPitch: number) => {
    if (!audioEngineRef.current) return;
    
    const pitchValue = Math.max(0.5, Math.min(2, newPitch));
    audioEngineRef.current.setPitch(pitchValue);
    setPitch(pitchValue);
  }, []);

  // Handle EQ changes
  const handleEQChange = useCallback((band: 'low' | 'mid' | 'high', value: number) => {
    if (!audioEngineRef.current) return;
    
    audioEngineRef.current.setEQ(band, value);
    setEqSettings(prev => ({
      ...prev,
      [band]: value
    }));
  }, []);

  // Apply audio effect
  const applyEffect = useCallback((effect: AudioEffect) => {
    if (!audioEngineRef.current) return;
    
    audioEngineRef.current.applyEffect(effect);
  }, []);

  // Remove audio effect
  const removeEffect = useCallback((effectId: string) => {
    if (!audioEngineRef.current) return;
    
    audioEngineRef.current.removeEffect(effectId);
  }, []);

  // Get current audio state
  const getAudioState = (): AudioState => ({
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackRate,
    pitch,
    eqSettings
  });

  return {
    // State
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackRate,
    pitch,
    eqSettings,
    
    // Methods
    loadTrack,
    togglePlayPause,
    seek,
    setVolume: handleVolumeChange,
    toggleMute,
    setPlaybackRate: handlePlaybackRateChange,
    setPitch: handlePitchChange,
    setEQ: handleEQChange,
    applyEffect,
    removeEffect,
    getAudioState,
    getAnalyser: () => audioEngineRef.current?.getAnalyser()
  };
};

export default useAudioPlayer;
