const fs = require('fs-extra');
const path = require('path');

async function copyProductionFiles() {
  try {
    const distDir = path.join(__dirname, '..', 'dist');
    const publicDir = path.join(__dirname, '..', 'public');
    
    // Ensure dist directory exists
    await fs.ensureDir(distDir);
    
    // Copy PHP API files
    await fs.copy(
      path.join(publicDir, 'api'),
      path.join(distDir, 'api')
    );
    
    // Copy .htaccess
    await fs.copy(
      path.join(publicDir, '.htaccess'),
      path.join(distDir, '.htaccess')
    );
    
    // Ensure audio directory exists
    await fs.ensureDir(path.join(distDir, 'audio'));
    
    console.log('Production files copied successfully!');
  } catch (error) {
    console.error('Error copying production files:', error);
    process.exit(1);
  }
}

copyProductionFiles();
