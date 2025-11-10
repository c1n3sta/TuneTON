#!/usr/bin/env node

import pkg from 'basic-ftp';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const { Client } = pkg;

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });

async function checkDirectory() {
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
    
    // List current directory
    console.log('Current directory:');
    const pwd = await client.send("PWD");
    console.log(pwd);
    
    // List files in current directory
    console.log('Files in current directory:');
    const list = await client.list();
    
    // Print detailed information about each file
    for (const item of list) {
      console.log(`- ${item.name} (${item.type === 1 ? 'file' : item.type === 2 ? 'directory' : 'other'})`);
      if (item.modifiedAt) {
        console.log(`  Modified: ${item.modifiedAt.toISOString()}`);
      }
    }
    
    // Check specifically for index.html
    const indexFile = list.find(item => item.name === 'index.html');
    if (indexFile) {
      console.log('\nFound index.html file:');
      console.log(`  Type: ${indexFile.type === 1 ? 'file' : indexFile.type === 2 ? 'directory' : 'other'}`);
      if (indexFile.size) console.log(`  Size: ${indexFile.size} bytes`);
      if (indexFile.modifiedAt) console.log(`  Modified: ${indexFile.modifiedAt.toISOString()}`);
    } else {
      console.log('\nindex.html file NOT found in current directory');
    }
    
    // Check for other important files
    const importantFiles = ['manifest.json', 'test-deployment.html'];
    for (const filename of importantFiles) {
      const file = list.find(item => item.name === filename);
      if (file) {
        console.log(`\nFound ${filename} file:`);
        console.log(`  Type: ${file.type === 1 ? 'file' : file.type === 2 ? 'directory' : 'other'}`);
        if (file.size) console.log(`  Size: ${file.size} bytes`);
        if (file.modifiedAt) console.log(`  Modified: ${file.modifiedAt.toISOString()}`);
      } else {
        console.log(`\n${filename} file NOT found in current directory`);
      }
    }
    
    // Check contents of assets directory
    try {
      console.log('\nChecking assets directory:');
      await client.cd("assets");
      const assetsList = await client.list();
      console.log(`Files in assets directory (${assetsList.length} items):`);
      for (const item of assetsList) {
        console.log(`- ${item.name} (${item.type === 1 ? 'file' : item.type === 2 ? 'directory' : 'other'})`);
        if (item.size) console.log(`  Size: ${item.size} bytes`);
        if (item.modifiedAt) console.log(`  Modified: ${item.modifiedAt.toISOString()}`);
      }
      
      // Go back to parent directory
      await client.cd("..");
    } catch (error) {
      console.log('Could not access assets directory:', error.message);
    }
    
  } catch (error) {
    console.error('Directory check failed:', error.message);
  } finally {
    client.close();
  }
}

checkDirectory();