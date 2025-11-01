-- DIAGNOSTIC QUERY TO CHECK EXISTING TABLES AND FOREIGN KEYS
-- Run this in your Supabase SQL editor to see what tables actually exist

-- Check what tables exist in your database
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check for foreign key constraints without indexes
SELECT
    tc.table_name,
    tc.constraint_name,
    kcu.column_name
FROM 
    information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- Check existing indexes
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Count unindexed foreign keys
SELECT COUNT(*) as unindexed_foreign_keys_count
FROM (
    SELECT
        tc.table_name,
        tc.constraint_name,
        kcu.column_name
    FROM 
        information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_schema = 'public'
    AND NOT EXISTS (
        SELECT 1
        FROM pg_indexes pi
        WHERE pi.tablename = tc.table_name
        AND pi.indexdef LIKE '%' || kcu.column_name || '%'
    )
) AS unindexed_fks;