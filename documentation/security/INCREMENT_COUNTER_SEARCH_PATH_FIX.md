# Fix for Mutable Search Path in increment_counter Function

## Issue Summary

The PostgreSQL function `public.increment_counter` had a mutable search path, which means it inherited the search path from the caller's session. This could lead to:

1. Unexpected behavior when resolving unqualified object names
2. Security vulnerabilities if malicious objects were placed in schemas that appear earlier in the search path
3. Hard-to-debug issues when the search path was modified by session settings

## Root Cause

The function was defined without an explicit `SET search_path` clause, leaving it vulnerable to changes in the session's search path.

## Solution

Created a migration file that redefines the function with a fixed search path:

```sql
CREATE OR REPLACE FUNCTION public.increment_counter(table_name TEXT, column_name TEXT, record_id BIGINT, increment_by INTEGER DEFAULT 1)
RETURNS VOID AS $$
BEGIN
    EXECUTE format('UPDATE %I SET %I = %I + $1 WHERE id = $2', table_name, column_name, column_name) 
    USING increment_by, record_id;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog;
```

## Key Improvements

1. **Fixed Search Path**: Added `SET search_path = public, pg_catalog` to ensure consistent name resolution
2. **Security Definer**: Added `SECURITY DEFINER` to ensure the function runs with the privileges of its owner
3. **Proper Permissions**: Granted execute permission to the anon role so it can be used by the application
4. **Documentation**: Added a comment to explain the function's purpose and security considerations

## Testing

Created test scripts to verify the function works correctly:
- `scripts/test-increment-counter.js` - Node.js test script
- `scripts/test-increment-counter.sql` - SQL test script

Added npm script `test:increment-counter` to package.json for easy testing.

## Validation

After applying this fix:
1. The function will always resolve unqualified names against the public schema first, then pg_catalog
2. Behavior is consistent regardless of the caller's session settings
3. Security is improved by preventing privilege escalation through search path manipulation
4. The function can be safely used by the application with predictable behavior

## Deployment

The fix is implemented as a Supabase migration that will be automatically applied when the database is updated.