// Simple test script to verify Telegram authentication
async function testTelegramAuth() {
  try {
    const response = await fetch('https://dthrpvpuzinmevrvqlhv.supabase.co/functions/v1/telegram-auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        initData: 'test'
      })
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testTelegramAuth();