import fetch from 'node-fetch';

async function testApi() {
  try {
    console.log('Testing API health endpoint...');
    const response = await fetch('http://127.0.0.1:3002/api/health');
    const data = await response.json();
    console.log('Response:', data);
    console.log('Status:', response.status);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testApi();