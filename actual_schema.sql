

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."calculate_user_level"("user_stars" integer, "total_remixes" integer, "total_likes" integer) RETURNS integer
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'pg_catalog'
    AS $$
BEGIN
    -- Level calculation logic based on engagement
    -- Using a fixed search_path to prevent issues with mutable search_path settings
    RETURN GREATEST(1, (user_stars / 100) + (total_remixes / 10) + (total_likes / 1000));
END;
$$;


ALTER FUNCTION "public"."calculate_user_level"("user_stars" integer, "total_remixes" integer, "total_likes" integer) OWNER TO "postgres";


COMMENT ON FUNCTION "public"."calculate_user_level"("user_stars" integer, "total_remixes" integer, "total_likes" integer) IS 'Calculates user level based on stars, remixes, and likes.
Uses a fixed search_path to prevent issues with mutable search_path settings.';



CREATE OR REPLACE FUNCTION "public"."increment_counter"("table_name" "text", "column_name" "text", "record_id" bigint, "increment_by" integer DEFAULT 1) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_catalog'
    AS $_$
BEGIN
    -- Use format to safely construct the dynamic SQL statement
    -- All identifiers are properly quoted with %I
    EXECUTE format('UPDATE %I SET %I = %I + $1 WHERE id = $2', table_name, column_name, column_name) 
    USING increment_by, record_id;
END;
$_$;


ALTER FUNCTION "public"."increment_counter"("table_name" "text", "column_name" "text", "record_id" bigint, "increment_by" integer) OWNER TO "postgres";


COMMENT ON FUNCTION "public"."increment_counter"("table_name" "text", "column_name" "text", "record_id" bigint, "increment_by" integer) IS 'Increments a counter column in a specified table for a given record ID. 
Uses a fixed search_path to prevent issues with mutable search_path settings.';



CREATE OR REPLACE FUNCTION "public"."recommend_tracks"("user_id" "uuid") RETURNS TABLE("track_id" bigint, "score" numeric)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
BEGIN
  -- Return tracks based on popularity and user preferences
  -- This is a simple implementation that should be replaced with more sophisticated recommendation logic
  RETURN QUERY
  SELECT 
    t.id as track_id,
    (t.play_count * 0.1 + t.like_count * 0.5) as score
  FROM public.tracks t
  WHERE t.id IS NOT NULL
  ORDER BY score DESC
  LIMIT 50;
END;
$$;


ALTER FUNCTION "public"."recommend_tracks"("user_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."recommend_tracks"("user_id" "uuid") IS 'Provides track recommendations for a given user based on popularity metrics.
Uses a fixed search_path to prevent issues with mutable search_path settings.';



CREATE OR REPLACE FUNCTION "public"."recommend_tracks"("input_track_name" "text" DEFAULT NULL::"text", "input_artist_name" "text" DEFAULT NULL::"text", "max_tracks" integer DEFAULT 10) RETURNS TABLE("track_name" "text", "artist_name" "text", "similarity" double precision)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.title as track_name,
        t.artist as artist_name,
        0.5 as similarity
    FROM public.tracks t
    WHERE (input_track_name IS NULL OR t.title ILIKE '%' || input_track_name || '%')
    AND (input_artist_name IS NULL OR t.artist ILIKE '%' || input_artist_name || '%')
    LIMIT max_tracks;
END;
$$;


ALTER FUNCTION "public"."recommend_tracks"("input_track_name" "text", "input_artist_name" "text", "max_tracks" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public', 'pg_temp'
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


COMMENT ON FUNCTION "public"."update_updated_at_column"() IS 'Updates the updated_at column with the current timestamp using a deterministic search_path.';


SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."albums" (
    "id" bigint NOT NULL,
    "artist_id" bigint,
    "title" character varying(255) NOT NULL,
    "slug" character varying(255) NOT NULL,
    "cover_url" "text",
    "release_date" "date",
    "genre" character varying(100),
    "total_tracks" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."albums" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."albums_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."albums_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."albums_id_seq" OWNED BY "public"."albums"."id";



CREATE TABLE IF NOT EXISTS "public"."app_config" (
    "id" bigint NOT NULL,
    "config_key" character varying(255) NOT NULL,
    "config_value" "jsonb" NOT NULL,
    "description" "text",
    "is_active" boolean DEFAULT true,
    "updated_by_user_id" bigint,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."app_config" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."app_config_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."app_config_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."app_config_id_seq" OWNED BY "public"."app_config"."id";



CREATE TABLE IF NOT EXISTS "public"."artists" (
    "id" bigint NOT NULL,
    "name" character varying(255) NOT NULL,
    "slug" character varying(255) NOT NULL,
    "avatar_url" "text",
    "is_verified" boolean DEFAULT false,
    "monthly_listeners" integer DEFAULT 0,
    "total_tracks" integer DEFAULT 0,
    "bio" "text",
    "social_links" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."artists" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."artists_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."artists_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."artists_id_seq" OWNED BY "public"."artists"."id";



CREATE TABLE IF NOT EXISTS "public"."audio_presets" (
    "id" bigint NOT NULL,
    "user_id" bigint,
    "name" character varying(255) NOT NULL,
    "description" "text",
    "effects_config" "jsonb" NOT NULL,
    "is_public" boolean DEFAULT true,
    "use_count" integer DEFAULT 0,
    "like_count" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."audio_presets" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."audio_presets_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."audio_presets_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."audio_presets_id_seq" OWNED BY "public"."audio_presets"."id";



CREATE TABLE IF NOT EXISTS "public"."comments" (
    "id" bigint NOT NULL,
    "user_id" bigint,
    "target_type" character varying(50) NOT NULL,
    "target_id" bigint NOT NULL,
    "parent_comment_id" bigint,
    "content" "text" NOT NULL,
    "like_count" integer DEFAULT 0,
    "reply_count" integer DEFAULT 0,
    "is_pinned" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."comments" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."comments_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."comments_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."comments_id_seq" OWNED BY "public"."comments"."id";



CREATE TABLE IF NOT EXISTS "public"."community_posts" (
    "id" bigint NOT NULL,
    "user_id" bigint,
    "post_type" character varying(50) NOT NULL,
    "content" "text",
    "media_urls" "text"[],
    "linked_content" "jsonb",
    "like_count" integer DEFAULT 0,
    "comment_count" integer DEFAULT 0,
    "share_count" integer DEFAULT 0,
    "is_public" boolean DEFAULT true,
    "is_pinned" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."community_posts" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."community_posts_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."community_posts_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."community_posts_id_seq" OWNED BY "public"."community_posts"."id";



CREATE TABLE IF NOT EXISTS "public"."content_reports" (
    "id" bigint NOT NULL,
    "reporter_user_id" bigint,
    "target_type" character varying(50) NOT NULL,
    "target_id" bigint NOT NULL,
    "report_type" character varying(50) NOT NULL,
    "description" "text",
    "status" character varying(50) DEFAULT 'pending'::character varying,
    "moderator_user_id" bigint,
    "moderator_notes" "text",
    "resolved_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."content_reports" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."content_reports_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."content_reports_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."content_reports_id_seq" OWNED BY "public"."content_reports"."id";



CREATE TABLE IF NOT EXISTS "public"."contest_entries" (
    "id" bigint NOT NULL,
    "contest_id" bigint,
    "user_id" bigint,
    "remix_id" bigint,
    "vote_count" integer DEFAULT 0,
    "score" numeric(5,2) DEFAULT 0.0,
    "rank_position" integer,
    "entry_metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "submitted_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."contest_entries" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."contest_entries_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."contest_entries_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."contest_entries_id_seq" OWNED BY "public"."contest_entries"."id";



CREATE TABLE IF NOT EXISTS "public"."contest_votes" (
    "id" bigint NOT NULL,
    "contest_id" bigint,
    "entry_id" bigint,
    "voter_id" bigint,
    "vote_weight" integer DEFAULT 1,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."contest_votes" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."contest_votes_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."contest_votes_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."contest_votes_id_seq" OWNED BY "public"."contest_votes"."id";



CREATE TABLE IF NOT EXISTS "public"."contests" (
    "id" bigint NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" "text",
    "cover_url" "text",
    "contest_type" character varying(50) NOT NULL,
    "rules" "jsonb",
    "prize_pool_ton" numeric(15,8) DEFAULT 0,
    "prize_pool_stars" integer DEFAULT 0,
    "prize_distribution" "jsonb",
    "start_date" timestamp with time zone,
    "end_date" timestamp with time zone,
    "voting_end_date" timestamp with time zone,
    "max_participants" integer,
    "participant_count" integer DEFAULT 0,
    "entry_count" integer DEFAULT 0,
    "status" character varying(50) DEFAULT 'upcoming'::character varying,
    "is_featured" boolean DEFAULT false,
    "created_by_user_id" bigint,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."contests" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."contests_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."contests_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."contests_id_seq" OWNED BY "public"."contests"."id";



CREATE TABLE IF NOT EXISTS "public"."kv_store_82f19583" (
    "key" "text" NOT NULL,
    "value" "jsonb" NOT NULL
);


ALTER TABLE "public"."kv_store_82f19583" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."music_tracks" (
    "id" bigint NOT NULL,
    "track_name" "text" NOT NULL,
    "artist_name" "text",
    "spotify_id" "text",
    "embedding" "extensions"."vector"(384),
    "popularity" double precision,
    "danceability" double precision,
    "energy" double precision,
    "loudness" double precision,
    "speechiness" double precision,
    "acousticness" double precision,
    "instrumentalness" double precision,
    "liveness" double precision,
    "valence" double precision,
    "tempo" double precision,
    "genre" "text",
    "release_year" integer,
    "added_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."music_tracks" OWNER TO "postgres";


ALTER TABLE "public"."music_tracks" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."music_tracks_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."nft_collections" (
    "id" bigint NOT NULL,
    "creator_id" bigint,
    "name" character varying(255) NOT NULL,
    "description" "text",
    "symbol" character varying(20),
    "cover_url" "text",
    "total_supply" integer,
    "minted_count" integer DEFAULT 0,
    "floor_price_ton" numeric(15,8),
    "total_volume_ton" numeric(15,8) DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."nft_collections" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."nft_collections_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."nft_collections_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."nft_collections_id_seq" OWNED BY "public"."nft_collections"."id";



CREATE TABLE IF NOT EXISTS "public"."nft_transactions" (
    "id" bigint NOT NULL,
    "nft_id" bigint,
    "transaction_type" character varying(50) NOT NULL,
    "from_user_id" bigint,
    "to_user_id" bigint,
    "price_ton" numeric(15,8),
    "ton_transaction_hash" character varying(255),
    "gas_fee_ton" numeric(15,8),
    "platform_fee_ton" numeric(15,8),
    "status" character varying(50) DEFAULT 'pending'::character varying,
    "block_number" bigint,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "confirmed_at" timestamp with time zone
);


ALTER TABLE "public"."nft_transactions" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."nft_transactions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."nft_transactions_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."nft_transactions_id_seq" OWNED BY "public"."nft_transactions"."id";



CREATE TABLE IF NOT EXISTS "public"."nfts" (
    "id" bigint NOT NULL,
    "collection_id" bigint,
    "token_id" character varying(255) NOT NULL,
    "ton_contract_address" character varying(255),
    "name" character varying(255) NOT NULL,
    "description" "text",
    "image_url" "text",
    "audio_url" "text",
    "metadata_url" "text",
    "preset_id" bigint,
    "remix_id" bigint,
    "current_owner_id" bigint,
    "creator_id" bigint,
    "mint_price_ton" numeric(15,8),
    "last_sale_price_ton" numeric(15,8),
    "current_listing_price_ton" numeric(15,8),
    "is_listed" boolean DEFAULT false,
    "rarity_rank" integer,
    "traits" "jsonb" DEFAULT '{}'::"jsonb",
    "minted_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."nfts" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."nfts_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."nfts_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."nfts_id_seq" OWNED BY "public"."nfts"."id";



CREATE TABLE IF NOT EXISTS "public"."platform_metrics" (
    "id" bigint NOT NULL,
    "metric_date" "date" NOT NULL,
    "metric_type" character varying(50) NOT NULL,
    "active_users" integer DEFAULT 0,
    "new_users" integer DEFAULT 0,
    "returning_users" integer DEFAULT 0,
    "tracks_played" integer DEFAULT 0,
    "remixes_created" integer DEFAULT 0,
    "presets_shared" integer DEFAULT 0,
    "likes_given" integer DEFAULT 0,
    "comments_posted" integer DEFAULT 0,
    "shares_made" integer DEFAULT 0,
    "stars_earned" integer DEFAULT 0,
    "stars_spent" integer DEFAULT 0,
    "ton_volume" numeric(15,8) DEFAULT 0,
    "nft_sales" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."platform_metrics" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."platform_metrics_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."platform_metrics_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."platform_metrics_id_seq" OWNED BY "public"."platform_metrics"."id";



CREATE TABLE IF NOT EXISTS "public"."playback_history" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" bigint,
    "track_id" "text" NOT NULL,
    "track_data" "jsonb",
    "played_at" timestamp with time zone DEFAULT "now"(),
    "duration_played" integer DEFAULT 0,
    "is_completed" boolean DEFAULT false
);


ALTER TABLE "public"."playback_history" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."playbacks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "track_id" bigint,
    "count" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."playbacks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."playlist_tracks" (
    "id" bigint NOT NULL,
    "playlist_id" bigint,
    "track_id" bigint,
    "remix_id" bigint,
    "position" integer NOT NULL,
    "added_by_user_id" bigint,
    "added_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "playlist_tracks_content" CHECK (((("track_id" IS NOT NULL) AND ("remix_id" IS NULL)) OR (("track_id" IS NULL) AND ("remix_id" IS NOT NULL))))
);


ALTER TABLE "public"."playlist_tracks" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."playlist_tracks_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."playlist_tracks_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."playlist_tracks_id_seq" OWNED BY "public"."playlist_tracks"."id";



CREATE TABLE IF NOT EXISTS "public"."playlists" (
    "id" bigint NOT NULL,
    "user_id" bigint,
    "title" character varying(255) NOT NULL,
    "description" "text",
    "cover_url" "text",
    "is_private" boolean DEFAULT false,
    "is_ai_generated" boolean DEFAULT false,
    "ai_generation_prompt" "text",
    "total_tracks" integer DEFAULT 0,
    "total_duration" integer DEFAULT 0,
    "play_count" integer DEFAULT 0,
    "like_count" integer DEFAULT 0,
    "follower_count" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."playlists" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."playlists_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."playlists_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."playlists_id_seq" OWNED BY "public"."playlists"."id";



CREATE TABLE IF NOT EXISTS "public"."remixes" (
    "id" bigint NOT NULL,
    "user_id" bigint,
    "original_track_id" bigint,
    "title" character varying(255) NOT NULL,
    "description" "text",
    "cover_url" "text",
    "duration" integer,
    "effects_config" "jsonb" NOT NULL,
    "processed_file_url" "text",
    "processing_metadata" "jsonb",
    "play_count" integer DEFAULT 0,
    "like_count" integer DEFAULT 0,
    "share_count" integer DEFAULT 0,
    "comment_count" integer DEFAULT 0,
    "stars_earned" integer DEFAULT 0,
    "is_public" boolean DEFAULT true,
    "is_featured" boolean DEFAULT false,
    "contest_entry_id" bigint,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."remixes" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."remixes_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."remixes_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."remixes_id_seq" OWNED BY "public"."remixes"."id";



CREATE TABLE IF NOT EXISTS "public"."social_interactions" (
    "id" bigint NOT NULL,
    "user_id" bigint,
    "target_type" character varying(50) NOT NULL,
    "target_id" bigint NOT NULL,
    "interaction_type" character varying(50) NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."social_interactions" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."social_interactions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."social_interactions_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."social_interactions_id_seq" OWNED BY "public"."social_interactions"."id";



CREATE TABLE IF NOT EXISTS "public"."stars_transactions" (
    "id" bigint NOT NULL,
    "user_id" bigint,
    "transaction_type" character varying(50) NOT NULL,
    "amount" integer NOT NULL,
    "source_type" character varying(50),
    "source_id" bigint,
    "telegram_payment_id" character varying(255),
    "telegram_invoice_payload" "text",
    "description" "text",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "status" character varying(50) DEFAULT 'completed'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."stars_transactions" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."stars_transactions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."stars_transactions_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."stars_transactions_id_seq" OWNED BY "public"."stars_transactions"."id";



CREATE TABLE IF NOT EXISTS "public"."ton_transactions" (
    "id" bigint NOT NULL,
    "user_id" bigint,
    "transaction_hash" character varying(255) NOT NULL,
    "transaction_type" character varying(50) NOT NULL,
    "amount_ton" numeric(15,8) NOT NULL,
    "from_address" character varying(255),
    "to_address" character varying(255),
    "gas_used" bigint,
    "gas_fee_ton" numeric(15,8),
    "related_type" character varying(50),
    "related_id" bigint,
    "block_number" bigint,
    "block_timestamp" timestamp with time zone,
    "logical_time" bigint,
    "status" character varying(50) DEFAULT 'pending'::character varying,
    "confirmation_count" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "confirmed_at" timestamp with time zone
);


ALTER TABLE "public"."ton_transactions" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."ton_transactions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."ton_transactions_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."ton_transactions_id_seq" OWNED BY "public"."ton_transactions"."id";



CREATE TABLE IF NOT EXISTS "public"."tracks" (
    "id" bigint NOT NULL,
    "artist_id" bigint,
    "album_id" bigint,
    "title" character varying(255) NOT NULL,
    "slug" character varying(255) NOT NULL,
    "duration" integer NOT NULL,
    "file_url" "text" NOT NULL,
    "cover_url" "text",
    "genre" character varying(100),
    "bpm" integer,
    "key_signature" character varying(10),
    "energy_level" integer,
    "audio_features" "jsonb",
    "license_info" "jsonb",
    "play_count" integer DEFAULT 0,
    "like_count" integer DEFAULT 0,
    "remix_count" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "tracks_energy_level_check" CHECK ((("energy_level" >= 1) AND ("energy_level" <= 5)))
);


ALTER TABLE "public"."tracks" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."tracks_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."tracks_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."tracks_id_seq" OWNED BY "public"."tracks"."id";



CREATE TABLE IF NOT EXISTS "public"."user_achievements" (
    "id" bigint NOT NULL,
    "user_id" bigint,
    "achievement_type" character varying(100) NOT NULL,
    "achievement_data" "jsonb",
    "earned_at" timestamp with time zone DEFAULT "now"(),
    "stars_reward" integer DEFAULT 0
);


ALTER TABLE "public"."user_achievements" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."user_achievements_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."user_achievements_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."user_achievements_id_seq" OWNED BY "public"."user_achievements"."id";



CREATE TABLE IF NOT EXISTS "public"."user_activities" (
    "id" bigint NOT NULL,
    "user_id" bigint,
    "activity_type" character varying(100) NOT NULL,
    "target_type" character varying(50),
    "target_id" bigint,
    "session_id" character varying(255),
    "device_info" "jsonb",
    "location_data" "jsonb",
    "activity_metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "timestamp" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."user_activities" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."user_activities_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."user_activities_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."user_activities_id_seq" OWNED BY "public"."user_activities"."id";



CREATE TABLE IF NOT EXISTS "public"."user_favorite_artists" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" bigint,
    "artist_id" "text" NOT NULL,
    "artist_name" "text" NOT NULL,
    "artist_image" "text",
    "added_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_favorite_artists" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_follows" (
    "id" bigint NOT NULL,
    "follower_id" bigint,
    "following_id" bigint,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "no_self_follow" CHECK (("follower_id" <> "following_id"))
);


ALTER TABLE "public"."user_follows" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."user_follows_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."user_follows_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."user_follows_id_seq" OWNED BY "public"."user_follows"."id";



CREATE TABLE IF NOT EXISTS "public"."user_library" (
    "id" bigint NOT NULL,
    "user_id" bigint,
    "item_type" character varying(50) NOT NULL,
    "item_id" bigint NOT NULL,
    "action_type" character varying(50) NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_library" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."user_library_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."user_library_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."user_library_id_seq" OWNED BY "public"."user_library"."id";



CREATE TABLE IF NOT EXISTS "public"."user_recent_tracks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "track_id" "text" NOT NULL,
    "track_name" "text" NOT NULL,
    "artist_name" "text" NOT NULL,
    "album_name" "text",
    "duration" integer DEFAULT 0 NOT NULL,
    "image_url" "text",
    "audio_url" "text",
    "jamendo_id" "text",
    "played_at" timestamp with time zone DEFAULT "now"(),
    "play_count" integer DEFAULT 1,
    "last_position" integer DEFAULT 0,
    "completed" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_recent_tracks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_sessions" (
    "id" bigint NOT NULL,
    "user_id" bigint,
    "session_token" character varying(255) NOT NULL,
    "telegram_auth_data" "jsonb",
    "expires_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_sessions" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."user_sessions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."user_sessions_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."user_sessions_id_seq" OWNED BY "public"."user_sessions"."id";



CREATE TABLE IF NOT EXISTS "public"."user_wallets" (
    "id" bigint NOT NULL,
    "user_id" bigint,
    "wallet_address" character varying(255) NOT NULL,
    "wallet_type" character varying(50),
    "is_primary" boolean DEFAULT false,
    "balance_ton" numeric(15,8) DEFAULT 0,
    "last_synced_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_wallets" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."user_wallets_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."user_wallets_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."user_wallets_id_seq" OWNED BY "public"."user_wallets"."id";



CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" bigint NOT NULL,
    "telegram_id" bigint NOT NULL,
    "telegram_username" character varying(255),
    "first_name" character varying(255) NOT NULL,
    "last_name" character varying(255),
    "telegram_photo_url" "text",
    "is_premium" boolean DEFAULT false,
    "is_verified" boolean DEFAULT false,
    "level" integer DEFAULT 1,
    "stars_balance" integer DEFAULT 0,
    "ton_wallet_address" character varying(255),
    "total_remixes" integer DEFAULT 0,
    "total_likes_received" integer DEFAULT 0,
    "total_plays" integer DEFAULT 0,
    "default_audio_profile" "jsonb" DEFAULT '{}'::"jsonb",
    "privacy_settings" "jsonb" DEFAULT '{"library": "friends", "profile": "public", "activity": "public"}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "last_active_at" timestamp with time zone DEFAULT "now"(),
    "onboarding_completed_at" timestamp with time zone
);


ALTER TABLE "public"."users" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."users_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."users_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."users_id_seq" OWNED BY "public"."users"."id";



ALTER TABLE ONLY "public"."albums" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."albums_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."app_config" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."app_config_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."artists" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."artists_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."audio_presets" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."audio_presets_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."comments" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."comments_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."community_posts" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."community_posts_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."content_reports" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."content_reports_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."contest_entries" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."contest_entries_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."contest_votes" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."contest_votes_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."contests" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."contests_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."nft_collections" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."nft_collections_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."nft_transactions" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."nft_transactions_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."nfts" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."nfts_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."platform_metrics" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."platform_metrics_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."playlist_tracks" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."playlist_tracks_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."playlists" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."playlists_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."remixes" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."remixes_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."social_interactions" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."social_interactions_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."stars_transactions" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."stars_transactions_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."ton_transactions" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."ton_transactions_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."tracks" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."tracks_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."user_achievements" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."user_achievements_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."user_activities" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."user_activities_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."user_follows" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."user_follows_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."user_library" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."user_library_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."user_sessions" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."user_sessions_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."user_wallets" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."user_wallets_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."users" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."users_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."albums"
    ADD CONSTRAINT "albums_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."app_config"
    ADD CONSTRAINT "app_config_config_key_key" UNIQUE ("config_key");



ALTER TABLE ONLY "public"."app_config"
    ADD CONSTRAINT "app_config_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."artists"
    ADD CONSTRAINT "artists_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."artists"
    ADD CONSTRAINT "artists_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."audio_presets"
    ADD CONSTRAINT "audio_presets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."community_posts"
    ADD CONSTRAINT "community_posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."content_reports"
    ADD CONSTRAINT "content_reports_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."contest_entries"
    ADD CONSTRAINT "contest_entries_contest_id_user_id_key" UNIQUE ("contest_id", "user_id");



ALTER TABLE ONLY "public"."contest_entries"
    ADD CONSTRAINT "contest_entries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."contest_votes"
    ADD CONSTRAINT "contest_votes_contest_id_entry_id_voter_id_key" UNIQUE ("contest_id", "entry_id", "voter_id");



ALTER TABLE ONLY "public"."contest_votes"
    ADD CONSTRAINT "contest_votes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."contests"
    ADD CONSTRAINT "contests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."kv_store_82f19583"
    ADD CONSTRAINT "kv_store_82f19583_pkey" PRIMARY KEY ("key");



ALTER TABLE ONLY "public"."music_tracks"
    ADD CONSTRAINT "music_tracks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."music_tracks"
    ADD CONSTRAINT "music_tracks_spotify_id_key" UNIQUE ("spotify_id");



ALTER TABLE ONLY "public"."nft_collections"
    ADD CONSTRAINT "nft_collections_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."nft_transactions"
    ADD CONSTRAINT "nft_transactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."nfts"
    ADD CONSTRAINT "nfts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."nfts"
    ADD CONSTRAINT "nfts_token_id_key" UNIQUE ("token_id");



ALTER TABLE ONLY "public"."platform_metrics"
    ADD CONSTRAINT "platform_metrics_metric_date_metric_type_key" UNIQUE ("metric_date", "metric_type");



ALTER TABLE ONLY "public"."platform_metrics"
    ADD CONSTRAINT "platform_metrics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."playback_history"
    ADD CONSTRAINT "playback_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."playbacks"
    ADD CONSTRAINT "playbacks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."playlist_tracks"
    ADD CONSTRAINT "playlist_tracks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."playlists"
    ADD CONSTRAINT "playlists_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."remixes"
    ADD CONSTRAINT "remixes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."social_interactions"
    ADD CONSTRAINT "social_interactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."social_interactions"
    ADD CONSTRAINT "social_interactions_user_id_target_type_target_id_interacti_key" UNIQUE ("user_id", "target_type", "target_id", "interaction_type");



ALTER TABLE ONLY "public"."stars_transactions"
    ADD CONSTRAINT "stars_transactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ton_transactions"
    ADD CONSTRAINT "ton_transactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ton_transactions"
    ADD CONSTRAINT "ton_transactions_transaction_hash_key" UNIQUE ("transaction_hash");



ALTER TABLE ONLY "public"."tracks"
    ADD CONSTRAINT "tracks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_achievements"
    ADD CONSTRAINT "user_achievements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_activities"
    ADD CONSTRAINT "user_activities_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_favorite_artists"
    ADD CONSTRAINT "user_favorite_artists_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_favorite_artists"
    ADD CONSTRAINT "user_favorite_artists_user_id_artist_id_key" UNIQUE ("user_id", "artist_id");



ALTER TABLE ONLY "public"."user_follows"
    ADD CONSTRAINT "user_follows_follower_id_following_id_key" UNIQUE ("follower_id", "following_id");



ALTER TABLE ONLY "public"."user_follows"
    ADD CONSTRAINT "user_follows_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_library"
    ADD CONSTRAINT "user_library_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_library"
    ADD CONSTRAINT "user_library_user_id_item_type_item_id_action_type_key" UNIQUE ("user_id", "item_type", "item_id", "action_type");



ALTER TABLE ONLY "public"."user_recent_tracks"
    ADD CONSTRAINT "user_recent_tracks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_sessions"
    ADD CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_sessions"
    ADD CONSTRAINT "user_sessions_session_token_key" UNIQUE ("session_token");



ALTER TABLE ONLY "public"."user_wallets"
    ADD CONSTRAINT "user_wallets_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_wallets"
    ADD CONSTRAINT "user_wallets_user_id_wallet_address_key" UNIQUE ("user_id", "wallet_address");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_telegram_id_key" UNIQUE ("telegram_id");



CREATE INDEX "idx_albums_artist_id" ON "public"."albums" USING "btree" ("artist_id");



CREATE INDEX "idx_audio_presets_user_id" ON "public"."audio_presets" USING "btree" ("user_id");



CREATE INDEX "idx_comments_parent_comment_id" ON "public"."comments" USING "btree" ("parent_comment_id");



CREATE INDEX "idx_comments_target" ON "public"."comments" USING "btree" ("target_type", "target_id", "created_at" DESC);



CREATE INDEX "idx_comments_user_id" ON "public"."comments" USING "btree" ("user_id");



CREATE INDEX "idx_community_posts_user_id" ON "public"."community_posts" USING "btree" ("user_id");



CREATE INDEX "idx_content_reports_moderator_user_id" ON "public"."content_reports" USING "btree" ("moderator_user_id");



CREATE INDEX "idx_content_reports_reporter_user_id" ON "public"."content_reports" USING "btree" ("reporter_user_id");



CREATE INDEX "idx_contest_entries_contest_score" ON "public"."contest_entries" USING "btree" ("contest_id", "score" DESC);



CREATE INDEX "idx_contest_entries_remix_id" ON "public"."contest_entries" USING "btree" ("remix_id");



CREATE INDEX "idx_contest_entries_user_id" ON "public"."contest_entries" USING "btree" ("user_id");



CREATE INDEX "idx_contest_votes_entry_id" ON "public"."contest_votes" USING "btree" ("entry_id");



CREATE INDEX "idx_contest_votes_voter_id" ON "public"."contest_votes" USING "btree" ("voter_id");



CREATE INDEX "idx_contests_created_by_user_id" ON "public"."contests" USING "btree" ("created_by_user_id");



CREATE INDEX "idx_contests_end_date" ON "public"."contests" USING "btree" ("end_date");



CREATE INDEX "idx_contests_status" ON "public"."contests" USING "btree" ("status");



CREATE INDEX "idx_music_tracks_embedding" ON "public"."music_tracks" USING "hnsw" ("embedding" "extensions"."vector_cosine_ops");



CREATE INDEX "idx_nft_collections_creator_id" ON "public"."nft_collections" USING "btree" ("creator_id");



CREATE INDEX "idx_nft_transactions_from_user_id" ON "public"."nft_transactions" USING "btree" ("from_user_id");



CREATE INDEX "idx_nft_transactions_nft" ON "public"."nft_transactions" USING "btree" ("nft_id", "created_at" DESC);



CREATE INDEX "idx_nft_transactions_to_user_id" ON "public"."nft_transactions" USING "btree" ("to_user_id");



CREATE INDEX "idx_nfts_collection_id" ON "public"."nfts" USING "btree" ("collection_id");



CREATE INDEX "idx_nfts_creator" ON "public"."nfts" USING "btree" ("creator_id");



CREATE INDEX "idx_nfts_listed" ON "public"."nfts" USING "btree" ("is_listed") WHERE ("is_listed" = true);



CREATE INDEX "idx_nfts_owner" ON "public"."nfts" USING "btree" ("current_owner_id");



CREATE INDEX "idx_nfts_preset_id" ON "public"."nfts" USING "btree" ("preset_id");



CREATE INDEX "idx_nfts_remix_id" ON "public"."nfts" USING "btree" ("remix_id");



CREATE INDEX "idx_playback_history_played_at" ON "public"."playback_history" USING "btree" ("played_at");



CREATE INDEX "idx_playback_history_track_id" ON "public"."playback_history" USING "btree" ("track_id");



CREATE INDEX "idx_playback_history_user_id" ON "public"."playback_history" USING "btree" ("user_id");



CREATE INDEX "idx_playback_history_user_track" ON "public"."playback_history" USING "btree" ("user_id", "track_id");



CREATE INDEX "idx_playbacks_created_at" ON "public"."playbacks" USING "btree" ("created_at");



CREATE INDEX "idx_playbacks_track_id" ON "public"."playbacks" USING "btree" ("track_id");



CREATE INDEX "idx_playlist_tracks_added_by_user_id" ON "public"."playlist_tracks" USING "btree" ("added_by_user_id");



CREATE INDEX "idx_playlist_tracks_playlist_id" ON "public"."playlist_tracks" USING "btree" ("playlist_id");



CREATE INDEX "idx_playlist_tracks_remix_id" ON "public"."playlist_tracks" USING "btree" ("remix_id");



CREATE INDEX "idx_playlist_tracks_track_id" ON "public"."playlist_tracks" USING "btree" ("track_id");



CREATE INDEX "idx_playlists_user_id" ON "public"."playlists" USING "btree" ("user_id");



CREATE INDEX "idx_remixes_created_at" ON "public"."remixes" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_remixes_is_public" ON "public"."remixes" USING "btree" ("is_public") WHERE ("is_public" = true);



CREATE INDEX "idx_remixes_original_track_id" ON "public"."remixes" USING "btree" ("original_track_id");



CREATE INDEX "idx_remixes_play_count" ON "public"."remixes" USING "btree" ("play_count" DESC);



CREATE INDEX "idx_remixes_user_id" ON "public"."remixes" USING "btree" ("user_id");



CREATE INDEX "idx_social_interactions_user_target" ON "public"."social_interactions" USING "btree" ("user_id", "target_type", "target_id");



CREATE INDEX "idx_stars_transactions_user_id" ON "public"."stars_transactions" USING "btree" ("user_id");



CREATE INDEX "idx_ton_transactions_user_id" ON "public"."ton_transactions" USING "btree" ("user_id");



CREATE INDEX "idx_tracks_album_id" ON "public"."tracks" USING "btree" ("album_id");



CREATE INDEX "idx_tracks_artist_id" ON "public"."tracks" USING "btree" ("artist_id");



CREATE INDEX "idx_tracks_created_at" ON "public"."tracks" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_tracks_genre" ON "public"."tracks" USING "btree" ("genre");



CREATE INDEX "idx_tracks_play_count" ON "public"."tracks" USING "btree" ("play_count" DESC);



CREATE INDEX "idx_tracks_slug" ON "public"."tracks" USING "btree" ("slug");



CREATE INDEX "idx_user_achievements_user_id" ON "public"."user_achievements" USING "btree" ("user_id");



CREATE INDEX "idx_user_activities_activity_type" ON "public"."user_activities" USING "btree" ("activity_type");



CREATE INDEX "idx_user_activities_target" ON "public"."user_activities" USING "btree" ("target_id", "target_type");



CREATE INDEX "idx_user_activities_timestamp" ON "public"."user_activities" USING "btree" ("timestamp");



CREATE INDEX "idx_user_activities_type" ON "public"."user_activities" USING "btree" ("activity_type", "created_at" DESC);



CREATE INDEX "idx_user_activities_user_id" ON "public"."user_activities" USING "btree" ("user_id");



CREATE INDEX "idx_user_activities_user_time" ON "public"."user_activities" USING "btree" ("user_id", "created_at" DESC);



CREATE INDEX "idx_user_favorite_artists_added_at" ON "public"."user_favorite_artists" USING "btree" ("added_at");



CREATE INDEX "idx_user_favorite_artists_artist_id" ON "public"."user_favorite_artists" USING "btree" ("artist_id");



CREATE INDEX "idx_user_favorite_artists_user_id" ON "public"."user_favorite_artists" USING "btree" ("user_id");



CREATE INDEX "idx_user_follows_follower" ON "public"."user_follows" USING "btree" ("follower_id");



CREATE INDEX "idx_user_follows_following" ON "public"."user_follows" USING "btree" ("following_id");



CREATE INDEX "idx_user_recent_tracks_track" ON "public"."user_recent_tracks" USING "btree" ("track_id");



CREATE INDEX "idx_user_recent_tracks_user_played" ON "public"."user_recent_tracks" USING "btree" ("user_id", "played_at" DESC);



CREATE INDEX "idx_user_sessions_user_id" ON "public"."user_sessions" USING "btree" ("user_id");



CREATE INDEX "idx_users_created_at" ON "public"."users" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_users_level" ON "public"."users" USING "btree" ("level" DESC);



CREATE INDEX "idx_users_telegram_id" ON "public"."users" USING "btree" ("telegram_id");



CREATE INDEX "kv_store_82f19583_key_idx" ON "public"."kv_store_82f19583" USING "btree" ("key" "text_pattern_ops");



CREATE OR REPLACE TRIGGER "update_comments_updated_at" BEFORE UPDATE ON "public"."comments" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_community_posts_updated_at" BEFORE UPDATE ON "public"."community_posts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_playlists_updated_at" BEFORE UPDATE ON "public"."playlists" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_remixes_updated_at" BEFORE UPDATE ON "public"."remixes" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_user_recent_tracks_updated_at" BEFORE UPDATE ON "public"."user_recent_tracks" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_users_updated_at" BEFORE UPDATE ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."albums"
    ADD CONSTRAINT "albums_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id");



ALTER TABLE ONLY "public"."audio_presets"
    ADD CONSTRAINT "audio_presets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_parent_comment_id_fkey" FOREIGN KEY ("parent_comment_id") REFERENCES "public"."comments"("id");



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."community_posts"
    ADD CONSTRAINT "community_posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."content_reports"
    ADD CONSTRAINT "content_reports_moderator_user_id_fkey" FOREIGN KEY ("moderator_user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."content_reports"
    ADD CONSTRAINT "content_reports_reporter_user_id_fkey" FOREIGN KEY ("reporter_user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."contest_entries"
    ADD CONSTRAINT "contest_entries_contest_id_fkey" FOREIGN KEY ("contest_id") REFERENCES "public"."contests"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."contest_entries"
    ADD CONSTRAINT "contest_entries_remix_id_fkey" FOREIGN KEY ("remix_id") REFERENCES "public"."remixes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."contest_entries"
    ADD CONSTRAINT "contest_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."contest_votes"
    ADD CONSTRAINT "contest_votes_contest_id_fkey" FOREIGN KEY ("contest_id") REFERENCES "public"."contests"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."contest_votes"
    ADD CONSTRAINT "contest_votes_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "public"."contest_entries"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."contest_votes"
    ADD CONSTRAINT "contest_votes_voter_id_fkey" FOREIGN KEY ("voter_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."contests"
    ADD CONSTRAINT "contests_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."nft_collections"
    ADD CONSTRAINT "nft_collections_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."nft_transactions"
    ADD CONSTRAINT "nft_transactions_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."nft_transactions"
    ADD CONSTRAINT "nft_transactions_nft_id_fkey" FOREIGN KEY ("nft_id") REFERENCES "public"."nfts"("id");



ALTER TABLE ONLY "public"."nft_transactions"
    ADD CONSTRAINT "nft_transactions_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."nfts"
    ADD CONSTRAINT "nfts_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "public"."nft_collections"("id");



ALTER TABLE ONLY "public"."nfts"
    ADD CONSTRAINT "nfts_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."nfts"
    ADD CONSTRAINT "nfts_current_owner_id_fkey" FOREIGN KEY ("current_owner_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."nfts"
    ADD CONSTRAINT "nfts_preset_id_fkey" FOREIGN KEY ("preset_id") REFERENCES "public"."audio_presets"("id");



ALTER TABLE ONLY "public"."nfts"
    ADD CONSTRAINT "nfts_remix_id_fkey" FOREIGN KEY ("remix_id") REFERENCES "public"."remixes"("id");



ALTER TABLE ONLY "public"."playback_history"
    ADD CONSTRAINT "playback_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("telegram_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."playbacks"
    ADD CONSTRAINT "playbacks_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "public"."tracks"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."playlist_tracks"
    ADD CONSTRAINT "playlist_tracks_added_by_user_id_fkey" FOREIGN KEY ("added_by_user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."playlist_tracks"
    ADD CONSTRAINT "playlist_tracks_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "public"."playlists"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."playlist_tracks"
    ADD CONSTRAINT "playlist_tracks_remix_id_fkey" FOREIGN KEY ("remix_id") REFERENCES "public"."remixes"("id");



ALTER TABLE ONLY "public"."playlist_tracks"
    ADD CONSTRAINT "playlist_tracks_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "public"."tracks"("id");



ALTER TABLE ONLY "public"."playlists"
    ADD CONSTRAINT "playlists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."remixes"
    ADD CONSTRAINT "remixes_original_track_id_fkey" FOREIGN KEY ("original_track_id") REFERENCES "public"."tracks"("id");



ALTER TABLE ONLY "public"."remixes"
    ADD CONSTRAINT "remixes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."social_interactions"
    ADD CONSTRAINT "social_interactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."stars_transactions"
    ADD CONSTRAINT "stars_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ton_transactions"
    ADD CONSTRAINT "ton_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."tracks"
    ADD CONSTRAINT "tracks_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "public"."albums"("id");



ALTER TABLE ONLY "public"."tracks"
    ADD CONSTRAINT "tracks_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id");



ALTER TABLE ONLY "public"."user_achievements"
    ADD CONSTRAINT "user_achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_activities"
    ADD CONSTRAINT "user_activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("telegram_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_favorite_artists"
    ADD CONSTRAINT "user_favorite_artists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_follows"
    ADD CONSTRAINT "user_follows_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_follows"
    ADD CONSTRAINT "user_follows_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_library"
    ADD CONSTRAINT "user_library_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_recent_tracks"
    ADD CONSTRAINT "user_recent_tracks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_sessions"
    ADD CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_wallets"
    ADD CONSTRAINT "user_wallets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Albums are viewable by everyone" ON "public"."albums" FOR SELECT USING (true);



CREATE POLICY "Anyone can insert playbacks" ON "public"."playbacks" FOR INSERT WITH CHECK (true);



CREATE POLICY "App config is viewable by everyone" ON "public"."app_config" FOR SELECT USING (true);



CREATE POLICY "Artists are viewable by everyone" ON "public"."artists" FOR SELECT USING (true);



CREATE POLICY "Audio presets are viewable by everyone" ON "public"."audio_presets" FOR SELECT USING (true);



CREATE POLICY "Comments are viewable by everyone" ON "public"."comments" FOR SELECT USING (true);



CREATE POLICY "Community posts are viewable by everyone" ON "public"."community_posts" FOR SELECT USING (true);



CREATE POLICY "Content reports can be inserted by anyone" ON "public"."content_reports" FOR INSERT WITH CHECK (true);



CREATE POLICY "Content reports can be selected by service role" ON "public"."content_reports" FOR SELECT USING ((( SELECT "current_setting"('role'::"text") AS "current_setting") = 'service_role'::"text"));



CREATE POLICY "Contest entries are viewable by everyone" ON "public"."contest_entries" FOR SELECT USING (true);



CREATE POLICY "Contest votes are viewable by everyone" ON "public"."contest_votes" FOR SELECT USING (true);



CREATE POLICY "Contests are viewable by everyone" ON "public"."contests" FOR SELECT USING (true);



CREATE POLICY "Favorite artists are viewable by user" ON "public"."user_favorite_artists" FOR SELECT USING (((("auth"."uid"())::"text")::bigint = "user_id"));



CREATE POLICY "KV store can be inserted by anyone" ON "public"."kv_store_82f19583" FOR INSERT WITH CHECK (true);



CREATE POLICY "KV store can be updated by anyone" ON "public"."kv_store_82f19583" FOR UPDATE USING (true);



CREATE POLICY "KV store is viewable by everyone" ON "public"."kv_store_82f19583" FOR SELECT USING (true);



CREATE POLICY "NFT collections are viewable by everyone" ON "public"."nft_collections" FOR SELECT USING (true);



CREATE POLICY "NFT transactions are viewable by everyone" ON "public"."nft_transactions" FOR SELECT USING (true);



CREATE POLICY "NFTs are viewable by everyone" ON "public"."nfts" FOR SELECT USING (true);



CREATE POLICY "Platform metrics can be inserted by service role" ON "public"."platform_metrics" FOR INSERT WITH CHECK ((( SELECT "current_setting"('role'::"text") AS "current_setting") = 'service_role'::"text"));



CREATE POLICY "Platform metrics can be selected by service role" ON "public"."platform_metrics" FOR SELECT USING ((( SELECT "current_setting"('role'::"text") AS "current_setting") = 'service_role'::"text"));



CREATE POLICY "Playlist tracks are viewable by everyone" ON "public"."playlist_tracks" FOR SELECT USING (true);



CREATE POLICY "Playlists are viewable by everyone" ON "public"."playlists" FOR SELECT USING (true);



CREATE POLICY "Public playbacks are viewable by everyone" ON "public"."playbacks" FOR SELECT USING (true);



CREATE POLICY "Public tracks are viewable by everyone" ON "public"."tracks" FOR SELECT USING (true);



CREATE POLICY "Service role can insert tracks" ON "public"."music_tracks" FOR INSERT TO "service_role" WITH CHECK (true);



CREATE POLICY "User activities are viewable by everyone" ON "public"."user_activities" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Users can delete playlist tracks" ON "public"."playlist_tracks" FOR DELETE USING (true);



CREATE POLICY "Users can delete their own favorite artists" ON "public"."user_favorite_artists" FOR DELETE USING (((("auth"."uid"())::"text")::bigint = "user_id"));



CREATE POLICY "Users can delete their own playlists" ON "public"."playlists" FOR DELETE USING (true);



CREATE POLICY "Users can delete their own recent tracks" ON "public"."user_recent_tracks" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert playlist tracks" ON "public"."playlist_tracks" FOR INSERT WITH CHECK (true);



CREATE POLICY "Users can insert their own activities" ON "public"."user_activities" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Users can insert their own comments" ON "public"."comments" FOR INSERT WITH CHECK (true);



CREATE POLICY "Users can insert their own community posts" ON "public"."community_posts" FOR INSERT WITH CHECK (true);



CREATE POLICY "Users can insert their own contest entries" ON "public"."contest_entries" FOR INSERT WITH CHECK (true);



CREATE POLICY "Users can insert their own contest votes" ON "public"."contest_votes" FOR INSERT WITH CHECK (true);



CREATE POLICY "Users can insert their own favorite artists" ON "public"."user_favorite_artists" FOR INSERT WITH CHECK (((("auth"."uid"())::"text")::bigint = "user_id"));



CREATE POLICY "Users can insert their own playback history" ON "public"."playback_history" FOR INSERT WITH CHECK (true);



CREATE POLICY "Users can insert their own playlists" ON "public"."playlists" FOR INSERT WITH CHECK (true);



CREATE POLICY "Users can insert their own recent tracks" ON "public"."user_recent_tracks" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own comments" ON "public"."comments" FOR UPDATE USING (true);



CREATE POLICY "Users can update their own community posts" ON "public"."community_posts" FOR UPDATE USING (true);



CREATE POLICY "Users can update their own playback history" ON "public"."playback_history" FOR UPDATE USING (true);



CREATE POLICY "Users can update their own playlists" ON "public"."playlists" FOR UPDATE USING (true);



CREATE POLICY "Users can update their own recent tracks" ON "public"."user_recent_tracks" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own playback history" ON "public"."playback_history" FOR SELECT USING (true);



CREATE POLICY "Users can view their own recent tracks" ON "public"."user_recent_tracks" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view tracks" ON "public"."music_tracks" FOR SELECT TO "authenticated" USING (true);



ALTER TABLE "public"."albums" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."app_config" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."artists" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."audio_presets" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."comments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."community_posts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."content_reports" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."contest_entries" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."contest_votes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."contests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."kv_store_82f19583" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."music_tracks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."nft_collections" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."nft_transactions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."nfts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."platform_metrics" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."playback_history" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."playbacks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."playlist_tracks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."playlists" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."remixes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."social_interactions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."stars_transactions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ton_transactions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tracks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_achievements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_activities" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_favorite_artists" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_follows" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_library" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_recent_tracks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_sessions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_wallets" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."calculate_user_level"("user_stars" integer, "total_remixes" integer, "total_likes" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."calculate_user_level"("user_stars" integer, "total_remixes" integer, "total_likes" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."calculate_user_level"("user_stars" integer, "total_remixes" integer, "total_likes" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_counter"("table_name" "text", "column_name" "text", "record_id" bigint, "increment_by" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."increment_counter"("table_name" "text", "column_name" "text", "record_id" bigint, "increment_by" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_counter"("table_name" "text", "column_name" "text", "record_id" bigint, "increment_by" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."recommend_tracks"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."recommend_tracks"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."recommend_tracks"("user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."recommend_tracks"("input_track_name" "text", "input_artist_name" "text", "max_tracks" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."recommend_tracks"("input_track_name" "text", "input_artist_name" "text", "max_tracks" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."recommend_tracks"("input_track_name" "text", "input_artist_name" "text", "max_tracks" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON TABLE "public"."albums" TO "anon";
GRANT ALL ON TABLE "public"."albums" TO "authenticated";
GRANT ALL ON TABLE "public"."albums" TO "service_role";



GRANT ALL ON SEQUENCE "public"."albums_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."albums_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."albums_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."app_config" TO "anon";
GRANT ALL ON TABLE "public"."app_config" TO "authenticated";
GRANT ALL ON TABLE "public"."app_config" TO "service_role";



GRANT ALL ON SEQUENCE "public"."app_config_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."app_config_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."app_config_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."artists" TO "anon";
GRANT ALL ON TABLE "public"."artists" TO "authenticated";
GRANT ALL ON TABLE "public"."artists" TO "service_role";



GRANT ALL ON SEQUENCE "public"."artists_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."artists_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."artists_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."audio_presets" TO "anon";
GRANT ALL ON TABLE "public"."audio_presets" TO "authenticated";
GRANT ALL ON TABLE "public"."audio_presets" TO "service_role";



GRANT ALL ON SEQUENCE "public"."audio_presets_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."audio_presets_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."audio_presets_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."comments" TO "anon";
GRANT ALL ON TABLE "public"."comments" TO "authenticated";
GRANT ALL ON TABLE "public"."comments" TO "service_role";



GRANT ALL ON SEQUENCE "public"."comments_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."comments_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."comments_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."community_posts" TO "anon";
GRANT ALL ON TABLE "public"."community_posts" TO "authenticated";
GRANT ALL ON TABLE "public"."community_posts" TO "service_role";



GRANT ALL ON SEQUENCE "public"."community_posts_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."community_posts_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."community_posts_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."content_reports" TO "anon";
GRANT ALL ON TABLE "public"."content_reports" TO "authenticated";
GRANT ALL ON TABLE "public"."content_reports" TO "service_role";



GRANT ALL ON SEQUENCE "public"."content_reports_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."content_reports_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."content_reports_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."contest_entries" TO "anon";
GRANT ALL ON TABLE "public"."contest_entries" TO "authenticated";
GRANT ALL ON TABLE "public"."contest_entries" TO "service_role";



GRANT ALL ON SEQUENCE "public"."contest_entries_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."contest_entries_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."contest_entries_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."contest_votes" TO "anon";
GRANT ALL ON TABLE "public"."contest_votes" TO "authenticated";
GRANT ALL ON TABLE "public"."contest_votes" TO "service_role";



GRANT ALL ON SEQUENCE "public"."contest_votes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."contest_votes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."contest_votes_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."contests" TO "anon";
GRANT ALL ON TABLE "public"."contests" TO "authenticated";
GRANT ALL ON TABLE "public"."contests" TO "service_role";



GRANT ALL ON SEQUENCE "public"."contests_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."contests_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."contests_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."kv_store_82f19583" TO "anon";
GRANT ALL ON TABLE "public"."kv_store_82f19583" TO "authenticated";
GRANT ALL ON TABLE "public"."kv_store_82f19583" TO "service_role";



GRANT ALL ON TABLE "public"."music_tracks" TO "anon";
GRANT ALL ON TABLE "public"."music_tracks" TO "authenticated";
GRANT ALL ON TABLE "public"."music_tracks" TO "service_role";



GRANT ALL ON SEQUENCE "public"."music_tracks_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."music_tracks_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."music_tracks_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."nft_collections" TO "anon";
GRANT ALL ON TABLE "public"."nft_collections" TO "authenticated";
GRANT ALL ON TABLE "public"."nft_collections" TO "service_role";



GRANT ALL ON SEQUENCE "public"."nft_collections_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."nft_collections_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."nft_collections_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."nft_transactions" TO "anon";
GRANT ALL ON TABLE "public"."nft_transactions" TO "authenticated";
GRANT ALL ON TABLE "public"."nft_transactions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."nft_transactions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."nft_transactions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."nft_transactions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."nfts" TO "anon";
GRANT ALL ON TABLE "public"."nfts" TO "authenticated";
GRANT ALL ON TABLE "public"."nfts" TO "service_role";



GRANT ALL ON SEQUENCE "public"."nfts_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."nfts_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."nfts_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."platform_metrics" TO "anon";
GRANT ALL ON TABLE "public"."platform_metrics" TO "authenticated";
GRANT ALL ON TABLE "public"."platform_metrics" TO "service_role";



GRANT ALL ON SEQUENCE "public"."platform_metrics_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."platform_metrics_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."platform_metrics_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."playback_history" TO "anon";
GRANT ALL ON TABLE "public"."playback_history" TO "authenticated";
GRANT ALL ON TABLE "public"."playback_history" TO "service_role";



GRANT ALL ON TABLE "public"."playbacks" TO "anon";
GRANT ALL ON TABLE "public"."playbacks" TO "authenticated";
GRANT ALL ON TABLE "public"."playbacks" TO "service_role";



GRANT ALL ON TABLE "public"."playlist_tracks" TO "anon";
GRANT ALL ON TABLE "public"."playlist_tracks" TO "authenticated";
GRANT ALL ON TABLE "public"."playlist_tracks" TO "service_role";



GRANT ALL ON SEQUENCE "public"."playlist_tracks_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."playlist_tracks_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."playlist_tracks_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."playlists" TO "anon";
GRANT ALL ON TABLE "public"."playlists" TO "authenticated";
GRANT ALL ON TABLE "public"."playlists" TO "service_role";



GRANT ALL ON SEQUENCE "public"."playlists_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."playlists_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."playlists_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."remixes" TO "anon";
GRANT ALL ON TABLE "public"."remixes" TO "authenticated";
GRANT ALL ON TABLE "public"."remixes" TO "service_role";



GRANT ALL ON SEQUENCE "public"."remixes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."remixes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."remixes_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."social_interactions" TO "anon";
GRANT ALL ON TABLE "public"."social_interactions" TO "authenticated";
GRANT ALL ON TABLE "public"."social_interactions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."social_interactions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."social_interactions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."social_interactions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."stars_transactions" TO "anon";
GRANT ALL ON TABLE "public"."stars_transactions" TO "authenticated";
GRANT ALL ON TABLE "public"."stars_transactions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."stars_transactions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."stars_transactions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."stars_transactions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."ton_transactions" TO "anon";
GRANT ALL ON TABLE "public"."ton_transactions" TO "authenticated";
GRANT ALL ON TABLE "public"."ton_transactions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."ton_transactions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."ton_transactions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."ton_transactions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."tracks" TO "anon";
GRANT ALL ON TABLE "public"."tracks" TO "authenticated";
GRANT ALL ON TABLE "public"."tracks" TO "service_role";



GRANT ALL ON SEQUENCE "public"."tracks_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."tracks_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."tracks_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."user_achievements" TO "anon";
GRANT ALL ON TABLE "public"."user_achievements" TO "authenticated";
GRANT ALL ON TABLE "public"."user_achievements" TO "service_role";



GRANT ALL ON SEQUENCE "public"."user_achievements_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_achievements_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_achievements_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."user_activities" TO "anon";
GRANT ALL ON TABLE "public"."user_activities" TO "authenticated";
GRANT ALL ON TABLE "public"."user_activities" TO "service_role";



GRANT ALL ON SEQUENCE "public"."user_activities_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_activities_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_activities_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."user_favorite_artists" TO "anon";
GRANT ALL ON TABLE "public"."user_favorite_artists" TO "authenticated";
GRANT ALL ON TABLE "public"."user_favorite_artists" TO "service_role";



GRANT ALL ON TABLE "public"."user_follows" TO "anon";
GRANT ALL ON TABLE "public"."user_follows" TO "authenticated";
GRANT ALL ON TABLE "public"."user_follows" TO "service_role";



GRANT ALL ON SEQUENCE "public"."user_follows_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_follows_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_follows_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."user_library" TO "anon";
GRANT ALL ON TABLE "public"."user_library" TO "authenticated";
GRANT ALL ON TABLE "public"."user_library" TO "service_role";



GRANT ALL ON SEQUENCE "public"."user_library_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_library_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_library_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."user_recent_tracks" TO "anon";
GRANT ALL ON TABLE "public"."user_recent_tracks" TO "authenticated";
GRANT ALL ON TABLE "public"."user_recent_tracks" TO "service_role";



GRANT ALL ON TABLE "public"."user_sessions" TO "anon";
GRANT ALL ON TABLE "public"."user_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."user_sessions" TO "service_role";



GRANT ALL ON SEQUENCE "public"."user_sessions_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_sessions_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_sessions_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."user_wallets" TO "anon";
GRANT ALL ON TABLE "public"."user_wallets" TO "authenticated";
GRANT ALL ON TABLE "public"."user_wallets" TO "service_role";



GRANT ALL ON SEQUENCE "public"."user_wallets_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_wallets_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_wallets_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."users_id_seq" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






RESET ALL;
