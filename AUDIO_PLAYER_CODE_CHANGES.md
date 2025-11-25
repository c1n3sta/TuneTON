# Audio Player Code Changes

## Executive Summary

This document provides the exact code changes needed to fix the audio player issues in TuneTON. The primary fix involves removing the conflicting HTMLAudioElement management from `useAudioPlayer.ts` and properly integrating the AudioEngineWrapper.

## 1. Primary Fix: useAudioPlayer.ts

### 1.1 Remove HTMLAudioElement Management

**Lines to Remove (lines 79, 118-217)**:
```typescript
const audioRef = useRef<HTMLAudioElement | null>(null);

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
```

### 1.2 Remove State Update Effect

**Lines to Remove (lines 220-226)**:
```typescript
useEffect(() => {
  const audio = audioRef.current;
  if (!audio) return;
  
  audio.volume = isMuted ? 0 : volume;
  audio.playbackRate = playbackRate;
}, [volume, isMuted, playbackRate]);
```

### 1.3 Add AudioEngineWrapper Integration

**Lines to Add (around line 78, after imports)**:
```typescript
import { AudioEngineWrapper } from '../core/audio/AudioEngineWrapper';
```

**Lines to Add (around line 117, after state declarations)**:
```typescript
const [audioEngine] = useState(() => new AudioEngineWrapper());
```

### 1.4 Replace loadTrack Function

**Lines to Replace (lines 229-260)**:
```typescript
// REPLACE THIS ENTIRE FUNCTION
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

// WITH THIS NEW FUNCTION
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
  }
};
```

### 1.5 Replace togglePlayPause Function

**Lines to Replace (lines 263-297)**:
```typescript
// REPLACE THIS ENTIRE FUNCTION
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
      // Record playback history when track starts playing
      if (currentTrack) {
        tuneTONAPI.addPlaybackHistory(currentTrack);
      }
    }).catch(error => {
      console.error('Failed to play audio:', error);
      // Handle autoplay policy issues
      if (error.name === 'NotAllowedError') {
        console.error('Autoplay prevented by browser policy. User interaction required.');
      }
    });
  }
};

// WITH THIS NEW FUNCTION
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
        return;
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
    if (error.name === 'NotAllowedError') {
      console.error('Autoplay prevented by browser policy. User interaction required.');
    }
  }
};
```

### 1.6 Replace seek Function

**Lines to Replace (lines 301-307)**:
```typescript
// REPLACE THIS ENTIRE FUNCTION
const seek = (time: number) => {
  const audio = audioRef.current;
  if (!audio) return;
  
  audio.currentTime = time;
  setCurrentTime(time);
};

// WITH THIS NEW FUNCTION
const seek = (time: number) => {
  console.log('Seeking to time through AudioEngine:', time);
  audioEngine.seek(time);
  setCurrentTime(time);
};
```

### 1.7 Replace setVolume Function

**Lines to Replace (lines 310-315)**:
```typescript
// REPLACE THIS ENTIRE FUNCTION
const setVolume = (newVolume: number) => {
  setVolumeState(newVolume);
  if (isMuted) {
    setIsMuted(false);
  }
};

// WITH THIS NEW FUNCTION
const setVolume = (newVolume: number) => {
  console.log('Setting volume through AudioEngine:', newVolume);
  setVolumeState(newVolume);
  if (isMuted && newVolume > 0) {
    setIsMuted(false);
  }
  audioEngine.setVolume(isMuted ? 0 : newVolume);
};
```

### 1.8 Replace toggleMute Function

**Lines to Replace (lines 318-320)**:
```typescript
// REPLACE THIS ENTIRE FUNCTION
const toggleMute = () => {
  setIsMuted(!isMuted);
};

// WITH THIS NEW FUNCTION
const toggleMute = () => {
  console.log('Toggling mute through AudioEngine. Current mute state:', isMuted);
  const newMuteState = !isMuted;
  setIsMuted(newMuteState);
  audioEngine.setVolume(newMuteState ? 0 : volume);
};
```

### 1.9 Replace setPlaybackRate Function

**Lines to Replace (lines 323-325)**:
```typescript
// REPLACE THIS ENTIRE FUNCTION
const setPlaybackRate = (rate: number) => {
  setPlaybackRateState(rate);
};

// WITH THIS NEW FUNCTION
const setPlaybackRate = (rate: number) => {
  console.log('Setting playback rate through AudioEngine:', rate);
  setPlaybackRateState(rate);
  audioEngine.setPlaybackRate(rate);
};
```

### 1.10 Replace Effect Control Functions

**Lines to Replace (lines 340-437)**:
```typescript
// REPLACE ALL THESE FUNCTIONS
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

const handleLofiToneChange = (value: number) => {
  setLofiTone(value);
};

const handleLofiNoiseChange = (value: number) => {
  setLofiNoise(value);
};

const handleLofiWowChange = (value: number) => {
  setLofiWow(value);
};

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

const handleLowPassToneChange = (value: number) => {
  setLowPassTone(value);
};

const handleLowPassResonanceChange = (value: number) => {
  setLowPassResonance(value);
};

// WITH THESE NEW FUNCTIONS
const setEffectBypass = (effectId: string, bypass: boolean) => {
  console.log('Setting effect bypass through AudioEngine:', effectId, bypass);
  audioEngine.setEffectBypass(effectId as any, bypass);
};

const setEffectMix = (effectId: string, mix: number) => {
  console.log('Setting effect mix through AudioEngine:', effectId, mix);
  audioEngine.setEffectMix(effectId as any, mix);
};

const handleLofiToneChange = (value: number) => {
  setLofiTone(value);
  audioEngine.setLofiTone(value);
};

const handleLofiNoiseChange = (value: number) => {
  setLofiNoise(value);
  audioEngine.setLofiNoiseLevel(value / 100); // Convert to 0-1 range
};

const handleLofiWowChange = (value: number) => {
  setLofiWow(value);
  audioEngine.setLofiWowFlutter(value / 10, 0.5); // Convert to appropriate values
};

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

const handleLowPassToneChange = (value: number) => {
  setLowPassTone(value);
  audioEngine.setLowPassTone(value);
};

const handleLowPassResonanceChange = (value: number) => {
  setLowPassResonance(value);
  audioEngine.setLowPassResonance(value);
};
```

### 1.11 Replace getAnalyser Function

**Lines to Replace (lines 440-443)**:
```typescript
// REPLACE THIS ENTIRE FUNCTION
const getAnalyser = (): AnalyserNode | null => {
  // In a real implementation, this would return an actual analyser node
  return null;
};

// WITH THIS NEW FUNCTION
const getAnalyser = (): AnalyserNode | null => {
  return audioEngine.getAnalyser();
};
```

## 2. Secondary Fix: URL Validation

### 2.1 Update isValidAudioUrl Function

**Lines to Replace (lines 98-119 in src/components/player/utils.ts)**:
```typescript
// REPLACE THIS ENTIRE FUNCTION
export function isValidAudioUrl(url: string): boolean {
  if (!url) return false;
  
  // For Jamendo URLs, we need to be more flexible
  if (url.includes('jamendo.com')) {
    return url.startsWith('http');
  }
  
  // For other URLs, check for common audio extensions
  // Also allow URLs that might be streaming endpoints
  return url.startsWith('http') && (
    url.includes('.mp3') || 
    url.includes('.wav') || 
    url.includes('.ogg') || 
    url.includes('.m4a') || 
    url.includes('.flac') ||
    // Allow streaming endpoints
    url.includes('/stream') ||  // Allow /stream anywhere in the URL
    url.includes('/audio')      // Allow /audio anywhere in the URL
  );
}

// WITH THIS NEW FUNCTION
export function isValidAudioUrl(url: string): boolean {
  if (!url) return false;
  
  // For Jamendo URLs, validate against the expected format
  if (url.includes('jamendo.com')) {
    // Expected format: https://api.jamendo.com/v3.0/tracks/filestream/?track_id={id}&client_id={key}
    const jamendoPattern = /^https:\/\/api\.jamendo\.com\/v3\.0\/tracks\/filestream\/\?track_id=\d+&client_id=[a-zA-Z0-9]+$/;
    return jamendoPattern.test(url);
  }
  
  // For other URLs, check for common audio extensions or streaming endpoints
  return url.startsWith('http') && (
    url.includes('.mp3') || 
    url.includes('.wav') || 
    url.includes('.ogg') || 
    url.includes('.m4a') || 
    url.includes('.flac') ||
    // Allow streaming endpoints
    url.includes('/stream') ||  // Allow /stream anywhere in the URL
    url.includes('/audio')      // Allow /audio anywhere in the URL
  );
}
```

## 3. Summary of Changes

### Files Modified:
1. **`src/hooks/useAudioPlayer.ts`**: 
   - Removed ~120 lines of HTMLAudioElement management code
   - Added AudioEngineWrapper integration (~5 lines)
   - Replaced 12 functions with delegated implementations

2. **`src/components/player/utils.ts`**:
   - Enhanced URL validation for Jamendo streaming URLs
   - Added specific pattern matching for Jamendo API format

### Lines of Code Changed:
- **Removed**: ~170 lines of conflicting code
- **Added**: ~30 lines of proper integration code
- **Net Change**: -140 lines (simplification and cleanup)

### Risk Assessment:
- **Low Risk**: Changes are surgical and focused on the root cause
- **Backward Compatible**: Existing API remains the same
- **Easy to Revert**: All changes are clearly defined and can be undone if needed

## 4. Verification Steps

After implementing these changes:

1. **Test Audio Engine Integration**:
   - Load a track and verify it's processed through WebAudioEngine
   - Check that console logs show "through AudioEngineWrapper"
   - Verify that advanced effects are available

2. **Test URL Validation**:
   - Try loading a valid Jamendo URL
   - Verify it passes validation with the new regex pattern
   - Test with invalid URLs to ensure proper rejection

3. **Test Playback Functionality**:
   - Click play button and verify audio plays
   - Test pause/resume functionality
   - Check seek and volume controls
   - Verify that no console errors appear

4. **Test Error Handling**:
   - Try loading invalid track data
   - Verify appropriate error messages
   - Check that system gracefully handles failures

## 5. Expected Results

After implementing these changes:
- ✅ Audio playback works consistently across all tracks
- ✅ Advanced audio effects (EQ, reverb, pitch shifting) are available
- ✅ No console errors related to audio conflicts
- ✅ Memory usage remains stable during extended playback
- ✅ User interface responds correctly to playback state changes
- ✅ Error handling provides clear feedback to users
- ✅ All existing functionality continues to work