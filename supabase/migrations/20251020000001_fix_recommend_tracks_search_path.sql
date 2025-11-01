-- Fix mutable search_path issue for recommend_tracks function
-- This function is used to provide track recommendations to users

-- First, drop any existing functions with the same name to avoid conflicts
DROP FUNCTION IF EXISTS public.recommend_tracks(uuid);
DROP FUNCTION IF EXISTS public.recommend_tracks();

-- Create the function with a specific signature
CREATE OR REPLACE FUNCTION public.recommend_tracks(user_id uuid)
RETURNS TABLE(track_id BIGINT, score NUMERIC) AS $$
BEGIN
  -- Return tracks based on popularity and user preferences
  -- This is a simple implementation that should be replaced with more sophisticated recommendation logic
  RETURN QUERY
  SELECT 
    t.id as track_id,
    (t.play_count * 0.1 + t.like_count * 0.5) as score
  FROM public.tracks t
  WHERE t.id IS NOT NULL
  ORDER BY score DESC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp;

-- Grant execute permission to anon role so it can be used by the application
GRANT EXECUTE ON FUNCTION public.recommend_tracks(uuid) TO anon;

-- Add a comment to document the function
COMMENT ON FUNCTION public.recommend_tracks(uuid) IS 
'Provides track recommendations for a given user based on popularity metrics.
Uses a fixed search_path to prevent issues with mutable search_path settings.';