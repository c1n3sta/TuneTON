#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Listing files on FTP server...');

try {
  // Проверяем наличие необходимых файлов
  const ftpCommands = path.join(process.cwd(), 'ftp-commands.txt');
  
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
  
  console.log(`Connecting to FTP server: ${host}:${port} as ${user}`);
  
  // Создаем временный скрипт для листинга файлов
  const listScript = path.join(process.cwd(), 'list-files.sh');
  
  // Создаем команды для листинга файлов
  let curlCommands = `#!/bin/bash\n\n`;
  curlCommands += `echo "Listing files in root directory:"\n`;
  curlCommands += `curl -s -l ftp://${user}:${pass}@${host}/\n\n`;
  curlCommands += `echo "Listing files in /www/ directory:"\n`;
  curlCommands += `curl -s -l ftp://${user}:${pass}@${host}/www/\n\n`;
  curlCommands += `echo "Listing files in /www/tuneton.space/ directory:"\n`;
  curlCommands += `curl -s -l ftp://${user}:${pass}@${host}/www/tuneton.space/\n\n`;
  
  fs.writeFileSync(listScript, curlCommands);
  
  // Делаем скрипт исполняемым
  execSync(`chmod +x "${listScript}"`, { stdio: 'inherit' });
  
  console.log('List script created. Executing...');
  
  // Выполняем листинг
  execSync(`"${listScript}"`, { stdio: 'inherit' });
  
  // Удаляем временный скрипт
  fs.unlinkSync(listScript);
  
  console.log('File listing completed.');
  
} catch (error) {
  console.error('File listing failed:', error.message);
  process.exit(1);
}