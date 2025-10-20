#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Starting TuneTON development servers...');

// Start the backend server
const backend = spawn('node', ['server/index.ts'], {
  cwd: __dirname + '/..',
  stdio: 'inherit',
  shell: true
});

// Start the frontend server
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: __dirname + '/..',
  stdio: 'inherit',
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down servers...');
  backend.kill();
  frontend.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nShutting down servers...');
  backend.kill();
  frontend.kill();
  process.exit(0);
});

// Handle errors
backend.on('error', (error) => {
  console.error('Backend server error:', error);
});

frontend.on('error', (error) => {
  console.error('Frontend server error:', error);
});

console.log('Servers started successfully!');
console.log('Frontend: http://localhost:3001');
console.log('Backend API: http://localhost:3002');