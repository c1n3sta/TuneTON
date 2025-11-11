// Test script to debug Jamendo API issues
import { debugJamendoAPI, testJamendoAPI } from './utils/jamendo-api';

async function runTests() {
  console.log('=== Jamendo API Tests ===');
  
  try {
    console.log('Running debugJamendoAPI...');
    const debugResult = await debugJamendoAPI();
    console.log('Debug result:', debugResult);
  } catch (error) {
    console.error('Debug test failed:', error);
  }
  
  try {
    console.log('Running testJamendoAPI...');
    const testResult = await testJamendoAPI();
    console.log('Test result:', testResult);
  } catch (error) {
    console.error('API test failed:', error);
  }
}

runTests();