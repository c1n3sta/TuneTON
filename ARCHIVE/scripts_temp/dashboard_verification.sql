-- DASHBOARD VERIFICATION SCRIPT
-- Run this in your Supabase SQL editor to verify the fixes and check what's still showing in the linter

-- 1. Count remaining unindexed foreign keys
SELECT 
    'Remaining unindexed foreign keys' as check_type,
    COUNT(*) as count
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
) AS unindexed_fks

UNION ALL

-- 2. Check vector extension
SELECT 
    'Vector extension installed' as check_type,
    COUNT(*) as count
FROM pg_extension 
WHERE extname = 'vector'

UNION ALL

-- 3. Check recommend_tracks function
SELECT 
    'Recommend tracks function exists' as check_type,
    COUNT(*) as count
FROM pg_proc 
WHERE proname = 'recommend_tracks'

UNION ALL

-- 4. List any remaining unindexed foreign keys (detailed)
SELECT 
    'Details: ' || tc.table_name as check_type,
    1 as count
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
ORDER BY check_type;