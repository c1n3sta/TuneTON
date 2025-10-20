import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';

async function createDevelopmentBuild() {
  try {
    console.log('Creating development build with all features...');
    
    // Clean previous build
    console.log('Cleaning previous build...');
    execSync('npm run clean:dist', { stdio: 'inherit' });
    
    // Run TypeScript check (but don't fail the build if there are errors)
    console.log('Running TypeScript check...');
    try {
      execSync('npm run type-check', { stdio: 'inherit' });
      console.log('✅ TypeScript check passed');
    } catch (error) {
      console.log('⚠️ TypeScript check found issues, but continuing with build...');
    }
    
    // Build the application with development mode
    console.log('Building application in development mode...');
    execSync('vite build --mode development', { stdio: 'inherit' });
    
    // Copy all files for development
    console.log('Copying all development files...');
    await copyAllFiles();
    
    // Finalize build
    console.log('Finalizing development build...');
    await finalizeBuild();
    
    console.log('✅ Development build created successfully!');
    console.log('📁 Build location: dist/');
    console.log('📝 Note: This build includes all development features and debugging tools.');
    
  } catch (error) {
    console.error('❌ Error creating development build:', error);
    process.exit(1);
  }
}

async function copyAllFiles() {
  const distDir = path.join(process.cwd(), 'dist');
  const publicDir = path.join(process.cwd(), 'public');
  
  // Ensure dist directory exists
  await fs.ensureDir(distDir);
  
  // Copy entire public directory for development
  console.log('  → Copying entire public directory...');
  await fs.copy(publicDir, distDir, {
    filter: (src, dest) => {
      // Skip node_modules if somehow present
      if (src.includes('node_modules')) return false;
      return true;
    }
  });
  
  console.log('  → Copied all public files for development');
}

async function finalizeBuild() {
  const distDir = path.join(process.cwd(), 'dist');
  
  // Create a build info file
  const packageJson = await fs.readJson(path.join(process.cwd(), 'package.json'));
  const buildInfo = {
    buildTime: new Date().toISOString(),
    version: packageJson.version,
    environment: 'development',
    nodeVersion: process.version,
    buildScript: 'create-development-build.js',
    features: [
      'Full debugging capabilities',
      'Source maps enabled',
      'Development tools included',
      'All API endpoints available',
      'Complete asset set'
    ]
  };
  
  const buildInfoPath = path.join(distDir, 'build-info.json');
  await fs.writeJson(buildInfoPath, buildInfo, { spaces: 2 });
  console.log('  → Created development build info file');
  
  // Log build size
  try {
    const stats = await fs.stat(distDir);
    console.log(`  → Build directory size: ${Math.round(stats.size / 1024)} KB`);
  } catch (error) {
    console.warn('Warning: Could not determine build size:', error.message);
  }
}

// Run the function directly if this script is executed directly
if (process.argv[1] && process.argv[1].endsWith('create-development-build.js')) {
  createDevelopmentBuild();
}

export { createDevelopmentBuild };
