#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Starting deployment process...');

try {
  // Проверяем наличие необходимых файлов
  const distZip = path.join(process.cwd(), 'dist-new.zip');
  const ftpCommands = path.join(process.cwd(), 'ftp-commands.txt');
  
  if (!fs.existsSync(distZip)) {
    throw new Error('dist-new.zip not found. Please run build first.');
  }
  
  if (!fs.existsSync(ftpCommands)) {
    throw new Error('ftp-commands.txt not found.');
  }
  
  console.log('All required files found.');
  
  // Создаем временный скрипт для FTP загрузки
  const ftpScript = path.join(process.cwd(), 'upload-ftp.bat');
  const ftpScriptContent = `@echo off
echo Connecting to FTP server...
ftp -s:"${ftpCommands}"
echo FTP upload completed.
pause`;

  fs.writeFileSync(ftpScript, ftpScriptContent);
  
  console.log('FTP script created.');
  
  // Копируем новый архив в директорию deploy-package
  const deployPackageDir = path.join(process.cwd(), 'deploy-package');
  const deployZip = path.join(deployPackageDir, 'dist.zip');
  
  if (fs.existsSync(deployPackageDir)) {
    fs.copyFileSync(distZip, deployZip);
    console.log('Updated dist.zip in deploy-package directory.');
  }
  
  // Загружаем файлы на сервер через FTP
  console.log('Uploading files to FTP server...');
  execSync(`"${ftpScript}"`, { stdio: 'inherit' });
  
  // Удаляем временный скрипт
  fs.unlinkSync(ftpScript);
  
  console.log('Deployment completed successfully!');
  console.log('The new build has been uploaded to the production server.');
  
} catch (error) {
  console.error('Deployment failed:', error.message);
  process.exit(1);
}