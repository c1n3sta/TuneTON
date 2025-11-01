-- VERIFY THAT THE FIXES WERE APPLIED CORRECTLY
-- Run this in your Supabase SQL editor to check the current state

-- Check how many unindexed foreign keys remain
SELECT 
    COUNT(*) as remaining_unindexed_foreign_keys
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

-- List any remaining unindexed foreign keys
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
ORDER BY tc.table_name;

-- Check if vector extension is installed
SELECT extname, extversion 
FROM pg_extension 
WHERE extname = 'vector';

-- Check if recommend_tracks function exists
SELECT proname, proargtypes::regtype[] 
FROM pg_proc 
WHERE proname = 'recommend_tracks';