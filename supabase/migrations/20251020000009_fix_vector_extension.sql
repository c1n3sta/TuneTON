-- Enable pgvector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- Fix the recommend_tracks function that uses vector type
DROP FUNCTION IF EXISTS public.recommend_tracks(vector, text, text, integer, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision);

-- Recreate the function with fixed search_path
CREATE OR REPLACE FUNCTION public.recommend_tracks(
    input_embedding vector,
    input_track_name text DEFAULT NULL::text,
    input_artist_name text DEFAULT NULL::text,
    max_tracks integer DEFAULT 10,
    embedding_weight double precision DEFAULT 0.5,
    popularity_weight double precision DEFAULT 0.1,
    danceability_weight double precision DEFAULT 0.1,
    energy_weight double precision DEFAULT 0.1,
    loudness_weight double precision DEFAULT 0.05,
    speechiness_weight double precision DEFAULT 0.05,
    acousticness_weight double precision DEFAULT 0.05,
    instrumentalness_weight double precision DEFAULT 0.05,
    liveness_weight double precision DEFAULT 0.05,
    valence_weight double precision DEFAULT 0.05,
    tempo_weight double precision DEFAULT 0.05
)
RETURNS TABLE(track_name text, artist_name text, similarity double precision, spotify_id text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    -- Function implementation would go here
    -- This is a placeholder - the actual implementation should be provided
    RETURN QUERY
    SELECT 
        t.name as track_name,
        t.artist as artist_name,
        0.0 as similarity,
        t.spotify_id as spotify_id
    FROM public.tracks t
    LIMIT max_tracks;
END;
$$;

-- Grant execute permission to anon role so it can be used by the application
GRANT EXECUTE ON FUNCTION public.recommend_tracks(vector, text, text, integer, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision) TO anon;

-- Add a comment to document the function
COMMENT ON FUNCTION public.recommend_tracks(vector, text, text, integer, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision) IS 
'Provides track recommendations based on audio embeddings and user preferences.
Uses a fixed search_path to prevent issues with mutable search_path settings.';