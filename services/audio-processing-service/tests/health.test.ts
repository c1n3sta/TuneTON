import request from 'supertest';
import { createServer } from 'http';
import express from 'express';
import { createClient } from 'redis';
import { config } from '@tuneton/shared';
import healthRoutes from '../src/routes/healthRoutes';

// Mock Redis client
jest.mock('redis');
const mockRedis = {
  connect: jest.fn().mockResolvedValue(undefined),
  ping: jest.fn().mockResolvedValue('PONG'),
  quit: jest.fn().mockResolvedValue('OK'),
};

(createClient as jest.Mock).mockReturnValue(mockRedis);

// Mock file system
const mockAccess = jest.fn().mockResolvedValue(undefined);
jest.mock('fs/promises', () => ({
  constants: { W_OK: 0 },
  access: (...args: any[]) => mockAccess(...args),
}));

describe('Health Check Endpoints', () => {
  let app: express.Application;
  let server: ReturnType<typeof createServer>;

  beforeAll(() => {
    // Create test Express app
    app = express();
    app.use(express.json());
    app.use('/health', healthRoutes);
    
    // Start server
    server = app.listen(0); // Random available port
  });

  afterAll((done) => {
    // Close server after tests
    server.close(done);
  });

  afterEach(() => {
    // Reset all mocks after each test
    jest.clearAllMocks();
  });

  describe('GET /health', () => {
    it('should return 200 and healthy status when all dependencies are healthy', async () => {
      const response = await request(server).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('OK');
      expect(response.body.checks.redis).toBe('healthy');
      expect(response.body.checks.storage).toBe('healthy');
      
      // Verify Redis client was called
      expect(mockRedis.connect).toHaveBeenCalled();
      expect(mockRedis.ping).toHaveBeenCalled();
      expect(mockRedis.quit).toHaveBeenCalled();
      
      // Verify file system access was checked
      expect(mockAccess).toHaveBeenCalledTimes(3); // 3 paths checked
    });

    it('should return 503 when Redis is unavailable', async () => {
      // Simulate Redis connection error
      mockRedis.ping.mockRejectedValueOnce(new Error('Redis connection failed'));
      
      const response = await request(server).get('/health');
      
      expect(response.status).toBe(503);
      expect(response.body.checks.redis).toBe('unhealthy');
      expect(response.body.message).toBe('Redis connection failed');
    });

    it('should return 503 when storage is not accessible', async () => {
      // Simulate storage access error
      mockAccess.mockRejectedValueOnce(new Error('Permission denied'));
      
      const response = await request(server).get('/health');
      
      expect(response.status).toBe(503);
      expect(response.body.checks.storage).toBe('unhealthy');
      expect(response.body.message).toBe('Storage access failed');
    });
  });

  describe('GET /health/ping', () => {
    it('should return 200 and status ok', async () => {
      const response = await request(server).get('/health/ping');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
      expect(response.body.timestamp).toBeDefined();
    });
  });
});
