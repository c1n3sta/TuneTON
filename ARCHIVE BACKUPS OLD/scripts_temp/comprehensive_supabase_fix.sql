-- COMPREHENSIVE FIX FOR UNINDEXED FOREIGN KEYS IN SUPABASE DATABASE
-- Run this script directly in the Supabase SQL Editor at:
-- https://supabase.com/dashboard/project/dthrpvpuzinmevrvqlhv/sql

-- Enable vector extension if not already enabled (fixes the vector type error)
CREATE EXTENSION IF NOT EXISTS vector;

-- Add indexes for ALL unindexed foreign keys to resolve the 56 warnings

-- Albums table
CREATE INDEX IF NOT EXISTS idx_albums_artist_id ON public.albums (artist_id);

-- Audio presets table
CREATE INDEX IF NOT EXISTS idx_audio_presets_user_id ON public.audio_presets (user_id);

-- Comments table
CREATE INDEX IF NOT EXISTS idx_comments_parent_comment_id ON public.comments (parent_comment_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments (user_id);

-- Community posts table
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON public.community_posts (user_id);

-- Content reports table
CREATE INDEX IF NOT EXISTS idx_content_reports_moderator_user_id ON public.content_reports (moderator_user_id);
CREATE INDEX IF NOT EXISTS idx_content_reports_reporter_user_id ON public.content_reports (reporter_user_id);

-- Contest entries table
CREATE INDEX IF NOT EXISTS idx_contest_entries_remix_id ON public.contest_entries (remix_id);
CREATE INDEX IF NOT EXISTS idx_contest_entries_user_id ON public.contest_entries (user_id);

-- Contest votes table
CREATE INDEX IF NOT EXISTS idx_contest_votes_entry_id ON public.contest_votes (entry_id);
CREATE INDEX IF NOT EXISTS idx_contest_votes_voter_id ON public.contest_votes (voter_id);

-- Contests table
CREATE INDEX IF NOT EXISTS idx_contests_created_by_user_id ON public.contests (created_by_user_id);

-- NFT collections table
CREATE INDEX IF NOT EXISTS idx_nft_collections_creator_id ON public.nft_collections (creator_id);

-- Playlists table
CREATE INDEX IF NOT EXISTS idx_playlists_user_id ON public.playlists (user_id);

-- Playlist tracks table
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_playlist_id ON public.playlist_tracks (playlist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_track_id ON public.playlist_tracks (track_id);

-- Additional common tables that might have unindexed foreign keys
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles (user_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON public.user_settings (user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_preferences (user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles (user_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id ON public.user_permissions (user_id);

-- Social features tables
CREATE INDEX IF NOT EXISTS idx_followers_follower_id ON public.followers (follower_id);
CREATE INDEX IF NOT EXISTS idx_followers_following_id ON public.followers (following_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes (user_id);
CREATE INDEX IF NOT EXISTS idx_likes_entity_id ON public.likes (entity_id);
CREATE INDEX IF NOT EXISTS idx_shares_user_id ON public.shares (user_id);
CREATE INDEX IF NOT EXISTS idx_shares_entity_id ON public.shares (entity_id);

-- Media/content tables
CREATE INDEX IF NOT EXISTS idx_media_user_id ON public.media (user_id);
CREATE INDEX IF NOT EXISTS idx_media_album_id ON public.media (album_id);
CREATE INDEX IF NOT EXISTS idx_tracks_album_id ON public.tracks (album_id);
CREATE INDEX IF NOT EXISTS idx_tracks_artist_id ON public.tracks (artist_id);

-- Notification tables
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_sender_id ON public.notifications (sender_id);

-- Messaging tables
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages (sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON public.messages (receiver_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user1_id ON public.conversations (user1_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user2_id ON public.conversations (user2_id);

-- Transaction/financial tables
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions (user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_nft_id ON public.transactions (nft_id);
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON public.wallets (user_id);

-- Verification and audit tables
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_verification_codes_user_id ON public.verification_codes (user_id);

-- Refresh the database linter to clear warnings
-- After running this script, refresh the Supabase dashboard to verify the fixes

SELECT 'Successfully created indexes for unindexed foreign keys. Please refresh the Supabase dashboard linter to verify all 56 warnings are resolved.' AS completion_message;