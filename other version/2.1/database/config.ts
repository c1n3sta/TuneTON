// Database configuration for TunTON platform
// Supports both development and production environments

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
  pool?: {
    min: number;
    max: number;
    idle: number;
  };
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
}

export interface TONConfig {
  network: 'mainnet' | 'testnet';
  apiUrl: string;
  walletMnemonic?: string;
  nftCollectionAddress?: string;
}

export interface TelegramConfig {
  botToken: string;
  webhookUrl?: string;
  starsApiKey?: string;
}

// Environment-based configuration
const config = {
  database: {
    development: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'tunton_dev',
      username: process.env.DB_USER || 'tunton_user',
      password: process.env.DB_PASSWORD || 'password',
      ssl: false,
      pool: {
        min: 2,
        max: 10,
        idle: 30000
      }
    } as DatabaseConfig,
    
    production: {
      host: process.env.DB_HOST!,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME!,
      username: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      ssl: true,
      pool: {
        min: 10,
        max: 50,
        idle: 10000
      }
    } as DatabaseConfig
  },

  redis: {
    development: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      db: 0
    } as RedisConfig,
    
    production: {
      host: process.env.REDIS_HOST!,
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: 0
    } as RedisConfig
  },

  ton: {
    development: {
      network: 'testnet' as const,
      apiUrl: 'https://testnet.toncenter.com/api/v2/',
      walletMnemonic: process.env.TON_WALLET_MNEMONIC,
      nftCollectionAddress: process.env.TON_NFT_COLLECTION_TESTNET
    } as TONConfig,
    
    production: {
      network: 'mainnet' as const,
      apiUrl: 'https://toncenter.com/api/v2/',
      walletMnemonic: process.env.TON_WALLET_MNEMONIC,
      nftCollectionAddress: process.env.TON_NFT_COLLECTION_MAINNET
    } as TONConfig
  },

  telegram: {
    development: {
      botToken: process.env.TELEGRAM_BOT_TOKEN!,
      webhookUrl: process.env.TELEGRAM_WEBHOOK_URL,
      starsApiKey: process.env.TELEGRAM_STARS_API_KEY
    } as TelegramConfig,
    
    production: {
      botToken: process.env.TELEGRAM_BOT_TOKEN!,
      webhookUrl: process.env.TELEGRAM_WEBHOOK_URL!,
      starsApiKey: process.env.TELEGRAM_STARS_API_KEY!
    } as TelegramConfig
  },

  app: {
    environment: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000'),
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-key',
    encryptionKey: process.env.ENCRYPTION_KEY || 'dev-encryption-key',
    
    // File storage
    storageProvider: process.env.STORAGE_PROVIDER || 'local', // 'local', 's3', 'ipfs'
    s3Bucket: process.env.S3_BUCKET,
    s3Region: process.env.S3_REGION,
    cdnUrl: process.env.CDN_URL,
    
    // Audio processing
    audioProcessingUrl: process.env.AUDIO_PROCESSING_API_URL,
    aiStemSeparationUrl: process.env.AI_STEM_API_URL,
    
    // Rate limiting
    rateLimitWindow: 15 * 60 * 1000, // 15 minutes
    rateLimitMax: 100, // requests per window
    
    // Feature flags
    features: {
      nftMarketplace: process.env.ENABLE_NFT_MARKETPLACE === 'true',
      aiStudio: process.env.ENABLE_AI_STUDIO === 'true',
      contests: process.env.ENABLE_CONTESTS === 'true',
      telegramStars: process.env.ENABLE_TELEGRAM_STARS === 'true'
    }
  }
};

export function getConfig() {
  const env = config.app.environment as 'development' | 'production';
  
  return {
    app: config.app,
    database: config.database[env],
    redis: config.redis[env],
    ton: config.ton[env],
    telegram: config.telegram[env]
  };
}

// Environment validation
export function validateEnvironment() {
  const required = [
    'TELEGRAM_BOT_TOKEN',
    'DB_HOST',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  if (config.app.environment === 'production') {
    const productionRequired = [
      'JWT_SECRET',
      'ENCRYPTION_KEY',
      'TELEGRAM_WEBHOOK_URL',
      'TON_WALLET_MNEMONIC'
    ];

    const missingProduction = productionRequired.filter(key => !process.env[key]);
    
    if (missingProduction.length > 0) {
      throw new Error(`Missing required production environment variables: ${missingProduction.join(', ')}`);
    }
  }
}