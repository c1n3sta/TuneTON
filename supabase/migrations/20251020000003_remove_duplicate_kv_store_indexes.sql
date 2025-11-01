-- Remove duplicate indexes on kv_store_82f19583 table
-- Only one index on the key column is needed

-- Verify what indexes exist before dropping (commented out for actual execution)
-- SELECT indexname, indexdef FROM pg_indexes WHERE schemaname = 'public' AND tablename = 'kv_store_82f19583' ORDER BY indexname;

-- Keep the primary index kv_store_82f19583_key_idx and drop all duplicates
DROP INDEX IF EXISTS public.kv_store_82f19583_key_idx1;
DROP INDEX IF EXISTS public.kv_store_82f19583_key_idx2;
DROP INDEX IF EXISTS public.kv_store_82f19583_key_idx3;
DROP INDEX IF EXISTS public.kv_store_82f19583_key_idx4;
DROP INDEX IF EXISTS public.kv_store_82f19583_key_idx5;
DROP INDEX IF EXISTS public.kv_store_82f19583_key_idx6;
DROP INDEX IF EXISTS public.kv_store_82f19583_key_idx7;
DROP INDEX IF EXISTS public.kv_store_82f19583_key_idx8;
DROP INDEX IF EXISTS public.kv_store_82f19583_key_idx9;
DROP INDEX IF EXISTS public.kv_store_82f19583_key_idx10;
DROP INDEX IF EXISTS public.kv_store_82f19583_key_idx11;
DROP INDEX IF EXISTS public.kv_store_82f19583_key_idx12;
DROP INDEX IF EXISTS public.kv_store_82f19583_key_idx13;
DROP INDEX IF EXISTS public.kv_store_82f19583_key_idx14;
DROP INDEX IF EXISTS public.kv_store_82f19583_key_idx15;
DROP INDEX IF EXISTS public.kv_store_82f19583_key_idx16;
DROP INDEX IF EXISTS public.kv_store_82f19583_key_idx17;
DROP INDEX IF EXISTS public.kv_store_82f19583_key_idx18;
DROP INDEX IF EXISTS public.kv_store_82f19583_key_idx19;
DROP INDEX IF EXISTS public.kv_store_82f19583_key_idx20;
DROP INDEX IF EXISTS public.kv_store_82f19583_key_idx21;
DROP INDEX IF EXISTS public.kv_store_82f19583_key_idx22;
DROP INDEX IF EXISTS public.kv_store_82f19583_key_idx23;

-- If for some reason the primary index was dropped, recreate it
-- CREATE INDEX IF NOT EXISTS kv_store_82f19583_key_idx ON public.kv_store_82f19583 (key);