# Consolidated User Session Persistence Fix Plan

## Problem Summary
Users are not seeing their actual recently played tracks. Every user sees the same generic track instead of their personalized listening history, even though user data is stored in the remote Supabase database.

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

## Current Implementation Status

The following components have already been implemented correctly:

1. **tuneTONAPI** correctly implements:
   - getUserId() method to retrieve Telegram user ID
   - addPlaybackHistory() with user ID inclusion
   - getRecentPlaybackHistory() and getLastPlayedTrack() with user filtering
   - recordUserActivity() with user ID

2. **useAudioPlayer** correctly:
   - Imports tuneTONAPI
   - Records playback history when tracks start playing

3. **HomePage** correctly:
   - Loads user-specific recently played tracks
   - Displays actual user history instead of generic data

## Remaining Issues to Address

### 1. Database Schema Fixes
Create migration to fix the schema inconsistency between tracks.id (BIGINT) and playbacks.track_id (UUID)

### 2. RLS Policy Updates
Update Row Level Security policies for proper user data isolation

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

### Phase 2: Update RLS Policies

#### Step 2: Create Migration for Proper RLS Policies
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
2. **Phase 2** (RLS Policies): 1 hour
3. **Phase 3** (Testing): 2-3 hours

Total estimated time: 4-6 hours