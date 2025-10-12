const axios = require('axios');

const FIGMA_API_TOKEN = 'figd_9V5XS-7I0U5dfchdsfUmG2G7s2PPKvv0oPpVpZuq';
const FILE_KEY = '81waUO6X18IBG74UerJRQl';
const NODE_ID = '1-502';

async function testFigmaAPI() {
  try {
    const response = await axios.get(
      `https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(NODE_ID)}`,
      {
        headers: {
          'X-Figma-Token': FIGMA_API_TOKEN
        }
      }
    );
    
    console.log('Successfully connected to Figma API');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error connecting to Figma API:');
    console.error(error.response ? error.response.data : error.message);
  }
}

testFigmaAPI();
