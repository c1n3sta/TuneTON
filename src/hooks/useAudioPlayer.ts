import { useState, useEffect, useRef, useCallback } from 'react';
import { WebAudioEngine } from '../core/audio/AudioEngine';
import { AudioTrack, AudioState, AudioEffect, EffectModuleId } from '../types/audio';

export const useAudioPlayer = () => {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [tempo, setTempo] = useState(1.0); // 0.5..1.5
  const [pitchSemitones, setPitchSemitones] = useState(0); // -12..+12
  const [eqSettings, setEqSettings] = useState({
    low: 0,
    mid: 0,
    high: 0
  });

  // Effect bus state
  const [eqMix, setEqMix] = useState(1);
  const [tempoPitchMix, setTempoPitchMix] = useState(1);
  const [lofiMix, setLofiMix] = useState(1);
  const [lofiTone, setLofiToneState] = useState(20000);
  const [lofiNoise, setLofiNoiseState] = useState(0);
  const [lofiWow, setLofiWowState] = useState(0);

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
    if (!audioEngineRef.current) return;
    
    try {
      await audioEngineRef.current.loadTrack(track);
      setCurrentTrack(track);
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

  // Stop playback
  const stop = useCallback(() => {
    if (!audioEngineRef.current) return;
    audioEngineRef.current.stop();
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

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

  // Tempo (time-stretch placeholder: maps to playbackRate until decoupled in Step 3)
  const handleTempoChange = useCallback((newTempo: number) => {
    const clamped = Math.max(0.5, Math.min(1.5, newTempo));
    setTempo(clamped);
    if (audioEngineRef.current) {
      audioEngineRef.current.setTempo(clamped);
    }
  }, []);

  // Pitch semitones (placeholder: maps to pitch ratio on source node)
  const handlePitchSemitonesChange = useCallback((semitones: number) => {
    const clamped = Math.max(-12, Math.min(12, semitones));
    setPitchSemitones(clamped);
    if (audioEngineRef.current) {
      audioEngineRef.current.setPitchSemitones(clamped);
      // Auto-enable subtle lo-fi when pitch shifting
      if (clamped !== 0) {
        setLofiToneState(14000);
        setLofiNoiseState(0.05);
        audioEngineRef.current.setLofiTone(14000);
        audioEngineRef.current.setLofiNoiseLevel(0.05);
      } else {
        setLofiToneState(20000);
        setLofiNoiseState(0);
        audioEngineRef.current.setLofiTone(20000);
        audioEngineRef.current.setLofiNoiseLevel(0);
      }
    }
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

  // Effect bus controls
  const setEffectBypass = useCallback((id: EffectModuleId, bypass: boolean) => {
    audioEngineRef.current?.setEffectBypass(id, bypass);
  }, []);

  const setEffectMix = useCallback((id: EffectModuleId, mix: number) => {
    audioEngineRef.current?.setEffectMix(id, mix);
  }, []);

  // Lo-fi controls
  const handleLofiToneChange = useCallback((value: number) => {
    setLofiToneState(value);
    audioEngineRef.current?.setLofiTone(value);
  }, []);

  const handleLofiNoiseChange = useCallback((value: number) => {
    setLofiNoiseState(value);
    audioEngineRef.current?.setLofiNoiseLevel(value);
  }, []);

  const handleLofiWowChange = useCallback((value: number) => {
    setLofiWowState(value);
    audioEngineRef.current?.setLofiWowFlutter(0.5, value * 0.5);
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
    pitch: Math.pow(2, pitchSemitones / 12),
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
    tempo,
    pitchSemitones,
    eqSettings,
    eqMix,
    tempoPitchMix,
    lofiMix,
    lofiTone,
    lofiNoise,
    lofiWow,
    
    // Methods
    loadTrack,
    togglePlayPause,
    stop,
    seek,
    setVolume: handleVolumeChange,
    toggleMute,
    setPlaybackRate: handlePlaybackRateChange,
    setTempo: handleTempoChange,
    setPitchSemitones: handlePitchSemitonesChange,
    setEQ: handleEQChange,
    setEffectBypass,
    setEffectMix,
    handleLofiToneChange,
    handleLofiNoiseChange,
    handleLofiWowChange,
    applyEffect,
    removeEffect,
    getAudioState,
    getAnalyser: () => audioEngineRef.current?.getAnalyser()
  };
};

export default useAudioPlayer;
