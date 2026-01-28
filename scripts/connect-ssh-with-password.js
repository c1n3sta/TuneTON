#!/usr/bin/env node

// Script to connect to SSH using password authentication
import dotenv from 'dotenv';
import { NodeSSH } from 'node-ssh';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });

async function connectWithPassword() {
  const ssh = new NodeSSH();
  
  try {
    // Get SSH credentials from environment variables
    const host = process.env.SSH_HOST || 'server290.hosting.reg.ru';
    const port = parseInt(process.env.SSH_PORT) || 22;
    const username = process.env.SSH_USER || 'u3220060';
    const password = process.env.SSH_PASSWORD || '2uh71L41NN7hvAGA';
    
    console.log(`🔍 Connecting to ${host}:${port} as ${username}...`);
    
    // Connect via SSH with password authentication
    await ssh.connect({
      host,
      port,
      username,
      password,
      tryKeyboard: true,
      onKeyboardInteractive: (name, instructions, instructionsLang, prompts, finish) => {
        if (prompts.length > 0 && prompts[0].prompt.toLowerCase().includes('password')) {
          finish([password]);
        }
      }
    });
    
    console.log('✅ SSH connection successful!');
    
    // Run a simple command to verify we can execute commands
    console.log('\n🏃 Running test commands:');
    
    // Check current directory
    const pwdResult = await ssh.execCommand('pwd');
    console.log(`📂 Current directory: ${pwdResult.stdout.trim()}`);
    
    // List home directory contents
    const lsResult = await ssh.execCommand('ls -la');
    console.log(`📋 Home directory contents:\n${lsResult.stdout}`);
    
    // Check if backend directory exists
    try {
      const backendResult = await ssh.execCommand('ls -la backend');
      console.log(`📋 Backend directory contents:\n${backendResult.stdout}`);
    } catch (error) {
      console.log('ℹ️  Backend directory not found or inaccessible');
    }
    
    // Check if we can access the tuneton directory
    try {
      const tunetonResult = await ssh.execCommand('ls -la tuneton');
      console.log(`📋 Tuneton directory contents:\n${tunetonResult.stdout}`);
    } catch (error) {
      console.log('ℹ️  Tuneton directory not found or inaccessible');
    }
    
    // Check Node.js version
    try {
      const nodeResult = await ssh.execCommand('node --version');
      console.log(`🟢 Node.js version: ${nodeResult.stdout.trim()}`);
    } catch (error) {
      console.log('⚠️  Node.js not found or not in PATH');
    }
    
    // Check npm version
    try {
      const npmResult = await ssh.execCommand('npm --version');
      console.log(`📦 npm version: ${npmResult.stdout.trim()}`);
    } catch (error) {
      console.log('⚠️  npm not found or not in PATH');
    }
    
    ssh.dispose();
    
    console.log(`
🎉 SSH connection test completed successfully!

💡 Next steps:
   - Run 'npm run deploy:backend' to deploy the backend files
   - SSH into the server manually with: ssh ${username}@${host} -p ${port}
   - Once connected, navigate to the backend directory and run 'npm install'
`);
    
  } catch (error) {
    console.error('❌ SSH connection failed:', error.message);
    
    if (error.message.includes('connect')) {
      console.log(`
🤔 Troubleshooting tips:
   1. Verify your SSH credentials in .env.production
   2. Check if SSH access is enabled on your hosting account
   3. Try connecting manually with: ssh ${username}@${host} -p ${port}
   4. Contact your hosting provider if issues persist
`);
    }
    
    if (error.message.includes('Permission denied')) {
      console.log(`
🔐 Authentication issues:
   1. The password might be incorrect
   2. SSH password authentication might be disabled
   3. Your account might not have SSH access enabled
   4. Try contacting your hosting provider to:
      - Verify SSH access is enabled for your account
      - Confirm the correct SSH credentials
      - Check if key-based authentication is required
`);
    }
    
    process.exit(1);
  }
}

// Run the connection test
connectWithPassword();