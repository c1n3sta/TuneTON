import request from 'supertest';
import { createConnection, getConnection } from 'typeorm';
import { app } from '../src/index';
import { Track } from '../src/entities/Track';

const TEST_DB = 'test_tracks';

beforeAll(async () => {
  await createConnection({
    type: 'sqlite', // Using SQLite for testing
    database: ':memory:',
    dropSchema: true,
    entities: [Track],
    synchronize: true,
    logging: false,
  });
});

afterAll(async () => {
  const connection = getConnection();
  await connection.dropDatabase();
  await connection.close();
});

describe('Track Service', () => {
  describe('GET /health', () => {
    it('should return 200 and status ok', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
    });
  });

  // Add more test cases for other endpoints
});
