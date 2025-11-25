#!/usr/bin/env node

import pkg from 'basic-ftp';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const { Client } = pkg;

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });

console.log('Starting deployment process with main FTP user using basic-ftp...');

// Function to create a new FTP client with proper settings
function createClient() {
  const client = new Client();
  client.ftp.verbose = true; // Log FTP commands and responses
  return client;
}

// Function to upload a single file with retry logic
async function uploadFileWithRetry(client, localPath, remotePath, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Uploading: ${remotePath} (Attempt ${attempt}/${maxRetries})`);
      await client.uploadFrom(localPath, remotePath);
      console.log(`✓ Uploaded successfully: ${remotePath}`);
      return true;
    } catch (error) {
      console.log(`✗ Failed to upload ${remotePath} (Attempt ${attempt}/${maxRetries}): ${error.message}`);
      if (attempt < maxRetries) {
        console.log(`Waiting 2 seconds before retry...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
  return false;
}

// Function to establish connection with proper error handling
async function connectWithRetry(client, config, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Connecting to FTP server (Attempt ${attempt}/${maxRetries}): ${config.host}:${config.port} as ${config.user}`);
      await client.access({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        secure: false
      });
      console.log('Connected successfully!');
      return true;
    } catch (error) {
      console.log(`Connection attempt ${attempt} failed: ${error.message}`);
      if (attempt < maxRetries) {
        console.log(`Waiting 5 seconds before retry...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }
  return false;
}

async function deploy() {
  let client = createClient();
  
  try {
    // Get FTP credentials from environment variables
    const host = process.env.FTP_HOST || '31.31.197.37';
    const port = parseInt(process.env.FTP_PORT) || 21;
    const user = process.env.FTP_USER || 'u3220060_tuneton_qoder';
    const pass = process.env.FTP_PASSWORD || '8XIaE5MdeOK4tJv1';
    
    const ftpConfig = { host, port, user, password: pass };
    
    // Connect to FTP server with retry logic
    if (!await connectWithRetry(client, ftpConfig)) {
      throw new Error('Failed to establish FTP connection after multiple attempts');
    }
    
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
    
    // Upload files with correct paths and retry logic
    let successCount = 0;
    let failureCount = 0;
    
    for (const file of filesToUpload) {
      try {
        // Reconnect if client is closed
        if (!client.ftp.connected) {
          console.log('Reconnecting to FTP server...');
          client = createClient();
          if (!await connectWithRetry(client, ftpConfig)) {
            throw new Error('Failed to reestablish FTP connection');
          }
        }
        
        let uploadSuccess = false;
        if (file.remote.startsWith('assets/')) {
          // Upload assets files to assets directory
          uploadSuccess = await uploadFileWithRetry(client, file.local, file.remote);
        } else {
          // Upload other files to root directory
          const filename = path.basename(file.remote);
          uploadSuccess = await uploadFileWithRetry(client, file.local, filename);
        }
        
        if (uploadSuccess) {
          successCount++;
        } else {
          failureCount++;
        }
      } catch (error) {
        console.log(`✗ Failed to upload ${file.remote}: ${error.message}`);
        failureCount++;
      }
    }
    
    console.log(`Upload completed! Success: ${successCount}, Failures: ${failureCount}`);
    
    if (failureCount === 0) {
      console.log('The new build has been uploaded to the production server using main FTP user.');
    } else {
      console.log(`⚠️  Upload completed with ${failureCount} failures. Please check the logs above.`);
    }
    
  } catch (error) {
    console.error('Deployment failed:', error.message);
    process.exit(1);
  } finally {
    if (client && client.ftp.connected) {
      client.close();
    }
  }
}

deploy();