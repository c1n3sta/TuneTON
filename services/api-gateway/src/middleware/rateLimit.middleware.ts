import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../utils/logger';

// In-memory store for rate limiting (in production, use Redis or similar)
const rateLimitStore = new Map<string, number>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // Limit each IP to 100 requests per windowMs

export const apiLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: MAX_REQUESTS,
  message: 'Too many requests from this IP, please try again later',
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', { 
      ip: req.ip, 
      path: req.path,
      method: req.method 
    });
    
    res.status(StatusCodes.TOO_MANY_REQUESTS).json({
      error: 'Too Many Requests',
      message: 'You have exceeded the 100 requests in 15 minutes limit!',
    });
  },
  // Use custom store for rate limiting
  store: {
    // Increment the counter for the given key
    increment: (key, cb) => {
      const now = Date.now();
      const windowStart = now - WINDOW_MS;
      
      // Filter out old entries
      for (const [ip, timestamp] of rateLimitStore.entries()) {
        if (timestamp < windowStart) {
          rateLimitStore.delete(ip);
        }
      }
      
      // Get or initialize the counter
      const currentCount = rateLimitStore.get(key) || 0;
      const newCount = currentCount + 1;
      rateLimitStore.set(key, newCount);
      
      // Call the callback with the current count and reset time
      cb(null, {
        current: newCount,
        resetTime: new Date(now + WINDOW_MS),
      });
    },
  },
});

// More aggressive rate limiting for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: 'Too many login attempts, please try again later',
  handler: (req, res) => {
    logger.warn('Auth rate limit exceeded', { 
      ip: req.ip, 
      path: req.path,
      method: req.method 
    });
    
    res.status(StatusCodes.TOO_MANY_REQUESTS).json({
      error: 'Too Many Requests',
      message: 'Too many login attempts, please try again later',
    });
  },
});
