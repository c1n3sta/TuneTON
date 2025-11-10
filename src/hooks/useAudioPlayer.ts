import { useEffect, useRef, useState } from 'react';
import type { AudioTrack } from '../types/audio';

// Add import for URL validation utility
import { isValidAudioUrl } from '../components/player/utils';

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
  loadTrack: (track: AudioTrack) => void;
  togglePlayPause: () => void;
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
  // Audio element ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
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
  
  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    
    const audio = audioRef.current;
    
    // Add important attributes for better compatibility
    audio.crossOrigin = "anonymous";
    audio.preload = "metadata";
    // Add mobile-specific attributes
    audio.setAttribute('playsinline', 'true');
    audio.setAttribute('webkit-playsinline', 'true');
    audio.setAttribute('x5-playsinline', 'true');
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    
    const handlePlay = () => {
      setIsPlaying(true);
    };
    
    const handlePause = () => {
      setIsPlaying(false);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    
    const handleError = () => {
      console.error('Audio playback error:', audio.error);
      // More detailed error handling
      if (audio.error) {
        switch (audio.error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            console.error('Media playback was aborted by the user');
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            console.error('A network error caused the media download to fail');
            break;
          case MediaError.MEDIA_ERR_DECODE:
            console.error('An error occurred while decoding the media');
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            console.error('The media resource is not supported');
            break;
          default:
            console.error('An unknown error occurred');
            break;
        }
      }
    };
    
    const handleStalled = () => {
      console.warn('Audio playback stalled');
    };
    
    const handleWaiting = () => {
      console.warn('Audio playback waiting for data');
    };
    
    const handleCanPlay = () => {
      console.log('Audio can play');
    };
    
    const handleCanPlayThrough = () => {
      console.log('Audio can play through');
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('stalled', handleStalled);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('stalled', handleStalled);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.pause();
      audio.src = '';
    };
  }, []);
  
  // Update audio element properties when state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.volume = isMuted ? 0 : volume;
    audio.playbackRate = playbackRate;
  }, [volume, isMuted, playbackRate]);
  
  // Load track function
  const loadTrack = (track: AudioTrack) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    console.log('Loading track in useAudioPlayer:', track);
    
    // Validate audio URL before loading
    const audioSource = track.audioUrl || (typeof track.source === 'string' ? track.source : '');
    if (audioSource) {
      console.log('Validating audio URL in useAudioPlayer:', audioSource);
      const isValid = isValidAudioUrl(audioSource);
      console.log('URL validation result in useAudioPlayer:', isValid);
      
      if (!isValid) {
        console.error('Invalid audio URL provided to loadTrack:', audioSource);
        // Don't return here, we'll still try to load it but log the issue
      }
    }
    
    setCurrentTrack(track);
    // Ensure we're setting a string source
    audio.src = typeof track.source === 'string' ? track.source : (track.audioUrl || '');
    setCurrentTime(0);
    setDuration(track.duration || 0);
    
    // Log the track being loaded
    console.log('Loading track:', track);
    console.log('Audio source set to:', audio.src);
    
    // Load the audio
    audio.load();
  };
  
  // Toggle play/pause
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    console.log('Toggle play/pause called. Current state:', isPlaying);
    console.log('Audio element readyState:', audio.readyState);
    console.log('Audio element networkState:', audio.networkState);
    console.log('Audio element src:', audio.src);
    
    if (isPlaying) {
      console.log('Pausing audio');
      audio.pause();
    } else {
      console.log('Attempting to play audio');
      // Check if we have a valid source
      if (!audio.src || audio.src === '') {
        console.error('No audio source available');
        return;
      }
      
      // Add better error handling and user feedback
      audio.play().then(() => {
        console.log('Audio playback started successfully');
      }).catch(error => {
        console.error('Failed to play audio:', error);
        // Handle autoplay policy issues
        if (error.name === 'NotAllowedError') {
          console.error('Autoplay prevented by browser policy. User interaction required.');
        }
      });
    }
  };
  
  // Seek to specific time
  const seek = (time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = time;
    setCurrentTime(time);
  };
  
  // Set volume
  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (isMuted) {
      setIsMuted(false);
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  // Set playback rate
  const setPlaybackRate = (rate: number) => {
    setPlaybackRateState(rate);
  };
  
  // Set tempo
  const setTempo = (newTempo: number) => {
    setTempoState(newTempo);
    // In a real implementation, this would affect the audio processing
  };
  
  // Set pitch semitones
  const setPitchSemitones = (semitones: number) => {
    setPitchSemitonesState(semitones);
    // In a real implementation, this would affect the audio processing
  };
  
  // Effect bypass controls
  const setEffectBypass = (effectId: string, bypass: boolean) => {
    switch (effectId) {
      case 'eq':
        setEqBypass(bypass);
        break;
      case 'reverb':
        setReverbBypass(bypass);
        break;
      case 'tempoPitch':
        // Handle tempo/pitch bypass
        break;
      case 'lofi':
        // Handle lofi bypass
        break;
      case 'lowPass':
        // Handle low-pass bypass
        break;
    }
  };
  
  // Effect mix controls
  const setEffectMix = (effectId: string, mix: number) => {
    switch (effectId) {
      case 'eq':
        setEqMix(mix);
        break;
      case 'reverb':
        setReverbMix(mix);
        break;
      case 'tempoPitch':
        // Handle tempo/pitch mix
        break;
      case 'lofi':
        // Handle lofi mix
        break;
      case 'lowPass':
        // Handle low-pass mix
        break;
    }
  };
  
  // Lo-fi handlers
  const handleLofiToneChange = (value: number) => {
    setLofiTone(value);
  };
  
  const handleLofiNoiseChange = (value: number) => {
    setLofiNoise(value);
  };
  
  const handleLofiWowChange = (value: number) => {
    setLofiWow(value);
  };
  
  // EQ handlers
  const handleEQBandChange = (bandIndex: number, value: number) => {
    const newEqBands = [...eqBands];
    newEqBands[bandIndex] = value;
    setEqBands(newEqBands);
  };
  
  const handleEQMixChange = (value: number) => {
    setEqMix(value);
  };
  
  const handleEQBypassChange = (bypass: boolean) => {
    setEqBypass(bypass);
  };
  
  // Reverb handlers
  const handleReverbMixChange = (value: number) => {
    setReverbMix(value);
  };
  
  const handleReverbPreDelayChange = (value: number) => {
    setReverbPreDelay(value);
  };
  
  const handleReverbDampingChange = (value: number) => {
    setReverbDamping(value);
  };
  
  const handleReverbPresetChange = (preset: 'small' | 'medium' | 'large') => {
    setReverbPreset(preset);
  };
  
  const handleReverbBypassChange = (bypass: boolean) => {
    setReverbBypass(bypass);
  };
  
  // Low-pass handlers
  const handleLowPassToneChange = (value: number) => {
    setLowPassTone(value);
  };
  
  const handleLowPassResonanceChange = (value: number) => {
    setLowPassResonance(value);
  };
  
  // Get analyser for visualization
  const getAnalyser = (): AnalyserNode | null => {
    // In a real implementation, this would return an actual analyser node
    return null;
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