-- Add indexes for unindexed foreign keys in remote database tables
-- These tables exist in the remote database but not in the current local schema

DO $$
BEGIN
  -- Add index for albums table
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'albums') THEN
    CREATE INDEX IF NOT EXISTS idx_albums_artist_id ON public.albums (artist_id);
  END IF;
  
  -- Add index for audio_presets table
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'audio_presets') THEN
    CREATE INDEX IF NOT EXISTS idx_audio_presets_user_id ON public.audio_presets (user_id);
  END IF;
  
  -- Add indexes for comments table
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'comments') THEN
    CREATE INDEX IF NOT EXISTS idx_comments_parent_comment_id ON public.comments (parent_comment_id);
    CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments (user_id);
  END IF;
  
  -- Add index for community_posts table
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'community_posts') THEN
    CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON public.community_posts (user_id);
  END IF;
  
  -- Add indexes for content_reports table
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'content_reports') THEN
    CREATE INDEX IF NOT EXISTS idx_content_reports_moderator_user_id ON public.content_reports (moderator_user_id);
    CREATE INDEX IF NOT EXISTS idx_content_reports_reporter_user_id ON public.content_reports (reporter_user_id);
  END IF;
  
  -- Add indexes for contest_entries table
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'contest_entries') THEN
    CREATE INDEX IF NOT EXISTS idx_contest_entries_remix_id ON public.contest_entries (remix_id);
    CREATE INDEX IF NOT EXISTS idx_contest_entries_user_id ON public.contest_entries (user_id);
  END IF;
  
  -- Add indexes for contest_votes table
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'contest_votes') THEN
    CREATE INDEX IF NOT EXISTS idx_contest_votes_entry_id ON public.contest_votes (entry_id);
    CREATE INDEX IF NOT EXISTS idx_contest_votes_voter_id ON public.contest_votes (voter_id);
  END IF;
  
  -- Add index for contests table
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'contests') THEN
    CREATE INDEX IF NOT EXISTS idx_contests_created_by_user_id ON public.contests (created_by_user_id);
  END IF;
  
  -- Add index for nft_collections table
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'nft_collections') THEN
    CREATE INDEX IF NOT EXISTS idx_nft_collections_creator_id ON public.nft_collections (creator_id);
  END IF;
  
  -- Add indexes for playlists table (common table that might exist)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'playlists') THEN
    CREATE INDEX IF NOT EXISTS idx_playlists_user_id ON public.playlists (user_id);
  END IF;
  
  -- Add indexes for playlist_tracks table (common table that might exist)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'playlist_tracks') THEN
    CREATE INDEX IF NOT EXISTS idx_playlist_tracks_playlist_id ON public.playlist_tracks (playlist_id);
    CREATE INDEX IF NOT EXISTS idx_playlist_tracks_track_id ON public.playlist_tracks (track_id);
  END IF;
END
$$;