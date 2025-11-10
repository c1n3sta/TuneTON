# TuneTON 3.0 - Detailed Remediation Plan

**Goal:** Transform current implementation into fully functional production-ready application

---

## Phase 1: Critical Database Fixes (2-3 hours)

### Task 1.1: Fix NFT & Contest User ID Types

**Priority:** 🔴 CRITICAL  
**Time:** 1 hour

**Create Migration File:**
`supabase/migrations/20251121000001_fix_nft_contest_user_id_types.sql`

**Actions:**

1. Change all UUID user_id fields to BIGINT
2. Update foreign key constraints to reference users.telegram_id
3. Handle existing data (will be NULL, tables likely empty)

**Affected Tables:**

- contests (created_by_user_id)
- contest_entries (user_id)
- contest_votes (voter_id)
- nft_collections (creator_id)
- nfts (creator_id, owner_id)
- nft_bids (bidder_id)

**Testing:**

```bash
# After creating migration
supabase db push --include-all

# Verify schema
supabase db pull
```

### Task 1.2: Fix RLS Policies for Telegram Auth

**Priority:** 🔴 CRITICAL  
**Time:** 1-2 hours

**Create Migration File:**
`supabase/migrations/20251121000002_fix_rls_policies_for_telegram_auth.sql`

**Option A: Permissive Policies (Quick Fix)**
Update all policies to allow authenticated operations, validate at app level:

```sql
-- Drop and recreate all policies without auth.uid() checks
DROP POLICY IF EXISTS "Users can create contests" ON contests;
CREATE POLICY "Users can create contests" ON contests
  FOR INSERT TO authenticated WITH CHECK (true);
```

**Option B: Proper Auth Integration (Recommended)**
Update telegram-auth edge function to properly set user session, then use auth.uid():

1. Modify edge function to link telegram_id with auth.users
2. Update RLS policies to work with auth.uid()
3. Test session persistence

**Affected Tables:**

- contests (3 policies)
- contest_entries (3 policies)
- contest_votes (2 policies)
- nft_collections (3 policies)
- nfts (4 policies)
- nft_bids (3 policies)
- playlist_tracks (5 policies)

---

## Phase 2: Search Functionality (3-4 hours)

### Task 2.1: Implement Real Search in SearchPage

**Priority:** 🔴 CRITICAL  
**Time:** 2 hours

**File:** `src/components/SearchPage.tsx`

**Changes Required:**

1. **Add State Management:**

```typescript
const [searchQuery, setSearchQuery] = useState("");
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [searchResults, setSearchResults] = useState<{
  tracks: JamendoTrack[];
  artists: JamendoArtist[];
  albums: JamendoAlbum[];
}>({ tracks: [], artists: [], albums: [] });
```

2. **Implement Debounced Search:**

```typescript
useEffect(() => {
  if (!searchQuery.trim()) {
    setSearchResults({ tracks: [], artists: [], albums: [] });
    return;
  }

  const timeoutId = setTimeout(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [tracksData, artistsData, albumsData] = await Promise.all([
        jamendoAPI.searchTracks({
          search: searchQuery,
          limit: 20,
          include: ['musicinfo']
        }),
        jamendoAPI.searchArtists(searchQuery),
        jamendoAPI.searchAlbums(searchQuery)
      ]);

      setSearchResults({
        tracks: tracksData.results,
        artists: artistsData.results,
        albums: albumsData.results
      });
    } catch (err) {
      setError('Failed to search. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, 500); // 500ms debounce

  return () => clearTimeout(timeoutId);
}, [searchQuery]);
```

3. **Update UI to Show Real Data:**

- Replace hardcoded results with `searchResults.tracks.map(...)`
- Add loading skeleton
- Add error message display
- Handle empty results

### Task 2.2: Add Search Filters

**Priority:** 🟡 MEDIUM  
**Time:** 1 hour

**Add Filter Options:**

- Genre filter
- BPM range
- Vocal/Instrumental toggle
- Duration range
- Sort options (popularity, newest, alphabetical)

### Task 2.3: Implement Search History

**Priority:** 🟢 LOW  
**Time:** 1 hour

**Store in localStorage:**

```typescript
const [searchHistory, setSearchHistory] = useState<string[]>(() => {
  const saved = localStorage.getItem('search_history');
  return saved ? JSON.parse(saved) : [];
});

const addToHistory = (query: string) => {
  const updated = [query, ...searchHistory.filter(q => q !== query)].slice(0, 10);
  setSearchHistory(updated);
  localStorage.setItem('search_history', JSON.stringify(updated));
};
```

---

## Phase 3: Activity Tracking System (2 hours)

### Task 3.1: Create Activity Tracking Hook

**Priority:** 🟡 MEDIUM  
**Time:** 30 minutes

**File:** `src/hooks/useActivityTracking.ts`

```typescript
import { supabase } from '../utils/supabase';
import { useTelegramAuth } from '../components/TelegramAuthProvider';

export function useActivityTracking() {
  const { user } = useTelegramAuth();

  const logActivity = async (
    activityType: 'play' | 'like' | 'follow' | 'playlist_create' | 'comment',
    targetId?: string,
    targetType?: string,
    content?: string
  ) => {
    if (!user) {
      console.warn('Cannot log activity: user not authenticated');
      return;
    }

    try {
      const { error } = await supabase.from('user_activities').insert({
        user_id: user.id,
        activity_type: activityType,
        target_id: targetId,
        target_type: targetType,
        content: content,
        timestamp: new Date().toISOString()
      });

      if (error) throw error;

      console.log('Activity logged:', activityType, targetId);
    } catch (error) {
      console.error('Error logging activity:', error);
      // Don't throw - activity logging should be non-blocking
    }
  };

  return { logActivity };
}
```

### Task 3.2: Integrate Activity Logging

**Priority:** 🟡 MEDIUM  
**Time:** 1.5 hours

**Integration Points:**

1. **Track Play Events**
   - File: `src/components/MusicPlayer.tsx`
   - Trigger: On play start

   ```typescript
   const { logActivity } = useActivityTracking();

   const handlePlay = async (track: JamendoTrack) => {
     await logActivity('play', track.id, 'track');
     // ... existing play logic
   };
   ```

2. **Like Events**
   - Files: All track lists, player
   - Trigger: On like button click

   ```typescript
   const handleLike = async (trackId: string) => {
     await logActivity('like', trackId, 'track');
     // ... toggle like state
   };
   ```

3. **Follow Events**
   - File: `src/components/ArtistPage.tsx`
   - Trigger: On follow button click

4. **Playlist Create Events**
   - File: Playlist creation modal
   - Trigger: On playlist created

5. **Comment Events**
   - Files: Track/NFT detail pages
   - Trigger: On comment posted

---

## Phase 4: Playback History Tracking (1-2 hours)

### Task 4.1: Create Playback History Hook

**Priority:** 🟡 MEDIUM  
**Time:** 30 minutes

**File:** `src/hooks/usePlaybackHistory.ts`

```typescript
import { supabase } from '../utils/supabase';
import { useTelegramAuth } from '../components/TelegramAuthProvider';
import { JamendoTrack } from '../utils/jamendo-api';

export function usePlaybackHistory() {
  const { user } = useTelegramAuth();

  const startPlayback = async (track: JamendoTrack) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('playback_history')
        .insert({
          user_id: user.id,
          track_id: track.id,
          track_data: {
            name: track.name,
            artist_name: track.artist_name,
            album_image: track.album_image,
            duration: track.duration
          },
          played_at: new Date().toISOString(),
          duration_played: 0,
          is_completed: false
        })
        .select()
        .single();

      if (error) throw error;
      return data.id; // Return playback ID for updating
    } catch (error) {
      console.error('Error starting playback history:', error);
      return null;
    }
  };

  const updatePlayback = async (
    playbackId: string,
    durationPlayed: number,
    isCompleted: boolean
  ) => {
    try {
      const { error } = await supabase
        .from('playback_history')
        .update({
          duration_played: durationPlayed,
          is_completed: isCompleted
        })
        .eq('id', playbackId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating playback history:', error);
    }
  };

  const getHistory = async (limit: number = 50) => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('playback_history')
        .select('*')
        .eq('user_id', user.id)
        .order('played_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching playback history:', error);
      return [];
    }
  };

  return { startPlayback, updatePlayback, getHistory };
}
```

### Task 4.2: Integrate with Music Player

**Priority:** 🟡 MEDIUM  
**Time:** 1 hour

**File:** `src/components/MusicPlayer.tsx` or `src/hooks/useAudioPlayer.ts`

```typescript
const { startPlayback, updatePlayback } = usePlaybackHistory();
const [currentPlaybackId, setCurrentPlaybackId] = useState<string | null>(null);

// On track start
useEffect(() => {
  if (currentTrack && isPlaying) {
    startPlayback(currentTrack).then(setCurrentPlaybackId);
  }
}, [currentTrack, isPlaying]);

// On progress update (every 10 seconds)
useEffect(() => {
  if (!currentPlaybackId || !isPlaying) return;

  const interval = setInterval(() => {
    const progress = audioEngine.getCurrentTime();
    const duration = currentTrack?.duration || 0;
    const isCompleted = progress >= duration * 0.9; // 90% = completed

    updatePlayback(currentPlaybackId, Math.floor(progress), isCompleted);
  }, 10000); // Update every 10 seconds

  return () => clearInterval(interval);
}, [currentPlaybackId, isPlaying]);
```

---

## Phase 5: Audio Playback Testing & Integration (2-3 hours)

### Task 5.1: Test Jamendo Audio Streaming

**Priority:** 🔴 CRITICAL  
**Time:** 1 hour

**Test Checklist:**

- [ ] Audio loads from Jamendo URLs
- [ ] Playback starts correctly
- [ ] Pause/resume works
- [ ] Seek functionality works
- [ ] Effects apply correctly
- [ ] Volume control works
- [ ] Next/previous track works
- [ ] Queue management works

**Test File:** Create `src/pages/AudioTest.tsx`

```typescript
import { useState, useEffect } from 'react';
import { jamendoAPI } from '../utils/jamendo-api';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

export default function AudioTest() {
  const [tracks, setTracks] = useState([]);
  const { play, pause, isPlaying } = useAudioPlayer();

  useEffect(() => {
    jamendoAPI.getPopularTracks(5).then(data => {
      setTracks(data.results);
    });
  }, []);

  return (
    <div className="p-4">
      <h1>Audio Playback Test</h1>
      {tracks.map(track => (
        <div key={track.id}>
          <button onClick={() => play(track)}>
            {isPlaying ? 'Pause' : 'Play'} {track.name}
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Task 5.2: Fix Audio Streaming Issues

**Priority:** 🔴 CRITICAL  
**Time:** 1-2 hours

**Common Issues & Solutions:**

1. **CORS Errors:**
   - Jamendo streams should allow cross-origin
   - If issues, use proxy

2. **Autoplay Policy:**
   - Already handled in AudioEngine (user interaction required)

3. **Buffer Stalls:**
   - Add preloading logic
   - Implement quality fallback

4. **Mobile Issues:**
   - Test on iOS Safari (WebKit restrictions)
   - Test on Android Chrome

---

## Phase 6: Playlist Management (2-3 hours)

### Task 6.1: Create Playlist Management Hook

**Priority:** 🟡 MEDIUM  
**Time:** 1 hour

**File:** `src/hooks/usePlaylistManagement.ts`

```typescript
import { supabase } from '../utils/supabase';
import { useTelegramAuth } from '../components/TelegramAuthProvider';

export function usePlaylistManagement() {
  const { user } = useTelegramAuth();

  const createPlaylist = async (name: string, description?: string, isPublic: boolean = true) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('user_playlists')
      .insert({
        user_id: user.id,
        name,
        description,
        is_public: isPublic,
        cover_image: null, // TODO: Add cover upload
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const getUserPlaylists = async () => {
    if (!user) return [];

    const { data, error } = await supabase
      .from('user_playlists')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  };

  const addTrackToPlaylist = async (playlistId: string, track: JamendoTrack) => {
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('playlist_tracks')
      .insert({
        playlist_id: playlistId,
        track_id: track.id,
        track_data: {
          name: track.name,
          artist_name: track.artist_name,
          album_image: track.album_image,
          duration: track.duration,
          audio: track.audio
        },
        position: 0, // TODO: Get max position + 1
        added_at: new Date().toISOString()
      });

    if (error) throw error;
  };

  const removeTrackFromPlaylist = async (playlistId: string, trackId: string) => {
    const { error } = await supabase
      .from('playlist_tracks')
      .delete()
      .eq('playlist_id', playlistId)
      .eq('track_id', trackId);

    if (error) throw error;
  };

  const deletePlaylist = async (playlistId: string) => {
    const { error } = await supabase
      .from('user_playlists')
      .delete()
      .eq('id', playlistId);

    if (error) throw error;
  };

  return {
    createPlaylist,
    getUserPlaylists,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    deletePlaylist
  };
}
```

### Task 6.2: Update LibraryPageReal Component

**Priority:** 🟡 MEDIUM  
**Time:** 2 hours

**File:** `src/components/LibraryPageReal.tsx`

Integrate usePlaylistManagement hook and display real playlists.

---

## Phase 7: Error Handling & Polish (4-6 hours)

### Task 7.1: Add Global Error Boundary

**Priority:** 🟡 MEDIUM  
**Time:** 1 hour

**File:** `src/components/ErrorBoundary.tsx`

```typescript
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // TODO: Send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center p-6">
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

Wrap App with ErrorBoundary in `src/main.tsx`.

### Task 7.2: Add Loading States

**Priority:** 🟡 MEDIUM  
**Time:** 2 hours

Add skeleton loaders to:

- SearchPage while searching
- LibraryPage while loading playlists
- HomePage while loading recommendations
- Track lists while loading

### Task 7.3: Add Toast Notifications

**Priority:** 🟢 LOW  
**Time:** 1 hour

**Install:** `npm install sonner`

**File:** `src/components/ToastProvider.tsx`

```typescript
import { Toaster } from 'sonner';

export default function ToastProvider() {
  return <Toaster position="top-center" richColors />;
}
```

Use throughout app for:

- Success messages (playlist created, track liked)
- Error messages (API failures, auth errors)
- Info messages (track added to queue)

### Task 7.4: Implement Retry Logic

**Priority:** 🟢 LOW  
**Time:** 1 hour

**File:** `src/utils/api-client.ts`

```typescript
export async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  maxRetries: number = 3
): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok || response.status < 500) {
        return response;
      }
      // Retry on 5xx errors
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('Max retries exceeded');
}
```

---

## Phase 8: Testing & Quality Assurance (3-4 hours)

### Task 8.1: Manual Testing Checklist

**Priority:** 🔴 CRITICAL  
**Time:** 2 hours

**Test Scenarios:**

#### Authentication

- [ ] App loads in Telegram WebApp
- [ ] User data displays correctly
- [ ] Session persists on reload
- [ ] Theme switches properly

#### Search

- [ ] Search input works
- [ ] Debouncing prevents excessive API calls
- [ ] Results display correctly
- [ ] Empty state shows
- [ ] Error state shows on API failure
- [ ] Can play track from search results

#### Playback

- [ ] Track loads and plays
- [ ] Pause/resume works
- [ ] Seek works
- [ ] Volume control works
- [ ] Effects apply correctly
- [ ] Next/previous track works
- [ ] Queue displays and works

#### Playlists

- [ ] Can create playlist
- [ ] Can add tracks to playlist
- [ ] Can remove tracks from playlist
- [ ] Can delete playlist
- [ ] Playlist displays in library
- [ ] Can play playlist

#### Activity/History

- [ ] Play events logged
- [ ] Like events logged
- [ ] History displays correctly
- [ ] Recently played shows

### Task 8.2: Cross-Device Testing

**Priority:** 🔴 CRITICAL  
**Time:** 1 hour

**Test On:**

- [ ] iOS Safari (Telegram WebView)
- [ ] Android Chrome (Telegram WebView)
- [ ] Desktop Telegram
- [ ] Different screen sizes
- [ ] Slow 3G connection

### Task 8.3: Performance Testing

**Priority:** 🟡 MEDIUM  
**Time:** 1 hour

**Metrics to Check:**

- [ ] Initial load time < 3s
- [ ] Time to first audio playback < 2s
- [ ] Search response time < 500ms
- [ ] Smooth scrolling (60 FPS)
- [ ] Memory usage stable
- [ ] No memory leaks

---

## Phase 9: Documentation (2 hours)

### Task 9.1: API Documentation

**Priority:** 🟢 LOW  
**Time:** 1 hour

Document all edge functions and their usage.

### Task 9.2: Component Documentation

**Priority:** 🟢 LOW  
**Time:** 1 hour

Add JSDoc comments to key components and hooks.

---

## Implementation Timeline

### Day 1 (6-8 hours)

- ✅ Morning: Phase 1 - Critical Database Fixes
- Afternoon: Phase 2 - Search Functionality
- Evening: Testing search integration

### Day 2 (6-8 hours)

- Morning: Phase 3 & 4 - Activity Tracking & Playback History
- Afternoon: Phase 5 - Audio Playback Testing
- Evening: Fix any audio issues

### Day 3 (4-6 hours)

- Morning: Phase 6 - Playlist Management
- Afternoon: Phase 7 - Error Handling & Polish
- Evening: Phase 8 - Testing

### Day 4 (2-3 hours)

- Final testing and bug fixes
- Documentation
- Deployment preparation

**Total Time:** 18-25 hours across 3-4 days

---

## Success Criteria

### Must Have (MVP)

- [x] Database migrations applied ✅
- [ ] NFT/Contest user_id types fixed
- [ ] RLS policies working
- [ ] Real search with Jamendo API
- [ ] Audio playback working
- [ ] Activity logging functional
- [ ] Playback history recording

### Should Have

- [ ] Playlist CRUD operations
- [ ] Error handling and retry logic
- [ ] Loading states everywhere
- [ ] Toast notifications
- [ ] Mobile testing complete

### Nice to Have

- [ ] Search history
- [ ] Advanced filters
- [ ] Offline support
- [ ] PWA features
- [ ] Analytics integration

---

## Rollback Plan

If critical issues arise:

1. **Database Issues:**
   - Keep SQL backups before each migration
   - Can rollback with `supabase db reset`

2. **Code Issues:**
   - Use Git branches for each phase
   - Can revert to working commit

3. **Deployment Issues:**
   - Keep previous version deployed
   - Blue-green deployment strategy

---

**Plan prepared by:** Cascade AI  
**Estimated completion:** 3-4 days of focused work  
**Next action:** Create Phase 1 migration files
