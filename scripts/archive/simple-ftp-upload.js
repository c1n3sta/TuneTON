#!/usr/bin/env node

/**
 * Simple FTP Upload Script
 * Uploads the secure-backend-reorg.sh script to the server
 */

import fs from 'fs';
import path from 'path';
import { Client } from 'basic-ftp';

// Load environment variables from .env.production
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });

const { FTP_HOST, FTP_USER, FTP_PASSWORD } = process.env;

async function uploadScript() {
    console.log('=== Simple FTP Upload Script ===');
    console.log('Uploading secure-backend-reorg.sh to server...');
    console.log('');

    const client = new Client();
    client.ftp.verbose = true;

    try {
        // Connect to FTP server
        console.log('Connecting to FTP server...');
        await client.access({
            host: FTP_HOST,
            user: FTP_USER,
            password: FTP_PASSWORD,
            secure: false
        });
        console.log('Successfully connected to FTP server');
        console.log('');

        // Change to root directory
        console.log('Changing to root directory...');
        await client.cd('/');
        console.log('Current directory:', await client.pwd());
        console.log('');

        // Upload the script
        console.log('Uploading secure-backend-reorg.sh...');
        const localPath = path.resolve(process.cwd(), 'scripts', 'secure-backend-reorg.sh');
        await client.uploadFrom(localPath, 'secure-backend-reorg.sh');
        console.log('Upload complete!');
        console.log('');

        // Verify upload
        console.log('Verifying upload...');
        const list = await client.list();
        const uploadedFile = list.find(file => file.name === 'secure-backend-reorg.sh');
        if (uploadedFile) {
            console.log('File successfully uploaded:');
            console.log(`  Name: ${uploadedFile.name}`);
            console.log(`  Size: ${uploadedFile.size} bytes`);
            console.log(`  Date: ${uploadedFile.date}`);
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

    } catch (err) {
        console.error('Error during upload:', err.message);
        process.exit(1);
    } finally {
        client.close();
    }
}

// Execute the function
uploadScript().catch(console.error);