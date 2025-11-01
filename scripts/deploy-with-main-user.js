#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });

console.log('Starting deployment process with main FTP user...');

try {
  // Check for required files
  const distDir = path.join(process.cwd(), 'dist');
  
  if (!fs.existsSync(distDir)) {
    throw new Error('dist directory not found. Please run build first.');
  }
  
  // Get FTP credentials from environment variables
  const host = process.env.FTP_HOST || '31.31.197.37';
  const port = '21';
  const user = process.env.FTP_USER || 'u3220060';
  const pass = process.env.FTP_PASSWORD || 'WDl0ZqrhEJ6Q6t75';
  
  console.log(`Deploying to FTP server: ${host}:${port} as ${user}`);
  
  // Create temporary script for uploading files
  const uploadScript = path.join(process.cwd(), 'upload-files-main.sh');
  
  // Get list of files to upload
  const filesToUpload = [];
  function getFiles(dir, baseDir = '') {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const relativePath = baseDir ? path.join(baseDir, item) : item;
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        getFiles(fullPath, relativePath);
      } else {
        filesToUpload.push({
          local: fullPath,
          remote: relativePath
        });
      }
    }
  }
  
  getFiles(distDir);
  
  // Create curl commands for uploading files
  let curlCommands = `#!/bin/bash\n\n`;
  curlCommands += `echo "Starting FTP upload with main user..."\n\n`;
  
  for (const file of filesToUpload) {
    // Create directories on server if needed
    const remoteDir = path.dirname(file.remote);
    if (remoteDir !== '.') {
      curlCommands += `echo "Creating directory: ${remoteDir}"\n`;
      curlCommands += `curl -s -T NUL ftp://${user}:${pass}@${host}/${remoteDir}/ --ftp-create-dirs\n`;
    }
    
    curlCommands += `echo "Uploading: ${file.remote}"\n`;
    curlCommands += `curl -T "${file.local}" ftp://${user}:${pass}@${host}/${file.remote} --ftp-create-dirs\n`;
  }
  
  curlCommands += `\necho "Upload completed successfully!"\n`;
  
  fs.writeFileSync(uploadScript, curlCommands);
  
  // Make script executable
  execSync(`chmod +x "${uploadScript}"`, { stdio: 'inherit' });
  
  console.log('Upload script created. Starting upload...');
  
  // Execute upload
  execSync(`"${uploadScript}"`, { stdio: 'inherit' });
  
  // Remove temporary script
  fs.unlinkSync(uploadScript);
  
  console.log('Deployment completed successfully!');
  console.log('The new build has been uploaded to the production server using main FTP user.');
  
} catch (error) {
  console.error('Deployment failed:', error.message);
  process.exit(1);
}