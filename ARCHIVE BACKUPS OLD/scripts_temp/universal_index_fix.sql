-- UNIVERSAL INDEX FIX FOR ALL FOREIGN KEYS
-- This script will create indexes for ALL foreign key columns in your database
-- Run this in your Supabase SQL editor

-- Create indexes for all foreign key columns
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

-- Enable vector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- Verification message
SELECT 'Successfully created indexes for all unindexed foreign keys. Please refresh the Supabase dashboard to verify the warnings are resolved.' AS completion_message;