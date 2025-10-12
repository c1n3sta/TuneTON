// Database service layer for TunTON platform
// Handles connections, transactions, and basic CRUD operations

import { Pool, PoolClient, QueryResult } from 'pg';
import Redis from 'ioredis';
import { getConfig, validateEnvironment } from './config';
import { 
  User, 
  Track, 
  Remix, 
  Playlist, 
  Contest, 
  NFT, 
  ApiResponse, 
  PaginationOptions,
  AudioEffectsConfig 
} from './types';

export class DatabaseService {
  private static instance: DatabaseService;
  private pool: Pool;
  private redis: Redis;
  private config: ReturnType<typeof getConfig>;

  private constructor() {
    validateEnvironment();
    this.config = getConfig();
    this.initializeConnections();
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private initializeConnections() {
    // PostgreSQL connection
    this.pool = new Pool({
      host: this.config.database.host,
      port: this.config.database.port,
      database: this.config.database.database,
      user: this.config.database.username,
      password: this.config.database.password,
      ssl: this.config.database.ssl,
      min: this.config.database.pool?.min || 2,
      max: this.config.database.pool?.max || 10,
      idleTimeoutMillis: this.config.database.pool?.idle || 30000,
    });

    // Redis connection for caching and sessions
    this.redis = new Redis({
      host: this.config.redis.host,
      port: this.config.redis.port,
      password: this.config.redis.password,
      db: this.config.redis.db,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
    });

    // Connection event handlers
    this.pool.on('error', (err) => {
      console.error('PostgreSQL pool error:', err);
    });

    this.redis.on('error', (err) => {
      console.error('Redis connection error:', err);
    });

    this.pool.on('connect', () => {
      console.log('Connected to PostgreSQL database');
    });

    this.redis.on('connect', () => {
      console.log('Connected to Redis cache');
    });
  }

  // =================
  // BASIC DATABASE OPERATIONS
  // =================

  async query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // =================
  // CACHE OPERATIONS
  // =================

  async getCache<T>(key: string): Promise<T | null> {
    try {
      const cached = await this.redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async setCache<T>(key: string, value: T, ttlSeconds = 3600): Promise<void> {
    try {
      await this.redis.setex(key, ttlSeconds, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async deleteCache(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async deleteCachePattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      console.error('Cache pattern delete error:', error);
    }
  }

  // =================
  // USER OPERATIONS
  // =================

  async createUser(telegramUser: {
    telegram_id: bigint;
    telegram_username?: string;
    first_name: string;
    last_name?: string;
    telegram_photo_url?: string;
    is_premium?: boolean;
  }): Promise<User> {
    const query = `
      INSERT INTO users (
        telegram_id, telegram_username, first_name, last_name, 
        telegram_photo_url, is_premium, onboarding_completed_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT (telegram_id) 
      DO UPDATE SET 
        telegram_username = EXCLUDED.telegram_username,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        telegram_photo_url = EXCLUDED.telegram_photo_url,
        is_premium = EXCLUDED.is_premium,
        last_active_at = NOW()
      RETURNING *
    `;

    const result = await this.query<User>(query, [
      telegramUser.telegram_id,
      telegramUser.telegram_username,
      telegramUser.first_name,
      telegramUser.last_name,
      telegramUser.telegram_photo_url,
      telegramUser.is_premium || false
    ]);

    const user = result.rows[0];
    await this.setCache(`user:${user.id}`, user, 1800); // Cache for 30 minutes
    return user;
  }

  async getUserById(userId: bigint): Promise<User | null> {
    // Try cache first
    const cached = await this.getCache<User>(`user:${userId}`);
    if (cached) return cached;

    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.query<User>(query, [userId]);
    
    if (result.rows.length === 0) return null;
    
    const user = result.rows[0];
    await this.setCache(`user:${userId}`, user, 1800);
    return user;
  }

  async getUserByTelegramId(telegramId: bigint): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE telegram_id = $1';
    const result = await this.query<User>(query, [telegramId]);
    
    if (result.rows.length === 0) return null;
    
    const user = result.rows[0];
    await this.setCache(`user:${user.id}`, user, 1800);
    return user;
  }

  async updateUserStars(userId: bigint, starsDelta: number, transactionType: string, sourceType?: string, sourceId?: bigint): Promise<void> {
    await this.transaction(async (client) => {
      // Update user's star balance
      await client.query(
        'UPDATE users SET stars_balance = stars_balance + $1, updated_at = NOW() WHERE id = $2',
        [starsDelta, userId]
      );

      // Record the transaction
      await client.query(`
        INSERT INTO stars_transactions (
          user_id, transaction_type, amount, source_type, source_id, status
        ) VALUES ($1, $2, $3, $4, $5, 'completed')
      `, [userId, transactionType, starsDelta, sourceType, sourceId]);
    });

    // Invalidate user cache
    await this.deleteCache(`user:${userId}`);
  }

  // =================
  // TRACK OPERATIONS
  // =================

  async getTracks(options: PaginationOptions = {}): Promise<ApiResponse<Track[]>> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = options;

    const offset = (page - 1) * limit;
    const cacheKey = `tracks:${page}:${limit}:${sortBy}:${sortOrder}`;

    // Try cache first
    const cached = await this.getCache<ApiResponse<Track[]>>(cacheKey);
    if (cached) return cached;

    const query = `
      SELECT t.*, a.name as artist_name, a.avatar_url as artist_avatar
      FROM tracks t
      LEFT JOIN artists a ON t.artist_id = a.id
      ORDER BY t.${sortBy} ${sortOrder.toUpperCase()}
      LIMIT $1 OFFSET $2
    `;

    const countQuery = 'SELECT COUNT(*) FROM tracks';

    const [tracksResult, countResult] = await Promise.all([
      this.query<Track & { artist_name: string; artist_avatar: string }>(query, [limit, offset]),
      this.query<{ count: string }>(countQuery)
    ]);

    const tracks = tracksResult.rows.map(row => ({
      ...row,
      artist: {
        id: row.artist_id,
        name: row.artist_name,
        avatar_url: row.artist_avatar
      }
    }));

    const total = parseInt(countResult.rows[0].count);
    const hasMore = offset + limit < total;

    const response: ApiResponse<Track[]> = {
      success: true,
      data: tracks,
      pagination: {
        page,
        limit,
        total,
        hasMore
      }
    };

    await this.setCache(cacheKey, response, 300); // Cache for 5 minutes
    return response;
  }

  async incrementTrackPlayCount(trackId: bigint, userId?: bigint): Promise<void> {
    await this.transaction(async (client) => {
      // Increment play count
      await client.query(
        'UPDATE tracks SET play_count = play_count + 1 WHERE id = $1',
        [trackId]
      );

      // Record user activity if user is provided
      if (userId) {
        await client.query(`
          INSERT INTO user_activities (
            user_id, activity_type, target_type, target_id
          ) VALUES ($1, 'play_track', 'track', $2)
        `, [userId, trackId]);
      }
    });

    // Invalidate related caches
    await this.deleteCache(`track:${trackId}`);
    await this.deleteCachePattern('tracks:*');
  }

  // =================
  // REMIX OPERATIONS
  // =================

  async createRemix(remixData: {
    user_id: bigint;
    original_track_id: bigint;
    title: string;
    description?: string;
    effects_config: AudioEffectsConfig;
    is_public?: boolean;
  }): Promise<Remix> {
    const query = `
      INSERT INTO remixes (
        user_id, original_track_id, title, description, 
        effects_config, is_public
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const result = await this.query<Remix>(query, [
      remixData.user_id,
      remixData.original_track_id,
      remixData.title,
      remixData.description,
      JSON.stringify(remixData.effects_config),
      remixData.is_public ?? true
    ]);

    const remix = result.rows[0];

    // Update user's remix count
    await this.query(
      'UPDATE users SET total_remixes = total_remixes + 1 WHERE id = $1',
      [remixData.user_id]
    );

    // Invalidate caches
    await this.deleteCache(`user:${remixData.user_id}`);
    await this.deleteCachePattern('remixes:*');

    return remix;
  }

  async getTrendingRemixes(limit = 20): Promise<Remix[]> {
    const cacheKey = `trending_remixes:${limit}`;
    
    // Try cache first
    const cached = await this.getCache<Remix[]>(cacheKey);
    if (cached) return cached;

    const query = `
      SELECT r.*, u.first_name as user_name, u.telegram_photo_url as user_avatar,
             t.title as original_title, t.cover_url as original_cover
      FROM remixes r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN tracks t ON r.original_track_id = t.id
      WHERE r.is_public = true
      ORDER BY (r.play_count * 0.4 + r.like_count * 0.4 + r.share_count * 0.2) DESC
      LIMIT $1
    `;

    const result = await this.query<Remix & {
      user_name: string;
      user_avatar: string;
      original_title: string;
      original_cover: string;
    }>(query, [limit]);

    const remixes = result.rows.map(row => ({
      ...row,
      user: {
        first_name: row.user_name,
        telegram_photo_url: row.user_avatar
      },
      original_track: {
        title: row.original_title,
        cover_url: row.original_cover
      }
    }));

    await this.setCache(cacheKey, remixes, 600); // Cache for 10 minutes
    return remixes;
  }

  // =================
  // CONTEST OPERATIONS
  // =================

  async getActiveContests(): Promise<Contest[]> {
    const cacheKey = 'active_contests';
    
    const cached = await this.getCache<Contest[]>(cacheKey);
    if (cached) return cached;

    const query = `
      SELECT * FROM contests 
      WHERE status IN ('active', 'voting') 
      ORDER BY 
        CASE WHEN status = 'active' THEN 1 ELSE 2 END,
        end_date ASC
    `;

    const result = await this.query<Contest>(query);
    const contests = result.rows;

    await this.setCache(cacheKey, contests, 300); // Cache for 5 minutes
    return contests;
  }

  async submitContestEntry(contestId: bigint, userId: bigint, remixId: bigint): Promise<void> {
    await this.transaction(async (client) => {
      // Create contest entry
      await client.query(`
        INSERT INTO contest_entries (contest_id, user_id, remix_id)
        VALUES ($1, $2, $3)
        ON CONFLICT (contest_id, user_id) 
        DO UPDATE SET remix_id = EXCLUDED.remix_id, submitted_at = NOW()
      `, [contestId, userId, remixId]);

      // Update contest entry count
      await client.query(
        'UPDATE contests SET entry_count = entry_count + 1 WHERE id = $1',
        [contestId]
      );

      // Mark remix as contest entry
      await client.query(
        'UPDATE remixes SET contest_entry_id = $1 WHERE id = $2',
        [contestId, remixId]
      );
    });

    // Invalidate caches
    await this.deleteCachePattern('contests:*');
    await this.deleteCachePattern('active_contests');
  }

  // =================
  // SOCIAL OPERATIONS
  // =================

  async toggleLike(userId: bigint, targetType: string, targetId: bigint): Promise<{ liked: boolean; newCount: number }> {
    return await this.transaction(async (client) => {
      // Check if already liked
      const existingLike = await client.query(
        'SELECT id FROM social_interactions WHERE user_id = $1 AND target_type = $2 AND target_id = $3 AND interaction_type = $4',
        [userId, targetType, targetId, 'like']
      );

      const isLiked = existingLike.rows.length > 0;
      let newCount: number;

      if (isLiked) {
        // Remove like
        await client.query(
          'DELETE FROM social_interactions WHERE user_id = $1 AND target_type = $2 AND target_id = $3 AND interaction_type = $4',
          [userId, targetType, targetId, 'like']
        );

        // Decrement like count
        const countResult = await client.query(
          `UPDATE ${targetType}s SET like_count = like_count - 1 WHERE id = $1 RETURNING like_count`,
          [targetId]
        );
        newCount = countResult.rows[0].like_count;
      } else {
        // Add like
        await client.query(
          'INSERT INTO social_interactions (user_id, target_type, target_id, interaction_type) VALUES ($1, $2, $3, $4)',
          [userId, targetType, targetId, 'like']
        );

        // Increment like count
        const countResult = await client.query(
          `UPDATE ${targetType}s SET like_count = like_count + 1 WHERE id = $1 RETURNING like_count`,
          [targetId]
        );
        newCount = countResult.rows[0].like_count;

        // Award stars to content creator for receiving likes
        if (targetType === 'remix') {
          const remixResult = await client.query('SELECT user_id FROM remixes WHERE id = $1', [targetId]);
          if (remixResult.rows.length > 0) {
            const creatorId = remixResult.rows[0].user_id;
            if (creatorId !== userId) { // Don't award stars for self-likes
              await client.query(
                'UPDATE users SET stars_balance = stars_balance + 1 WHERE id = $1',
                [creatorId]
              );
              
              await client.query(`
                INSERT INTO stars_transactions (
                  user_id, transaction_type, amount, source_type, source_id
                ) VALUES ($1, 'earn', 1, 'remix_like', $2)
              `, [creatorId, targetId]);
            }
          }
        }
      }

      return { liked: !isLiked, newCount };
    });
  }

  // =================
  // CLEANUP AND HEALTH
  // =================

  async healthCheck(): Promise<{ database: boolean; redis: boolean }> {
    try {
      // Test PostgreSQL
      await this.query('SELECT 1');
      const dbHealthy = true;

      // Test Redis
      await this.redis.ping();
      const redisHealthy = true;

      return { database: dbHealthy, redis: redisHealthy };
    } catch (error) {
      console.error('Health check failed:', error);
      return { database: false, redis: false };
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
    await this.redis.quit();
  }
}

// Export singleton instance
export const db = DatabaseService.getInstance();