import { useCallback, useEffect, useRef, useState } from 'react';
import { apiClient } from '../api/client';
import { WebAudioEngine } from '../core/audio/AudioEngine';
import type { AudioTrack, EffectModuleId } from '../types/audio';

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
  const [lofiTone, setLofiToneState] = useState(20000);
  const [lofiNoise, setLofiNoiseState] = useState(0);
  const [lofiWow, setLofiWowState] = useState(0);
  // 7-band EQ state
  const [eqBands, setEqBands] = useState([0, 0, 0, 0, 0, 0, 0]); // 7 bands, 0 dB each
  const [eqMix, setEqMixState] = useState(1);
  const [eqBypass, setEqBypassState] = useState(false);
  // Reverb state
  const [reverbMix, setReverbMixState] = useState(0.3);
  const [reverbPreDelay, setReverbPreDelayState] = useState(20);
  const [reverbDamping, setReverbDampingState] = useState(8000);
  const [reverbPreset, setReverbPresetState] = useState<'small' | 'medium' | 'large'>('medium');
  const [reverbBypass, setReverbBypassState] = useState(false);
  // Low-pass tone state
  const [lowPassTone, setLowPassToneState] = useState(20000);
  const [lowPassResonance, setLowPassResonanceState] = useState(0.707);
  const [tempoPitchMix] = useState(1);
  const [lofiMix] = useState(1);

  const audioEngineRef = useRef<WebAudioEngine | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const previousVolumeRef = useRef(volume);
  const isInitializedRef = useRef(false);

  // Initialize audio engine on first user interaction
  const initializeAudioEngine = useCallback(async () => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      try {
        audioEngineRef.current = new WebAudioEngine();
        
        // Set initial volume
        audioEngineRef.current.setVolume(volume);
      } catch (error) {
        console.error('Failed to initialize audio engine:', error);
        // Fallback to a mock audio engine if initialization fails
        audioEngineRef.current = null;
      }
    }
    
    return audioEngineRef.current;
  }, [volume]);

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
    try {
      const audioEngine = await initializeAudioEngine();
      if (!audioEngine) return false;
      
      await audioEngine.loadTrack(track);
      setCurrentTrack(track);
      setDuration(audioEngine.getDuration());
      setCurrentTime(0);
      return true;
    } catch (error) {
      console.error('Error loading track:', error);
      return false;
    }
  }, [initializeAudioEngine]);

  // Toggle play/pause
  const togglePlayPause = useCallback(async () => {
    try {
      const audioEngine = await initializeAudioEngine();
      if (!audioEngine) return;
      
      if (isPlaying) {
        audioEngine.pause();
        setIsPlaying(false);
      } else {
        try {
          await audioEngine.play();
          setIsPlaying(true);
          
          // Track playback if we have a current track
          if (currentTrack) {
            try {
              await apiClient.incrementPlayback(currentTrack.id);
            } catch (error) {
              console.error('Failed to track playback:', error);
            }
          }
        } catch (error) {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        }
      }
    } catch (error) {
      console.error('Error in togglePlayPause:', error);
    }
  }, [isPlaying, currentTrack, initializeAudioEngine]);

  // Stop playback
  const stop = useCallback(async () => {
    try {
      const audioEngine = await initializeAudioEngine();
      if (!audioEngine) return;
      audioEngine.stop();
      setIsPlaying(false);
      setCurrentTime(0);
    } catch (error) {
      console.error('Error in stop:', error);
    }
  }, [initializeAudioEngine]);

  // Seek to a specific time
  const seek = useCallback(async (time: number) => {
    try {
      const audioEngine = await initializeAudioEngine();
      if (!audioEngine) return;
      
      audioEngine.seek(time);
      setCurrentTime(time);
    } catch (error) {
      console.error('Error in seek:', error);
    }
  }, [initializeAudioEngine]);

  // Handle volume change
  const handleVolumeChange = useCallback(async (newVolume: number) => {
    try {
      const audioEngine = await initializeAudioEngine();
      if (!audioEngine) return;
      
      const volumeValue = Math.max(0, Math.min(1, newVolume));
      audioEngine.setVolume(volumeValue);
      setVolume(volumeValue);
      
      // If volume was 0 and is being increased, unmute
      if (isMuted && volumeValue > 0) {
        setIsMuted(false);
      }
    } catch (error) {
      console.error('Error in handleVolumeChange:', error);
    }
  }, [isMuted, initializeAudioEngine]);

  // Toggle mute
  const toggleMute = useCallback(async () => {
    try {
      const audioEngine = await initializeAudioEngine();
      if (!audioEngine) return;
      
      if (isMuted) {
        // Unmute by restoring previous volume
        audioEngine.setVolume(previousVolumeRef.current);
        setVolume(previousVolumeRef.current);
      } else {
        // Mute by setting volume to 0 and storing current volume
        previousVolumeRef.current = volume;
        audioEngine.setVolume(0);
        setVolume(0);
      }
      
      setIsMuted(!isMuted);
    } catch (error) {
      console.error('Error in toggleMute:', error);
    }
  }, [isMuted, volume, initializeAudioEngine]);

  // Handle playback rate change
  const handlePlaybackRateChange = useCallback(async (rate: number) => {
    try {
      const audioEngine = await initializeAudioEngine();
      if (!audioEngine) return;
      
      const newRate = Math.max(0.5, Math.min(2, rate));
      audioEngine.setPlaybackRate(newRate);
      setPlaybackRate(newRate);
    } catch (error) {
      console.error('Error in handlePlaybackRateChange:', error);
    }
  }, [initializeAudioEngine]);

  // Tempo (time-stretch placeholder: maps to playbackRate until decoupled in Step 3)
  const handleTempoChange = useCallback(async (newTempo: number) => {
    try {
      const audioEngine = await initializeAudioEngine();
      if (!audioEngine) return;
      
      const clamped = Math.max(0.5, Math.min(1.5, newTempo));
      setTempo(clamped);
      audioEngine.setTempo(clamped);
    } catch (error) {
      console.error('Error in handleTempoChange:', error);
    }
  }, [initializeAudioEngine]);

  // Pitch semitones (placeholder: maps to pitch ratio on source node)
  const handlePitchSemitonesChange = useCallback(async (semitones: number) => {
    try {
      const audioEngine = await initializeAudioEngine();
      if (!audioEngine) return;
      
      const clamped = Math.max(-12, Math.min(12, semitones));
      setPitchSemitones(clamped);
      audioEngine.setPitchSemitones(clamped);
      // Auto-enable subtle lo-fi when pitch shifting
      if (clamped !== 0) {
        setLofiToneState(14000);
        setLofiNoiseState(0.05);
        audioEngine.setLofiTone(14000);
        audioEngine.setLofiNoiseLevel(0.05);
      } else {
        setLofiToneState(20000);
        setLofiNoiseState(0);
        audioEngine.setLofiTone(20000);
        audioEngine.setLofiNoiseLevel(0);
      }
    } catch (error) {
      console.error('Error in handlePitchSemitonesChange:', error);
    }
  }, [initializeAudioEngine]);

  // Handle EQ changes
  const handleEQChange = useCallback(async (band: 'low' | 'mid' | 'high', value: number) => {
    try {
      const audioEngine = await initializeAudioEngine();
      if (!audioEngine) return;
      
      audioEngine.setEQ(band, value);
      setEqSettings(prev => ({
        ...prev,
        [band]: value
      }));
    } catch (error) {
      console.error('Error in handleEQChange:', error);
    }
  }, [initializeAudioEngine]);

  // Effect bus controls
  const setEffectBypass = useCallback(async (id: EffectModuleId, bypass: boolean) => {
    try {
      const audioEngine = await initializeAudioEngine();
      if (!audioEngine) return;
      audioEngine.setEffectBypass(id, bypass);
    } catch (error) {
      console.error('Error in setEffectBypass:', error);
    }
  }, [initializeAudioEngine]);

  const setEffectMix = useCallback(async (id: EffectModuleId, mix: number) => {
    try {
      const audioEngine = await initializeAudioEngine();
      if (!audioEngine) return;
      audioEngine.setEffectMix(id, mix);
    } catch (error) {
      console.error('Error in setEffectMix:', error);
    }
  }, [initializeAudioEngine]);

  // Lo-fi controls
  const handleLofiToneChange = useCallback(async (value: number) => {
    try {
      const audioEngine = await initializeAudioEngine();
      if (!audioEngine) return;
      
      setLofiToneState(value);
      audioEngine.setLofiTone(value);
    } catch (error) {
      console.error('Error in handleLofiToneChange:', error);
    }
  }, [initializeAudioEngine]);

  const handleLofiNoiseChange = useCallback(async (value: number) => {
    try {
      const audioEngine = await initializeAudioEngine();
      if (!audioEngine) return;
      
      setLofiNoiseState(value);
      audioEngine.setLofiNoiseLevel(value);
    } catch (error) {
      console.error('Error in handleLofiNoiseChange:', error);
    }
  }, [initializeAudioEngine]);

  const handleLofiWowChange = useCallback(async (value: number) => {
    try {
      const audioEngine = await initializeAudioEngine();
      if (!audioEngine) return;
      
      setLofiWowState(value);
      audioEngine.setLofiWowFlutter(0.5, value * 0.5);
    } catch (error) {
      console.error('Error in handleLofiWowChange:', error);
    }
  }, [initializeAudioEngine]);

  // 7-band EQ controls
  const handleEQBandChange = useCallback(async (band: number, gainDb: number) => {
    try {
      const audioEngine = await initializeAudioEngine();
      if (!audioEngine) return;
      
      const newBands = [...eqBands];
      newBands[band] = gainDb;
      setEqBands(newBands);
      audioEngine.setEQBand(band, gainDb);
    } catch (error) {
      console.error('Error in handleEQBandChange:', error);
    }
  }, [eqBands, initializeAudioEngine]);

  const handleEQMixChange = useCallback(async (mix: number) => {
    try {
      const audioEngine = await initializeAudioEngine();
      if (!audioEngine) return;
      
      setEqMixState(mix);
      audioEngine.setEQMix(mix);
    } catch (error) {
      console.error('Error in handleEQMixChange:', error);
    }
  }, [initializeAudioEngine]);

  const handleEQBypassChange = useCallback(async (bypass: boolean) => {
    try {
      const audioEngine = await initializeAudioEngine();
      if (!audioEngine) return;
      
      setEqBypassState(bypass);
      audioEngine.setEQBypass(bypass);
    } catch (error) {
      console.error('Error in handleEQBypassChange:', error);
    }
  }, [initializeAudioEngine]);

  // Reverb controls
  const handleReverbMixChange = useCallback(async (mix: number) => {
    try {
      const audioEngine = await initializeAudioEngine();
      if (!audioEngine) return;
      
      setReverbMixState(mix);
      audioEngine.setReverbMix(mix);
    } catch (error) {
      console.error('Error in handleReverbMixChange:', error);
    }
  }, [initializeAudioEngine]);

  const handleReverbPreDelayChange = useCallback(async (delayMs: number) => {
    try {
      const audioEngine = await initializeAudioEngine();
      if (!audioEngine) return;
      
      setReverbPreDelayState(delayMs);
      audioEngine.setReverbPreDelay(delayMs);
    } catch (error) {
      console.error('Error in handleReverbPreDelayChange:', error);
    }
  }, [initializeAudioEngine]);

  const handleReverbDampingChange = useCallback(async (cutoffHz: number) => {
    try {
      const audioEngine = await initializeAudioEngine();
      if (!audioEngine) return;
      
      setReverbDampingState(cutoffHz);
      audioEngine.setReverbDamping(cutoffHz);
    } catch (error) {
      console.error('Error in handleReverbDampingChange:', error);
    }
  }, [initializeAudioEngine]);

  const handleReverbPresetChange = useCallback(async (preset: 'small' | 'medium' | 'large') => {
    try {
      const audioEngine = await initializeAudioEngine();
      if (!audioEngine) return;
      
      setReverbPresetState(preset);
      audioEngine.setReverbPreset(preset);
    } catch (error) {
      console.error('Error in handleReverbPresetChange:', error);
    }
  }, [initializeAudioEngine]);

  const handleReverbBypassChange = useCallback(async (bypass: boolean) => {
    try {
      const audioEngine = await initializeAudioEngine();
      if (!audioEngine) return;
      
      setReverbBypassState(bypass);
      audioEngine.setReverbBypass(bypass);
    } catch (error) {
      console.error('Error in handleReverbBypassChange:', error);
    }
  }, [initializeAudioEngine]);

  // Low-pass tone controls
  const handleLowPassToneChange = useCallback(async (cutoffHz: number) => {
    try {
      const audioEngine = await initializeAudioEngine();
      if (!audioEngine) return;
      
      setLowPassToneState(cutoffHz);
      audioEngine.setLowPassTone(cutoffHz);
    } catch (error) {
      console.error('Error in handleLowPassToneChange:', error);
    }
  }, [initializeAudioEngine]);

  const handleLowPassResonanceChange = useCallback(async (resonance: number) => {
    try {
      const audioEngine = await initializeAudioEngine();
      if (!audioEngine) return;
      
      setLowPassResonanceState(resonance);
      audioEngine.setLowPassResonance(resonance);
    } catch (error) {
      console.error('Error in handleLowPassResonanceChange:', error);
    }
  }, [initializeAudioEngine]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioEngineRef.current) {
        try {
          audioEngineRef.current.destroy();
        } catch (error) {
          console.error('Error destroying audio engine:', error);
        }
        audioEngineRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Get analyser for visualization
  const getAnalyser = useCallback(() => {
    if (!audioEngineRef.current) return null;
    return audioEngineRef.current.getAnalyser();
  }, []);

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
    lofiTone,
    lofiNoise,
    lofiWow,
    eqBands,
    eqMix,
    eqBypass,
    reverbMix,
    reverbPreDelay,
    reverbDamping,
    reverbPreset,
    reverbBypass,
    lowPassTone,
    lowPassResonance,
    tempoPitchMix,
    lofiMix,

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
    handleEQBandChange,
    handleEQMixChange,
    handleEQBypassChange,
    handleReverbMixChange,
    handleReverbPreDelayChange,
    handleReverbDampingChange,
    handleReverbPresetChange,
    handleReverbBypassChange,
    handleLowPassToneChange,
    handleLowPassResonanceChange,
    getAnalyser
  };
};