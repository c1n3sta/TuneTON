-- Fix mutable search_path issue for update_updated_at_column function
-- This function is used to automatically update the updated_at timestamp on row updates

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public, pg_catalog;

-- Add a comment to document the function
COMMENT ON FUNCTION public.update_updated_at_column() IS 
'Updates the updated_at column with the current timestamp. 
Uses a fixed search_path to prevent issues with mutable search_path settings.';