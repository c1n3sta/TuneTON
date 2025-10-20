import { execSync } from 'child_process';
import { existsSync, rmSync } from 'fs';
import { resolve } from 'path';

// Clean dist folder
const distPath = resolve('./dist');
if (existsSync(distPath)) {
  rmSync(distPath, { recursive: true });
  console.log('Cleaned dist folder');
}

try {
  // Run TypeScript check
  console.log('Running TypeScript check...');
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('TypeScript check passed');
  
  // Run Vite build
  console.log('Building with Vite...');
  execSync('npx vite build --mode production', { stdio: 'inherit' });
  console.log('Build completed successfully');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}