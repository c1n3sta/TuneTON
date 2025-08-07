import { mkdir } from 'fs/promises';
import { join } from 'path';

// Create test directories before all tests run
export default async function globalSetup() {
  const testDirs = [
    join(__dirname, '../test-uploads'),
    join(__dirname, '../test-processed'),
    join(__dirname, '../test-temp'),
    join(__dirname, '../test-logs'),
  ];

  await Promise.all(
    testDirs.map((dir) =>
      mkdir(dir, { recursive: true })
    )
  );

  // Set environment variables for testing
  process.env.NODE_ENV = 'test';
  process.env.PORT = '0'; // Use random port for tests
  process.env.REDIS_HOST = 'localhost';
  process.env.REDIS_PORT = '6379';
  process.env.STORAGE_UPLOAD_PATH = join(__dirname, '../test-uploads');
  process.env.STORAGE_PROCESSED_PATH = join(__dirname, '../test-processed');
  process.env.STORAGE_TEMP_PATH = join(__dirname, '../test-temp');
  process.env.LOG_LEVEL = 'error'; // Only show errors during tests
}
