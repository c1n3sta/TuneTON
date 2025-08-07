import request from 'supertest';
import { AppDataSource } from '../src/config/data-source';
import app from '../src/index';
import { User } from '../src/entities/User';
import { config } from '@tuneton/shared';
import jwt from 'jsonwebtoken';

// Mock the database connection
jest.mock('../src/config/data-source', () => {
  const mockUserRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockDataSource = {
    initialize: jest.fn(),
    getRepository: jest.fn(() => mockUserRepository),
  };

  return {
    AppDataSource: mockDataSource,
  };
});

// Mock JWT verification
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('User Service', () => {
  let userRepository: any;
  let mockUser: Partial<User>;

  beforeAll(async () => {
    userRepository = AppDataSource.getRepository(User);
    
    // Mock user data
    mockUser = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      telegramId: 123456789,
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      isAdmin: false,
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /health', () => {
    it('should return 200 and service status', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'ok',
        service: 'user-service'
      });
    });
  });

  describe('Protected Routes', () => {
    it('should return 401 if no token is provided', async () => {
      const response = await request(app).get('/api/v1/users/me');
      
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('You are not logged in! Please log in to get access.');
    });

    it('should return 401 if token is invalid', async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const response = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', 'Bearer invalidtoken');
      
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid token. Please log in again!');
    });
  });

  describe('GET /api/v1/users/me', () => {
    it('should return current user profile', async () => {
      // Mock JWT verification
      (jwt.verify as jest.Mock).mockReturnValue({ userId: mockUser.id });
      
      // Mock user repository
      (userRepository.findOne as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', 'Bearer validtoken');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user.id).toBe(mockUser.id);
      expect(response.body.data.user.username).toBe(mockUser.username);
    });
  });

  describe('PATCH /api/v1/users/me', () => {
    it('should update current user profile', async () => {
      const updatedData = {
        firstName: 'Updated',
        lastName: 'Name',
        email: 'updated@example.com'
      };

      // Mock JWT verification
      (jwt.verify as jest.Mock).mockReturnValue({ userId: mockUser.id });
      
      // Mock user repository
      (userRepository.findOne as jest.Mock).mockResolvedValue(mockUser);
      (userRepository.save as jest.Mock).mockImplementation((user) => ({
        ...user,
        ...updatedData
      }));

      const response = await request(app)
        .patch('/api/v1/users/me')
        .set('Authorization', 'Bearer validtoken')
        .send(updatedData);
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user.firstName).toBe(updatedData.firstName);
      expect(response.body.data.user.lastName).toBe(updatedData.lastName);
      expect(response.body.data.user.email).toBe(updatedData.email);
    });
  });
});
