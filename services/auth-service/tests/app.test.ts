import request from 'supertest';
import app from '../src/index';
import { config } from '@tuneton/shared';

// Mock the config for testing
jest.mock('@tuneton/shared', () => ({
  config: {
    authService: { port: 3001 },
    cors: { origins: 'http://localhost:3000' },
    nodeEnv: 'test',
    telegram: { botToken: 'test-bot-token' },
    jwt: {
      secret: 'test-secret',
      refreshSecret: 'test-refresh-secret',
      accessExpirationMinutes: 15,
      refreshExpirationDays: 7,
      issuer: 'test-issuer',
      audience: 'test-audience',
    },
  },
}));

describe('Auth Service', () => {
  describe('Health Check', () => {
    it('should return 200 and service status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: 'ok',
        service: 'auth-service',
      });
    });
  });

  describe('Telegram Authentication', () => {
    it('should return 400 if no initData is provided', async () => {
      const res = await request(app)
        .post('/api/v1/auth/telegram/auth')
        .send({});
      
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('No initData provided');
    });

    // More tests for Telegram auth will be added here
  });

  describe('JWT Authentication', () => {
    it('should return 400 if userId or telegramId is missing', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({});
      
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Please provide userId and telegramId');
    });

    it('should return tokens with valid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ userId: '123', telegramId: 456 });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('expiresIn');
      expect(res.body).toHaveProperty('tokenType', 'Bearer');
    });

    // More tests for JWT auth will be added here
  });
});
