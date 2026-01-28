#!/usr/bin/env node

/**
 * Script to reorganize backend files for better security isolation
 * Moves backend files from web-accessible directory to isolated application directory
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Load environment variables from .env.production
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });

const { FTP_HOST, FTP_USER, FTP_PASSWORD } = process.env;

console.log('=== Backend Security Reorganization Script ===');
console.log('This script will reorganize your backend files for better security.');
console.log('');

// Instructions for manual execution via FTP client
console.log('MANUAL EXECUTION INSTRUCTIONS:');
console.log('');
console.log('1. Connect to your server via FTP using these credentials:');
console.log(`   Host: ${FTP_HOST}`);
console.log(`   User: ${FTP_USER}`);
console.log(`   Password: ${FTP_PASSWORD}`);
console.log('');
console.log('2. On the server, execute these commands:');
console.log('');
console.log('   # Check if the isolated backend directory exists');
console.log('   ls -la /tuneton/');
console.log('');
console.log('   # Create the backend directory if it doesn\'t exist');
console.log('   mkdir -p /tuneton/backend');
console.log('');
console.log('   # Copy files from web-accessible directory to isolated directory');
console.log('   cp -r /www/tuneton.space/backend/* /tuneton/backend/');
console.log('');
console.log('   # Set proper permissions for security');
console.log('   find /tuneton/backend -type d -exec chmod 755 {} \\;');
console.log('   find /tuneton/backend -type f -exec chmod 644 {} \\;');
console.log('   chmod 600 /tuneton/backend/.env*');
console.log('');
console.log('   # Verify the copy was successful');
console.log('   ls -la /tuneton/backend/');
console.log('');
console.log('3. After confirming everything works, you can remove the web-accessible copy:');
console.log('   rm -rf /www/tuneton.space/backend/');
console.log('');
console.log('4. Finally, configure your web server to proxy requests to port 3001');
console.log('   where the backend application will run.');

console.log('');
console.log('=== Security Benefits ===');
console.log('- Isolates backend code from web-accessible directories');
console.log('- Reduces attack surface by limiting direct file access');
console.log('- Improves permission control over sensitive files');
console.log('- Follows security best practices for web applications');

console.log('');
console.log('Remember to update any deployment scripts to use the new location.');