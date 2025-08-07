import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({
  path: process.env.ENV_FILE || path.join(process.cwd(), '.env'),
});

// Common configuration for all services
export const config = {
  // Server configuration
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV !== 'production',
  serviceName: process.env.SERVICE_NAME || 'tuneton-service',
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || '0.0.0.0',
  apiPrefix: process.env.API_PREFIX || '/api',
  corsOrigins: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:3000'],

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    issuer: process.env.JWT_ISSUER || 'tuneton-api',
    audience: process.env.JWT_AUDIENCE || 'tuneton-client',
  },

  // Database configuration
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/tuneton',
    logging: process.env.DATABASE_LOGGING === 'true',
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  },

  // Redis configuration
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    ttl: parseInt(process.env.REDIS_TTL || '86400', 10), // 1 day in seconds
  },

  // Message queue configuration
  mq: {
    url: process.env.MQ_URL || 'amqp://localhost:5672',
    audioProcessingQueue: 'audio-processing',
    notificationQueue: 'notifications',
  },

  // Storage configuration
  storage: {
    type: process.env.STORAGE_TYPE || 'local',
    localPath: process.env.STORAGE_LOCAL_PATH || './uploads',
    s3: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      region: process.env.S3_REGION,
      bucket: process.env.S3_BUCKET,
      endpoint: process.env.S3_ENDPOINT,
    },
  },

  // External services
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    apiUrl: process.env.TELEGRAM_API_URL || 'https://api.telegram.org',
  },

  // Monitoring
  sentry: {
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
  },

  // Feature flags
  features: {
    enableTelegramAuth: process.env.FEATURE_TELEGRAM_AUTH === 'true',
    enableEmailVerification: process.env.FEATURE_EMAIL_VERIFICATION === 'true',
    enableAudioProcessing: process.env.FEATURE_AUDIO_PROCESSING === 'true',
  },
} as const;

export type Config = typeof config;

export default config;
