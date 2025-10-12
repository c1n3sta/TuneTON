const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Source and destination directories
const sourceDir = path.join(__dirname, 'new');
const destDir = path.join(__dirname, 'src');

// Files and directories to copy from new/ to src/
const filesToCopy = [
  'App.tsx',
  'vite-env.d.ts',
  'components',
  'utils',
  'hooks',
  'styles',
  'theme',
  'types'
];

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Function to copy files and directories recursively
function copyRecursiveSync(src, dest) {
  const stats = fs.statSync(src);
  
  if (stats.isDirectory()) {
    // Create directory if it doesn't exist
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    // Copy directory contents
    const items = fs.readdirSync(src);
    for (const item of items) {
      copyRecursiveSync(path.join(src, item), path.join(dest, item));
    }
  } else {
    // Skip if source and destination are the same file
    if (fs.existsSync(dest)) {
      const destStat = fs.statSync(dest);
      if (stats.mtime <= destStat.mtime) {
        console.log(`Skipping ${src} (up to date)`);
        return;
      }
    }
    
    // Copy file
    console.log(`Copying ${src} to ${dest}`);
    fs.copyFileSync(src, dest);
  }
}

// Copy files and directories
console.log('Moving files from new/ to src/...');
for (const item of filesToCopy) {
  const srcPath = path.join(sourceDir, item);
  const destPath = path.join(destDir, item);
  
  if (fs.existsSync(srcPath)) {
    copyRecursiveSync(srcPath, destPath);
  } else {
    console.warn(`Warning: ${srcPath} does not exist`);
  }
}

// Copy .env.example if it exists
const envExampleSrc = path.join(sourceDir, '.env.example');
const envExampleDest = path.join(__dirname, '.env.example');
if (fs.existsSync(envExampleSrc) && !fs.existsSync(envExampleDest)) {
  console.log(`Copying ${envExampleSrc} to ${envExampleDest}`);
  fs.copyFileSync(envExampleSrc, envExampleDest);
}

console.log('File move completed!');
