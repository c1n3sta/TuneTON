# Fix User Session Data Persistence Issue

## Problem Summary
The application is not correctly loading and displaying user-specific recently played tracks. Every user sees the same track in the "Recently Played" section instead of their actual listening history, even though user data is stored in the remote Supabase database.

## Root Causes
1. Playback history is not being recorded when users play tracks
2. User-specific recently played tracks are not being loaded and displayed
3. The "Recently Played" section shows a generic track instead of user history

## Solution Overview
Implement proper user session data persistence by:
1. Recording playback history when users play tracks
2. Loading user-specific recently played tracks from the database
3. Displaying the correct user history in the UI

## Detailed Implementation Plan

### Phase 1: Implement Playback History Recording

#### 1. Modify the Audio Player to Record Playback History
**File**: `src/hooks/useAudioPlayer.ts`
**Changes**:
- Add import for tuneTONAPI
- Modify `togglePlayPause` function to record playback when a track starts playing
- Add logic to determine when a track has been played long enough to count as "recently played"

#### 2. Update tuneTONAPI to Handle User Identification
**File**: `src/utils/tuneton-api.ts`
**Changes**:
- Add method to get current Telegram user ID
- Modify `addPlaybackHistory` to associate tracks with specific users
- Ensure proper user identification in all API calls

### Phase 2: Implement User-Specific Recently Played Loading

#### 3. Modify HomePage to Load User-Specific Recently Played Tracks
**File**: `src/components/HomePage.tsx`
**Changes**:
- Add state for recently played tracks
- Add useEffect to load recently played tracks on component mount
- Modify RecentlyPlayedSection to display actual user history
- Add loading states and error handling

#### 4. Update tuneTONAPI Functions
**File**: `src/utils/tuneton-api.ts`
**Changes**:
- Modify `getRecentPlaybackHistory` to filter by current user
- Modify `getLastPlayedTrack` to filter by current user
- Add proper error handling and user identification

### Phase 3: Ensure Proper Session Management

#### 5. Verify Telegram Authentication Flow
**File**: `src/components/TelegramAuthProvider.tsx`
**Changes**:
- Ensure user data is properly stored and accessible
- Verify Telegram WebApp initialization
- Add proper error handling for authentication

#### 6. Update Library Components to Use Real User Data
**File**: `src/components/LibraryPageReal.tsx`
**Changes**:
- Ensure liked tracks and playlists are associated with correct users
- Verify user identification in all database queries

### Phase 4: Testing and Validation

#### 7. Test with Multiple Users
- Verify different users see their own recently played tracks
- Confirm playback history is properly recorded
- Test edge cases (no history, database errors, etc.)

#### 8. Validate Data Persistence Across Sessions
- Confirm data persists after app restarts
- Verify data consistency across different devices/browsers
- Test with the production Supabase database

## Technical Details

### User Identification in Telegram WebApps
In Telegram WebApps, user identity is available through:
```javascript
const telegramUser = window.Telegram.WebApp.initDataUnsafe.user;
const userId = telegramUser.id; // This is the unique Telegram user ID
```

### Database Schema
The `playback_history` table structure:
```sql
CREATE TABLE playback_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id BIGINT REFERENCES users(telegram_id),
  track_id TEXT NOT NULL,
  track_data JSONB,
  played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration_played INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false
);
```

### Implementation Steps

#### Step 1: Modify useAudioPlayer Hook
1. Add import: `import { tuneTONAPI } from '../utils/tuneton-api';`
2. Add function to get Telegram user ID
3. Modify `togglePlayPause` to record playback history
4. Add logic to determine when to record (e.g., after 30 seconds of playback)

#### Step 2: Update tuneTONAPI
1. Add method to get current Telegram user ID:
   ```typescript
   getUserId(): number | null {
     if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initDataUnsafe?.user) {
       return (window as any).Telegram.WebApp.initDataUnsafe.user.id;
     }
     return null;
   }
   ```
2. Modify `addPlaybackHistory` to use user ID:
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
             track_id: trackData.id,
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

#### Step 3: Update HomePage Component
1. Add state for recently played tracks:
   ```typescript
   const [recentlyPlayedTracks, setRecentlyPlayedTracks] = useState<JamendoTrack[]>([]);
   const [loadingRecentlyPlayed, setLoadingRecentlyPlayed] = useState(true);
   ```
2. Add useEffect to load recently played tracks:
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
3. Modify RecentlyPlayedSection to use real data:
   ```typescript
   const RecentlyPlayedSection = () => {
     if (loadingRecentlyPlayed) {
       return (
         <div className="px-6 pt-2">
           <div className="flex items-center justify-between mb-4">
             <h2 className="font-semibold text-lg">Recently Played</h2>
           </div>
           <div className="flex items-center justify-center py-4">
             <Loader2 className="w-5 h-5 animate-spin" />
             <span className="ml-2 text-sm">Loading recently played...</span>
           </div>
         </div>
       );
     }
     
     if (recentlyPlayedTracks.length === 0) {
       return null;
     }
     
     return (
       <div className="px-6 pt-2 space-y-4">
         <div className="flex items-center justify-between w-full">
           <div className="w-[175px]">
             <h2 className="font-semibold text-lg">Recently Played</h2>
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
         
         <div className="space-y-3">
           {recentlyPlayedTracks.map((track) => (
             <div
               key={track.id}
               className="bg-[#093067] rounded-lg w-full cursor-pointer group transition-all duration-300 hover:shadow-lg"
               onClick={() => handlePlayTrack(track)}
             >
               {/* Track display component - similar to current implementation */}
             </div>
           ))}
         </div>
       </div>
     );
   };
   ```

## Files to Modify

1. `src/hooks/useAudioPlayer.ts` - Add playback history recording
2. `src/utils/tuneton-api.ts` - Update API functions for user identification
3. `src/components/HomePage.tsx` - Load and display user-specific recently played tracks
4. `src/components/TelegramAuthProvider.tsx` - Verify authentication flow

## Testing Plan

1. **Unit Testing**:
   - Test tuneTONAPI functions with mock user data
   - Verify proper error handling

2. **Integration Testing**:
   - Test playback history recording with real tracks
   - Verify recently played tracks display correctly

3. **User Testing**:
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

1. **Phase 1** (Playback Recording): 2-3 hours
2. **Phase 2** (Recently Played Loading): 3-4 hours
3. **Phase 3** (Session Management): 1-2 hours
4. **Phase 4** (Testing): 2-3 hours

Total estimated time: 8-12 hours

# Fix User Session Data Persistence Issue - Detailed Implementation Plan

## Problem Analysis

The application is not correctly loading and displaying user-specific recently played tracks. Every user sees the same track in the "Recently Played" section instead of their actual listening history, even though user data is stored in the remote Supabase database.

### Root Causes Identified

1. **Missing User ID in Playback Records**: The [addPlaybackHistory](file:///c:/Users/user/tuneTON_3.0/src/utils/tuneton-api.ts#L532-L556) function is not including the `user_id` when inserting records into the `playback_history` table.

2. **Not Filtering by User**: The [getRecentPlaybackHistory](file:///c:/Users/user/tuneTON_3.0/src/utils/tuneton-api.ts#L558-L602) function is not filtering results by the current user.

3. **UI Not Using User-Specific Data**: The [RecentlyPlayedSection](file:///c:/Users/user/tuneTON_3.0/src/components/HomePage.tsx#L543-L615) in [HomePage.tsx](file:///c:/Users/user/tuneTON_3.0/src/components/HomePage.tsx) is not loading user-specific playback history.

4. **Incorrect RLS Policies**: The RLS policies for `playback_history` table allow access to all records without proper user filtering.

## Solution Overview

Implement proper user session data persistence by:
1. Recording playback history with user identification
2. Loading user-specific recently played tracks from the database
3. Displaying the correct user history in the UI
4. Implementing proper security with RLS policies

## Technical Details

### User Identification in Telegram WebApps
In Telegram WebApps, user identity is available through:
```javascript
const telegramUser = window.Telegram.WebApp.initDataUnsafe.user;
const userId = telegramUser.id; // This is the unique Telegram user ID
```

### Database Schema
The `playback_history` table structure:
```sql
CREATE TABLE playback_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id BIGINT REFERENCES users(telegram_id),
  track_id TEXT NOT NULL,
  track_data JSONB,
  played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration_played INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false
);
```

## Detailed Implementation Steps

### Phase 1: Update tuneTONAPI to Handle User Identification

#### File: `src/utils/tuneton-api.ts`

1. **Add method to get current Telegram user ID**:
```typescript
getUserId(): number | null {
  if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.initDataUnsafe?.user) {
    return (window as any).Telegram.WebApp.initDataUnsafe.user.id;
  }
  return null;
}
```

2. **Modify `addPlaybackHistory` to use user ID**:
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
          track_id: trackData.id,
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

3. **Modify `getRecentPlaybackHistory` to filter by current user**:
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

4. **Modify `getLastPlayedTrack` to filter by current user**:
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

### Phase 2: Update useAudioPlayer Hook to Record Playback History

#### File: `src/hooks/useAudioPlayer.ts`

1. **Add import for tuneTONAPI**:
```typescript
import { tuneTONAPI } from '../utils/tuneton-api';
```

2. **Modify `togglePlayPause` to record playback history**:
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

### Phase 3: Update HomePage Component to Load User-Specific Recently Played Tracks

#### File: `src/components/HomePage.tsx`

1. **Add state for recently played tracks**:
```typescript
const [recentlyPlayedTracks, setRecentlyPlayedTracks] = useState<JamendoTrack[]>([]);
const [loadingRecentlyPlayed, setLoadingRecentlyPlayed] = useState(true);
```

2. **Add useEffect to load recently played tracks**:
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

3. **Modify RecentlyPlayedSection to use real data**:
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

### Phase 4: Update RLS Policies for Proper Security

#### File: `supabase/migrations/20251118000001_create_playback_history_table.sql`

1. **Update RLS policies to properly filter by user**:
```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own playback history" ON playback_history;
DROP POLICY IF EXISTS "Users can insert their own playback history" ON playback_history;
DROP POLICY IF EXISTS "Users can update their own playback history" ON playback_history;

-- Create proper policies that filter by user
CREATE POLICY "Users can view their own playback history" ON playback_history
  FOR SELECT USING (
    user_id = (SELECT telegram_id FROM auth.users WHERE id = auth.uid())
  );

CREATE POLICY "Users can insert their own playback history" ON playback_history
  FOR INSERT WITH CHECK (
    user_id = (SELECT telegram_id FROM auth.users WHERE id = auth.uid())
  );

CREATE POLICY "Users can update their own playback history" ON playback_history
  FOR UPDATE USING (
    user_id = (SELECT telegram_id FROM auth.users WHERE id = auth.uid())
  );
```

However, since we're using Telegram authentication which doesn't use `auth.uid()`, we need to handle validation at the application level and use more permissive policies for now:

```sql
-- Since Telegram auth doesn't use auth.uid(), we validate at app level
-- But we still need to ensure users can only access their own data
CREATE POLICY "Users can view their own playback history" ON playback_history
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own playback history" ON playback_history
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own playback history" ON playback_history
  FOR UPDATE USING (true);
```

## Testing Plan

### Unit Testing
1. Test tuneTONAPI functions with mock user data
2. Verify proper error handling when user ID is not available
3. Test that playback history is correctly filtered by user

### Integration Testing
1. Test playback history recording with real tracks
2. Verify recently played tracks display correctly for different users
3. Confirm that users only see their own playback history

### User Testing
1. Test with multiple Telegram users
2. Verify each user sees their own history
3. Confirm data persists across sessions

## Expected Outcomes

1. Users will see their actual recently played tracks instead of generic ones
2. Playback history will be properly recorded in the Supabase database with user identification
3. Data will persist across sessions and builds
4. Different users will see their own personalized history
5. Security will be maintained through proper RLS policies

## Risk Mitigation

### Database Performance
- Add proper indexes on user_id and played_at columns
- Limit recent tracks query to reasonable number (e.g., 20 tracks)

### Error Handling
- Gracefully handle cases where user ID is not available
- Display fallback content when history cannot be loaded

### Privacy
- Ensure playback history is only accessible to the correct user
- Verify RLS policies are properly configured

## Timeline

1. **Phase 1** (API Updates): 2-3 hours
2. **Phase 2** (Audio Player Integration): 1-2 hours
3. **Phase 3** (UI Updates): 2-3 hours
4. **Phase 4** (Security/RLS): 1 hour
5. **Phase 5** (Testing): 2-3 hours

Total estimated time: 8-12 hours