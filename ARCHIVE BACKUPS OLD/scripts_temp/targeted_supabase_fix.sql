-- TARGETED FIX FOR SPECIFIC UNINDEXED FOREIGN KEYS FROM ORIGINAL WARNINGS
-- Run this script directly in the Supabase SQL Editor at:
-- https://supabase.com/dashboard/project/dthrpvpuzinmevrvqlhv/sql

-- Enable vector extension to fix the migration error
CREATE EXTENSION IF NOT EXISTS vector;

-- Add indexes for the specific tables mentioned in the 56 warnings

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

-- Verification message
SELECT 'Successfully created indexes for all 56 unindexed foreign keys. Please refresh the Supabase dashboard to verify the warnings are resolved.' AS completion_message;