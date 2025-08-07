import { processAudio, cleanupTempFiles } from '../src/services/audioProcessor';
import { ProcessAudioOptions } from '../src/types/audio';
import fs from 'fs/promises';
import path from 'path';

describe('Audio Processor', () => {
  const testOptions: ProcessAudioOptions = {
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('processAudio', () => {
    it('should process audio with valid options', async () => {
      const result = await processAudio(testOptions);
      
      expect(result).toMatchObject({
        jobId: 'test-job-1',
        trackId: 'track-1',
        format: 'mp3',
        status: 'success',
        duration: expect.any(Number),
        size: expect.any(Number),
        processingTime: expect.any(Number),
      });
      
      // Verify the output path is correct
      expect(result.outputPath).toContain(
        path.join('processed', 'user-1', 'track-1')
      );
      expect(result.outputPath).toMatch(/\.mp3$/);
    });

    it('should handle processing errors', async () => {
      // Mock FFmpeg error
      const mockSave = jest.fn().mockImplementation((outputPath, callback) => {
        callback(new Error('FFmpeg processing failed'));
      });
      
      jest.requireMock('fluent-ffmpeg').mockImplementation(() => ({
        audioBitrate: jest.fn().mockReturnThis(),
        audioChannels: jest.fn().mockReturnThis(),
        audioFrequency: jest.fn().mockReturnThis(),
        audioFilters: jest.fn().mockReturnThis(),
        on: jest.fn().mockImplementation(function (this: any, event, callback) {
          if (event === 'error') {
            callback(new Error('FFmpeg processing failed'));
          }
          return this;
        }),
        save: mockSave,
      }));

      const result = await processAudio(testOptions);
      
      expect(result.status).toBe('failed');
      expect(result.error).toContain('FFmpeg processing failed');
    });
  });

  describe('cleanupTempFiles', () => {
    it('should clean up temporary files', async () => {
      const mockUnlink = jest.spyOn(fs, 'unlink').mockResolvedValue(undefined);
      const filePaths = ['/tmp/file1.mp3', '/tmp/file2.wav'];
      
      await cleanupTempFiles(filePaths);
      
      expect(mockUnlink).toHaveBeenCalledTimes(2);
      expect(mockUnlink).toHaveBeenCalledWith('/tmp/file1.mp3');
      expect(mockUnlink).toHaveBeenCalledWith('/tmp/file2.wav');
    });

    it('should not throw if file deletion fails', async () => {
      const mockUnlink = jest.spyOn(fs, 'unlink')
        .mockRejectedValueOnce(new Error('File not found'))
        .mockResolvedValueOnce(undefined);
      
      const filePaths = ['/tmp/nonexistent.mp3', '/tmp/existing.wav'];
      
      await expect(cleanupTempFiles(filePaths)).resolves.not.toThrow();
      expect(mockUnlink).toHaveBeenCalledTimes(2);
    });
  });
});
