// Test script to verify search functionality integration
const fs = require('fs');

// Check if the required files exist and have the correct content
const filesToCheck = [
  'src/components/SearchPage.tsx',
  'src/components/MusicApp.tsx',
  'src/components/BottomNavigation.tsx',
  'src/utils/jamendo-api.ts'
];

console.log('=== Testing Search Functionality Integration ===');

let allTestsPassed = true;

// Check if files exist
for (const file of filesToCheck) {
  if (fs.existsSync(file)) {
    console.log(`✓ ${file} exists`);
  } else {
    console.log(`✗ ${file} does not exist`);
    allTestsPassed = false;
  }
}

// Check specific content in SearchPage
const searchPageContent = fs.readFileSync('src/components/SearchPage.tsx', 'utf8');
if (searchPageContent.includes('useDebounce')) {
  console.log('✓ SearchPage has debounce implementation');
} else {
  console.log('✗ SearchPage is missing debounce implementation');
  allTestsPassed = false;
}

if (searchPageContent.includes('jamendoAPI.textSearch')) {
  console.log('✓ SearchPage integrates with Jamendo API');
} else {
  console.log('✗ SearchPage does not integrate with Jamendo API');
  allTestsPassed = false;
}

// Check if MusicApp has search route
const musicAppContent = fs.readFileSync('src/components/MusicApp.tsx', 'utf8');
if (musicAppContent.includes('currentPage === "search"')) {
  console.log('✓ MusicApp has search route');
} else {
  console.log('✗ MusicApp is missing search route');
  allTestsPassed = false;
}

// Check if BottomNavigation has search tab
const bottomNavContent = fs.readFileSync('src/components/BottomNavigation.tsx', 'utf8');
if (bottomNavContent.includes('Search')) {
  console.log('✓ BottomNavigation has search tab');
} else {
  console.log('✗ BottomNavigation is missing search tab');
  allTestsPassed = false;
}

// Check if Jamendo API has authentication headers
const jamendoApiContent = fs.readFileSync('src/utils/jamendo-api.ts', 'utf8');
if (jamendoApiContent.includes('Authorization') && jamendoApiContent.includes('apikey')) {
  console.log('✓ Jamendo API has authentication headers');
} else {
  console.log('✗ Jamendo API is missing authentication headers');
  allTestsPassed = false;
}

console.log('\n=== Test Result ===');
if (allTestsPassed) {
  console.log('All tests passed! Search functionality should be working correctly.');
} else {
  console.log('Some tests failed. Please check the issues above.');
}