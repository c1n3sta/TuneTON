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
    const user = process.env.FTP_USER || 'u3220060_tuneton_qoder';
    const pass = process.env.FTP_PASSWORD || '8XIaE5MdeOK4tJv1';
    
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
    
    // First, let's clear the current directory on the server
    console.log('Cleaning up existing files on server...');
    try {
      const list = await client.list();
      for (const item of list) {
        if (item.name !== '.' && item.name !== '..') {
          try {
            if (item.type === 2) { // Directory
              await client.removeDir(item.name);
              console.log(`Removed directory: ${item.name}`);
            } else { // File
              await client.remove(item.name);
              console.log(`Removed file: ${item.name}`);
            }
          } catch (error) {
            console.log(`Failed to remove ${item.name}: ${error.message}`);
          }
        }
      }
    } catch (error) {
      console.log('Error during cleanup:', error.message);
    }
    
    // Create assets directory
    try {
      await client.send('MKD assets');
      console.log('Created assets directory');
    } catch (error) {
      console.log('Assets directory already exists or error creating it');
    }
    
    // Get list of files to upload
    const filesToUpload = [];
    function getFiles(dir, baseDir = '') {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        // Use forward slashes for FTP paths
        const relativePath = baseDir ? path.join(baseDir, item).replace(/\\/g, '/') : item.replace(/\\/g, '/');
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
    
    // Upload files with correct paths
    for (const file of filesToUpload) {
      try {
        console.log(`Uploading: ${file.remote}`);
        
        if (file.remote.startsWith('assets/')) {
          // Upload assets files to assets directory
          await client.uploadFrom(file.local, file.remote);
          console.log(`✓ Uploaded to assets: ${file.remote}`);
        } else {
          // Upload other files to root directory
          const filename = path.basename(file.remote);
          await client.uploadFrom(file.local, filename);
          console.log(`✓ Uploaded to root: ${filename}`);
        }
      } catch (error) {
        console.log(`✗ Failed to upload ${file.remote}: ${error.message}`);
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