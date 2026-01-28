#!/usr/bin/env node

/**
 * Alternative FTP Upload Script using ftp-client
 */

import fs from 'fs';
import path from 'path';
import { FTPClient } from 'ftp-client';

// Load environment variables from .env.production
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });

const { FTP_HOST, FTP_USER, FTP_PASSWORD } = process.env;

async function uploadScript() {
    console.log('=== Alternative FTP Upload Script ===');
    console.log('Uploading secure-backend-reorg.sh to server...');
    console.log('');

    try {
        // Configure FTP client
        const client = new FTPClient({
            host: FTP_HOST,
            port: 21,
            user: FTP_USER,
            password: FTP_PASSWORD
        }, {
            logging: 'basic'
        });

        // Connect to FTP server
        console.log('Connecting to FTP server...');
        await client.connect();
        console.log('Successfully connected to FTP server');
        console.log('');

        // Upload the script
        console.log('Uploading secure-backend-reorg.sh...');
        const localPath = path.resolve(process.cwd(), 'scripts', 'secure-backend-reorg.sh');
        const remotePath = '/secure-backend-reorg.sh';
        
        await client.upload([localPath], '/', {
            overwrite: 'all'
        });
        
        console.log('Upload complete!');
        console.log('');

        // List files to verify upload
        console.log('Verifying upload...');
        const files = await client.list('/');
        const uploadedFile = files.find(file => file.name === 'secure-backend-reorg.sh');
        if (uploadedFile) {
            console.log('File successfully uploaded:');
            console.log(`  Name: ${uploadedFile.name}`);
            console.log(`  Size: ${uploadedFile.size} bytes`);
        } else {
            console.log('WARNING: Could not verify file upload');
        }

        console.log('');
        console.log('=== UPLOAD COMPLETE ===');
        console.log('The script has been uploaded to the server.');
        console.log('Next steps for SSH operations:');
        console.log('1. SSH into the server');
        console.log('2. Make the script executable: chmod +x secure-backend-reorg.sh');
        console.log('3. Run the script: ./secure-backend-reorg.sh');

        // Close connection
        await client.disconnect();

    } catch (err) {
        console.error('Error during upload:', err.message);
        process.exit(1);
    }
}

// Execute the function
uploadScript().catch(console.error);