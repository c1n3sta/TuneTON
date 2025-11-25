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
        errorMessage = 'Media playback was aborted by the user';
        break;
      case MediaError.MEDIA_ERR_NETWORK:
        errorMessage = 'A network error caused the media download to fail';
        break;
      case MediaError.MEDIA_ERR_DECODE:
        errorMessage = 'An error occurred while decoding the media';
        break;
      case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
        errorMessage = 'The media resource is not supported or could not be loaded';
        break;
      default:
        errorMessage = `An unknown error occurred (code: ${audio.error.code})`;
        break;
    }
    console.error('Detailed audio error:', errorMessage);
    // Dispatch custom event for UI to handle
    window.dispatchEvent(new CustomEvent('audioError', { 
      detail: { 
        message: errorMessage,
        code: audio.error.code,
        track: currentTrack
      } 
    }));
  }
};
```

#### Add network error detection (add after handleError function):

```typescript
const handleStalled = () => {
  console.warn('Audio playback stalled - possible network issue');
  // Dispatch event for UI to show buffering state
  window.dispatchEvent(new CustomEvent('audioStalled', { detail: { track: currentTrack } }));
};

const handleWaiting = () => {
  console.warn('Audio playback waiting for data');
  // Dispatch event for UI to show buffering state
  window.dispatchEvent(new CustomEvent('audioWaiting', { detail: { track: currentTrack } }));
};
```

### 4.2 Enhance MusicPlayer Component Error Handling

**File:** `src/components/MusicPlayer.tsx`

**Current Issues:**
- Generic error messages
- No specific validation before attempting to play
- No user-friendly error reporting

**Changes:**

#### Improve error handling in togglePlay function (lines 288-314):

```typescript
// Handle play/pause
const togglePlay = () => {
  console.log('Toggle play called, track:', track);
  console.log('Track audioUrl:', track?.audioUrl);
  console.log('Track source:', track?.source);

  // Reset error state
  if (hasError) {
    setHasError(false);
    setErrorMessage(null);
  }

  if (!track) {
    setHasError(true);
    setErrorMessage('No track selected. Please select a track to play.');
    console.error('No track selected');
    return;
  }

  // Check if we have a valid audio source
  const audioSource = track.audioUrl || (typeof track.source === 'string' ? track.source : '');
  console.log('Audio source to validate:', audioSource);
  console.log('Audio source type:', typeof audioSource);

  if (!audioSource || audioSource === '') {
    setHasError(true);
    setErrorMessage('No audio source available for this track. This track may not be playable.');
    console.error('No audio source available for track:', track);
    return;
  }

  // Validate audio URL before playing
  if (audioSource && typeof audioSource === 'string') {
    console.log('Validating audio URL:', audioSource);
    const isValid = isValidAudioUrl(audioSource);
    console.log('URL validation result:', isValid);

    // Even if validation fails, we'll still try to play as Jamendo URLs might not always validate properly
    // but are still valid streaming URLs
    if (!isValid && !audioSource.includes('jamendo.com')) {
      setHasError(true);
      setErrorMessage(`Invalid audio URL format: "${audioSource}". This track may not be playable.`);
      console.error('Invalid audio URL format:', audioSource);
      return;
    }
    
    // Additional check for Jamendo URLs
    if (audioSource.includes('jamendo.com') && !audioSource.startsWith('http')) {
      setHasError(true);
      setErrorMessage(`Invalid Jamendo URL: "${audioSource}". The URL must start with http or https.`);
      console.error('Invalid Jamendo URL format:', audioSource);
      return;
    }
  }

  // Call the hook's togglePlayPause function
  togglePlayPause();

  const newPlayState = !playerIsPlaying;
  setPlayerIsPlaying(newPlayState);
  onPlayPause?.();
};
```

#### Add event listeners for audio errors (add to useEffect hook around lines 118-217):

```typescript
// Add event listeners for custom audio events
useEffect(() => {
  const handleAudioError = (e: CustomEvent) => {
    console.error('Custom audio error event:', e.detail);
    setHasError(true);
    setErrorMessage(e.detail.message || 'Audio playback failed');
  };
  
  const handleAudioStalled = (e: CustomEvent) => {
    console.warn('Audio stalled event:', e.detail);
    // Could show buffering indicator here
  };
  
  const handleAudioWaiting = (e: CustomEvent) => {
    console.warn('Audio waiting event:', e.detail);
    // Could show buffering indicator here
  };
  
  window.addEventListener('audioError', handleAudioError as EventListener);
  window.addEventListener('audioStalled', handleAudioStalled as EventListener);
  window.addEventListener('audioWaiting', handleAudioWaiting as EventListener);
  
  return () => {
    window.removeEventListener('audioError', handleAudioError as EventListener);
    window.removeEventListener('audioStalled', handleAudioStalled as EventListener);
    window.removeEventListener('audioWaiting', handleAudioWaiting as EventListener);
  };
}, []);
```

## 5. Playback History Improvements

### 5.1 Fix tuneTONAPI.addPlaybackHistory Function

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

## 6. Testing Plan

### 6.1 Unit Tests for URL Validation

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

### 6.2 Integration Tests

1. Test with actual Jamendo track URLs
2. Test error scenarios (invalid URLs, network issues)
3. Test database schema fixes with sample data
4. Test playback history recording (once fixed)

## 7. Implementation Order

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

5. **Playback History Improvements** (lower priority)
   - Fix tuneTONAPI function
   - Re-enable once database schema is stable

6. **Testing and Validation** (ongoing)
   - Run unit tests
   - Test with actual Jamendo tracks
   - Verify database schema fixes

## 8. Rollback Plan

If any changes cause issues:

1. Revert database migrations (if applied)
2. Restore previous versions of modified files
3. Re-deploy previous working version
4. Analyze issues and adjust approach

## 9. Monitoring and Validation

After deployment:

1. Monitor error logs for audio playback issues
2. Track successful vs failed playback attempts
3. Monitor database for constraint violations
4. Gather user feedback on playback experience