# Remote Supabase Database Schema and Edge Functions

This document provides the actual database schema and edge function information extracted from the remote Supabase production environment.

## Database Connectivity Verification

- **Remote Database URL**: `https://dthrpvpuzinmevrvqlhv.supabase.co`
- **Authentication Method**: Service Role Key
- **Connection Status**: ✅ Successfully connected and queried
- **Schema**: public

## Database Tables

### 1. users
**Description**: Main user table storing Telegram WebApp user information and TuneTON-specific data.

**Columns**:
- `id` (number) - Primary key, auto-incrementing user ID
- `telegram_id` (number) - Telegram user ID from WebApp
- `telegram_username` (object) - Telegram username (nullable)
- `first_name` (string) - User's first name from Telegram
- `last_name` (string) - User's last name from Telegram (nullable)
- `telegram_photo_url` (object) - URL to user's Telegram profile photo (nullable)
- `is_premium` (boolean) - Whether the Telegram user has premium status
- `is_verified` (boolean) - User verification status within TuneTON
- `level` (number) - User level based on activity
- `stars_balance` (number) - User's star currency balance
- `ton_wallet_address` (object) - Associated TON blockchain wallet address (nullable)
- `total_remixes` (number) - Total number of remixes created by user
- `total_likes_received` (number) - Total likes received on user's content
- `total_plays` (number) - Total plays of user's content
- `default_audio_profile` (object) - User's default audio effect settings (nullable)
- `privacy_settings` (object) - User's privacy preferences (nullable)
- `created_at` (string) - Timestamp when user record was created
- `updated_at` (string) - Timestamp when user record was last updated
- `last_active_at` (string) - Timestamp of user's last activity
- `onboarding_completed_at` (object) - Timestamp when user completed onboarding (nullable)

### 2. tracks
**Description**: Music track metadata and information.

**Columns**:
- `id` (number) - Primary key, auto-incrementing track ID
- `artist_id` (object) - Reference to artist (nullable)
- `album_id` (object) - Reference to album (nullable)
- `title` (string) - Track title
- `slug` (string) - URL-friendly track identifier
- `duration` (number) - Track duration in seconds
- `file_url` (string) - URL to audio file
- `cover_url` (object) - URL to track cover art (nullable)
- `genre` (object) - Track genre classification (nullable)
- `bpm` (object) - Beats per minute (nullable)
- `key_signature` (object) - Musical key signature (nullable)
- `energy_level` (object) - Energy level classification (nullable)
- `audio_features` (object) - Detailed audio analysis data (nullable)
- `license_info` (object) - Licensing information (nullable)
- `play_count` (number) - Number of times track has been played
- `like_count` (number) - Number of likes received
- `remix_count` (number) - Number of remixes created from this track
- `created_at` (string) - Timestamp when track record was created

### 3. playback_history
**Description**: User listening history and playback tracking.

**Columns**:
- `id` (string) - Unique playback session ID
- `user_id` (number) - Reference to user who played the track
- `track_id` (string) - Reference to the played track
- `track_data` (object) - Cached track metadata at time of playback
- `played_at` (string) - Timestamp when playback started
- `duration_played` (number) - Duration of playback in seconds
- `is_completed` (boolean) - Whether playback was completed (listened to end)

### 4. Empty Tables
The following tables exist in the database schema but are currently empty:
- `playlists` - User-created music playlists
- `playlist_tracks` - Junction table for playlist-track relationships
- `user_follows` - User following relationships
- `comments` - User comments on tracks/playlists
- `nfts` - Music NFT metadata and ownership
- `contests` - Music contest information
- `contest_entries` - User submissions to contests
- `contest_votes` - Voting data for contest entries
- `user_achievements` - User achievement unlocks

## Edge Functions

### 1. jamendo-proxy
**Path**: `supabase/functions/jamendo-proxy/`
**Description**: Proxy function for accessing Jamendo API to avoid CORS issues
**Files**:
- `index.ts` - Main function implementation
- `function.json` - Function configuration
- `import_map.json` - Dependency mapping

### 2. telegram-auth
**Path**: `supabase/functions/telegram-auth/`
**Description**: Telegram WebApp authentication verification using HMAC-SHA256
**Files**:
- `index.ts` - Main function implementation
- `index.ts.backup` - Backup of previous version

### 3. Other Functions
Additional edge functions deployed in the production environment:
- `health` - System health check endpoint
- `hello` - Simple test function
- `playbacks` - Playback-related operations
- `tracks` - Track management operations
- `test` - General testing functions
- `test-db-schema` - Database schema testing

## Database Relationships

Based on the schema analysis, the following relationships can be inferred:
- `users` ←→ `playback_history` (one-to-many)
- `tracks` ←→ `playback_history` (one-to-many)
- `users` ←→ `playlists` (one-to-many)
- `playlists` ←→ `playlist_tracks` (one-to-many)
- `tracks` ←→ `playlist_tracks` (one-to-many)
- `users` ←→ `user_follows` (self-referential many-to-many)
- `users` ←→ `comments` (one-to-many)
- `tracks` ←→ `comments` (one-to-many)
- `users` ←→ `nfts` (one-to-many)
- `users` ←→ `contests` (one-to-many)
- `contests` ←→ `contest_entries` (one-to-many)
- `users` ←→ `contest_entries` (one-to-many)
- `contest_entries` ←→ `contest_votes` (one-to-many)
- `users` ←→ `contest_votes` (one-to-many)
- `users` ←→ `user_achievements` (one-to-many)
- `achievements` ←→ `user_achievements` (one-to-many)

## Row Level Security (RLS)

All tables in the database implement Row Level Security policies to ensure data isolation between users. The specific policies are implemented in the database migrations and enforce that users can only access their own data.

## Conclusion

The remote Supabase database contains a comprehensive schema for supporting the TuneTON music application with proper relationships between users, tracks, playlists, social features, NFT functionality, and contest systems. The edge functions provide serverless backend capabilities for authentication, external API access, and specialized operations.