import { useEffect, useState } from 'react';
import type { AudioTrack } from '../types/audio';

// Add import for URL validation utility
import { isValidAudioUrl } from '../components/player/utils';

// Add import for tuneTONAPI

// Add import for AudioEngineWrapper
import { AudioEngineWrapper } from '../core/audio/AudioEngineWrapper';

interface UseAudioPlayerReturn {
  // Playback state
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  
  // Playback controls
  playbackRate: number;
  tempo: number;
  pitchSemitones: number;
  
  // EQ settings
  eqBands: number[];
  eqMix: number;
  eqBypass: boolean;
  
  // Reverb settings
  reverbMix: number;
  reverbPreDelay: number;
  reverbDamping: number;
  reverbPreset: 'small' | 'medium' | 'large';
  reverbBypass: boolean;
  
  // Lo-fi settings
  lofiTone: number;
  lofiNoise: number;
  lofiWow: number;
  
  // Low-pass filter settings
  lowPassTone: number;
  lowPassResonance: number;
  
  // Core functions
  loadTrack: (track: AudioTrack) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  setTempo: (tempo: number) => void;
  setPitchSemitones: (semitones: number) => void;
  
  // Effect controls
  setEffectBypass: (effectId: string, bypass: boolean) => void;
  setEffectMix: (effectId: string, mix: number) => void;
  
  // Specific effect handlers
  handleLofiToneChange: (value: number) => void;
  handleLofiNoiseChange: (value: number) => void;
  handleLofiWowChange: (value: number) => void;
  handleEQBandChange: (bandIndex: number, value: number) => void;
  handleEQMixChange: (value: number) => void;
  handleEQBypassChange: (bypass: boolean) => void;
  handleReverbMixChange: (value: number) => void;
  handleReverbPreDelayChange: (value: number) => void;
  handleReverbDampingChange: (value: number) => void;
  handleReverbPresetChange: (preset: 'small' | 'medium' | 'large') => void;
  handleReverbBypassChange: (bypass: boolean) => void;
  handleLowPassToneChange: (value: number) => void;
  handleLowPassResonanceChange: (value: number) => void;
  
  // Analyser for visualization
  getAnalyser: () => AnalyserNode | null;
}

export const useAudioPlayer = (): UseAudioPlayerReturn => {
  // Audio engine wrapper
  const [audioEngine] = useState(() => new AudioEngineWrapper());
  
  // Track user interaction state
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  
  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  
  // Playback controls
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [tempo, setTempoState] = useState(1);
  const [pitchSemitones, setPitchSemitonesState] = useState(0);
  
  // EQ settings (7-band EQ)
  const [eqBands, setEqBands] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [eqMix, setEqMix] = useState(1);
  const [eqBypass, setEqBypass] = useState(false);
  
  // Reverb settings
  const [reverbMix, setReverbMix] = useState(0);
  const [reverbPreDelay, setReverbPreDelay] = useState(0);
  const [reverbDamping, setReverbDamping] = useState(2000);
  const [reverbPreset, setReverbPreset] = useState<'small' | 'medium' | 'large'>('medium');
  const [reverbBypass, setReverbBypass] = useState(true);
  
  // Lo-fi settings
  const [lofiTone, setLofiTone] = useState(8000);
  const [lofiNoise, setLofiNoise] = useState(0);
  const [lofiWow, setLofiWow] = useState(0);
  
  // Low-pass filter settings
  const [lowPassTone, setLowPassTone] = useState(20000);
  const [lowPassResonance, setLowPassResonance] = useState(1);
  
  // Current track
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  
  // Detect user interaction to enable audio context activation
  useEffect(() => {
    const handleUserInteraction = () => {
      setHasUserInteracted(true);
      // Notify the audio engine wrapper that user interaction has occurred
      audioEngine.setUserInteracted();
      // Remove event listeners after first interaction to avoid memory leaks
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
    
    // Add event listeners for different types of user interactions
    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);
    
    // Cleanup function to remove event listeners
    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, [audioEngine]);
  
  // Load track function
  const loadTrack = async (track: AudioTrack) => {
    console.log('Loading track through AudioEngineWrapper:', track);
    
    // Validate audio URL before loading
    const audioSource = track.audioUrl || (typeof track.source === 'string' ? track.source : '');
    if (audioSource) {
      console.log('Validating audio URL:', audioSource);
      const isValid = isValidAudioUrl(audioSource);
      console.log('URL validation result:', isValid);
      
      if (!isValid) {
        console.error('Invalid audio URL provided to loadTrack:', audioSource);
        // Don't return here, we'll still try to load it but log the issue
      }
    }
    
    setCurrentTrack(track);
    setDuration(track.duration || 0);
    setCurrentTime(0);
    
    // Delegate to AudioEngine
    try {
      await audioEngine.loadTrack(track);
      console.log('Track loaded successfully through AudioEngine');
    } catch (error) {
      console.error('Failed to load track through AudioEngine:', error);
      throw new Error(`Failed to load track: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  // Toggle play/pause
  const togglePlayPause = async () => {
    console.log('Toggle play/pause called through AudioEngineWrapper. Current state:', isPlaying);
    
    try {
      if (isPlaying) {
        console.log('Pausing audio through AudioEngine');
        audioEngine.pause();
        setIsPlaying(false);
      } else {
        console.log('Attempting to play audio through AudioEngine');
        
        // Check if we have a track loaded
        if (!currentTrack) {
          console.error('No track loaded');
          throw new Error('No track loaded. Please select a track to play.');
        }
        
        await audioEngine.play();
        console.log('Audio playback started successfully through AudioEngine');
        setIsPlaying(true);
        
        // Record playback history when track starts playing
        if (currentTrack) {
          // Note: tuneTONAPI.addPlaybackHistory may need to be adapted for AudioTrack
          // tuneTONAPI.addPlaybackHistory(currentTrack);
        }
      }
    } catch (error) {
      console.error('Failed to toggle play/pause through AudioEngine:', error);
      // Handle autoplay policy issues
      if ((error as Error).name === 'NotAllowedError') {
        console.error('Autoplay prevented by browser policy. User interaction required.');
        throw new Error('Playback blocked by browser. Please click the play button to start playback.');
      }
      throw error;
    }
  };
  
  // Seek to specific time
  const seek = (time: number) => {
    console.log('Seeking to time through AudioEngine:', time);
    audioEngine.seek(time);
    setCurrentTime(time);
  };
  
  // Set volume
  const setVolume = (newVolume: number) => {
    console.log('Setting volume through AudioEngine:', newVolume);
    setVolumeState(newVolume);
    if (isMuted && newVolume > 0) {
      setIsMuted(false);
    }
    audioEngine.setVolume(isMuted ? 0 : newVolume);
  };
  
  // Toggle mute
  const toggleMute = () => {
    console.log('Toggling mute through AudioEngine. Current mute state:', isMuted);
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    audioEngine.setVolume(newMuteState ? 0 : volume);
  };
  
  // Set playback rate
  const setPlaybackRate = (rate: number) => {
    console.log('Setting playback rate through AudioEngine:', rate);
    setPlaybackRateState(rate);
    audioEngine.setPlaybackRate(rate);
  };
  
  // Set tempo
  const setTempo = (newTempo: number) => {
    setTempoState(newTempo);
    audioEngine.setTempo(newTempo);
  };
  
  // Set pitch semitones
  const setPitchSemitones = (semitones: number) => {
    setPitchSemitonesState(semitones);
    audioEngine.setPitchSemitones(semitones);
  };
  
  // Effect bypass controls
  const setEffectBypass = (effectId: string, bypass: boolean) => {
    console.log('Setting effect bypass through AudioEngine:', effectId, bypass);
    audioEngine.setEffectBypassById(effectId, bypass);
  };
  
  // Effect mix controls
  const setEffectMix = (effectId: string, mix: number) => {
    console.log('Setting effect mix through AudioEngine:', effectId, mix);
    audioEngine.setEffectMixById(effectId, mix);
  };
  
  // Lo-fi handlers
  const handleLofiToneChange = (value: number) => {
    setLofiTone(value);
    audioEngine.setLofiTone(value);
  };
  
  const handleLofiNoiseChange = (value: number) => {
    setLofiNoise(value);
    audioEngine.setLofiNoiseLevel(value);
  };
  
  const handleLofiWowChange = (value: number) => {
    setLofiWow(value);
    audioEngine.setLofiWowFlutter(value, 0.5);
  };
  
  // EQ handlers
  const handleEQBandChange = (bandIndex: number, value: number) => {
    const newEqBands = [...eqBands];
    newEqBands[bandIndex] = value;
    setEqBands(newEqBands);
    audioEngine.setEQBand(bandIndex, value);
  };
  
  const handleEQMixChange = (value: number) => {
    setEqMix(value);
    audioEngine.setEQMix(value);
  };
  
  const handleEQBypassChange = (bypass: boolean) => {
    setEqBypass(bypass);
    audioEngine.setEQBypass(bypass);
  };
  
  // Reverb handlers
  const handleReverbMixChange = (value: number) => {
    setReverbMix(value);
    audioEngine.setReverbMix(value);
  };
  
  const handleReverbPreDelayChange = (value: number) => {
    setReverbPreDelay(value);
    audioEngine.setReverbPreDelay(value);
  };
  
  const handleReverbDampingChange = (value: number) => {
    setReverbDamping(value);
    audioEngine.setReverbDamping(value);
  };
  
  const handleReverbPresetChange = (preset: 'small' | 'medium' | 'large') => {
    setReverbPreset(preset);
    audioEngine.setReverbPreset(preset);
  };
  
  const handleReverbBypassChange = (bypass: boolean) => {
    setReverbBypass(bypass);
    audioEngine.setReverbBypass(bypass);
  };
  
  // Low-pass handlers
  const handleLowPassToneChange = (value: number) => {
    setLowPassTone(value);
    audioEngine.setLowPassTone(value);
  };
  
  const handleLowPassResonanceChange = (value: number) => {
    setLowPassResonance(value);
    audioEngine.setLowPassResonance(value);
  };
  
  // Get analyser for visualization
  const getAnalyser = (): AnalyserNode | null => {
    return audioEngine.getAnalyser();
  };
  
  return {
    // Playback state
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    
    // Playback controls
    playbackRate,
    tempo,
    pitchSemitones,
    
    // EQ settings
    eqBands,
    eqMix,
    eqBypass,
    
    // Reverb settings
    reverbMix,
    reverbPreDelay,
    reverbDamping,
    reverbPreset,
    reverbBypass,
    
    // Lo-fi settings
    lofiTone,
    lofiNoise,
    lofiWow,
    
    // Low-pass filter settings
    lowPassTone,
    lowPassResonance,
    
    // Core functions
    loadTrack,
    togglePlayPause,
    seek,
    setVolume,
    toggleMute,
    setPlaybackRate,
    setTempo,
    setPitchSemitones,
    
    // Effect controls
    setEffectBypass,
    setEffectMix,
    
    // Specific effect handlers
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
    
    // Analyser for visualization
    getAnalyser
  };
};