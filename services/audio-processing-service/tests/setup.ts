import { config } from '@tuneton/shared';
import { createLogger, transports } from 'winston';

// Configure test logger
const testLogger = createLogger({
  level: 'error', // Only log errors during tests
  format: config.logging.format,
  transports: [
    new transports.Console({
      silent: process.env.NODE_ENV === 'test', // Disable logging during tests
    }),
  ],
});

// Mock the logger for testing
jest.mock('../src/utils/logger', () => ({
  logger: testLogger,
}));

// Mock Redis client
jest.mock('redis', () => ({
  createClient: jest.fn().mockImplementation(() => ({
    connect: jest.fn().mockResolvedValue(undefined),
    ping: jest.fn().mockResolvedValue('PONG'),
    quit: jest.fn().mockResolvedValue('OK'),
    on: jest.fn(),
  })),
}));

// Mock FFmpeg
jest.mock('fluent-ffmpeg', () => {
  return jest.fn().mockImplementation(() => ({
    audioBitrate: jest.fn().mockReturnThis(),
    audioChannels: jest.fn().mockReturnThis(),
    audioFrequency: jest.fn().mockReturnThis(),
    audioFilters: jest.fn().mockReturnThis(),
    on: jest.fn().mockImplementation(function (this: any, event, callback) {
      if (event === 'end') {
        callback();
      }
      return this;
    }),
    save: jest.fn().mockImplementation(function (this: any, outputPath, callback) {
      callback(null);
      return this;
    }),
  }));
});

// Mock file system
jest.mock('fs/promises', () => ({
  constants: { W_OK: 0 },
  access: jest.fn().mockResolvedValue(undefined),
  mkdir: jest.fn().mockResolvedValue(undefined),
  rename: jest.fn().mockResolvedValue(undefined),
  unlink: jest.fn().mockResolvedValue(undefined),
  stat: jest.fn().mockResolvedValue({ size: 1024 }),
}));

// Mock BullMQ
jest.mock('bullmq', () => ({
  Queue: jest.fn().mockImplementation(() => ({
    add: jest.fn().mockResolvedValue({ id: 'test-job-id' }),
    getJob: jest.fn().mockResolvedValue({
      id: 'test-job-id',
      getState: jest.fn().mockResolvedValue('completed'),
      progress: jest.fn().mockReturnValue(100),
      data: { trackId: 'test-track-id', format: 'mp3' },
      returnvalue: {
        status: 'success',
        outputPath: '/path/to/processed/audio.mp3',
        duration: 180.5,
        size: 1024,
        processingTime: 1000,
      },
    }),
    getJobs: jest.fn().mockResolvedValue([
      {
        id: 'test-job-1',
        name: 'process-audio',
        data: { trackId: 'test-track-1', format: 'mp3' },
        progress: jest.fn().mockReturnValue(100),
        getState: jest.fn().mockResolvedValue('completed'),
      },
    ]),
    close: jest.fn().mockResolvedValue(undefined),
  })),
  Worker: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
  })),
}));

// Mock TypeORM
jest.mock('typeorm', () => {
  const actual = jest.requireActual('typeorm');
  return {
    ...actual,
    createConnection: jest.fn().mockResolvedValue({
      options: { database: 'test-db' },
      isConnected: true,
      close: jest.fn().mockResolvedValue(undefined),
    }),
  };
});
