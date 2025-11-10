// Detailed debug script for comprehensive authentication debugging
// This script provides detailed logging for the authentication process

// Mock Telegram WebApp data for debugging
const debugTelegramData = {
  id: '123456789',
  first_name: 'Debug',
  last_name: 'User',
  username: 'debuguser',
  photo_url: 'https://t.me/i/userpic/320/debuguser.jpg',
  auth_date: '1640995200',
  hash: 'debug_hash_value'
};

// Debug configuration
const DEBUG_CONFIG = {
  LOG_LEVEL: 'VERBOSE',
  ENABLE_TIMING: true,
  LOG_TO_FILE: false,
  SHOW_STACK_TRACE: true
};

// Debug logger
class DebugLogger {
  constructor(config) {
    this.config = config;
  }
  
  log(level, message, data) {
    if (this.config.LOG_LEVEL === 'VERBOSE' || level !== 'DEBUG') {
      const timestamp = new Date().toISOString();
      const logEntry = `[${timestamp}] ${level}: ${message}`;
      
      console.log(logEntry);
      
      if (data) {
        console.log('Data:', JSON.stringify(data, null, 2));
      }
    }
  }
  
  debug(message, data) {
    this.log('DEBUG', message, data);
  }
  
  info(message, data) {
    this.log('INFO', message, data);
  }
  
  warn(message, data) {
    this.log('WARN', message, data);
  }
  
  error(message, data) {
    this.log('ERROR', message, data);
  }
}

// Initialize logger
const logger = new DebugLogger(DEBUG_CONFIG);

// Debug authentication function
async function debugAuthenticate(telegramData) {
  logger.info('Starting debug authentication', { telegramData });
  
  try {
    // Step 1: Parse data
    logger.debug('Step 1: Parsing Telegram data');
    const parsedData = parseTelegramData(telegramData);
    logger.debug('Parsed data', { parsedData });
    
    // Step 2: Verify hash
    logger.debug('Step 2: Verifying hash');
    const hashVerification = await verifyHash(parsedData);
    logger.debug('Hash verification result', { hashVerification });
    
    if (!hashVerification.isValid) {
      throw new Error(`Hash verification failed: ${hashVerification.error}`);
    }
    
    // Step 3: Validate auth date
    logger.debug('Step 3: Validating auth date');
    const dateValidation = validateAuthDate(parsedData.auth_date);
    logger.debug('Date validation result', { dateValidation });
    
    if (!dateValidation.isValid) {
      throw new Error(`Auth date validation failed: ${dateValidation.error}`);
    }
    
    // Step 4: Process user
    logger.debug('Step 4: Processing user');
    const userProcessing = await processUser(parsedData);
    logger.debug('User processing result', { userProcessing });
    
    // Step 5: Generate tokens
    logger.debug('Step 5: Generating tokens');
    const tokens = generateTokens(userProcessing.user);
    logger.debug('Tokens generated', { tokens });
    
    logger.info('Debug authentication completed successfully');
    
    return {
      success: true,
      user: userProcessing.user,
      tokens: tokens
    };
  } catch (error) {
    logger.error('Debug authentication failed', {
      error: error.message,
      stack: DEBUG_CONFIG.SHOW_STACK_TRACE ? error.stack : undefined
    });
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Helper functions
function parseTelegramData(data) {
  logger.debug('Parsing Telegram data', { rawData: data });
  
  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    username: data.username,
    photoUrl: data.photo_url,
    authDate: data.auth_date,
    hash: data.hash
  };
}

async function verifyHash(data) {
  logger.debug('Verifying hash', { data });
  
  // Simulate async hash verification
  return new Promise(resolve => {
    setTimeout(() => {
      const isValid = data.hash && data.hash.length === 64;
      resolve({
        isValid: isValid,
        error: isValid ? null : 'Invalid hash format'
      });
    }, 100);
  });
}

function validateAuthDate(authDate) {
  logger.debug('Validating auth date', { authDate });
  
  const now = Math.floor(Date.now() / 1000);
  const authTime = parseInt(authDate);
  const timeDiff = now - authTime;
  
  // Allow 1 hour difference
  const isValid = timeDiff < 3600 && timeDiff >= 0;
  
  return {
    isValid: isValid,
    error: isValid ? null : 'Auth date is invalid or expired'
  };
}

async function processUser(data) {
  logger.debug('Processing user', { data });
  
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        user: {
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          photoUrl: data.photoUrl,
          lastLogin: new Date().toISOString()
        }
      });
    }, 50);
  });
}

function generateTokens(user) {
  logger.debug('Generating tokens', { userId: user.id });
  
  return {
    accessToken: `debug_access_token_${user.id}_${Date.now()}`,
    refreshToken: `debug_refresh_token_${user.id}_${Date.now()}`
  };
}

// Run debug authentication
logger.info('Running detailed debug authentication');
debugAuthenticate(debugTelegramData)
  .then(result => {
    logger.info('Debug authentication result', { result });
  });