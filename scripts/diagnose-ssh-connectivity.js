#!/usr/bin/env node

// Script to diagnose SSH connectivity issues
import { spawn } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });

console.log('🔍 Diagnosing SSH connectivity...\n');

// Get SSH credentials from environment variables
const host = process.env.SSH_HOST || 'server290.hosting.reg.ru';
const port = parseInt(process.env.SSH_PORT) || 22;
const username = process.env.SSH_USER || 'u3220060';

console.log('🔧 Connection parameters:');
console.log(`   Host: ${host}`);
console.log(`   Port: ${port}`);
console.log(`   Username: ${username}\n`);

// Function to run a command and return the result
function runCommand(command, args) {
  return new Promise((resolve) => {
    const proc = spawn(command, args);
    let stdout = '';
    let stderr = '';
    
    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    proc.on('close', (code) => {
      resolve({ code, stdout, stderr });
    });
  });
}

async function diagnoseConnectivity() {
  console.log('📡 Step 1: Checking if host is reachable (ping)...');
  
  try {
    // Try to ping the host (Windows uses -n, Unix uses -c)
    const pingArgs = process.platform === 'win32' ? ['-n', '4', host] : ['-c', '4', host];
    const pingResult = await runCommand('ping', pingArgs);
    
    if (pingResult.code === 0) {
      console.log('✅ Host is reachable via ICMP ping\n');
    } else {
      console.log('❌ Host is not reachable via ICMP ping');
      console.log('   This might be normal as many servers block ICMP requests\n');
    }
  } catch (error) {
    console.log('⚠️  Could not run ping command\n');
  }
  
  console.log('🔌 Step 2: Checking if SSH port is open...');
  
  try {
    // Try to check if the port is open using telnet or nc
    let portCheckResult;
    
    if (process.platform === 'win32') {
      // On Windows, try PowerShell Test-NetConnection
      const psCommand = `Test-NetConnection -ComputerName ${host} -Port ${port}`;
      portCheckResult = await runCommand('powershell', ['-Command', psCommand]);
      
      if (portCheckResult.stdout.includes('TcpTestSucceeded : True')) {
        console.log(`✅ Port ${port} is open on ${host}\n`);
      } else {
        console.log(`❌ Port ${port} appears to be closed or filtered on ${host}`);
        console.log('   This could mean:');
        console.log('   - SSH is not enabled on the server');
        console.log('   - The port is blocked by a firewall');
        console.log('   - You\'re using the wrong port\n');
      }
    } else {
      // On Unix-like systems, try nc (netcat)
      portCheckResult = await runCommand('nc', ['-zv', host, port.toString()]);
      
      if (portCheckResult.code === 0) {
        console.log(`✅ Port ${port} is open on ${host}\n`);
      } else {
        console.log(`❌ Port ${port} appears to be closed or filtered on ${host}`);
        console.log('   This could mean:');
        console.log('   - SSH is not enabled on the server');
        console.log('   - The port is blocked by a firewall');
        console.log('   - You\'re using the wrong port\n');
      }
    }
  } catch (error) {
    console.log('⚠️  Could not check port connectivity directly');
    console.log('   Try installing netcat (nc) or using a port scanning tool\n');
  }
  
  console.log('🌐 Step 3: DNS resolution check...');
  
  try {
    // Try to resolve the hostname
    const dnsResult = await runCommand('nslookup', [host]);
    
    if (dnsResult.code === 0) {
      console.log('✅ DNS resolution successful');
      // Extract IP address if possible
      const ipMatch = dnsResult.stdout.match(/Addresses?:\s*(\d+\.\d+\.\d+\.\d+)/i);
      if (ipMatch) {
        console.log(`   Resolved IP: ${ipMatch[1]}\n`);
      }
    } else {
      console.log('❌ DNS resolution failed');
      console.log('   Check if the hostname is correct\n');
    }
  } catch (error) {
    console.log('⚠️  Could not perform DNS resolution\n');
  }
  
  console.log('📋 Step 4: Checking common SSH ports...');
  
  // Check common SSH ports
  const commonPorts = [22, 2222, 2200, 222, 2022];
  const sshPort = parseInt(process.env.SSH_PORT) || 22;
  
  if (!commonPorts.includes(sshPort)) {
    commonPorts.push(sshPort);
  }
  
  console.log('   Testing common SSH ports:');
  
  for (const testPort of commonPorts) {
    try {
      if (process.platform === 'win32') {
        const psCommand = `Test-NetConnection -ComputerName ${host} -Port ${testPort}`;
        const portResult = await runCommand('powershell', ['-Command', psCommand]);
        
        if (portResult.stdout.includes('TcpTestSucceeded : True')) {
          console.log(`   ✅ Port ${testPort}: Open`);
        } else {
          console.log(`   ❌ Port ${testPort}: Closed/Filtered`);
        }
      } else {
        const portResult = await runCommand('nc', ['-zv', host, testPort.toString()]);
        if (portResult.code === 0) {
          console.log(`   ✅ Port ${testPort}: Open`);
        } else {
          console.log(`   ❌ Port ${testPort}: Closed/Filtered`);
        }
      }
    } catch (error) {
      console.log(`   ⚠️  Port ${testPort}: Could not test`);
    }
  }
  
  console.log('\n📝 Summary and Recommendations:');
  console.log(`
  Based on the diagnostics:
  
  1. 🔍 If the host is not pingable:
     - This is often normal as many servers block ICMP
     - Continue with other tests
     
  2. 🔌 If the SSH port is closed:
     - SSH may be disabled on your hosting account
     - Your hosting provider may use a different port
     - Contact your hosting provider for the correct SSH settings
     
  3. 🌐 If DNS resolution fails:
     - Double-check the hostname in .env.production
     - Try using the IP address directly if available
     
  4. 📋 If none of the common ports are open:
     - Your hosting provider likely uses a custom port
     - Check your hosting provider's documentation
     - Contact support for SSH access details
     
  🔄 Alternative approaches:
     - Use the web-based setup script (scripts/web-based-setup.php)
     - Upload files via FTP and configure through ISP Manager's file manager
     - Contact your hosting provider to enable SSH access
  `);
}

diagnoseConnectivity();