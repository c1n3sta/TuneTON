#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Starting deployment process...');

try {
  // Проверяем наличие необходимых файлов
  const distDir = path.join(process.cwd(), 'dist');
  const ftpCommands = path.join(process.cwd(), 'ftp-commands.txt');
  
  if (!fs.existsSync(distDir)) {
    throw new Error('dist directory not found. Please run build first.');
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
  
  // Создаем временный скрипт для загрузки файлов
  const uploadScript = path.join(process.cwd(), 'upload-files.sh');
  
  // Получаем список файлов для загрузки
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
          remote: relativePath
        });
      }
    }
  }
  
  getFiles(distDir);
  
  // Создаем команды для загрузки файлов
  let curlCommands = `#!/bin/bash\n\n`;
  curlCommands += `echo "Starting FTP upload..."\n\n`;
  
  for (const file of filesToUpload) {
    // Создаем директории на сервере если нужно
    const remoteDir = path.dirname(file.remote);
    if (remoteDir !== '.') {
      curlCommands += `echo "Creating directory: ${remoteDir}"\n`;
      curlCommands += `curl -s -T NUL ftp://${user}:${pass}@${host}/${remoteDir}/ --ftp-create-dirs\n`;
    }
    
    curlCommands += `echo "Uploading: ${file.remote}"\n`;
    curlCommands += `curl -T "${file.local}" ftp://${user}:${pass}@${host}/${file.remote} --ftp-create-dirs\n`;
  }
  
  curlCommands += `\necho "Upload completed successfully!"\n`;
  
  fs.writeFileSync(uploadScript, curlCommands);
  
  // Делаем скрипт исполняемым
  execSync(`chmod +x "${uploadScript}"`, { stdio: 'inherit' });
  
  console.log('Upload script created. Starting upload...');
  
  // Выполняем загрузку
  execSync(`"${uploadScript}"`, { stdio: 'inherit' });
  
  // Удаляем временный скрипт
  fs.unlinkSync(uploadScript);
  
  console.log('Deployment completed successfully!');
  console.log('The new build has been uploaded to the production server.');
  
} catch (error) {
  console.error('Deployment failed:', error.message);
  process.exit(1);
}