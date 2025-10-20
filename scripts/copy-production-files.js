import fs from 'fs-extra';
import path from 'path';

async function copyProductionFiles() {
  try {
    const distDir = path.join(process.cwd(), 'dist');
    const publicDir = path.join(process.cwd(), 'public');
    
    // Ensure dist directory exists
    await fs.ensureDir(distDir);
    
    console.log('Copying essential production files...');
    
    // Copy only essential PHP API files for production
    const apiDir = path.join(publicDir, 'api');
    const distApiDir = path.join(distDir, 'api');
    
    if (fs.existsSync(apiDir)) {
      await fs.ensureDir(distApiDir);
      
      // Copy only essential API files
      const essentialApiFiles = ['tracks.php', 'playback.php'];
      for (const file of essentialApiFiles) {
        const srcFile = path.join(apiDir, file);
        const destFile = path.join(distApiDir, file);
        if (fs.existsSync(srcFile)) {
          await fs.copy(srcFile, destFile);
          console.log(`Copied ${file} to production build`);
        }
      }
    }
    
    // Copy .htaccess if it exists
    const htaccessSrc = path.join(publicDir, '.htaccess');
    const htaccessDest = path.join(distDir, '.htaccess');
    if (fs.existsSync(htaccessSrc)) {
      await fs.copy(htaccessSrc, htaccessDest);
      console.log('Copied .htaccess to production build');
    }
    
    // Copy essential assets (but not development/test assets)
    const assetsSrc = path.join(publicDir, 'assets');
    const assetsDest = path.join(distDir, 'assets');
    if (fs.existsSync(assetsSrc)) {
      await fs.copy(assetsSrc, assetsDest);
      console.log('Copied assets to production build');
    }
    
    // Note: Audio files are NOT copied to production build
    // They should be served separately or uploaded to a CDN
    console.log('NOTE: Audio files are not included in production build.');
    console.log('Audio files should be served separately or uploaded to a CDN.');
    
    console.log('Production files copied successfully!');
    console.log('Production build is ready and contains only essential files.');
  } catch (error) {
    console.error('Error copying production files:', error);
    process.exit(1);
  }
}

// Also create a function to clean the production build
async function cleanProductionBuild() {
  try {
    const distDir = path.join(process.cwd(), 'dist');
    
    // Remove development-only files from dist directory
    const devOnlyFiles = [
      // Add any development-only files that might have been included
    ];
    
    for (const file of devOnlyFiles) {
      const filePath = path.join(distDir, file);
      if (fs.existsSync(filePath)) {
        await fs.remove(filePath);
        console.log(`Removed development file: ${file}`);
      }
    }
    
    console.log('Production build cleaned successfully!');
  } catch (error) {
    console.error('Error cleaning production build:', error);
    process.exit(1);
  }
}

// Run the functions
async function run() {
  await copyProductionFiles();
  await cleanProductionBuild();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run();
}

export { cleanProductionBuild, copyProductionFiles };
