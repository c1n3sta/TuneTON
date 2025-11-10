-- FIX FOR MIGRATION ISSUES
-- This script should be run in the Supabase SQL Editor to fix migration history

-- First, let's check what migrations exist in the remote database
SELECT * FROM supabase_migrations.schema_migrations ORDER BY version;

-- If you see migration 20251020214244 in the list, you can mark it as applied locally:
-- supabase migration repair --status applied 20251020214244

-- If you see migration 20251020211720 in the list, you can mark it as reverted locally:
-- supabase migration repair --status reverted 20251020211720

-- After running the above commands, sync with remote:
-- supabase db pull

-- Then you can push your changes:
-- supabase db push --linked