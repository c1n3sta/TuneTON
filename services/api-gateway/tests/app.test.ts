import request from 'supertest';
import app from '../src/index';
import { StatusCodes } from 'http-status-codes';

describe('API Gateway', () => {
  describe('Health Check', () => {
    it('should return 200 and status ok', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.status).toBe('ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('Non-existent Route', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/non-existent-route');
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
      expect(response.body).toHaveProperty('error', 'Not Found');
    });
  });

  // Add more tests for authentication, validation, etc.
});
