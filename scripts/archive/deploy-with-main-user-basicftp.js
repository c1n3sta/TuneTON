#!/usr/bin/env node

import pkg from 'basic-ftp';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const { Client } = pkg;

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });

console.log('Starting deployment process with main FTP user using basic-ftp...');

async function deploy() {
  const client = new Client();
  client.ftp.verbose = true; // Log FTP commands and responses
  
  try {
    // Get FTP credentials from environment variables
    const host = process.env.FTP_HOST || '31.31.197.37';
    const port = parseInt(process.env.FTP_PORT) || 21;
    const user = process.env.FTP_USER || 'u3220060';
    const pass = process.env.FTP_PASSWORD || 'WDl0ZqrhEJ6Q6t75';
    
    console.log(`Connecting to FTP server: ${host}:${port} as ${user}`);
    
    // Connect to FTP server
    await client.access({
      host,
      port,
      user,
      password: pass,
      secure: false
    });
    
    console.log('Connected successfully!');
    
    // Check for required files
    const distDir = path.join(process.cwd(), 'dist');
    
    if (!fs.existsSync(distDir)) {
      throw new Error('dist directory not found. Please run build first.');
    }
    
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
    
    // Upload files
    for (const file of filesToUpload) {
      try {
        // Create directories on server if needed
        const remoteDir = path.dirname(file.remote);
        if (remoteDir !== '.') {
          console.log(`Creating directory: ${remoteDir}`);
          await client.ensureDir(remoteDir);
        }
        
        console.log(`Uploading: ${file.remote}`);
        await client.uploadFrom(file.local, file.remote);
        console.log(`✓ Uploaded: ${file.remote}`);
      } catch (uploadError) {
        console.log(`✗ Failed to upload: ${file.remote}`, uploadError.message);
      }
    }
    
    console.log('Upload completed successfully!');
    console.log('The new build has been uploaded to the production server using main FTP user.');
    
  } catch (error) {
    console.error('Deployment failed:', error.message);
    process.exit(1);
  } finally {
    client.close();
  }
}

deploy();