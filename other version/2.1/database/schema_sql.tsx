-- TunTON Music Platform Database Schema
-- Supports Telegram integration, music streaming, social features, NFT marketplace, and TON blockchain

-- =================
-- USER MANAGEMENT
-- =================

-- Users table with Telegram integration
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    telegram_id BIGINT UNIQUE NOT NULL,
    telegram_username VARCHAR(255),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    telegram_photo_url TEXT,
    is_premium BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    
    -- TunTON specific fields
    level INTEGER DEFAULT 1,
    stars_balance INTEGER DEFAULT 0,
    ton_wallet_address VARCHAR(255),
    total_remixes INTEGER DEFAULT 0,
    total_likes_received INTEGER DEFAULT 0,
    total_plays INTEGER DEFAULT 0,
    
    -- Preferences
    default_audio_profile JSONB DEFAULT '{}', -- User's default effect preferences
    privacy_settings JSONB DEFAULT '{"profile": "public", "library": "friends", "activity": "public"}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    onboarding_completed_at TIMESTAMP WITH TIME ZONE
);

-- User achievements and badges
CREATE TABLE user_achievements (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    achievement_type VARCHAR(100) NOT NULL, -- 'lofi_master', 'speed_demon', 'community_favorite'
    achievement_data JSONB, -- Additional data like progress, metadata
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    stars_reward INTEGER DEFAULT 0
);

-- User sessions and activity tracking
CREATE TABLE user_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    telegram_auth_data JSONB,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =================
-- MUSIC LIBRARY
-- =================

-- Artists
CREATE TABLE artists (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    monthly_listeners INTEGER DEFAULT 0,
    total_tracks INTEGER DEFAULT 0,
    bio TEXT,
    social_links JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Albums
CREATE TABLE albums (
    id BIGSERIAL PRIMARY KEY,
    artist_id BIGINT REFERENCES artists(id),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    cover_url TEXT,
    release_date DATE,
    genre VARCHAR(100),
    total_tracks INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Original tracks (licensed content)
CREATE TABLE tracks (
    id BIGSERIAL PRIMARY KEY,
    artist_id BIGINT REFERENCES artists(id),
    album_id BIGINT REFERENCES albums(id),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    duration INTEGER NOT NULL, -- Duration in seconds
    file_url TEXT NOT NULL, -- Audio file URL
    cover_url TEXT,
    genre VARCHAR(100),
    bpm INTEGER,
    key_signature VARCHAR(10),
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
    audio_features JSONB, -- AI-analyzed features (tempo, vocals, instruments, etc.)
    license_info JSONB, -- Licensing and rights information
    play_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    remix_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =================
-- AUDIO PROCESSING & REMIXES
-- =================

-- Audio effect presets that users can save and share
CREATE TABLE audio_presets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    effects_config JSONB NOT NULL, -- Complete effects configuration
    /*
    Example effects_config:
    {
        "tempo": {"enabled": true, "value": 1.25},
        "lofi": {"enabled": true, "preset": "vinyl", "intensity": 0.7},
        "eq": {"enabled": true, "bands": [0, 2, -1, 0, 1, -2, 0]},
        "vocals": {"enabled": true, "type": "remove"},
        "ambient": {"enabled": true, "type": "rain", "volume": 0.3}
    }
    */
    is_public BOOLEAN DEFAULT TRUE,
    use_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User remixes (tracks with applied effects)
CREATE TABLE remixes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    original_track_id BIGINT REFERENCES tracks(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_url TEXT,
    duration INTEGER,
    
    -- Audio processing data
    effects_config JSONB NOT NULL,
    processed_file_url TEXT, -- Pre-processed version for sharing
    processing_metadata JSONB, -- Technical details about processing
    
    -- Engagement metrics
    play_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    stars_earned INTEGER DEFAULT 0,
    
    -- Visibility and status
    is_public BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    contest_entry_id BIGINT, -- If part of a contest
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =================
-- PLAYLISTS & LIBRARY
-- =================

-- User playlists
CREATE TABLE playlists (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_url TEXT,
    is_private BOOLEAN DEFAULT FALSE,
    is_ai_generated BOOLEAN DEFAULT FALSE,
    ai_generation_prompt TEXT, -- If AI-generated, store the prompt
    total_tracks INTEGER DEFAULT 0,
    total_duration INTEGER DEFAULT 0, -- Total duration in seconds
    play_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    follower_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Playlist tracks (supports both original tracks and remixes)
CREATE TABLE playlist_tracks (
    id BIGSERIAL PRIMARY KEY,
    playlist_id BIGINT REFERENCES playlists(id) ON DELETE CASCADE,
    track_id BIGINT REFERENCES tracks(id),
    remix_id BIGINT REFERENCES remixes(id),
    position INTEGER NOT NULL,
    added_by_user_id BIGINT REFERENCES users(id),
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT playlist_tracks_content CHECK (
        (track_id IS NOT NULL AND remix_id IS NULL) OR 
        (track_id IS NULL AND remix_id IS NOT NULL)
    )
);

-- User's library (liked tracks, followed artists, etc.)
CREATE TABLE user_library (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL, -- 'track', 'remix', 'playlist', 'artist', 'preset'
    item_id BIGINT NOT NULL,
    action_type VARCHAR(50) NOT NULL, -- 'like', 'follow', 'save', 'download'
    metadata JSONB DEFAULT '{}', -- Additional data like download quality, save reason
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, item_type, item_id, action_type)
);

-- =================
-- SOCIAL FEATURES
-- =================

-- User follows
CREATE TABLE user_follows (
    id BIGSERIAL PRIMARY KEY,
    follower_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    following_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(follower_id, following_id),
    CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

-- Social interactions (likes, shares, etc.)
CREATE TABLE social_interactions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(50) NOT NULL, -- 'track', 'remix', 'playlist', 'comment'
    target_id BIGINT NOT NULL,
    interaction_type VARCHAR(50) NOT NULL, -- 'like', 'share', 'bookmark', 'report'
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, target_type, target_id, interaction_type)
);

-- Comments system
CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(50) NOT NULL, -- 'track', 'remix', 'playlist'
    target_id BIGINT NOT NULL,
    parent_comment_id BIGINT REFERENCES comments(id), -- For replies
    content TEXT NOT NULL,
    like_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community posts (social feed)
CREATE TABLE community_posts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    post_type VARCHAR(50) NOT NULL, -- 'remix_share', 'achievement', 'collaboration', 'general'
    content TEXT,
    media_urls TEXT[], -- Array of media URLs
    linked_content JSONB, -- References to tracks, remixes, contests, etc.
    
    -- Engagement
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    
    -- Visibility
    is_public BOOLEAN DEFAULT TRUE,
    is_pinned BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =================
-- CONTESTS & CHALLENGES
-- =================

-- Contest definitions
CREATE TABLE contests (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_url TEXT,
    contest_type VARCHAR(50) NOT NULL, -- 'remix', 'speed', 'technical', 'collaborative'
    rules JSONB, -- Contest-specific rules and requirements
    
    -- Prizes and rewards
    prize_pool_ton DECIMAL(15,8) DEFAULT 0,
    prize_pool_stars INTEGER DEFAULT 0,
    prize_distribution JSONB, -- How prizes are distributed
    
    -- Timing
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    voting_end_date TIMESTAMP WITH TIME ZONE,
    
    -- Participation
    max_participants INTEGER,
    participant_count INTEGER DEFAULT 0,
    entry_count INTEGER DEFAULT 0,
    
    -- Status
    status VARCHAR(50) DEFAULT 'upcoming', -- 'upcoming', 'active', 'voting', 'ended'
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_by_user_id BIGINT REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contest entries
CREATE TABLE contest_entries (
    id BIGSERIAL PRIMARY KEY,
    contest_id BIGINT REFERENCES contests(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    remix_id BIGINT REFERENCES remixes(id) ON DELETE CASCADE,
    
    -- Competition metrics
    vote_count INTEGER DEFAULT 0,
    score DECIMAL(5,2) DEFAULT 0.0,
    rank_position INTEGER,
    
    -- Metadata
    entry_metadata JSONB DEFAULT '{}',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(contest_id, user_id) -- One entry per user per contest
);

-- Contest voting
CREATE TABLE contest_votes (
    id BIGSERIAL PRIMARY KEY,
    contest_id BIGINT REFERENCES contests(id) ON DELETE CASCADE,
    entry_id BIGINT REFERENCES contest_entries(id) ON DELETE CASCADE,
    voter_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    vote_weight INTEGER DEFAULT 1, -- For weighted voting systems
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(contest_id, entry_id, voter_id)
);

-- =================
-- NFT MARKETPLACE
-- =================

-- NFT collections for audio content
CREATE TABLE nft_collections (
    id BIGSERIAL PRIMARY KEY,
    creator_id BIGINT REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    symbol VARCHAR(20),
    cover_url TEXT,
    total_supply INTEGER,
    minted_count INTEGER DEFAULT 0,
    floor_price_ton DECIMAL(15,8),
    total_volume_ton DECIMAL(15,8) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Individual NFTs (audio presets, exclusive remixes, etc.)
CREATE TABLE nfts (
    id BIGSERIAL PRIMARY KEY,
    collection_id BIGINT REFERENCES nft_collections(id),
    token_id VARCHAR(255) UNIQUE NOT NULL,
    ton_contract_address VARCHAR(255),
    
    -- Content
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    audio_url TEXT,
    metadata_url TEXT,
    
    -- Linked content
    preset_id BIGINT REFERENCES audio_presets(id),
    remix_id BIGINT REFERENCES remixes(id),
    
    -- Ownership
    current_owner_id BIGINT REFERENCES users(id),
    creator_id BIGINT REFERENCES users(id),
    
    -- Market data
    mint_price_ton DECIMAL(15,8),
    last_sale_price_ton DECIMAL(15,8),
    current_listing_price_ton DECIMAL(15,8),
    is_listed BOOLEAN DEFAULT FALSE,
    
    -- Rarity and traits
    rarity_rank INTEGER,
    traits JSONB DEFAULT '{}',
    
    -- Timestamps
    minted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NFT marketplace transactions
CREATE TABLE nft_transactions (
    id BIGSERIAL PRIMARY KEY,
    nft_id BIGINT REFERENCES nfts(id),
    transaction_type VARCHAR(50) NOT NULL, -- 'mint', 'sale', 'transfer', 'list', 'delist'
    
    -- Parties
    from_user_id BIGINT REFERENCES users(id),
    to_user_id BIGINT REFERENCES users(id),
    
    -- Transaction details
    price_ton DECIMAL(15,8),
    ton_transaction_hash VARCHAR(255),
    gas_fee_ton DECIMAL(15,8),
    platform_fee_ton DECIMAL(15,8),
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'failed'
    block_number BIGINT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE
);

-- =================
-- BLOCKCHAIN INTEGRATION
-- =================

-- TON wallet connections
CREATE TABLE user_wallets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    wallet_address VARCHAR(255) NOT NULL,
    wallet_type VARCHAR(50), -- 'tonkeeper', 'tonhub', 'openmask', etc.
    is_primary BOOLEAN DEFAULT FALSE,
    balance_ton DECIMAL(15,8) DEFAULT 0,
    last_synced_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, wallet_address)
);

-- Telegram Stars transactions
CREATE TABLE stars_transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL, -- 'earn', 'spend', 'gift_received', 'gift_sent'
    amount INTEGER NOT NULL,
    source_type VARCHAR(50), -- 'contest_win', 'achievement', 'gift', 'purchase', 'remix_tip'
    source_id BIGINT, -- ID of related content (contest, achievement, etc.)
    
    -- Telegram integration
    telegram_payment_id VARCHAR(255),
    telegram_invoice_payload TEXT,
    
    -- Metadata
    description TEXT,
    metadata JSONB DEFAULT '{}',
    
    -- Status
    status VARCHAR(50) DEFAULT 'completed', -- 'pending', 'completed', 'failed', 'refunded'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TON blockchain transactions
CREATE TABLE ton_transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    transaction_hash VARCHAR(255) UNIQUE NOT NULL,
    transaction_type VARCHAR(50) NOT NULL, -- 'reward_payout', 'nft_purchase', 'contest_prize'
    
    -- Transaction details
    amount_ton DECIMAL(15,8) NOT NULL,
    from_address VARCHAR(255),
    to_address VARCHAR(255),
    gas_used BIGINT,
    gas_fee_ton DECIMAL(15,8),
    
    -- Related content
    related_type VARCHAR(50), -- 'contest', 'nft', 'remix', 'tip'
    related_id BIGINT,
    
    -- Blockchain data
    block_number BIGINT,
    block_timestamp TIMESTAMP WITH TIME ZONE,
    logical_time BIGINT,
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending',
    confirmation_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE
);

-- =================
-- ANALYTICS & METRICS
-- =================

-- User activity tracking
CREATE TABLE user_activities (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(100) NOT NULL, -- 'play_track', 'create_remix', 'like_content', etc.
    target_type VARCHAR(50), -- 'track', 'remix', 'playlist', etc.
    target_id BIGINT,
    session_id VARCHAR(255),
    
    -- Context data
    device_info JSONB,
    location_data JSONB, -- Country, region (privacy-compliant)
    activity_metadata JSONB, -- Activity-specific data
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily/weekly/monthly aggregated metrics
CREATE TABLE platform_metrics (
    id BIGSERIAL PRIMARY KEY,
    metric_date DATE NOT NULL,
    metric_type VARCHAR(50) NOT NULL, -- 'daily', 'weekly', 'monthly'
    
    -- User metrics
    active_users INTEGER DEFAULT 0,
    new_users INTEGER DEFAULT 0,
    returning_users INTEGER DEFAULT 0,
    
    -- Content metrics
    tracks_played INTEGER DEFAULT 0,
    remixes_created INTEGER DEFAULT 0,
    presets_shared INTEGER DEFAULT 0,
    
    -- Social metrics
    likes_given INTEGER DEFAULT 0,
    comments_posted INTEGER DEFAULT 0,
    shares_made INTEGER DEFAULT 0,
    
    -- Economic metrics
    stars_earned INTEGER DEFAULT 0,
    stars_spent INTEGER DEFAULT 0,
    ton_volume DECIMAL(15,8) DEFAULT 0,
    nft_sales INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(metric_date, metric_type)
);

-- =================
-- SYSTEM TABLES
-- =================

-- App configuration and feature flags
CREATE TABLE app_config (
    id BIGSERIAL PRIMARY KEY,
    config_key VARCHAR(255) UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    updated_by_user_id BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content moderation
CREATE TABLE content_reports (
    id BIGSERIAL PRIMARY KEY,
    reporter_user_id BIGINT REFERENCES users(id),
    target_type VARCHAR(50) NOT NULL, -- 'remix', 'comment', 'post', 'user'
    target_id BIGINT NOT NULL,
    report_type VARCHAR(50) NOT NULL, -- 'copyright', 'inappropriate', 'spam', 'harassment'
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'reviewed', 'resolved', 'dismissed'
    moderator_user_id BIGINT REFERENCES users(id),
    moderator_notes TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =================
-- INDEXES FOR PERFORMANCE
-- =================

-- User indexes
CREATE INDEX idx_users_telegram_id ON users(telegram_id);
CREATE INDEX idx_users_level ON users(level DESC);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- Track indexes
CREATE INDEX idx_tracks_artist_id ON tracks(artist_id);
CREATE INDEX idx_tracks_genre ON tracks(genre);
CREATE INDEX idx_tracks_play_count ON tracks(play_count DESC);
CREATE INDEX idx_tracks_created_at ON tracks(created_at DESC);

-- Remix indexes
CREATE INDEX idx_remixes_user_id ON remixes(user_id);
CREATE INDEX idx_remixes_original_track_id ON remixes(original_track_id);
CREATE INDEX idx_remixes_play_count ON remixes(play_count DESC);
CREATE INDEX idx_remixes_created_at ON remixes(created_at DESC);
CREATE INDEX idx_remixes_is_public ON remixes(is_public) WHERE is_public = true;

-- Social indexes
CREATE INDEX idx_social_interactions_user_target ON social_interactions(user_id, target_type, target_id);
CREATE INDEX idx_comments_target ON comments(target_type, target_id, created_at DESC);
CREATE INDEX idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX idx_user_follows_following ON user_follows(following_id);

-- Contest indexes
CREATE INDEX idx_contests_status ON contests(status);
CREATE INDEX idx_contests_end_date ON contests(end_date);
CREATE INDEX idx_contest_entries_contest_score ON contest_entries(contest_id, score DESC);

-- NFT indexes
CREATE INDEX idx_nfts_owner ON nfts(current_owner_id);
CREATE INDEX idx_nfts_creator ON nfts(creator_id);
CREATE INDEX idx_nfts_listed ON nfts(is_listed) WHERE is_listed = true;
CREATE INDEX idx_nft_transactions_nft ON nft_transactions(nft_id, created_at DESC);

-- Activity indexes
CREATE INDEX idx_user_activities_user_time ON user_activities(user_id, created_at DESC);
CREATE INDEX idx_user_activities_type ON user_activities(activity_type, created_at DESC);

-- =================
-- FUNCTIONS AND TRIGGERS
-- =================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_remixes_updated_at BEFORE UPDATE ON remixes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_playlists_updated_at BEFORE UPDATE ON playlists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON community_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment counters
CREATE OR REPLACE FUNCTION increment_counter(table_name TEXT, column_name TEXT, record_id BIGINT, increment_by INTEGER DEFAULT 1)
RETURNS VOID AS $$
BEGIN
    EXECUTE format('UPDATE %I SET %I = %I + $1 WHERE id = $2', table_name, column_name, column_name) 
    USING increment_by, record_id;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate user level based on stars and activity
CREATE OR REPLACE FUNCTION calculate_user_level(user_stars INTEGER, total_remixes INTEGER, total_likes INTEGER)
RETURNS INTEGER AS $$
BEGIN
    -- Level calculation logic based on engagement
    RETURN GREATEST(1, (user_stars / 100) + (total_remixes / 10) + (total_likes / 1000));
END;
$$ LANGUAGE plpgsql;