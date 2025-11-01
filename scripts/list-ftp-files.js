#!/usr/bin/env node

import pkg from 'basic-ftp';
import fs from 'fs';

const { Client } = pkg;

async function listFiles() {
  const client = new Client();
  client.ftp.verbose = true;
  
  try {
    // Use the working credentials from ftp-commands.txt
    await client.access({
      host: '31.31.197.37',
      port: 21,
      user: 'u3220060_tuneton_qoder',
      password: '8XIaE5MdeOK4tJv1',
      secure: false
    });
    
    console.log('Connected successfully!');
    
    // List files in the root directory
    const list = await client.list();
    console.log('Root directory files:');
    for (const item of list) {
      console.log(`${item.name} (${item.type})`);
    }
    
    // Try to list files in the dist directory if it exists
    try {
      await client.cd('dist');
      const distList = await client.list();
      console.log('\nDist directory files:');
      for (const item of distList) {
        console.log(`${item.name} (${item.type})`);
      }
    } catch (error) {
      console.log('No dist directory found');
    }
    
  } catch (error) {
    console.error('Failed to list files:', error.message);
  } finally {
    client.close();
  }
}

listFiles();