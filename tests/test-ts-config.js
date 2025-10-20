import { execSync } from 'child_process';

try {
  console.log('Running TypeScript compilation check...');
  execSync('npx tsc --noEmit --watch false', { stdio: 'inherit' });
  console.log('TypeScript compilation check completed successfully!');
} catch (error) {
  console.error('TypeScript compilation check failed:', error.message);
  process.exit(1);
}