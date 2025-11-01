#!/usr/bin/env node

import { exec } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';

// Create a simple FTP script to list files
const ftpScript = `open 31.31.197.37 21
user u3220060 WDl0ZqrhEJ6Q6t75
binary
pwd
ls
quit`;

writeFileSync('test-listing.txt', ftpScript);

// Execute FTP command
exec('ftp -n -s:test-listing.txt', (error, stdout, stderr) => {
  if (error) {
    console.log('Error:', error);
    return;
  }
  
  console.log('FTP Output:');
  console.log(stdout);
  
  // Clean up
  unlinkSync('test-listing.txt');
});