#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Starting deployment process with clean...');

try {
  // Проверяем наличие необходимых файлов
  const distDir = path.join(process.cwd(), 'dist');
  const distZip = path.join(process.cwd(), 'dist-new.zip');
  const ftpCommands = path.join(process.cwd(), 'ftp-commands.txt');
  
  if (!fs.existsSync(distDir)) {
    throw new Error('dist directory not found. Please run build first.');
  }
  
  if (!fs.existsSync(distZip)) {
    throw new Error('dist-new.zip not found. Please create ZIP archive first.');
  }
  
  if (!fs.existsSync(ftpCommands)) {
    throw new Error('ftp-commands.txt not found.');
  }
  
  // Читаем FTP команды
  const ftpContent = fs.readFileSync(ftpCommands, 'utf8');
  const lines = ftpContent.split('\n').filter(line => line.trim() !== '');
  
  if (lines.length < 3) {
    throw new Error('Invalid ftp-commands.txt format');
  }
  
  const hostLine = lines[0].trim();
  const userLine = lines[1].trim();
  
  if (!hostLine.startsWith('open ') || !userLine.startsWith('user ')) {
    throw new Error('Invalid ftp-commands.txt format');
  }
  
  const hostParts = hostLine.split(' ');
  const userParts = userLine.split(' ');
  
  if (hostParts.length < 3 || userParts.length < 3) {
    throw new Error('Invalid ftp-commands.txt format');
  }
  
  const host = hostParts[1];
  const port = hostParts[2];
  const user = userParts[1];
  const pass = userParts[2];
  
  console.log(`Deploying to FTP server: ${host}:${port} as ${user}`);
  
  // Создаем временный скрипт для очистки и загрузки файлов
  const deployScript = path.join(process.cwd(), 'deploy-clean.sh');
  
  // Создаем команды для очистки и загрузки файлов
  let scriptCommands = `#!/bin/bash\n\n`;
  scriptCommands += `echo "Starting FTP deployment with clean..."\n\n`;
  
  // Загружаем ZIP архив
  scriptCommands += `echo "Uploading ZIP archive..."\n`;
  scriptCommands += `curl -T "${distZip}" ftp://${user}:${pass}@${host}/dist-new.zip --ftp-create-dirs\n`;
  
  scriptCommands += `\necho "Upload completed successfully!"\n`;
  
  fs.writeFileSync(deployScript, scriptCommands);
  
  // Делаем скрипт исполняемым
  execSync(`chmod +x "${deployScript}"`, { stdio: 'inherit' });
  
  console.log('Deploy script created. Starting deployment...');
  
  // Выполняем загрузку
  execSync(`"${deployScript}"`, { stdio: 'inherit' });
  
  // Удаляем временный скрипт
  fs.unlinkSync(deployScript);
  
  console.log('Deployment completed successfully!');
  console.log('The new build ZIP has been uploaded to the production server.');
  console.log('Note: You may need to extract the ZIP archive manually on the server.');
  
} catch (error) {
  console.error('Deployment failed:', error.message);
  process.exit(1);
}