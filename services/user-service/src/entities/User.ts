import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { User as IUser, UserPreferences } from '@tuneton/shared';

@Entity('users')
export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'bigint', unique: true })
  @Index()
  telegramId: number;

  @Column({ nullable: true })
  username: string;

  @Column({ name: 'first_name', nullable: true })
  firstName: string;

  @Column({ name: 'last_name', nullable: true })
  lastName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ name: 'photo_url', nullable: true })
  photoUrl: string;

  @Column({ type: 'jsonb', default: {} })
  preferences: UserPreferences;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ default: false, name: 'is_verified' })
  isVerified: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  // Helper methods
  toJSON() {
    const { id, telegramId, username, firstName, lastName, email, photoUrl, preferences, isAdmin, isVerified, createdAt, updatedAt } = this;
    return { id, telegramId, username, firstName, lastName, email, photoUrl, preferences, isAdmin, isVerified, createdAt, updatedAt };
  }
}
