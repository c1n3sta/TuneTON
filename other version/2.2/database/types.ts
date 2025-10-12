// TypeScript types for TunTON database models
// Generated from the database schema

export interface User {
  id: bigint;
  telegram_id: bigint;
  telegram_username?: string;
  first_name: string;
  last_name?: string;
  telegram_photo_url?: string;
  is_premium: boolean;
  is_verified: boolean;
  
  // TunTON specific
  level: number;
  stars_balance: number;
  ton_wallet_address?: string;
  total_remixes: number;
  total_likes_received: number;
  total_plays: number;
  
  // Preferences
  default_audio_profile: AudioEffectsConfig;
  privacy_settings: PrivacySettings;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
  last_active_at: Date;
  onboarding_completed_at?: Date;
}

export interface AudioEffectsConfig {
  tempo?: {
    enabled: boolean;
    value: number; // 0.5 to 2.0
  };
  lofi?: {
    enabled: boolean;
    preset: 'vinyl' | 'cassette' | 'radio' | 'old_speaker';
    intensity: number; // 0.0 to 1.0
  };
  eq?: {
    enabled: boolean;
    bands: number[]; // 7-band EQ values (-12 to +12 dB)
  };
  vocals?: {
    enabled: boolean;
    type: 'remove' | 'isolate' | 'enhance';
    strength?: number;
  };
  ambient?: {
    enabled: boolean;
    type: 'rain' | 'cafe' | 'nature' | 'city' | 'fire';
    volume: number; // 0.0 to 1.0
  };
  reverb?: {
    enabled: boolean;
    type: 'hall' | 'room' | 'chamber' | 'plate';
    intensity: number;
  };
}

export interface PrivacySettings {
  profile: 'public' | 'friends' | 'private';
  library: 'public' | 'friends' | 'private';
  activity: 'public' | 'friends' | 'private';
  allow_collaboration_requests: boolean;
  show_online_status: boolean;
}

export interface Artist {
  id: bigint;
  name: string;
  slug: string;
  avatar_url?: string;
  is_verified: boolean;
  monthly_listeners: number;
  total_tracks: number;
  bio?: string;
  social_links: Record<string, string>;
  created_at: Date;
}

export interface Track {
  id: bigint;
  artist_id: bigint;
  album_id?: bigint;
  title: string;
  slug: string;
  duration: number;
  file_url: string;
  cover_url?: string;
  genre?: string;
  bpm?: number;
  key_signature?: string;
  energy_level?: number;
  audio_features?: AudioFeatures;
  license_info?: LicenseInfo;
  play_count: number;
  like_count: number;
  remix_count: number;
  created_at: Date;
  
  // Relations
  artist?: Artist;
  album?: Album;
}

export interface AudioFeatures {
  tempo: number;
  key: string;
  mode: 'major' | 'minor';
  time_signature: number;
  acousticness: number;
  danceability: number;
  energy: number;
  instrumentalness: number;
  liveness: number;
  loudness: number;
  speechiness: number;
  valence: number;
  has_vocals: boolean;
  dominant_instruments: string[];
}

export interface LicenseInfo {
  copyright_holder: string;
  license_type: string;
  usage_rights: string[];
  restrictions?: string[];
  royalty_rate?: number;
}

export interface Album {
  id: bigint;
  artist_id: bigint;
  title: string;
  slug: string;
  cover_url?: string;
  release_date?: Date;
  genre?: string;
  total_tracks: number;
  created_at: Date;
  
  // Relations
  artist?: Artist;
  tracks?: Track[];
}

export interface AudioPreset {
  id: bigint;
  user_id: bigint;
  name: string;
  description?: string;
  effects_config: AudioEffectsConfig;
  is_public: boolean;
  use_count: number;
  like_count: number;
  created_at: Date;
  
  // Relations
  user?: User;
}

export interface Remix {
  id: bigint;
  user_id: bigint;
  original_track_id: bigint;
  title: string;
  description?: string;
  cover_url?: string;
  duration?: number;
  effects_config: AudioEffectsConfig;
  processed_file_url?: string;
  processing_metadata?: ProcessingMetadata;
  
  // Engagement
  play_count: number;
  like_count: number;
  share_count: number;
  comment_count: number;
  stars_earned: number;
  
  // Status
  is_public: boolean;
  is_featured: boolean;
  contest_entry_id?: bigint;
  
  created_at: Date;
  updated_at: Date;
  
  // Relations
  user?: User;
  original_track?: Track;
  contest_entry?: ContestEntry;
}

export interface ProcessingMetadata {
  processing_time_ms: number;
  effects_applied: string[];
  audio_quality: {
    bitrate: number;
    sample_rate: number;
    channels: number;
  };
  ai_processing?: {
    stem_separation_used: boolean;
    vocal_isolation_confidence?: number;
    processing_model_version: string;
  };
}

export interface Playlist {
  id: bigint;
  user_id: bigint;
  title: string;
  description?: string;
  cover_url?: string;
  is_private: boolean;
  is_ai_generated: boolean;
  ai_generation_prompt?: string;
  total_tracks: number;
  total_duration: number;
  play_count: number;
  like_count: number;
  follower_count: number;
  created_at: Date;
  updated_at: Date;
  
  // Relations
  user?: User;
  tracks?: PlaylistTrack[];
}

export interface PlaylistTrack {
  id: bigint;
  playlist_id: bigint;
  track_id?: bigint;
  remix_id?: bigint;
  position: number;
  added_by_user_id: bigint;
  added_at: Date;
  
  // Relations
  playlist?: Playlist;
  track?: Track;
  remix?: Remix;
  added_by?: User;
}

export interface UserLibrary {
  id: bigint;
  user_id: bigint;
  item_type: 'track' | 'remix' | 'playlist' | 'artist' | 'preset';
  item_id: bigint;
  action_type: 'like' | 'follow' | 'save' | 'download';
  metadata: Record<string, any>;
  created_at: Date;
}

export interface SocialInteraction {
  id: bigint;
  user_id: bigint;
  target_type: string;
  target_id: bigint;
  interaction_type: 'like' | 'share' | 'bookmark' | 'report';
  metadata: Record<string, any>;
  created_at: Date;
}

export interface Comment {
  id: bigint;
  user_id: bigint;
  target_type: string;
  target_id: bigint;
  parent_comment_id?: bigint;
  content: string;
  like_count: number;
  reply_count: number;
  is_pinned: boolean;
  created_at: Date;
  updated_at: Date;
  
  // Relations
  user?: User;
  parent_comment?: Comment;
  replies?: Comment[];
}

export interface CommunityPost {
  id: bigint;
  user_id: bigint;
  post_type: 'remix_share' | 'achievement' | 'collaboration' | 'general';
  content?: string;
  media_urls: string[];
  linked_content?: Record<string, any>;
  
  // Engagement
  like_count: number;
  comment_count: number;
  share_count: number;
  
  // Visibility
  is_public: boolean;
  is_pinned: boolean;
  
  created_at: Date;
  updated_at: Date;
  
  // Relations
  user?: User;
  comments?: Comment[];
}

export interface Contest {
  id: bigint;
  title: string;
  description?: string;
  cover_url?: string;
  contest_type: 'remix' | 'speed' | 'technical' | 'collaborative';
  rules?: ContestRules;
  
  // Prizes
  prize_pool_ton: number;
  prize_pool_stars: number;
  prize_distribution?: PrizeDistribution;
  
  // Timing
  start_date?: Date;
  end_date?: Date;
  voting_end_date?: Date;
  
  // Participation
  max_participants?: number;
  participant_count: number;
  entry_count: number;
  
  // Status
  status: 'upcoming' | 'active' | 'voting' | 'ended';
  is_featured: boolean;
  
  created_by_user_id?: bigint;
  created_at: Date;
  
  // Relations
  created_by?: User;
  entries?: ContestEntry[];
}

export interface ContestRules {
  duration_limit?: number; // seconds
  effects_allowed: string[];
  effects_required?: string[];
  collaboration_allowed: boolean;
  original_tracks_only?: boolean;
  min_participants?: number;
  voting_criteria: string[];
}

export interface PrizeDistribution {
  first_place: { ton?: number; stars?: number };
  second_place?: { ton?: number; stars?: number };
  third_place?: { ton?: number; stars?: number };
  participation_reward?: { stars: number };
}

export interface ContestEntry {
  id: bigint;
  contest_id: bigint;
  user_id: bigint;
  remix_id: bigint;
  vote_count: number;
  score: number;
  rank_position?: number;
  entry_metadata: Record<string, any>;
  submitted_at: Date;
  
  // Relations
  contest?: Contest;
  user?: User;
  remix?: Remix;
}

export interface NFTCollection {
  id: bigint;
  creator_id: bigint;
  name: string;
  description?: string;
  symbol?: string;
  cover_url?: string;
  total_supply?: number;
  minted_count: number;
  floor_price_ton?: number;
  total_volume_ton: number;
  created_at: Date;
  
  // Relations
  creator?: User;
  nfts?: NFT[];
}

export interface NFT {
  id: bigint;
  collection_id?: bigint;
  token_id: string;
  ton_contract_address?: string;
  
  // Content
  name: string;
  description?: string;
  image_url?: string;
  audio_url?: string;
  metadata_url?: string;
  
  // Linked content
  preset_id?: bigint;
  remix_id?: bigint;
  
  // Ownership
  current_owner_id?: bigint;
  creator_id?: bigint;
  
  // Market data
  mint_price_ton?: number;
  last_sale_price_ton?: number;
  current_listing_price_ton?: number;
  is_listed: boolean;
  
  // Rarity
  rarity_rank?: number;
  traits: Record<string, any>;
  
  minted_at?: Date;
  created_at: Date;
  
  // Relations
  collection?: NFTCollection;
  current_owner?: User;
  creator?: User;
  preset?: AudioPreset;
  remix?: Remix;
}

export interface StarsTransaction {
  id: bigint;
  user_id: bigint;
  transaction_type: 'earn' | 'spend' | 'gift_received' | 'gift_sent';
  amount: number;
  source_type?: string;
  source_id?: bigint;
  
  // Telegram
  telegram_payment_id?: string;
  telegram_invoice_payload?: string;
  
  description?: string;
  metadata: Record<string, any>;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: Date;
  
  // Relations
  user?: User;
}

export interface TONTransaction {
  id: bigint;
  user_id?: bigint;
  transaction_hash: string;
  transaction_type: string;
  amount_ton: number;
  from_address?: string;
  to_address?: string;
  gas_used?: bigint;
  gas_fee_ton?: number;
  related_type?: string;
  related_id?: bigint;
  
  // Blockchain
  block_number?: bigint;
  block_timestamp?: Date;
  logical_time?: bigint;
  status: string;
  confirmation_count: number;
  
  created_at: Date;
  confirmed_at?: Date;
  
  // Relations  
  user?: User;
}

export interface UserActivity {
  id: bigint;
  user_id: bigint;
  activity_type: string;
  target_type?: string;
  target_id?: bigint;
  session_id?: string;
  device_info?: Record<string, any>;
  location_data?: Record<string, any>;
  activity_metadata?: Record<string, any>;
  created_at: Date;
  
  // Relations
  user?: User;
}

export interface UserAchievement {
  id: bigint;
  user_id: bigint;
  achievement_type: string;
  achievement_data?: Record<string, any>;
  earned_at: Date;
  stars_reward: number;
  
  // Relations
  user?: User;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

// Search and filter types
export interface SearchFilters {
  query?: string;
  genre?: string;
  bpm_min?: number;
  bpm_max?: number;
  duration_min?: number;
  duration_max?: number;
  energy_level?: number;
  has_vocals?: boolean;
  created_after?: Date;
  created_before?: Date;
}

export interface RemixFilters extends SearchFilters {
  effects_used?: string[];
  contest_entry?: boolean;
  stars_earned_min?: number;
  play_count_min?: number;
}