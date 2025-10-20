import { execSync } from 'child_process';

console.log('Testing simple build...');

try {
  console.log('Running TypeScript check...');
  execSync('npm run type-check', { stdio: 'inherit' });
  console.log('✅ TypeScript check passed');
} catch (error) {
  console.log('⚠️ TypeScript check found issues, but continuing...');
}

try {
  console.log('Running Vite build...');
  execSync('npx vite build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.error('❌ Build failed:', error.message);
}