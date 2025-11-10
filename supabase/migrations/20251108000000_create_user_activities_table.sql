-- Create user_activities table for tracking social activities
CREATE TABLE IF NOT EXISTS public.user_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id BIGINT REFERENCES public.users(telegram_id) ON DELETE CASCADE NOT NULL,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('play', 'like', 'follow', 'playlist_create', 'comment')),
    target_id TEXT,
    target_type TEXT,
    content TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Ensure legacy deployments receive the timestamp column before we add dependent indexes
ALTER TABLE public.user_activities
    ADD COLUMN IF NOT EXISTS timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL;
    
-- Ensure user_id is BIGINT and references the correct table
DO $$ 
BEGIN
    -- Drop the old foreign key if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_activities_user_id_fkey' 
        AND table_name = 'user_activities'
    ) THEN
        ALTER TABLE public.user_activities DROP CONSTRAINT user_activities_user_id_fkey;
    END IF;
    
    -- Alter column type if needed (safe with IF NOT EXISTS equivalent)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_activities' 
        AND column_name = 'user_id' 
        AND data_type != 'bigint'
    ) THEN
        ALTER TABLE public.user_activities ALTER COLUMN user_id TYPE BIGINT;
    END IF;
    
    -- Add the correct foreign key
    ALTER TABLE public.user_activities 
        ADD CONSTRAINT user_activities_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES public.users(telegram_id) ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
    WHEN others THEN NULL;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_activity_type ON public.user_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activities_timestamp ON public.user_activities(timestamp);
CREATE INDEX IF NOT EXISTS idx_user_activities_target ON public.user_activities(target_id, target_type);

-- Enable RLS
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "User activities are viewable by everyone" ON public.user_activities;
DROP POLICY IF EXISTS "Users can insert their own activities" ON public.user_activities;

-- Users can view all activities (for social feed)
CREATE POLICY "User activities are viewable by everyone" 
ON public.user_activities FOR SELECT 
TO anon, authenticated 
USING (true);

-- Users can insert activities (using Telegram auth, validated at app level)
-- Since Telegram auth doesn't use auth.uid(), we allow authenticated inserts
CREATE POLICY "Users can insert their own activities" 
ON public.user_activities FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Grant permissions
GRANT SELECT, INSERT ON public.user_activities TO anon, authenticated;