const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Directories to remove
const dirsToRemove = [
  'new',
  'move-files.js',
  'cleanup.js'
];

// Function to remove a directory recursively
function removeDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    console.log(`Removing ${dirPath}...`);
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

// Function to remove a file
function removeFile(filePath) {
  if (fs.existsSync(filePath)) {
    console.log(`Removing ${filePath}...`);
    fs.unlinkSync(filePath);
  }
}

// Clean up
console.log('Cleaning up...');

// Remove directories
dirsToRemove.forEach(item => {
  const fullPath = path.join(__dirname, item);
  if (fs.existsSync(fullPath)) {
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      removeDir(fullPath);
    } else {
      removeFile(fullPath);
    }
  }
});

// Clean npm cache and reinstall dependencies
console.log('\nCleaning npm cache and reinstalling dependencies...');
try {
  // Remove node_modules and package-lock.json
  removeDir(path.join(__dirname, 'node_modules'));
  removeFile(path.join(__dirname, 'package-lock.json'));
  
  // Clean npm cache
  execSync('npm cache clean --force', { stdio: 'inherit' });
  
  // Install dependencies
  console.log('\nInstalling dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('\nCleanup and dependency installation completed successfully!');
} catch (error) {
  console.error('Error during cleanup:', error);
  process.exit(1);
}
