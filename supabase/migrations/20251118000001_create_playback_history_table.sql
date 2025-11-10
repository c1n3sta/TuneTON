-- Create playback_history table to track user listening history
CREATE TABLE IF NOT EXISTS playback_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id BIGINT REFERENCES public.users(telegram_id) ON DELETE CASCADE,
  track_id TEXT NOT NULL,
  track_data JSONB,
  played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration_played INTEGER DEFAULT 0, -- seconds played
  is_completed BOOLEAN DEFAULT false -- whether the track was played to completion
);

-- Ensure user_id is BIGINT and references the correct table
DO $$ 
BEGIN
    -- Drop the old foreign key if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'playback_history_user_id_fkey' 
        AND table_name = 'playback_history'
    ) THEN
        ALTER TABLE playback_history DROP CONSTRAINT playback_history_user_id_fkey;
    END IF;
    
    -- Alter column type if needed
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'playback_history' 
        AND column_name = 'user_id' 
        AND data_type != 'bigint'
    ) THEN
        ALTER TABLE playback_history ALTER COLUMN user_id TYPE BIGINT;
    END IF;
    
    -- Add the correct foreign key
    ALTER TABLE playback_history 
        ADD CONSTRAINT playback_history_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES public.users(telegram_id) ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
    WHEN others THEN NULL;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_playback_history_user_id ON playback_history(user_id);
CREATE INDEX IF NOT EXISTS idx_playback_history_track_id ON playback_history(track_id);
CREATE INDEX IF NOT EXISTS idx_playback_history_played_at ON playback_history(played_at);
CREATE INDEX IF NOT EXISTS idx_playback_history_user_track ON playback_history(user_id, track_id);

-- Enable Row Level Security
ALTER TABLE playback_history ENABLE ROW LEVEL SECURITY;

-- Create policies for playback_history
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own playback history" ON playback_history;
DROP POLICY IF EXISTS "Users can insert their own playback history" ON playback_history;
DROP POLICY IF EXISTS "Users can update their own playback history" ON playback_history;

-- Since Telegram auth doesn't use auth.uid(), we allow access with validation at app level
CREATE POLICY "Users can view their own playback history" ON playback_history
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own playback history" ON playback_history
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own playback history" ON playback_history
  FOR UPDATE USING (true);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON playback_history TO anon;
GRANT ALL ON playback_history TO service_role;