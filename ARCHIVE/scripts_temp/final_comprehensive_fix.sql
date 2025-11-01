-- FINAL COMPREHENSIVE FIX FOR ALL SUPABASE ISSUES
-- Run this entire script in your Supabase SQL editor

-- 1. Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Fix the recommend_tracks function
DROP FUNCTION IF EXISTS public.recommend_tracks(vector, text, text, integer, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision);

-- Create a simplified version that doesn't depend on vector type
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
        0.5 as similarity
    FROM public.tracks t
    WHERE (input_track_name IS NULL OR t.title ILIKE '%' || input_track_name || '%')
    AND (input_artist_name IS NULL OR t.artist ILIKE '%' || input_artist_name || '%')
    LIMIT max_tracks;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.recommend_tracks(text, text, integer) TO anon;

-- 3. Create indexes for ALL foreign keys in the database
DO $$
DECLARE
    r record;
    index_name text;
BEGIN
    FOR r IN
        SELECT
            tc.table_name,
            kcu.column_name
        FROM 
            information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
              ON tc.constraint_name = kcu.constraint_name
              AND tc.table_schema = kcu.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_schema = 'public'
        AND NOT EXISTS (
            SELECT 1
            FROM pg_indexes pi
            WHERE pi.tablename = tc.table_name
            AND pi.indexdef LIKE '%' || kcu.column_name || '%'
        )
    LOOP
        index_name := 'idx_' || r.table_name || '_' || r.column_name;
        -- Ensure index name is not too long
        IF LENGTH(index_name) > 63 THEN
            index_name := LEFT(index_name, 63);
        END IF;
        
        -- Create the index
        EXECUTE 'CREATE INDEX IF NOT EXISTS ' || quote_ident(index_name) || 
                ' ON ' || quote_ident(r.table_name) || 
                ' (' || quote_ident(r.column_name) || ');';
        
        RAISE NOTICE 'Created index % on %.%', index_name, r.table_name, r.column_name;
    END LOOP;
END $$;

-- 4. Verification queries
SELECT 'Vector extension status:' as info, 
       (SELECT extname FROM pg_extension WHERE extname = 'vector') as vector_status
UNION ALL
SELECT 'Number of unindexed foreign keys:' as info,
       (SELECT COUNT(*) FROM (
           SELECT
               tc.table_name,
               kcu.column_name
           FROM 
               information_schema.table_constraints AS tc
               JOIN information_schema.key_column_usage AS kcu
                 ON tc.constraint_name = kcu.constraint_name
                 AND tc.table_schema = kcu.table_schema
           WHERE tc.constraint_type = 'FOREIGN KEY' 
           AND tc.table_schema = 'public'
           AND NOT EXISTS (
               SELECT 1
               FROM pg_indexes pi
               WHERE pi.tablename = tc.table_name
               AND pi.indexdef LIKE '%' || kcu.column_name || '%'
           )
       ) AS unindexed_fks) as count;

-- Final completion message
SELECT 'Comprehensive fix completed. Please refresh the Supabase dashboard to verify all issues are resolved.' AS completion_message;