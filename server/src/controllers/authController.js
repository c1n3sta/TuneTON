// Authentication controller
import User from '../models/User.js';
import { parseInitData, verifyTelegramData } from '../utils/telegramAuth.js';

/**
 * Handle Telegram WebApp authentication
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
export async function telegramAuth(req, res) {
  try {
    const { initData } = req.body;
    
    // Get bot token from environment
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    if (!BOT_TOKEN) {
      return res.status(500).json({ 
        error: 'Server configuration error: TELEGRAM_BOT_TOKEN not set' 
      });
    }
    
    // Verify Telegram WebApp data
    const isValid = await verifyTelegramData(initData, BOT_TOKEN);
    if (!isValid) {
      return res.status(400).json({ 
        error: 'Invalid Telegram WebApp data' 
      });
    }
    
    // Parse user data
    const telegramUser = parseInitData(initData);
    if (!telegramUser?.id) {
      return res.status(400).json({ 
        error: 'Invalid user data from WebApp' 
      });
    }
    
    // Check if user exists in database
    let user = await User.findByTelegramId(telegramUser.id);
    
    if (user) {
      // Update existing user
      user = await User.update(user.id, {
        username: telegramUser.username,
        first_name: telegramUser.first_name,
        last_name: telegramUser.last_name,
        photo_url: telegramUser.photo_url,
        is_premium: telegramUser.is_premium || false
      });
    } else {
      // Create new user
      user = await User.create({
        telegram_id: telegramUser.id,
        username: telegramUser.username,
        first_name: telegramUser.first_name,
        last_name: telegramUser.last_name,
        photo_url: telegramUser.photo_url,
        is_premium: telegramUser.is_premium || false
      });
    }
    
    // Return success response
    return res.status(200).json({
      message: 'Authentication successful',
      user: telegramUser
    });
    
  } catch (error) {
    console.error('Error in telegram-auth:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
}