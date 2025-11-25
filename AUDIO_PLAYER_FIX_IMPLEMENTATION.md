# Audio Player Fix Implementation Plan

## Executive Summary

This document provides a step-by-step implementation plan to fix the critical audio player issues in TuneTON. The primary problem is a conflict between two audio management systems that must be resolved by eliminating the direct HTMLAudioElement management and properly integrating the WebAudioEngine through AudioEngineWrapper.

## 1. Immediate Fix: Eliminate HTMLAudioElement Conflict

### 1.1 File: src/hooks/useAudioPlayer.ts

**Current Problem**: 
The hook directly manages an HTMLAudioElement, creating conflicts with WebAudioEngine.

**Solution**: 
Remove all HTMLAudioElement management and delegate to AudioEngineWrapper.

**Implementation Steps**:

#### Step 1: Remove HTMLAudioElement Management
```typescript
// REMOVE these lines (approximately lines 79, 118-217):
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

#### Step 2: Remove State Update Effect
```typescript
// REMOVE this effect (approximately lines 220-226):
useEffect(() => {
  const audio = audioRef.current;
  if (!audio) return;
  
  audio.volume = isMuted ? 0 : volume;
  audio.playbackRate = playbackRate;
}, [volume, isMuted, playbackRate]);
```

#### Step 3: Add AudioEngineWrapper Integration
```typescript
// ADD at the top of the hook:
import { AudioEngineWrapper } from '../core/audio/AudioEngineWrapper';

// ADD after state declarations (around line 117):
const [audioEngine] = useState(() => new AudioEngineWrapper());
```

#### Step 4: Rewrite loadTrack Function
```typescript
// REPLACE the entire loadTrack function (lines 229-260):
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

#### Step 5: Rewrite togglePlayPause Function
```typescript
// REPLACE the entire togglePlayPause function (lines 263-297):
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

#### Step 6: Rewrite seek Function
```typescript
// REPLACE the entire seek function (lines 301-307):
const seek = (time: number) => {
  console.log('Seeking to time through AudioEngine:', time);
  audioEngine.seek(time);
  setCurrentTime(time);
};
```

#### Step 7: Rewrite setVolume Function
```typescript
// REPLACE the entire setVolume function (lines 310-315):
const setVolume = (newVolume: number) => {
  console.log('Setting volume through AudioEngine:', newVolume);
  setVolumeState(newVolume);
  if (isMuted && newVolume > 0) {
    setIsMuted(false);
  }
  audioEngine.setVolume(isMuted ? 0 : newVolume);
};
```

#### Step 8: Rewrite toggleMute Function
```typescript
// REPLACE the entire toggleMute function (lines 318-320):
const toggleMute = () => {
  console.log('Toggling mute through AudioEngine. Current mute state:', isMuted);
  const newMuteState = !isMuted;
  setIsMuted(newMuteState);
  audioEngine.setVolume(newMuteState ? 0 : volume);
};
```

#### Step 9: Rewrite setPlaybackRate Function
```typescript
// REPLACE the entire setPlaybackRate function (lines 323-325):
const setPlaybackRate = (rate: number) => {
  console.log('Setting playback rate through AudioEngine:', rate);
  setPlaybackRateState(rate);
  audioEngine.setPlaybackRate(rate);
};
```

#### Step 10: Rewrite Effect Control Functions
```typescript
// REPLACE setEffectBypass function (lines 340-358):
const setEffectBypass = (effectId: string, bypass: boolean) => {
  console.log('Setting effect bypass through AudioEngine:', effectId, bypass);
  audioEngine.setEffectBypass(effectId as any, bypass);
};

// REPLACE setEffectMix function (lines 361-379):
const setEffectMix = (effectId: string, mix: number) => {
  console.log('Setting effect mix through AudioEngine:', effectId, mix);
  audioEngine.setEffectMix(effectId as any, mix);
};

// REPLACE all specific effect handler functions to delegate to audioEngine:
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

#### Step 11: Update getAnalyser Function
```typescript
// REPLACE getAnalyser function (lines 440-443):
const getAnalyser = (): AnalyserNode | null => {
  return audioEngine.getAnalyser();
};
```

## 2. Secondary Fix: Enhanced URL Validation

### 2.1 File: src/components/player/utils.ts

**Current Problem**: 
URL validation is too restrictive for Jamendo streaming URLs.

**Solution**: 
Improve validation to properly handle Jamendo API URL format.

**Implementation Steps**:

#### Step 1: Update isValidAudioUrl Function
```typescript
// REPLACE the entire isValidAudioUrl function (lines 98-119):
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

## 3. Verification and Testing

### 3.1 Test Audio Engine Integration
1. Load a track and verify it's processed through WebAudioEngine
2. Test play/pause functionality through AudioEngineWrapper
3. Verify that audio effects are properly applied
4. Check that volume and seek controls work correctly

### 3.2 Test URL Validation
1. Validate that Jamendo streaming URLs pass validation
2. Confirm that invalid URLs are properly rejected
3. Test fallback mechanisms for URL selection

### 3.3 Test Error Handling
1. Test with invalid track data
2. Verify proper error messages are displayed
3. Check that the system gracefully handles network errors

## 4. Rollback Plan

If issues occur during implementation:

1. **Revert useAudioPlayer.ts changes**:
   - Restore the original HTMLAudioElement management
   - Revert to direct audio element operations

2. **Temporary workaround**:
   - Disable WebAudioEngine integration
   - Use only HTMLAudioElement for basic playback

3. **Diagnostic steps**:
   - Add extensive logging to track audio command flow
   - Verify that AudioEngineWrapper is properly initialized
   - Check that WebAudioEngine receives commands correctly

## 5. Success Criteria

The fix is successful when:
1. Audio playback works consistently across all tracks
2. Advanced audio effects are available and functional
3. No console errors related to audio conflicts
4. Memory usage remains stable during extended playback
5. User interface responds correctly to playback state changes
6. Error handling provides clear feedback to users