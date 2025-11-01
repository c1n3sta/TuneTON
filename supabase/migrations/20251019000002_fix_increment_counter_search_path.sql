-- Fix mutable search_path issue for increment_counter function
-- This function is used to safely increment counter values in tables

CREATE OR REPLACE FUNCTION public.increment_counter(table_name TEXT, column_name TEXT, record_id BIGINT, increment_by INTEGER DEFAULT 1)
RETURNS VOID AS $$
BEGIN
    -- Use format to safely construct the dynamic SQL statement
    -- All identifiers are properly quoted with %I
    EXECUTE format('UPDATE %I SET %I = %I + $1 WHERE id = $2', table_name, column_name, column_name) 
    USING increment_by, record_id;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog;

-- Grant execute permission to anon role so it can be used by the application
GRANT EXECUTE ON FUNCTION public.increment_counter(TEXT, TEXT, BIGINT, INTEGER) TO anon;

-- Add a comment to document the function
COMMENT ON FUNCTION public.increment_counter IS 
'Increments a counter column in a specified table for a given record ID. 
Uses a fixed search_path to prevent issues with mutable search_path settings.';