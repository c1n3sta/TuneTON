// Telegram authentication utilities
import crypto from 'crypto';

/**
 * Verify Telegram WebApp data
 * @param {string} initData - The initData string from Telegram WebApp
 * @param {string} botToken - The bot token
 * @returns {boolean} - Whether the data is valid
 */
export async function verifyTelegramData(initData, botToken) {
  try {
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    const authDate = params.get('auth_date');
    
    // Check if required parameters exist
    if (!hash || !authDate) {
      console.warn('Missing required parameters in Telegram initData');
      return false;
    }
    
    // Check if auth_date is recent (within 1 hour)
    const authTimestamp = parseInt(authDate);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (currentTimestamp - authTimestamp > 3600) { // 1 hour
      console.warn('Telegram auth data is too old');
      return false;
    }
    
    // Remove hash from parameters and sort
    params.delete('hash');
    const sortedParams = Array.from(params.entries()).sort(([a], [b]) => a.localeCompare(b));
    
    // Create data string according to Telegram documentation
    const dataString = sortedParams.map(([key, value]) => `${key}=${value}`).join('\n');
    
    // Create secret key using HMAC-SHA256 with "WebAppData" as key and bot token as message
    const encoder = new TextEncoder();
    const webAppDataKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode('WebAppData'),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const secret = await crypto.subtle.sign('HMAC', webAppDataKey, encoder.encode(botToken));
    
    // Create HMAC-SHA256 hash of data string using the secret
    // Convert the secret ArrayBuffer to a CryptoKey
    const secretKey = await crypto.subtle.importKey(
      'raw',
      secret,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', secretKey, encoder.encode(dataString));
    
    // Convert signature to hex string
    const hexSignature = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // Compare hashes
    const isValid = hexSignature === hash;
    if (!isValid) {
      console.warn('Telegram hash verification failed');
      console.warn('Expected:', hash);
      console.warn('Actual:', hexSignature);
      console.warn('Data string:', dataString);
    }
    
    return isValid;
  } catch (error) {
    console.error('Error verifying Telegram data:', error);
    return false;
  }
}

/**
 * Extract user data from initData
 * @param {string} initData - The initData string from Telegram WebApp
 * @returns {object|null} - The user data or null if invalid
 */
export function parseInitData(initData) {
  const params = new URLSearchParams(initData);
  const userParam = params.get('user');
  if (!userParam) return null;
  
  try {
    // The user parameter is a URL-encoded JSON string
    // We need to decode it and then parse as JSON
    return JSON.parse(decodeURIComponent(userParam));
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
}