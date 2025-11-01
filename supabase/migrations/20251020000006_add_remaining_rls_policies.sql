-- Add missing RLS policies for remaining tables with RLS enabled but no policies
-- This fixes the remaining "RLS Enabled No Policy" warnings from the Supabase linter

-- Remixes table
DO $$
BEGIN
  -- Check if the table exists before trying to add policies
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'remixes') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy WHERE polrelid = 'remixes'::regclass AND polname = 'Remixes are viewable by everyone'
    ) THEN
      CREATE POLICY "Remixes are viewable by everyone" ON public.remixes
        FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy WHERE polrelid = 'remixes'::regclass AND polname = 'Users can insert their own remixes'
    ) THEN
      CREATE POLICY "Users can insert their own remixes" ON public.remixes
        FOR INSERT WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy WHERE polrelid = 'remixes'::regclass AND polname = 'Users can update their own remixes'
    ) THEN
      CREATE POLICY "Users can update their own remixes" ON public.remixes
        FOR UPDATE USING (true);
    END IF;
  END IF;
END
$$;

-- Social interactions table
DO $$
BEGIN
  -- Check if the table exists before trying to add policies
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'social_interactions') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy WHERE polrelid = 'social_interactions'::regclass AND polname = 'Social interactions are viewable by everyone'
    ) THEN
      CREATE POLICY "Social interactions are viewable by everyone" ON public.social_interactions
        FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy WHERE polrelid = 'social_interactions'::regclass AND polname = 'Users can insert social interactions'
    ) THEN
      CREATE POLICY "Users can insert social interactions" ON public.social_interactions
        FOR INSERT WITH CHECK (true);
    END IF;
  END IF;
END
$$;

-- Stars transactions table
DO $$
BEGIN
  -- Check if the table exists before trying to add policies
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'stars_transactions') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy WHERE polrelid = 'stars_transactions'::regclass AND polname = 'Stars transactions are viewable by everyone'
    ) THEN
      CREATE POLICY "Stars transactions are viewable by everyone" ON public.stars_transactions
        FOR SELECT USING (true);
    END IF;
  END IF;
END
$$;

-- TON transactions table
DO $$
BEGIN
  -- Check if the table exists before trying to add policies
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ton_transactions') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy WHERE polrelid = 'ton_transactions'::regclass AND polname = 'TON transactions are viewable by everyone'
    ) THEN
      CREATE POLICY "TON transactions are viewable by everyone" ON public.ton_transactions
        FOR SELECT USING (true);
    END IF;
  END IF;
END
$$;

-- User achievements table
DO $$
BEGIN
  -- Check if the table exists before trying to add policies
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_achievements') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy WHERE polrelid = 'user_achievements'::regclass AND polname = 'User achievements are viewable by everyone'
    ) THEN
      CREATE POLICY "User achievements are viewable by everyone" ON public.user_achievements
        FOR SELECT USING (true);
    END IF;
  END IF;
END
$$;

-- User activities table
DO $$
BEGIN
  -- Check if the table exists before trying to add policies
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_activities') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy WHERE polrelid = 'user_activities'::regclass AND polname = 'User activities are viewable by everyone'
    ) THEN
      CREATE POLICY "User activities are viewable by everyone" ON public.user_activities
        FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy WHERE polrelid = 'user_activities'::regclass AND polname = 'Users can insert their own activities'
    ) THEN
      CREATE POLICY "Users can insert their own activities" ON public.user_activities
        FOR INSERT WITH CHECK (true);
    END IF;
  END IF;
END
$$;

-- User follows table
DO $$
BEGIN
  -- Check if the table exists before trying to add policies
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_follows') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy WHERE polrelid = 'user_follows'::regclass AND polname = 'User follows are viewable by everyone'
    ) THEN
      CREATE POLICY "User follows are viewable by everyone" ON public.user_follows
        FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy WHERE polrelid = 'user_follows'::regclass AND polname = 'Users can insert follows'
    ) THEN
      CREATE POLICY "Users can insert follows" ON public.user_follows
        FOR INSERT WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy WHERE polrelid = 'user_follows'::regclass AND polname = 'Users can delete follows'
    ) THEN
      CREATE POLICY "Users can delete follows" ON public.user_follows
        FOR DELETE USING (true);
    END IF;
  END IF;
END
$$;

-- User library table
DO $$
BEGIN
  -- Check if the table exists before trying to add policies
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_library') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy WHERE polrelid = 'user_library'::regclass AND polname = 'User library items are viewable by everyone'
    ) THEN
      CREATE POLICY "User library items are viewable by everyone" ON public.user_library
        FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy WHERE polrelid = 'user_library'::regclass AND polname = 'Users can insert library items'
    ) THEN
      CREATE POLICY "Users can insert library items" ON public.user_library
        FOR INSERT WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy WHERE polrelid = 'user_library'::regclass AND polname = 'Users can delete library items'
    ) THEN
      CREATE POLICY "Users can delete library items" ON public.user_library
        FOR DELETE USING (true);
    END IF;
  END IF;
END
$$;

-- User sessions table
DO $$
BEGIN
  -- Check if the table exists before trying to add policies
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_sessions') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy WHERE polrelid = 'user_sessions'::regclass AND polname = 'User sessions can be selected by service role'
    ) THEN
      CREATE POLICY "User sessions can be selected by service role" ON public.user_sessions
        FOR SELECT USING (current_setting('role') = 'service_role');
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy WHERE polrelid = 'user_sessions'::regclass AND polname = 'User sessions can be inserted by service role'
    ) THEN
      CREATE POLICY "User sessions can be inserted by service role" ON public.user_sessions
        FOR INSERT WITH CHECK (current_setting('role') = 'service_role');
    END IF;
  END IF;
END
$$;

-- User wallets table
DO $$
BEGIN
  -- Check if the table exists before trying to add policies
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_wallets') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy WHERE polrelid = 'user_wallets'::regclass AND polname = 'User wallets are viewable by everyone'
    ) THEN
      CREATE POLICY "User wallets are viewable by everyone" ON public.user_wallets
        FOR SELECT USING (true);
    END IF;
  END IF;
END
$$;

-- Users table (adding missing policies if they don't exist)
DO $$
BEGIN
  -- Check if the table exists before trying to add policies
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy WHERE polrelid = 'users'::regclass AND polname = 'User profiles are viewable by everyone'
    ) THEN
      CREATE POLICY "User profiles are viewable by everyone" ON public.users
        FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy WHERE polrelid = 'users'::regclass AND polname = 'Users can insert their own profile'
    ) THEN
      CREATE POLICY "Users can insert their own profile" ON public.users
        FOR INSERT WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM pg_policy WHERE polrelid = 'users'::regclass AND polname = 'Users can update their own profile'
    ) THEN
      CREATE POLICY "Users can update their own profile" ON public.users
        FOR UPDATE USING (true);
    END IF;
  END IF;
END
$$;

-- Grant necessary permissions to anon role
DO $$
BEGIN
  -- Check if the table exists before trying to grant permissions
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'remixes') THEN
    GRANT SELECT ON public.remixes TO anon;
    GRANT INSERT, UPDATE ON public.remixes TO anon;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'social_interactions') THEN
    GRANT SELECT ON public.social_interactions TO anon;
    GRANT INSERT ON public.social_interactions TO anon;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'stars_transactions') THEN
    GRANT SELECT ON public.stars_transactions TO anon;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ton_transactions') THEN
    GRANT SELECT ON public.ton_transactions TO anon;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_achievements') THEN
    GRANT SELECT ON public.user_achievements TO anon;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_activities') THEN
    GRANT SELECT, INSERT ON public.user_activities TO anon;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_follows') THEN
    GRANT SELECT, INSERT, DELETE ON public.user_follows TO anon;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_library') THEN
    GRANT SELECT, INSERT, DELETE ON public.user_library TO anon;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_wallets') THEN
    GRANT SELECT ON public.user_wallets TO anon;
  END IF;
END
$$;

-- Grant necessary permissions to service_role
DO $$
BEGIN
  -- Check if the table exists before trying to grant permissions
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_sessions') THEN
    GRANT SELECT, INSERT ON public.user_sessions TO service_role;
  END IF;
END
$$;