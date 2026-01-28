#!/usr/bin/env node

// Script to debug SSH connection issues in detail
import { spawn } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });

// Get SSH credentials from environment variables
const host = process.env.SSH_HOST || 'server290.hosting.reg.ru';
const port = parseInt(process.env.SSH_PORT) || 22;
const username = process.env.SSH_USER || 'u3220060';
const password = process.env.SSH_PASSWORD || '2uh71L41NN7hvAGA';

console.log('🔍 Detailed SSH Connection Debugging');
console.log('=====================================\n');

console.log('🔧 Connection Parameters:');
console.log(`   Host: ${host}`);
console.log(`   Port: ${port}`);
console.log(`   Username: ${username}\n`);

// Function to run SSH command with verbose output
function runSSHDebug() {
  console.log('🏃 Running SSH with maximum verbosity...\n');
  
  // SSH command with verbose output
  const ssh = spawn('ssh', [
    '-vvv',  // Maximum verbosity
    '-o', 'StrictHostKeyChecking=no',
    '-o', 'UserKnownHostsFile=/dev/null',
    '-o', 'ConnectTimeout=30',
    '-p', port.toString(),
    `${username}@${host}`,
    'echo "SSH CONNECTION SUCCESSFUL"'
  ], {
    env: { ...process.env, SSHPASS: password }
  });

  ssh.stdout.on('data', (data) => {
    console.log(`[STDOUT] ${data}`);
  });

  ssh.stderr.on('data', (data) => {
    console.log(`[STDERR] ${data}`);
  });

  ssh.on('close', (code) => {
    console.log(`\n[INFO] SSH process exited with code ${code}`);
  });

  // Set a timeout to kill the process if it hangs
  setTimeout(() => {
    console.log('\n⏰ Terminating SSH debug after 60 seconds');
    ssh.kill();
  }, 60000);
}

// Also try with sshpass if available (for password auth)
function runSSHPassDebug() {
  console.log('\n🏃 Running SSH with sshpass (if available)...\n');
  
  const sshpass = spawn('sshpass', [
    '-p', password,
    'ssh', 
    '-vvv',
    '-o', 'StrictHostKeyChecking=no',
    '-o', 'UserKnownHostsFile=/dev/null',
    '-o', 'ConnectTimeout=30',
    '-p', port.toString(),
    `${username}@${host}`,
    'echo "SSH CONNECTION SUCCESSFUL"'
  ]);

  sshpass.stdout.on('data', (data) => {
    console.log(`[STDOUT] ${data}`);
  });

  sshpass.stderr.on('data', (data) => {
    console.log(`[STDERR] ${data}`);
  });

  sshpass.on('close', (code) => {
    console.log(`\n[INFO] SSHpass process exited with code ${code}`);
  });

  // Set a timeout to kill the process if it hangs
  setTimeout(() => {
    console.log('\n⏰ Terminating SSHpass debug after 60 seconds');
    sshpass.kill();
  }, 60000);
}

// Run the debugging
runSSHDebug();

// Try sshpass after a delay
setTimeout(() => {
  runSSHPassDebug();
}, 30000);

console.log('\n📝 Next Steps:');
console.log('1. Check the verbose output for specific error messages');
console.log('2. Look for "handshake" or "connection refused" errors');
console.log('3. Contact your hosting provider with the exact error messages');
console.log('4. Ask if SSH access requires special activation or different credentials');