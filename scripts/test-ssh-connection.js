#!/usr/bin/env node

// Simple script to test SSH connection using credentials from .env.production
import dotenv from 'dotenv';
import { NodeSSH } from 'node-ssh';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });

async function testSSHConnection() {
  const ssh = new NodeSSH();
  
  try {
    // Get SSH credentials from environment variables
    const host = process.env.SSH_HOST || 'server290.hosting.reg.ru';
    const port = parseInt(process.env.SSH_PORT) || 22;
    const username = process.env.SSH_USER || 'u3220060';
    const password = process.env.SSH_PASSWORD || '2uh71L41NN7hvAGA';
    
    console.log(`🔍 Testing SSH connection to ${host}:${port} as ${username}...`);
    
    // Connect via SSH
    await ssh.connect({
      host,
      port,
      username,
      password
    });
    
    console.log('✅ SSH connection successful!');
    
    // Run a simple command to verify we can execute commands
    console.log('🏃 Running test command: whoami');
    const result = await ssh.execCommand('whoami');
    console.log(`👤 User: ${result.stdout.trim()}`);
    
    console.log('🏃 Running test command: pwd');
    const pwdResult = await ssh.execCommand('pwd');
    console.log(`📂 Current directory: ${pwdResult.stdout.trim()}`);
    
    console.log('🏃 Running test command: ls -la');
    const lsResult = await ssh.execCommand('ls -la');
    console.log(`📋 Directory listing:\n${lsResult.stdout}`);
    
    ssh.dispose();
    
    console.log(`
🎉 SSH connection test completed successfully!

📡 Connection Details:
   - Host: ${host}
   - Port: ${port}
   - User: ${username}
   - Password: ${password.substring(0, 3)}*** (hidden for security)

💡 Next steps:
   - Run 'npm run setup:monitoring' to set up the monitoring system
   - Or connect manually with: ssh ${username}@${host} -p ${port}
`);
    
  } catch (error) {
    console.error('❌ SSH connection failed:', error.message);
    
    if (error.message.includes('connect')) {
      console.log(`
🤔 Troubleshooting tips:
   1. Verify your SSH credentials in .env.production
   2. Check if SSH access is enabled on your hosting account
   3. Ensure the SSH port (${port}) is not blocked by a firewall
   4. Try connecting manually with: ssh ${username}@${host} -p ${port}
   5. Contact your hosting provider if issues persist
`);
    }
    
    process.exit(1);
  }
}

// Run the test
testSSHConnection();