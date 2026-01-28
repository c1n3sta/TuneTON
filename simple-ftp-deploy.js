#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('Starting simple FTP deployment...');

try {
    // Check if dist directory exists
    const distDir = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(distDir)) {
        throw new Error('dist directory not found. Please run "npm run build" first.');
    }

    // Read FTP credentials
    const ftpCommandsPath = path.join(process.cwd(), 'ftp-commands.txt');
    if (!fs.existsSync(ftpCommandsPath)) {
        throw new Error('ftp-commands.txt not found.');
    }

    const ftpContent = fs.readFileSync(ftpCommandsPath, 'utf8');
    const lines = ftpContent.split('\n').filter(line => line.trim() !== '');
    
    const hostLine = lines[0].trim();
    const userLine = lines[1].trim();
    
    const hostParts = hostLine.split(' ');
    const userParts = userLine.split(' ');
    
    const host = hostParts[1];
    const port = hostParts[2];
    const user = userParts[1];
    const pass = userParts[2];

    console.log(`Deploying to FTP server: ${host}:${port} as ${user}`);

    // Get all files from dist directory
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
                    remote: relativePath.replace(/\\/g, '/') // Convert to forward slashes
                });
            }
        }
    }

    getFiles(distDir);

    console.log(`Found ${filesToUpload.length} files to upload`);

    // Upload files using curl
    for (const file of filesToUpload) {
        console.log(`Uploading: ${file.remote}`);
        
        try {
            // Create directory if needed
            const remoteDir = path.dirname(file.remote);
            if (remoteDir !== '.') {
                const createDirCmd = `curl -s -T NUL ftp://${user}:${pass}@${host}/${remoteDir}/ --ftp-create-dirs`;
                execSync(createDirCmd, { stdio: 'pipe' });
            }
            
            // Upload file
            const uploadCmd = `curl -T "${file.local}" ftp://${user}:${pass}@${host}/${file.remote} --ftp-create-dirs`;
            execSync(uploadCmd, { stdio: 'pipe' });
            
        } catch (error) {
            console.error(`Failed to upload ${file.remote}:`, error.message);
        }
    }

    console.log('Deployment completed successfully!');
    console.log('The new build has been uploaded to the production server.');

} catch (error) {
    console.error('Deployment failed:', error.message);
    process.exit(1);
}
