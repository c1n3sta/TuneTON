import { Queue, Worker } from 'bullmq';
import { initQueue, processQueue } from '../src/services/queue';
import { processAudio } from '../src/services/audioProcessor';
import { ProcessAudioOptions } from '../src/types/audio';

// Mock the queue and worker
jest.mock('bullmq', () => ({
  Queue: jest.fn().mockImplementation(() => ({
    add: jest.fn().mockResolvedValue({ id: 'test-job-id' }),
    getJob: jest.fn(),
    getJobs: jest.fn(),
    close: jest.fn().mockResolvedValue(undefined),
    on: jest.fn(),
  })),
  Worker: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    close: jest.fn().mockResolvedValue(undefined),
  })),
}));

// Mock the audio processor
jest.mock('../src/services/audioProcessor', () => ({
  processAudio: jest.fn().mockResolvedValue({
    status: 'success',
    outputPath: '/path/to/processed/audio.mp3',
    duration: 180.5,
    size: 1024,
    processingTime: 1000,
  }),
}));

describe('Queue Service', () => {
  let queue: Queue;
  let worker: Worker;
  const testJobData: ProcessAudioOptions = {
    jobId: 'test-job-1',
    userId: 'user-1',
    trackId: 'track-1',
    originalFilePath: '/path/to/original/audio.wav',
    format: 'mp3',
    options: {
      pitchShift: 2,
      tempo: 1.2,
      bitrate: 192,
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    
    // Initialize the queue and worker
    queue = await initQueue();
    worker = await processQueue(queue);
  });

  afterEach(async () => {
    // Clean up
    await queue.close();
    await worker.close();
  });

  describe('initQueue', () => {
    it('should initialize the queue with the correct name', () => {
      expect(Queue).toHaveBeenCalledWith(
        'audio-processing',
        expect.objectContaining({
          connection: expect.objectContaining({
            host: 'localhost',
            port: 6379,
          }),
        })
      );
    });
  });

  describe('processQueue', () => {
    it('should create a worker that processes jobs', async () => {
      // Simulate a job being added to the queue
      const job = await queue.add('process-audio', testJobData);
      
      // Get the worker's process function
      const processFn = (Worker as jest.Mock).mock.calls[0][1];
      
      // Process the job
      const result = await processFn(job);
      
      // Verify the audio processor was called with the correct data
      expect(processAudio).toHaveBeenCalledWith(testJobData);
      
      // Verify the result
      expect(result).toEqual({
        status: 'success',
        outputPath: '/path/to/processed/audio.mp3',
        duration: 180.5,
        size: 1024,
        processingTime: 1000,
      });
    });

    it('should handle job failures', async () => {
      // Mock a job failure
      const error = new Error('Processing failed');
      (processAudio as jest.Mock).mockRejectedValueOnce(error);
      
      // Simulate a job being added to the queue
      const job = await queue.add('process-audio', testJobData);
      
      // Get the worker's process function
      const processFn = (Worker as jest.Mock).mock.calls[0][1];
      
      // Process the job and expect it to throw
      await expect(processFn(job)).rejects.toThrow('Processing failed');
    });
  });
});
