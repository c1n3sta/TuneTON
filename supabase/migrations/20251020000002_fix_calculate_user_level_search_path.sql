-- Fix mutable search_path issue for calculate_user_level function
-- This function is used to calculate user levels based on their activity metrics

-- First, drop any existing functions with the same name to avoid conflicts
DROP FUNCTION IF EXISTS public.calculate_user_level(INTEGER, INTEGER, INTEGER);

CREATE OR REPLACE FUNCTION public.calculate_user_level(user_stars INTEGER, total_remixes INTEGER, total_likes INTEGER)
RETURNS INTEGER AS $$
BEGIN
    -- Level calculation logic based on engagement
    -- Using a fixed search_path to prevent issues with mutable search_path settings
    RETURN GREATEST(1, (user_stars / 100) + (total_remixes / 10) + (total_likes / 1000));
END;
$$ LANGUAGE plpgsql
SET search_path = public, pg_catalog;

-- Add a comment to document the function
COMMENT ON FUNCTION public.calculate_user_level IS 
'Calculates user level based on stars, remixes, and likes.
Uses a fixed search_path to prevent issues with mutable search_path settings.';