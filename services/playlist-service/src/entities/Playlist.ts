import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { PlaylistTrack } from './PlaylistTrack';

@Entity('playlists')
export class Playlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'boolean', default: false })
  isPublic: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  coverImageUrl: string | null;

  @Column({ type: 'uuid', name: 'user_id' })
  @Index()
  userId: string;

  // This is a denormalized field to avoid joins for simple queries
  @Column({ type: 'int', default: 0 })
  trackCount: number;

  @Column({ type: 'int', default: 0 })
  playCount: number;

  @Column({ type: 'int', default: 0 })
  duration: number; // Total duration in seconds

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => PlaylistTrack, (playlistTrack) => playlistTrack.playlist, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  playlistTracks: PlaylistTrack[];

  // Hooks
  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  validate() {
    if (this.name.length > 100) {
      throw new Error('Name must be less than 100 characters');
    }
    if (this.description && this.description.length > 500) {
      throw new Error('Description must be less than 500 characters');
    }
  }

  // Helper methods
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      isPublic: this.isPublic,
      coverImageUrl: this.coverImageUrl,
      userId: this.userId,
      trackCount: this.trackCount,
      playCount: this.playCount,
      duration: this.duration,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
