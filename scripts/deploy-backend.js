#!/usr/bin/env node

// Script to deploy the self-hosted backend
import { Client } from 'basic-ftp';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });

console.log('Starting backend deployment...');

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

// Function to create directory recursively
async function createDirectoryRecursive(client, dirPath) {
  // Remove leading slash if present and split path
  const cleanPath = dirPath.replace(/^\//, '');
  const dirs = cleanPath.split('/').filter(dir => dir !== '');
  
  let currentPath = '';
  for (const dir of dirs) {
    currentPath = currentPath ? currentPath + '/' + dir : dir;
    try {
      await client.send('MKD ' + currentPath);
      console.log(`Created directory: ${currentPath}`);
    } catch (error) {
      // Directory might already exist, which is fine
      console.log(`Directory ${currentPath} already exists or error creating it`);
    }
  }
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
    const serverDir = path.join(process.cwd(), 'server');
    
    if (!fs.existsSync(serverDir)) {
      throw new Error('server directory not found.');
    }
    
    // Create backend directory on server if it doesn't exist
    try {
      await client.send('MKD backend');
      console.log('Created backend directory');
    } catch (error) {
      console.log('Backend directory already exists or error creating it');
    }
    
    // Change to backend directory
    await client.cd('backend');
    
    // Get list of files to upload
    const filesToUpload = [];
    async function getFiles(dir, baseDir = '') {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        // Skip node_modules and other unnecessary directories
        if (item === 'node_modules' || item === '.git' || item === 'dist') {
          continue;
        }
        
        const fullPath = path.join(dir, item);
        // Use forward slashes for FTP paths
        const relativePath = baseDir ? path.join(baseDir, item).replace(/\\/g, '/') : item.replace(/\\/g, '/');
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Create directory on server
          const remoteDirPath = relativePath;
          try {
            await createDirectoryRecursive(client, remoteDirPath);
          } catch (error) {
            console.log(`Error creating directory ${remoteDirPath}: ${error.message}`);
          }
          
          await getFiles(fullPath, relativePath);
        } else {
          filesToUpload.push({
            local: fullPath,
            remote: relativePath
          });
        }
      }
    }
    
    await getFiles(serverDir);
    
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
          // Change to backend directory again
          await client.cd('backend');
        }
        
        // Create directory structure if needed
        const dirPath = path.dirname(file.remote);
        if (dirPath && dirPath !== '.') {
          try {
            await createDirectoryRecursive(client, dirPath);
          } catch (error) {
            console.log(`Error creating directory ${dirPath}: ${error.message}`);
          }
        }
        
        const uploadSuccess = await uploadFileWithRetry(client, file.local, file.remote);
        
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
      console.log('The backend has been uploaded to the production server.');
      console.log('Remember to run "npm install" on the server to install dependencies.');
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

// Run the deployment
deploy();