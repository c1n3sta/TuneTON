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
  
  console.log(`Found ${filesToUpload.length} files to upload`);
  
  // Create a simple FTP upload script
  const ftpScript = path.join(process.cwd(), 'ftp-upload-script.txt');
  let scriptContent = `open ${host} ${port}\n`;
  scriptContent += `user ${user} ${pass}\n`;
  scriptContent += `binary\n`;
  
  // Upload files
  for (const file of filesToUpload) {
    const remoteDir = path.dirname(file.remote);
    if (remoteDir !== '.') {
      scriptContent += `mkdir ${remoteDir}\n`;
    }
    scriptContent += `put "${file.local}" "${file.remote}"\n`;
  }
  
  scriptContent += `quit\n`;
  
  fs.writeFileSync(ftpScript, scriptContent);
  
  console.log('FTP script created. Starting upload...');
  
  // Execute FTP upload
  try {
    execSync(`ftp -n -s:"${ftpScript}"`, { stdio: 'inherit' });
    console.log('Upload completed successfully!');
  } catch (ftpError) {
    console.log('FTP command failed, trying alternative method...');
    
    // Fallback to individual curl commands
    let successCount = 0;
    let failCount = 0;
    
    for (const file of filesToUpload) {
      try {
        const remoteDir = path.dirname(file.remote);
        if (remoteDir !== '.') {
          // Try to create directory (ignore errors)
          try {
            execSync(`curl -s -T NUL "ftp://${user}:${pass}@${host}/${remoteDir}/" --ftp-create-dirs`, { stdio: 'ignore' });
          } catch (dirError) {
            // Ignore directory creation errors
          }
        }
        
        execSync(`curl -T "${file.local}" "ftp://${user}:${pass}@${host}/${file.remote}" --ftp-create-dirs`, { stdio: 'ignore' });
        console.log(`✓ Uploaded: ${file.remote}`);
        successCount++;
      } catch (uploadError) {
        console.log(`✗ Failed to upload: ${file.remote}`);
        failCount++;
      }
    }
    
    console.log(`Upload summary: ${successCount} successful, ${failCount} failed`);
  }
  
  // Clean up
  if (fs.existsSync(ftpScript)) {
    fs.unlinkSync(ftpScript);
  }
  
  console.log('Deployment process completed!');
  
} catch (error) {
  console.error('Deployment failed:', error.message);
  process.exit(1);
}