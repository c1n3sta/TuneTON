-- Fix RLS policies that re-evaluate current_setting() for each row
-- This improves query performance at scale by using subquery evaluation

-- First, drop the existing policies that have performance issues
DO $$
BEGIN
  -- Check if content_reports table exists before trying to modify it
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'content_reports') THEN
    DROP POLICY IF EXISTS "Content reports can be selected by service role" ON public.content_reports;
  END IF;
  
  -- Check if platform_metrics table exists before trying to modify it
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'platform_metrics') THEN
    DROP POLICY IF EXISTS "Platform metrics can be selected by service role" ON public.platform_metrics;
    DROP POLICY IF EXISTS "Platform metrics can be inserted by service role" ON public.platform_metrics;
  END IF;
END
$$;

-- Create updated policies with proper subquery evaluation
DO $$
BEGIN
  -- Check if content_reports table exists before trying to create policy
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'content_reports') THEN
    CREATE POLICY "Content reports can be selected by service role" ON public.content_reports
      FOR SELECT USING ((select current_setting('role')) = 'service_role');
  END IF;
  
  -- Check if platform_metrics table exists before trying to create policies
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'platform_metrics') THEN
    CREATE POLICY "Platform metrics can be selected by service role" ON public.platform_metrics
      FOR SELECT USING ((select current_setting('role')) = 'service_role');
    
    CREATE POLICY "Platform metrics can be inserted by service role" ON public.platform_metrics
      FOR INSERT WITH CHECK ((select current_setting('role')) = 'service_role');
  END IF;
END
$$;

-- Add indexes for foreign keys to improve query performance
-- Add index for playbacks table track_id foreign key
CREATE INDEX IF NOT EXISTS idx_playbacks_track_id ON public.playbacks (track_id);

-- Add index for users table telegram_id (already exists but ensuring it's properly indexed)
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON public.users (telegram_id);

-- Add index for rate_limit table ip_address (already exists but ensuring it's properly indexed)
CREATE INDEX IF NOT EXISTS idx_rate_limit_ip ON public.rate_limit (ip_address);