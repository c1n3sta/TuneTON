import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';
import { AppError } from '../middleware/errorHandler';
import { catchAsync } from '../middleware/errorHandler';

class UserController {
  private userRepository = getRepository(User);

  // Get all users (admin only)
  getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await this.userRepository.find({
      select: ['id', 'username', 'email', 'firstName', 'lastName', 'isAdmin', 'isVerified', 'createdAt']
    });
    
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users }
    });
  });

  // Get current user profile
  getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await this.userRepository.findOne({
      where: { id: req.user.id },
      select: ['id', 'username', 'email', 'firstName', 'lastName', 'photoUrl', 'preferences', 'isAdmin', 'isVerified']
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  });

  // Get user by ID
  getUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await this.userRepository.findOne({
      where: { id: req.params.id },
      select: ['id', 'username', 'firstName', 'lastName', 'photoUrl']
    });

    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  });

  // Update user profile (current user only)
  updateMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Filter out unwanted fields that are not allowed to be updated
    const { password, isAdmin, isVerified, ...filteredBody } = req.body;

    // Only allow certain fields to be updated
    const allowedFields = ['email', 'firstName', 'lastName', 'photoUrl', 'preferences'];
    const updateData: any = {};

    Object.keys(filteredBody).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = filteredBody[key];
      }
    });

    const user = await this.userRepository.preload({
      id: req.user.id,
      ...updateData
    });

    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }

    const updatedUser = await this.userRepository.save(user);

    res.status(200).json({
      status: 'success',
      data: { user: updatedUser }
    });
  });

  // Delete user (set active to false)
  deleteMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await this.userRepository.update(req.user.id, { isActive: false });

    res.status(204).json({
      status: 'success',
      data: null
    });
  });

  // Create or update user from Telegram data
  createOrUpdateFromTelegram = async (telegramData: any) => {
    const { id: telegramId, username, first_name, last_name, photo_url } = telegramData;
    
    // Check if user exists
    let user = await this.userRepository.findOne({ where: { telegramId } });

    if (!user) {
      // Create new user
      user = this.userRepository.create({
        telegramId,
        username,
        firstName: first_name,
        lastName: last_name,
        photoUrl: photo_url,
        preferences: {},
        isVerified: true
      });
    } else {
      // Update existing user
      user.username = username || user.username;
      user.firstName = first_name || user.firstName;
      user.lastName = last_name || user.lastName;
      user.photoUrl = photo_url || user.photoUrl;
    }

    await this.userRepository.save(user);
    return user;
  };
}

export default new UserController();
