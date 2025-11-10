-- Ensure update_updated_at_column trigger function uses a fixed search_path
-- This prevents shadowing issues when invoked under roles with custom search_path

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.update_updated_at_column() IS
'Updates the updated_at column with the current timestamp using a deterministic search_path.';
