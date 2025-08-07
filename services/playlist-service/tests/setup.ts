import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { config } from '@tuneton/shared';

// Test database connection configuration
const testDbConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5433, // Different port to avoid conflicts with development DB
  username: 'test_user',
  password: 'test_password',
  database: 'tuneton_playlist_test',
  synchronize: true, // Auto-create schema
  dropSchema: true, // Drop schema each time connection is established (for tests)
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  logging: false,
};

// Global test setup
beforeAll(async () => {
  // Override environment variables for tests
  process.env.NODE_ENV = 'test';
  process.env.DB_HOST = 'localhost';
  process.env.DB_PORT = '5433';
  process.env.DB_USERNAME = 'test_user';
  process.env.DB_PASSWORD = 'test_password';
  process.env.DB_NAME = 'tuneton_playlist_test';
  process.env.JWT_SECRET = 'test-secret';
  process.env.REDIS_HOST = 'localhost';
  process.env.REDIS_PORT = '6379';

  // Create test database connection
  try {
    const connection = await createConnection(testDbConfig);
    global.testConnection = connection;
  } catch (error) {
    console.error('Failed to create test database connection:', error);
    throw error;
  }
});

// Global test teardown
afterAll(async () => {
  if (global.testConnection) {
    await global.testConnection.close();
  }
});

// Extend NodeJS global type
declare global {
  namespace NodeJS {
    interface Global {
      testConnection: Connection;
    }
  }
}
