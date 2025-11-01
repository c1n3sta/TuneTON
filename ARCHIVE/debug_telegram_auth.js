// Debug Telegram authentication script
// This script helps debug issues with Telegram WebApp authentication

// Configuration
const DEBUG_TELEGRAM_CONFIG = {
  BOT_TOKEN: '123456789:ABCdefGHIjklMNOpqrSTUvwxYZ123456789',
  ENABLE_LOGGING: true,
  SHOW_TIMING: true,
  VERBOSE_OUTPUT: true
};

// Debug logger
function debugLog(message, data) {
  if (DEBUG_TELEGRAM_CONFIG.ENABLE_LOGGING) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] DEBUG: ${message}`);
    
    if (data) {
      console.log('  Data:', JSON.stringify(data, null, 2));
    }
  }
}

// Mock Telegram WebApp data
const mockTelegramWebAppData = {
  initData: 'user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22Debug%22%2C%22last_name%22%3A%22User%22%2C%22username%22%3A%22debuguser%22%7D&auth_date=1640995200&hash=debug_hash_value',
  initDataUnsafe: {
    user: {
      id: 123456789,
      first_name: 'Debug',
      last_name: 'User',
      username: 'debuguser',
      photo_url: 'https://t.me/i/userpic/320/debuguser.jpg'
    },
    auth_date: 1640995200,
    hash: 'debug_hash_value'
  }
};

// Debug Telegram authentication function
async function debugTelegramAuth() {
  debugLog('Starting Telegram authentication debug');
  
  try {
    // Step 1: Extract data
    debugLog('Step 1: Extracting Telegram data');
    const extractedData = extractTelegramData();
    debugLog('Extracted data', extractedData);
    
    // Step 2: Validate data structure
    debugLog('Step 2: Validating data structure');
    const structureValidation = validateDataStructure(extractedData);
    debugLog('Structure validation', structureValidation);
    
    if (!structureValidation.isValid) {
      throw new Error(`Data structure validation failed: ${structureValidation.error}`);
    }
    
    // Step 3: Verify hash
    debugLog('Step 3: Verifying hash');
    const hashVerification = await verifyTelegramHash(extractedData);
    debugLog('Hash verification', hashVerification);
    
    if (!hashVerification.isValid) {
      throw new Error(`Hash verification failed: ${hashVerification.error}`);
    }
    
    // Step 4: Process authentication
    debugLog('Step 4: Processing authentication');
    const authResult = await processAuthentication(extractedData);
    debugLog('Authentication result', authResult);
    
    debugLog('Telegram authentication debug completed successfully');
    
    return {
      success: true,
      data: authResult
    };
  } catch (error) {
    debugLog('Telegram authentication debug failed', {
      error: error.message,
      stack: error.stack
    });
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Helper functions
function extractTelegramData() {
  debugLog('Extracting data from Telegram WebApp');
  
  if (!mockTelegramWebAppData.initDataUnsafe) {
    throw new Error('Telegram WebApp data not available');
  }
  
  const data = mockTelegramWebAppData.initDataUnsafe;
  
  return {
    user: {
      id: data.user.id,
      firstName: data.user.first_name,
      lastName: data.user.last_name,
      username: data.user.username,
      photoUrl: data.user.photo_url
    },
    authDate: data.auth_date,
    hash: data.hash
  };
}

function validateDataStructure(data) {
  debugLog('Validating data structure');
  
  if (!data.user) {
    return {
      isValid: false,
      error: 'Missing user data'
    };
  }
  
  if (!data.user.id) {
    return {
      isValid: false,
      error: 'Missing user ID'
    };
  }
  
  if (!data.authDate) {
    return {
      isValid: false,
      error: 'Missing auth date'
    };
  }
  
  if (!data.hash) {
    return {
      isValid: false,
      error: 'Missing hash'
    };
  }
  
  return {
    isValid: true,
    error: null
  };
}

async function verifyTelegramHash(data) {
  debugLog('Verifying Telegram hash', data);
  
  // Simulate async hash verification
  return new Promise(resolve => {
    setTimeout(() => {
      // In a real implementation, this would use crypto functions
      const isValid = data.hash && data.hash.startsWith('debug_');
      
      resolve({
        isValid: isValid,
        error: isValid ? null : 'Invalid hash format'
      });
    }, 100);
  });
}

async function processAuthentication(data) {
  debugLog('Processing authentication', data);
  
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        userId: data.user.id,
        username: data.user.username,
        authenticated: true,
        timestamp: new Date().toISOString()
      });
    }, 50);
  });
}

// Run debug
debugLog('Running Telegram authentication debug');
debugTelegramAuth()
  .then(result => {
    debugLog('Debug result', result);
  });