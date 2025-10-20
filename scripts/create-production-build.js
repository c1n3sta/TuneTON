#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Creating production build...');

try {
  // Ensure we're in the project root
  const projectRoot = path.resolve(__dirname, '..');
  process.chdir(projectRoot);
  
  // Clean previous builds
  console.log('Cleaning previous builds...');
  execSync('npx rimraf dist', { stdio: 'inherit' });
  
  // Build the project with Vite
  console.log('Building project with Vite...');
  execSync('npx vite build --mode production', { stdio: 'inherit' });
  
  // Verify that the required files exist
  const distPath = path.join(projectRoot, 'dist');
  const manifestPath = path.join(distPath, 'manifest.json');
  const pwaIcon192 = path.join(distPath, 'pwa-192x192.png');
  const pwaIcon512 = path.join(distPath, 'pwa-512x512.png');
  
  if (!fs.existsSync(distPath)) {
    throw new Error('Dist directory was not created');
  }
  
  console.log('Build completed successfully!');
  console.log('Build artifacts are in the dist/ directory');
  
  // List the contents of the dist directory
  console.log('\nDist directory contents:');
  const files = fs.readdirSync(distPath);
  files.forEach(file => {
    console.log(`  ${file}`);
  });
  
  // Verify PWA assets
  console.log('\nVerifying PWA assets:');
  console.log(`  manifest.json: ${fs.existsSync(manifestPath) ? '✓ Found' : '✗ Missing'}`);
  console.log(`  pwa-192x192.png: ${fs.existsSync(pwaIcon192) ? '✓ Found' : '✗ Missing'}`);
  console.log(`  pwa-512x512.png: ${fs.existsSync(pwaIcon512) ? '✓ Found' : '✗ Missing'}`);
  
  console.log('\nProduction build is ready!');
  
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}