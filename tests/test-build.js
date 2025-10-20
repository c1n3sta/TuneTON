import { execSync } from 'child_process';

try {
  console.log('Running Vite build...');
  execSync('npx vite build --mode production', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}