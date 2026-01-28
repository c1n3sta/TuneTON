#!/usr/bin/env node

// Simple script to check the current contents of the server via FTP
import { Client } from 'basic-ftp';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });

console.log('🔍 Checking current server contents via FTP...\n');

// Function to create a new FTP client with proper settings
function createClient() {
  const client = new Client();
  client.ftp.verbose = false; // Less verbose to avoid timeout issues
  client.ftp.timeout = 30000; // 30 second timeout
  return client;
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
      console.log('Connected successfully!\n');
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

// Function to list directory contents (non-recursively to avoid timeouts)
async function listDirectory(client, dirPath = '.') {
  try {
    console.log(`📁 Contents of ${dirPath}/:`);
    const files = await client.list(dirPath);
    
    for (const file of files) {
      if (file.name === '.' || file.name === '..') continue;
      
      const type = file.isDirectory ? 'DIR' : 'FILE';
      const size = file.isDirectory ? '' : ` (${file.size} bytes)`;
      console.log(`  ${type.padEnd(4)} ${file.name}${size}`);
    }
    console.log('');
  } catch (error) {
    console.log(`❌ Error listing ${dirPath}: ${error.message}\n`);
  }
}

async function checkServerContents() {
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
    
    console.log('🏠 Home directory contents:');
    await listDirectory(client, '.');
    
    // Check specific directories
    const directoriesToCheck = ['backend', 'tuneton', 'database', 'src', 'monitoring'];
    
    for (const dir of directoriesToCheck) {
      console.log(`🔍 Checking ${dir} directory:`);
      await listDirectory(client, dir);
    }
    
  } catch (error) {
    console.error('❌ Operation failed:', error.message);
    process.exit(1);
  } finally {
    if (client && client.ftp.connected) {
      client.close();
    }
  }
  
  console.log('✅ Server contents check completed.');
}

// Run the check
checkServerContents();