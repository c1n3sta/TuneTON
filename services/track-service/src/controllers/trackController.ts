import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Track } from '../entities/Track';
import { AppError } from '../middleware/errorHandler';

class TrackController {
  // Get all tracks (public or user's own)
  async getTracks(req: Request, res: Response) {
    const trackRepository = getRepository(Track);
    const { page = 1, limit = 10, search, genre } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const query = trackRepository
      .createQueryBuilder('track')
      .where('track.isPublic = :isPublic', { isPublic: true });

    // Add search filter if provided
    if (search) {
      query.andWhere('LOWER(track.title) LIKE :search', {
        search: `%${(search as string).toLowerCase()}%`,
      });
    }

    // Add genre filter if provided
    if (genre) {
      query.andWhere('track.genre = :genre', { genre });
    }

    const [tracks, total] = await query
      .orderBy('track.createdAt', 'DESC')
      .skip(skip)
      .take(parseInt(limit as string))
      .getManyAndCount();

    res.json({
      data: tracks,
      meta: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  }

  // Get a single track by ID
  async getTrackById(req: Request, res: Response) {
    const trackRepository = getRepository(Track);
    const track = await trackRepository.findOne(req.params.id);

    if (!track) {
      throw new AppError(404, 'Track not found');
    }

    // Increment play count
    track.playCount += 1;
    await trackRepository.save(track);

    res.json({ data: track });
  }

  // Create a new track
  async createTrack(req: Request, res: Response) {
    const trackRepository = getRepository(Track);
    const userId = (req as any).user.id;

    const track = trackRepository.create({
      ...req.body,
      userId,
    });

    await trackRepository.save(track);
    res.status(201).json({ data: track });
  }

  // Update a track
  async updateTrack(req: Request, res: Response) {
    const trackRepository = getRepository(Track);
    const userId = (req as any).user.id;

    const track = await trackRepository.findOne({
      where: { id: req.params.id, userId },
    });

    if (!track) {
      throw new AppError(404, 'Track not found or you do not have permission');
    }

    trackRepository.merge(track, req.body);
    const updatedTrack = await trackRepository.save(track);

    res.json({ data: updatedTrack });
  }

  // Delete a track
  async deleteTrack(req: Request, res: Response) {
    const trackRepository = getRepository(Track);
    const userId = (req as any).user.id;

    const track = await trackRepository.findOne({
      where: { id: req.params.id, userId },
    });

    if (!track) {
      throw new AppError(404, 'Track not found or you do not have permission');
    }

    await trackRepository.remove(track);
    res.status(204).send();
  }
}

export default new TrackController();
