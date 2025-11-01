import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

console.log('Hash test function starting...');

// Simple hash test function
async function testHashCalculation() {
  try {
    console.log('Testing hash calculation...');
    
    // Test data
    const BOT_TOKEN = 'test_token';
    const dataString = 'test_data';
    
    console.log('BOT_TOKEN:', BOT_TOKEN);
    console.log('Data string:', dataString);
    
    // Create secret key using HMAC-SHA256 with bot token as key and "WebAppData" as message
    const encoder = new TextEncoder();
    const botTokenKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(BOT_TOKEN),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    console.log('Step 1: Created botTokenKey');
    
    const secret = await crypto.subtle.sign('HMAC', botTokenKey, encoder.encode('WebAppData'));
    console.log('Step 2: Created secret');
    
    // Create HMAC-SHA256 hash of data string using the secret
    // Convert the secret ArrayBuffer to a CryptoKey
    const secretKey = await crypto.subtle.importKey(
      'raw',
      secret,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    console.log('Step 3: Created secretKey');
    
    const signature = await crypto.subtle.sign('HMAC', secretKey, encoder.encode(dataString));
    console.log('Step 4: Created signature');
    
    // Convert signature to hex string
    const hexSignature = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    console.log('Final hash:', hexSignature);
    
    return hexSignature;
  } catch (error) {
    console.error('Error in hash calculation:', error);
    return 'ERROR';
  }
}

serve(async (req) => {
  console.log('Request received');
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
      }
    });
  }
  
  try {
    const hash = await testHashCalculation();
    
    return new Response(
      JSON.stringify({ 
        message: 'Hash test completed',
        hash: hash
      }),
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'authorization, content-type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Content-Type': 'application/json'
        },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'authorization, content-type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Content-Type': 'application/json'
        },
        status: 500
      }
    );
  }
});

console.log('Hash test function started');