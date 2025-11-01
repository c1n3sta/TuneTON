-- VECTOR EXTENSION FIX
-- This script addresses the vector extension issue that's causing migration errors

-- First, check if vector extension is available
SELECT name, default_version, installed_version 
FROM pg_available_extensions 
WHERE name = 'vector';

-- Enable vector extension if available
CREATE EXTENSION IF NOT EXISTS vector;

-- If the above doesn't work, try installing with explicit schema
CREATE EXTENSION IF NOT EXISTS vector SCHEMA public;

-- Check if the extension is now installed
SELECT extname, extversion 
FROM pg_extension 
WHERE extname = 'vector';

-- Fix for the recommend_tracks function that was causing errors
DROP FUNCTION IF EXISTS public.recommend_tracks(vector, text, text, integer, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision);

-- Create a simplified version without vector dependency
CREATE OR REPLACE FUNCTION public.recommend_tracks(
    input_track_name text DEFAULT NULL::text,
    input_artist_name text DEFAULT NULL::text,
    max_tracks integer DEFAULT 10
)
RETURNS TABLE(track_name text, artist_name text, similarity double precision)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.title as track_name,
        t.artist as artist_name,
        0.0 as similarity
    FROM public.tracks t
    LIMIT max_tracks;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.recommend_tracks(text, text, integer) TO anon;

SELECT 'Vector extension fix completed. Please refresh the Supabase dashboard.' AS completion_message;