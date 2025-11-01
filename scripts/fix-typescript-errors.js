// Script to fix critical TypeScript errors in the project
import { execSync } from 'child_process';
import { writeFileSync, readFileSync } from 'fs';

console.log('Fixing critical TypeScript errors...');

// Fix the button variant issue in HomePageNew.tsx
try {
  const homePageNewPath = 'src/components/HomePageNew.tsx';
  let content = readFileSync(homePageNewPath, 'utf8');
  
  // Replace incorrect button variants
  content = content.replace(/variant="text"/g, 'variant="ghost"');
  content = content.replace(/variant="outlined"/g, 'variant="outline"');
  
  writeFileSync(homePageNewPath, content);
  console.log('Fixed button variants in HomePageNew.tsx');
} catch (error) {
  console.log('Could not fix HomePageNew.tsx:', error.message);
}

// Fix the audio URL issue in utils
try {
  const utilsPath = 'src/components/player/utils.ts';
  let content = readFileSync(utilsPath, 'utf8');
  
  // Ensure we're using the correct audio URL
  if (content.includes('jamendoTrack.audio || jamendoTrack.audiodownload')) {
    content = content.replace(
      'audioUrl: jamendoTrack.audio || jamendoTrack.audiodownload,', 
      'audioUrl: jamendoTrack.audio, // Use streaming URL only'
    );
    writeFileSync(utilsPath, content);
    console.log('Fixed audio URL handling in utils.ts');
  }
} catch (error) {
  console.log('Could not fix utils.ts:', error.message);
}

console.log('Critical TypeScript error fixes completed.');