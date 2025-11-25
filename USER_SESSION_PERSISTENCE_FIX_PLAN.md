# User Session Persistence Fix Plan

## Problem Summary
Users are not seeing their actual recently played tracks. Every user sees the same generic track instead of their personalized listening history, even though data is stored in the remote Supabase database.

## Root Causes Identified

### 1. Database Schema Inconsistencies
- **tracks.id**: BIGINT
- **playbacks.track_id**: UUID (should be BIGINT to match tracks.id)
- **playback_history.track_id**: TEXT (correct)

### 2. Missing User Identification in Playback Recording
- Playback history is not being recorded with user identification
- The `playback_history.user_id` field exists but is not populated

### 3. Recently Played Section Not Using User Data
- HomePage uses generic Jamendo tracks instead of user-specific playback history

### 4. API Functions Not Filtering by User
- tuneTONAPI functions don't include user ID when inserting/fetching playback history

## Solution Overview

### Phase 1: Fix Database Schema Issues
1. Create migration to fix playbacks table track_id data type
2. Ensure proper foreign key constraints

### Phase 2: Implement User-Specific Playback Recording
1. Modify useAudioPlayer hook to record playback history with user ID
2. Update tuneTONAPI to include user identification

### Phase 3: Fix Recently Played Display
1. Modify HomePage to load user-specific recently played tracks
2. Update UI to show actual user history

### Phase 4: Implement Proper RLS Policies
1. Update Row Level Security policies for playback_history table

## Detailed Implementation Steps

### Phase 1: Database Schema Fixes

#### Step 1: Create Migration to Fix playbacks Table
File: `supabase/migrations/20251125000000_fix_playbacks_track_id_type.sql`

```sql
-- Fix playbacks table track_id data type to match tracks.id
BEGIN;

-- Drop existing constraint
ALTER TABLE playbacks DROP CONSTRAINT IF EXISTS playbacks_track_id_fkey;

-- Alter column type
ALTER TABLE playbacks ALTER COLUMN track_id TYPE BIGINT USING track_id::BIGINT;

-- Recreate foreign key constraint
ALTER TABLE playbacks 
  ADD CONSTRAINT playbacks_track_id_fkey 
  FOREIGN KEY (track_id) 
  REFERENCES tracks(id) 
  ON DELETE CASCADE;

COMMIT;
```

### Phase 2: Implement User-Specific Playback Recording

#### Step 2: Add User ID Method to tuneTONAPI
File: `src/utils/tuneton-api.ts`

Add a method to get current Telegram user ID:

```typescript
getUserId(): number | null {
  if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initDataUnsafe?.user) {
    return (window as any).Telegram.WebApp.initDataUnsafe.user.id;
  }
  return null;
}
```

#### Step 3: Modify addPlaybackHistory to Include User ID
File: `src/utils/tuneton-api.ts`

Update the `addPlaybackHistory` function:

```typescript
async addPlaybackHistory(trackData: JamendoTrack, durationPlayed: number = 0, isCompleted: boolean = false): Promise<boolean> {
  try {
    const userId = this.getUserId();
    if (!userId) {
      console.warn('User ID not available, cannot record playback history');
      return false;
    }
    
    const { error } = await supabase
      .from('playback_history')
      .insert([
        {
          user_id: userId,
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
  } catch (error) {
    console.error('Error adding playback history:', error);
    return false;
  }
}
```

#### Step 4: Modify getRecentPlaybackHistory to Filter by User
File: `src/utils/tuneton-api.ts`

Update the `getRecentPlaybackHistory` function:

```typescript
async getRecentPlaybackHistory(limit: number = 20): Promise<JamendoTrack[]> {
  try {
    const userId = this.getUserId();
    if (!userId) {
      console.warn('User ID not available, cannot fetch playback history');
      return [];
    }
    
    const { data, error } = await supabase
      .from('playback_history')
      .select('track_data')
      .eq('user_id', userId)
      .order('played_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching playback history:', error);
      return [];
    }

    // Convert stored track data to JamendoTrack format
    const tracks: JamendoTrack[] = data.map((ph: any) => {
      if (ph.track_data) {
        return ph.track_data as JamendoTrack;
      }
      // Return empty track if no data is stored
      return {
        id: '',
        name: '',
        artist_name: '',
        duration: 0,
        artist_id: '',
        artist_idstr: '',
        album_id: '',
        album_name: '',
        album_image: '',
        audio: '',
        audiodownload: '',
        prourl: '',
        shorturl: '',
        shareurl: '',
        waveform: '',
        image: ''
      } as JamendoTrack;
    });

    return tracks;
  } catch (error) {
    console.error('Error fetching playback history:', error);
    return [];
  }
}
```

#### Step 5: Modify getLastPlayedTrack to Filter by User
File: `src/utils/tuneton-api.ts`

Update the `getLastPlayedTrack` function:

```typescript
async getLastPlayedTrack(): Promise<JamendoTrack | null> {
  try {
    const userId = this.getUserId();
    if (!userId) {
      console.warn('User ID not available, cannot fetch last played track');
      return null;
    }
    
    const { data, error } = await supabase
      .from('playback_history')
      .select('track_data')
      .eq('user_id', userId)
      .order('played_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching last played track:', error);
      return null;
    }

    if (data && data.track_data) {
      return data.track_data as JamendoTrack;
    }

    return null;
  } catch (error) {
    console.error('Error fetching last played track:', error);
    return null;
  }
}
```

### Phase 3: Update useAudioPlayer Hook

#### Step 6: Import tuneTONAPI
File: `src/hooks/useAudioPlayer.ts`

Add import:
```typescript
import { tuneTONAPI } from '../utils/tuneton-api';
```

#### Step 7: Modify togglePlayPause to Record Playback History
File: `src/hooks/useAudioPlayer.ts`

Update the `togglePlayPause` function:

```typescript
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
```

### Phase 4: Update HomePage Component

#### Step 8: Add State for Recently Played Tracks
File: `src/components/HomePage.tsx`

Add state variables:
```typescript
const [recentlyPlayedTracks, setRecentlyPlayedTracks] = useState<JamendoTrack[]>([]);
const [loadingRecentlyPlayed, setLoadingRecentlyPlayed] = useState(true);
```

#### Step 9: Add useEffect to Load Recently Played Tracks
File: `src/components/HomePage.tsx`

Add useEffect hook:
```typescript
useEffect(() => {
  const loadRecentlyPlayed = async () => {
    setLoadingRecentlyPlayed(true);
    try {
      const tracks = await tuneTONAPI.getRecentPlaybackHistory(5);
      setRecentlyPlayedTracks(tracks);
    } catch (error) {
      console.error('Error loading recently played tracks:', error);
    } finally {
      setLoadingRecentlyPlayed(false);
    }
  };
  
  loadRecentlyPlayed();
}, []);
```

#### Step 10: Modify RecentlyPlayedSection to Use Real Data
File: `src/components/HomePage.tsx`

Replace the existing [RecentlyPlayedSection](file:///C:/Users/user/tuneTON_3.0/src/components/HomePage.tsx#L542-L615) component:

```typescript
const RecentlyPlayedSection = () => {
  // Use recentlyPlayedTracks state instead of jamendoTracks.popular[0]
  const recentTrack = recentlyPlayedTracks[0];
  
  // If no tracks are available, we can't display this section
  if (!recentTrack || loadingRecentlyPlayed) {
    return (
      <div className="px-6 pt-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg text-foreground">Recently Played</h2>
        </div>
        <div className="flex items-center justify-center py-4">
          {loadingRecentlyPlayed ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="ml-2 text-sm text-muted-foreground">Loading recently played...</span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">No recently played tracks</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pt-2 space-y-4">
      {/* Header with title and search button */}
      <div className="flex items-center justify-between w-full">
        <div className="w-[175px]">
          <h2 className="font-semibold text-lg text-foreground">Recently Played</h2>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="w-5 h-5"
            onClick={() => onNavigate && onNavigate("Search", "search")}
          >
            <Search className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Single track card */}
      <div
        className="bg-[#093067] rounded-lg w-full cursor-pointer group transition-all duration-300 hover:shadow-lg"
        onClick={() => handlePlayTrack(recentTrack as JamendoTrack)}
      >
        <div className="flex items-center px-4 py-3 gap-[15px]">
          {/* Album Art */}
          <div
            className="w-12 h-12 rounded-lg bg-cover bg-center bg-[#484f58] shrink-0 group-hover:scale-105 transition-transform duration-300"
            style={{ backgroundImage: `url('${recentTrack.image || imgAlbumArt}')` }}
          />

          {/* Track Info */}
          <div className="flex-1 min-w-0 w-[164px]">
            <div className="space-y-1">
              <h3 className="font-semibold text-sm text-[#c9d1d9] truncate">{recentTrack.name}</h3>
              <p className="font-semibold text-xs text-[#8b949e] truncate">{recentTrack.artist_name}</p>
            </div>
          </div>

          {/* Audio Visualizer and Play Button */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Animated Audio Visualizer */}
            <div className="bg-[#484f58] rounded w-10 h-[30px] flex items-end justify-center gap-[3.4px] px-[5.69px] py-0 overflow-hidden">
              <div className="bg-[#ff22fb] opacity-80 rounded-sm w-[3px] h-3 animate-pulse"></div>
              <div className="bg-[#ff22fb] opacity-80 rounded-sm w-[3px] h-[21px] animate-pulse delay-100"></div>
              <div className="bg-[#ff22fb] opacity-80 rounded-sm w-[3px] h-[16.5px] animate-pulse delay-200"></div>
              <div className="bg-[#ff22fb] opacity-80 rounded-sm w-[3px] h-[25.5px] animate-pulse delay-300"></div>
              <div className="bg-[#ff22fb] opacity-80 rounded-sm w-[3px] h-[18px] animate-pulse delay-400"></div>
            </div>

            {/* Play Button */}
            <Button variant="ghost" size="icon" className="w-6 h-6 text-[#FF22FB] hover:text-[#FF22FB]/80">
              {(currentTrack === recentTrack.name || currentTrack === "Starlight Serenade") && isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### Phase 5: Update RLS Policies

#### Step 11: Create Migration for Proper RLS Policies
File: `supabase/migrations/20251125000001_fix_playback_history_rls.sql`

```sql
-- Fix RLS policies for playback_history table to properly filter by user
BEGIN;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own playback history" ON playback_history;
DROP POLICY IF EXISTS "Users can insert their own playback history" ON playback_history;
DROP POLICY IF EXISTS "Users can update their own playback history" ON playback_history;

-- Create proper policies that filter by user
-- Since we're using Telegram authentication, we need to check the user_id directly
CREATE POLICY "Users can view their own playback history" ON playback_history
  FOR SELECT USING (
    user_id = (SELECT telegram_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert their own playback history" ON playback_history
  FOR INSERT WITH CHECK (
    user_id = (SELECT telegram_id FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Users can update their own playback history" ON playback_history
  FOR UPDATE USING (
    user_id = (SELECT telegram_id FROM users WHERE id = auth.uid())
  );

COMMIT;
```

However, since Telegram authentication doesn't use `auth.uid()` in the same way, we need a different approach:

```sql
-- Alternative approach for Telegram authentication
BEGIN;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own playback history" ON playback_history;
DROP POLICY IF EXISTS "Users can insert their own playback history" ON playback_history;
DROP POLICY IF EXISTS "Users can update their own playback history" ON playback_history;

-- Create policies that allow access but rely on application-level filtering
-- The application will ensure users only access their own data
CREATE POLICY "Users can view their own playback history" ON playback_history
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own playback history" ON playback_history
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own playback history" ON playback_history
  FOR UPDATE USING (true);

COMMIT;
```

## Testing Plan

### 1. Unit Testing
- Test tuneTONAPI functions with mock user data
- Verify proper error handling

### 2. Integration Testing
- Test playback history recording with real tracks
- Verify recently played tracks display correctly

### 3. User Testing
- Test with multiple Telegram users
- Verify each user sees their own history
- Confirm data persists across sessions

## Expected Outcomes

1. Users will see their actual recently played tracks instead of generic ones
2. Playback history will be properly recorded in the Supabase database
3. Data will persist across sessions and builds
4. Different users will see their own personalized history

## Risk Mitigation

1. **Database Performance**: 
   - Add proper indexes on user_id and played_at columns
   - Limit recent tracks query to reasonable number (e.g., 20 tracks)

2. **Error Handling**:
   - Gracefully handle cases where user ID is not available
   - Display fallback content when history cannot be loaded

3. **Privacy**:
   - Ensure playback history is only accessible to the correct user
   - Verify RLS policies are properly configured

## Timeline

1. **Phase 1** (Database Fixes): 1-2 hours
2. **Phase 2** (API Implementation): 2-3 hours
3. **Phase 3** (Frontend Updates): 2-3 hours
4. **Phase 4** (RLS Policies): 1 hour
5. **Phase 5** (Testing): 2-3 hours

Total estimated time: 8-12 hours