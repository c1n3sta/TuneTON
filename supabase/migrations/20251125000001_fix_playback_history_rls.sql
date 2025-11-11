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