# Audio Playback Fix Plan for TuneTON 3.0

## Overview

This document outlines the specific code changes, database migrations, and implementation steps required to resolve the audio playback issues in TuneTON 3.0. The fixes are organized by component and priority.

## 1. Database Schema Fixes

### 1.1 Fix Playback History Foreign Key Constraint

**File:** Create new migration file `supabase/migrations/20251125000002_fix_playback_history_foreign_key.sql`

```sql
-- Fix playback_history table foreign key to reference users.id (UUID) instead of users.telegram_id (BIGINT)
BEGIN;

-- Drop existing constraint
ALTER TABLE playback_history DROP CONSTRAINT IF EXISTS playback_history_user_id_fkey;

-- Alter column type from BIGINT to UUID to match users.id
ALTER TABLE playback_history ALTER COLUMN user_id TYPE UUID USING NULL;

-- Add the correct foreign key referencing users.id
ALTER TABLE playback_history 
    ADD CONSTRAINT playback_history_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES users(id) 
    ON DELETE CASCADE;

COMMIT;
```

**Note:** Since we're changing from BIGINT to UUID, we need to handle existing data. In practice, this would require a more complex migration to map telegram_id values to user UUIDs, but for immediate fixes, we'll set the column to accept NULL values temporarily.

### 1.2 Verify Playbacks Table Fix

**File:** `supabase/migrations/20251125000000_fix_playbacks_track_id_type.sql` (already exists)

Verify this migration has been applied:
- playbacks.track_id should be BIGINT
- Foreign key constraint should reference tracks.id

## 2. Audio URL Validation Improvements

### 2.1 Enhance URL Validation Logic

**File:** `src/components/player/utils.ts`

**Current Issues:**
- Overly restrictive validation for Jamendo URLs
- No handling of temporary network issues
- No validation of URL accessibility

**Changes:**

#### Update isValidAudioUrl function (lines 58-69):

```typescript
// Check if audio URL is valid
export function isValidAudioUrl(url: string): boolean {
  if (!url) return false;
  
  // For Jamendo URLs, we need to be more flexible
  // Jamendo streaming URLs often don't have file extensions
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
    url.includes('/stream') ||  // Allow streaming endpoints
    url.includes('/audio')      // Allow audio endpoints
  );
}
```

#### Update validateAndSelectAudioUrl function (lines 38-55):

```typescript
// Validate and select the best audio URL
function validateAndSelectAudioUrl(audio?: string, audiodownload?: string): string {
  // Prefer audio URL (streaming) over audiodownload (direct download)
  const primaryUrl = audio || audiodownload || '';
  const fallbackUrl = audiodownload || audio || '';
  
  // Validate primary URL first
  if (primaryUrl && isValidAudioUrl(primaryUrl)) {
    return primaryUrl;
  }
  
  // Try fallback URL
  if (fallbackUrl && isValidAudioUrl(fallbackUrl)) {
    return fallbackUrl;
  }
  
  // For Jamendo URLs, even if they don't validate perfectly, they might still work
  if (primaryUrl && primaryUrl.includes('jamendo.com')) {
    return primaryUrl;
  }
  
  if (fallbackUrl && fallbackUrl.includes('jamendo.com')) {
    return fallbackUrl;
  }
  
  // Return whatever we have if no valid URL found (may be empty)
  return primaryUrl;
}
```

## 3. Track Data Conversion Improvements

### 3.1 Improve convertJamendoToTrack Function

**File:** `src/components/player/utils.ts`

**Current Issues:**
- No validation that required fields are present
- No error handling for missing data
- No fallback for missing cover art

**Changes:**

#### Update convertJamendoToTrack function (lines 6-35):

```typescript
// Convert Jamendo track to AudioTrack
export function convertJamendoToTrack(
  track: JamendoTrack | null, 
  fallbackName: string = 'Unknown Track',
  currentTime: number = 0,
  isLiked: boolean = false,
  isDisliked: boolean = false
): AudioTrack | null {
  if (!track) return null;
  
  // Validate required fields
  if (!track.id) {
    console.error('Invalid Jamendo track: missing id', track);
    return null;
  }
  
  // Handle missing data gracefully
  const trackName = track.name || fallbackName;
  const artistName = track.artist_name || 'Unknown Artist';
  const duration = track.duration || 0;
  
  // Try multiple sources for cover art
  const coverArt = track.image || track.album_image || '';
  
  // Prioritize audio over audiodownload for streaming URLs and validate
  const audioUrl = validateAndSelectAudioUrl(track.audio, track.audiodownload);
  
  // Validate that we have at least a valid audio URL
  if (!audioUrl) {
    console.error('Invalid Jamendo track: no valid audio URL', track);
    return null;
  }
  
  return {
    id: track.id.toString(), // Ensure ID is string
    title: trackName,
    artist: artistName,
    duration,
    source: audioUrl,
    coverArt,
    audioUrl,
    album: track.album_name || 'Unknown Album',
    cover: coverArt
    // Note: currentTime is not part of AudioTrack interface, it's managed by the player
  };
}
```

## 4. Audio Player Component Enhancements

### 4.1 Improve useAudioPlayer Hook Error Handling

**File:** `src/hooks/useAudioPlayer.ts`

**Current Issues:**
- Generic error messages
- No specific handling for different MediaError types
- No network error detection

**Changes:**

#### Enhance error handling in audio element event listener (lines 152-174):

```typescript
const handleError = () => {
  console.error('Audio playback error:', audio.error);
  // More detailed error handling
  if (audio.error) {
    let errorMessage = 'Unknown audio error';
    
    switch (audio.error.code) {
      case MediaError.MEDIA_ERR_ABORTED:
        errorMessage = 'Media playback was aborted. Please try again.';
        break;
      case MediaError.MEDIA_ERR_NETWORK:
        errorMessage = 'Network error occurred while loading audio. Check your connection and try again.';
        break;
      case MediaError.MEDIA_ERR_DECODE:
        errorMessage = 'Audio decoding failed. The file may be corrupted or in an unsupported format.';
        break;
      case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
        errorMessage = 'Audio format not supported by this browser. Try a different track.';
        break;
      default:
        errorMessage = `Media error: ${audio.error.message || 'Unknown error'}`;
    }
    
    setError(new Error(errorMessage));
  }
};
```

#### Add comprehensive event handlers (lines 176-200):

```typescript
// Add event listeners for detailed debugging
useEffect(() => {
  if (!audio) return;
  
  const handleLoadedMetadata = () => {
    console.log('Audio metadata loaded successfully');
    setDuration(audio.duration || 0);
  };
  
  const handleCanPlay = () => {
    console.log('Audio can play through without interruption');
  };
  
  const handleStalled = () => {
    console.warn('Audio loading has stalled');
  };
  
  const handleWaiting = () => {
    console.warn('Audio is waiting for data');
  };
  
  audio.addEventListener('loadedmetadata', handleLoadedMetadata);
  audio.addEventListener('canplay', handleCanPlay);
  audio.addEventListener('stalled', handleStalled);
  audio.addEventListener('waiting', handleWaiting);
  
  return () => {
    audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    audio.removeEventListener('canplay', handleCanPlay);
    audio.removeEventListener('stalled', handleStalled);
    audio.removeEventListener('waiting', handleWaiting);
  };
}, [audio]);
```

### 4.2 Improve MusicPlayer Error Display

**File:** `src/components/MusicPlayer.tsx`

**Current Issues:**
- Generic error messages that don't help users resolve issues
- No specific guidance for different error types

**Changes:**

#### Enhance error message handling in togglePlayPause (lines 364-386):

```typescript
// Call the hook's togglePlayPause function and handle errors
try {
  await togglePlayPause();
  const newPlayState = !playerIsPlaying;
  setPlayerIsPlaying(newPlayState);
  onPlayPause?.();
} catch (error) {
  console.error('Error during playback:', error);
  
  // Provide more specific error messages based on the error type
  let userMessage = 'An unknown error occurred during playback.';
  
  if (error instanceof Error) {
    userMessage = error.message;
    
    // Check for specific error patterns and provide more helpful messages
    if (error.message.includes('autoplay')) {
      userMessage = 'Browser autoplay policy is blocking audio. Click the play button again to start playback.';
    } else if (error.message.includes('interrupted') || error.message.includes('Abort')) {
      userMessage = 'Audio playback was interrupted. Click the play button again to retry.';
    } else if (error.message.includes('format not supported')) {
      userMessage = 'This audio format is not supported. Try selecting a different track.';
    } else if (error.message.includes('network')) {
      userMessage = 'Network error occurred while trying to play audio. Check your connection and try again.';
    } else if (error.message.includes('activate')) {
      userMessage = 'Failed to activate audio system. This may be due to browser restrictions. Please ensure you have interacted with the page (clicked somewhere) and try clicking the play button again.';
    } else if (error.message.includes('engine error')) {
      userMessage = 'Audio engine error. Please try clicking the play button again. If the problem persists, try refreshing the page.';
    } else if (error.message.includes('worklet')) {
      userMessage = 'Audio processing error. The audio effects engine failed to initialize. Please try refreshing the page.';
    } else if (error.message.includes('connect')) {
      userMessage = 'Audio connection error. The audio processing nodes failed to connect properly. Please try refreshing the page.';
    }
  }
  
  setHasError(true);
  setErrorMessage(userMessage);
}
```

## 5. Audio Context Activation Improvements

### 5.1 Improve AudioEngine Error Handling

**File:** `src/core/audio/AudioEngine.ts`

**Current Issues:**
- Generic error message when audio context activation fails
- No detailed logging to help diagnose audio context issues
- No specific handling for different types of audio context activation failures
- No proper handling of Tone.js worklet loading failures
- No proper handling of audio graph connection issues

**Changes:**

#### Improve error handling in getAudioContext method (lines 97-123):

```typescript
// Initialize AudioContext on first user interaction
private async getAudioContext(): Promise<AudioContext> {
  if (!this.audioContext) {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        latencyHint: 'interactive'
      } as any);
      
      // Initialize all audio nodes
      await this.initializeAudioNodes();
    } catch (error) {
      console.error('Failed to create AudioContext:', error);
      throw new Error('Failed to initialize audio system. This may be due to browser restrictions or missing audio capabilities.');
    }
  }
  
  // Resume context if suspended (needed for autoplay policy)
  if (this.audioContext.state === 'suspended') {
    console.log('Audio context is suspended, attempting to resume...');
    try {
      await this.audioContext.resume();
      console.log('Audio context resumed successfully');
    } catch (error) {
      console.error('Failed to resume AudioContext:', error);
      // Provide more specific error messages based on the error type
      if (error instanceof DOMException) {
        switch (error.name) {
          case 'NotAllowedError':
            throw new Error('Audio playback blocked by browser autoplay policy. Please click the play button again to start playback.');
          case 'AbortError':
            throw new Error('Audio activation was interrupted. Please click the play button again to retry.');
          default:
            throw new Error(`Failed to activate audio system: ${error.message || 'Unknown error'}. This may be due to browser restrictions. Please click the play button again.`);
        }
      }
      throw new Error('Failed to activate audio system. This may be due to browser restrictions. Please click the play button again.');
    }
  }
  
  return this.audioContext;
}
```

#### Improve error handling in play method (lines 556-661):

```typescript
async play(): Promise<void> {
  try {
    // Ensure audio context is initialized
    const audioContext = await this.getAudioContext();
    
    if (this.mediaElement) {
      // Ensure audio context is properly resumed before playing
      if (audioContext.state === 'suspended') {
        console.log('Audio context is suspended, attempting to resume...');
        try {
          await audioContext.resume();
          console.log('Audio context resumed successfully');
        } catch (resumeError) {
          console.error('Failed to resume audio context:', resumeError);
          // Provide more specific error messages based on the error type
          if (resumeError instanceof DOMException) {
            switch (resumeError.name) {
              case 'NotAllowedError':
                throw new Error('Audio playback blocked by browser autoplay policy. Please click the play button again to start playback.');
              case 'AbortError':
                throw new Error('Audio activation was interrupted. Please click the play button again to retry.');
              default:
                throw new Error(`Failed to activate audio system: ${resumeError.message || 'Unknown error'}. This may be due to browser restrictions. Please click the play button again.`);
            }
          }
          throw new Error('Failed to activate audio system. This may be due to browser restrictions. Please click the play button again.');
        }
      }
      
      // Gentle fade-in
      const now = audioContext.currentTime;
      const gainParam = this.masterGain?.gain;
      if (gainParam) {
        gainParam.cancelScheduledValues(now);
        const targetVol = this.volume;
        const startValue = Math.max(0, Math.min(1, gainParam.value));
        gainParam.setValueAtTime(startValue, now);
        gainParam.linearRampToValueAtTime(targetVol, now + 0.01);
      }

      // Add error handling for play
      try {
        console.log('Attempting to play media element...');
        await this.mediaElement.play();
        this.isPlayingFlag = true;
        console.log('Media element playing successfully');
        return;
      } catch (error) {
        console.error('Error playing media:', error);
        
        // Provide more detailed error messages based on the error type
        if (error instanceof DOMException) {
          switch (error.name) {
            case 'NotAllowedError':
              throw new Error('Audio playback blocked by browser autoplay policy. Click the play button again to start playback.');
            case 'AbortError':
              throw new Error('Audio playback was interrupted. This may be due to browser autoplay restrictions or network issues. Click the play button again to retry.');
            case 'NotSupportedError':
              throw new Error('Audio format not supported by this browser. Try a different track.');
            default:
              throw new Error(`Audio playback failed: ${error.message || 'Unknown error'}. Click the play button again to retry.`);
          }
        }
        throw new Error(`Failed to play audio: ${error instanceof Error ? error.message : 'Playback failed'}. Click the play button again to retry.`);
      }
    }
    if (!this.audioBuffer) {
      throw new Error('No audio data loaded. Please select a different track or check your network connection.');
    }
    
    if (this.isPlayingFlag) {
      this.pause();
      return;
    }

    // Create new source and wire to effect bus input
    if (this.audioContext) {
      this.audioBufferSource = this.audioContext.createBufferSource();
      this.audioBufferSource.buffer = this.audioBuffer;
      // Apply both playback rate and pitch (temporary coupling on buffer path)
      this.audioBufferSource.playbackRate.value = this.playbackRate * this.pitchRatio;
      
      // Connect source to the first module input
      this.audioBufferSource.connect(this.tempoPitchIn);
      
      this.audioBufferSource.onended = () => {
        this.isPlayingFlag = false;
        this.pauseTime = 0;
        // TODO: Emit track end event
      };

      // Gentle fade-in to avoid clicks
      const now = this.audioContext.currentTime;
      const gainParam = this.masterGain?.gain;
      if (gainParam) {
        gainParam.cancelScheduledValues(now);
        const targetVol = this.volume;
        // Start from current value (or 0 if starting from silence)
        const startValue = Math.max(0, Math.min(1, gainParam.value));
        gainParam.setValueAtTime(startValue, now);
        gainParam.linearRampToValueAtTime(targetVol, now + 0.01);
      }

      this.startTime = now - this.pauseTime;
      this.audioBufferSource.start(0, this.pauseTime);
      this.isPlayingFlag = true;
      
      // Resume audio context if it was suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
    }
  } catch (error) {
    console.error('Error in play:', error);
    throw error;
  }
}
```

#### Add proper error handling for Tone.js worklet loading:

```typescript
// In the initializeAudioNodes method
private async initializeAudioNodes(): Promise<void> {
  if (!this.audioContext) {
    throw new Error('AudioContext not initialized');
  }

  try {
    // Master gain node
    this.masterGain = this.audioContext.createGain();
    this.masterGain.connect(this.audioContext.destination);

    // Tempo/Pitch processor
    this.tempoPitchNode = new TonePitchShiftProcessor(this.audioContext);
    await this.tempoPitchNode.init();
    this.tempoPitchIn = this.tempoPitchNode.input;
    this.tempoPitchOut = this.tempoPitchNode.output;
    this.tempoPitchOut.connect(this.masterGain);

    // EQ processor
    this.eqNode = new ToneEQProcessor(this.audioContext);
    await this.eqNode.init();
    this.eqIn = this.eqNode.input;
    this.eqOut = this.eqNode.output;
    this.eqOut.connect(this.tempoPitchIn);

    // Reverb processor
    this.reverbNode = new ToneReverbProcessor(this.audioContext);
    await this.reverbNode.init();
    this.reverbIn = this.reverbNode.input;
    this.reverbOut = this.reverbNode.output;
    this.reverbOut.connect(this.eqIn);

    console.log('All audio nodes initialized successfully');
  } catch (error) {
    console.error('Failed to initialize audio nodes:', error);
    throw new Error(`Audio engine initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try refreshing the page.`);
  }
}
```

### 5.2 Improve AudioEngineWrapper User Interaction Detection

**File:** `src/core/audio/AudioEngineWrapper.ts`

**Current Issues:**
- User interaction detection may not be working correctly
- No proper handling of audio context activation failures
- Generic error messages that don't help users resolve issues

**Changes:**

#### Improve initializeOnUserInteraction method (lines 10-22):

```typescript
// Initialize audio engine on first user interaction
private async initializeOnUserInteraction(): Promise<WebAudioEngine> {
  // Always set hasUserInteracted to true when this method is called
  // This ensures that subsequent calls don't block on user interaction
  this.hasUserInteracted = true;
  
  if (!this.audioEngine) {
    try {
      this.audioEngine = new WebAudioEngine();
      // No need to call initialize since it's done through getAudioContext
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize WebAudioEngine:', error);
      throw new Error(`Failed to initialize audio engine: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  return this.audioEngine;
}
```

#### Improve error handling in all methods (lines 24-42):

```typescript
async loadTrack(track: AudioTrack): Promise<void> {
  try {
    const engine = await this.initializeOnUserInteraction();
    return await engine.loadTrack(track);
  } catch (error) {
    console.error('AudioEngineWrapper failed to load track:', error);
    // Provide more specific error messages based on the error type
    if (error instanceof Error) {
      if (error.message.includes('autoplay') || error.message.includes('activate')) {
        throw new Error('Audio playback blocked by browser. Please click the play button again to start playback.');
      } else if (error.message.includes('worklet') || error.message.includes('initialize')) {
        throw new Error('Audio engine initialization failed. Please try refreshing the page.');
      }
    }
    throw new Error(`Audio engine error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async play(): Promise<void> {
  try {
    const engine = await this.initializeOnUserInteraction();
    return await engine.play();
  } catch (error) {
    console.error('AudioEngineWrapper failed to play:', error);
    // Provide more specific error messages based on the error type
    if (error instanceof Error) {
      if (error.message.includes('autoplay') || error.message.includes('activate')) {
        throw new Error('Audio playback blocked by browser. Please click the play button again to start playback.');
      } else if (error.message.includes('worklet') || error.message.includes('initialize')) {
        throw new Error('Audio engine initialization failed. Please try refreshing the page.');
      } else if (error.message.includes('connect')) {
        throw new Error('Audio connection error. Please try refreshing the page.');
      }
    }
    throw new Error(`Audio engine error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
```

### 5.3 Additional Audio Context Activation Fixes

**File:** `src/hooks/useAudioPlayer.ts`

**Current Issues:**
- Audio context activation still failing despite improvements
- Need to ensure proper user interaction before attempting audio context activation
- Missing explicit user interaction requirements

**Changes:**

#### Add explicit user interaction detection (lines 80-85):

```typescript
export const useAudioPlayer = (): UseAudioPlayerReturn => {
  // Audio engine wrapper
  const [audioEngine] = useState(() => new AudioEngineWrapper());
  
  // Track user interaction state
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  
  // Detect user interaction to enable audio context activation
  useEffect(() => {
    const handleUserInteraction = () => {
      setHasUserInteracted(true);
      // Remove event listeners after first interaction
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
    
    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);
    
    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);
```

#### Enhance togglePlayPause with user interaction check (lines 150-190):

```typescript
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
```

## 6. Playback History Improvements

### 6.1 Fix tuneTONAPI.addPlaybackHistory Function

**File:** `src/utils/tuneton-api.ts`

**Current Issues:**
- Uses Telegram user ID which may not match the database schema
- No error handling for database issues

**Changes:**

#### Update addPlaybackHistory function (lines 540-571):

```typescript
// Playback history management
async addPlaybackHistory(trackData: JamendoTrack, durationPlayed: number = 0, isCompleted: boolean = false): Promise<boolean> {
  try {
    // For now, we'll skip recording playback history due to schema issues
    // This will be re-enabled once the database schema is fixed
    console.warn('Playback history recording temporarily disabled due to schema issues');
    return true;
    
    /*
    const userId = this.getUserId();
    if (!userId) {
      console.warn('User ID not available, cannot record playback history');
      return false;
    }
    
    const { error } = await supabase
      .from('playback_history')
      .insert([
        {
          user_id: userId, // This needs to be a UUID, not Telegram ID
          track_id: trackData.id.toString(),
          track_data: trackData,
          played_at: new Date().toISOString(),
          duration_played: durationPlayed,
          is_completed: isCompleted
        }
      ]);

    if (error) {
      console.error('Error adding playback history:', error);
      return false;
    }

    return true;
    */
  } catch (error) {
    console.error('Error adding playback history:', error);
    return false;
  }
}
```

## 7. Testing Plan

### 7.1 Unit Tests for URL Validation

**File:** `src/components/player/utils.test.ts`

Add new tests for improved URL validation:

```typescript
describe('Enhanced Audio URL Validation', () => {
  it('should validate Jamendo streaming URLs with query parameters', () => {
    expect(isValidAudioUrl('https://prod-1.storage.jamendo.com/?trackid=168&format=mp31&from=hash')).toBe(true);
    expect(isValidAudioUrl('https://api.jamendo.com/v3.0/tracks/file?track_id=12345')).toBe(true);
  });

  it('should validate streaming endpoints', () => {
    expect(isValidAudioUrl('https://example.com/stream/12345')).toBe(true);
    expect(isValidAudioUrl('https://example.com/audio/12345')).toBe(true);
  });

  it('should handle edge cases in URL validation', () => {
    expect(isValidAudioUrl('https://jamendo.com/track/12345')).toBe(true);
    expect(isValidAudioUrl('http://example.com/audio')).toBe(true);
  });
});
```

### 7.2 Integration Tests

1. Test with actual Jamendo track URLs
2. Test error scenarios (invalid URLs, network issues)
3. Test database schema fixes with sample data
4. Test playback history recording (once fixed)
5. Test audio context activation with different browser policies
6. Test Tone.js worklet loading and connections
7. Test audio graph connections and signal flow

## 8. Implementation Order

1. **Database Schema Fixes** (highest priority)
   - Create and apply migration for playback_history foreign key
   - Verify playbacks table fix

2. **Audio URL Validation Improvements** (high priority)
   - Update utils.ts with enhanced validation
   - Add unit tests

3. **Track Data Conversion Improvements** (medium priority)
   - Update convertJamendoToTrack function
   - Add validation and error handling

4. **Audio Player Component Enhancements** (medium priority)
   - Improve error handling in useAudioPlayer
   - Enhance MusicPlayer error display

5. **Audio Context Activation Improvements** (high priority)
   - Improve error handling in WebAudioEngine
   - Enhance user interaction detection in AudioEngineWrapper
   - Add explicit user interaction requirements
   - Fix Tone.js worklet loading and connection issues

6. **Playback History Improvements** (lower priority)
   - Fix tuneTONAPI function
   - Re-enable once database schema is stable

7. **Testing and Validation** (ongoing)
   - Run unit tests
   - Test with actual Jamendo tracks
   - Verify database schema fixes
   - Test audio context activation fixes
   - Test Tone.js worklet loading and connections
   - Test audio graph connections and signal flow

## 9. Rollback Plan

If any changes cause issues:

1. Revert database migrations (if applied)
2. Restore previous versions of modified files
3. Re-deploy previous working version
4. Analyze issues and adjust approach

## 10. Monitoring and Validation

After deployment:

1. Monitor error logs for audio playback issues
2. Track successful vs failed playback attempts
3. Monitor user feedback on error messages
4. Verify that audio context activation issues are resolved
5. Test with different browsers and devices
6. Monitor Tone.js worklet loading and connection success rates
7. Monitor audio graph connection success rates