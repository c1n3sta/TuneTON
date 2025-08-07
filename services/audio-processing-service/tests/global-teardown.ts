import { rm } from 'fs/promises';
import { join } from 'path';

// Clean up test directories after all tests complete
export default async function globalTeardown() {
  const testDirs = [
    join(__dirname, '../test-uploads'),
    join(__dirname, '../test-processed'),
    join(__dirname, '../test-temp'),
    join(__dirname, '../test-logs'),
    join(__dirname, '../coverage'),
  ];

  await Promise.allSettled(
    testDirs.map((dir) =>
      rm(dir, { recursive: true, force: true })
    )
  );
}
