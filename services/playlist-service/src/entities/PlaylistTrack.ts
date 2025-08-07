import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  BeforeInsert,
  Unique,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Playlist } from './Playlist';

@Entity('playlist_tracks')
@Unique('UQ_playlist_track_order', ['playlistId', 'position'])
@Index('IDX_playlist_track', ['playlistId', 'trackId'])
export class PlaylistTrack {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'playlist_id' })
  playlistId: string;

  @Column({ type: 'uuid', name: 'track_id' })
  trackId: string;

  @Column({ type: 'int' })
  position: number;

  @Column({ type: 'uuid', name: 'added_by', nullable: true })
  addedBy: string | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'added_at' })
  addedAt: Date;

  // Relations
  @ManyToOne(() => Playlist, (playlist) => playlist.playlistTracks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'playlist_id' })
  playlist: Playlist;

  // Hooks
  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }

  // Helper methods
  toJSON() {
    return {
      id: this.id,
      playlistId: this.playlistId,
      trackId: this.trackId,
      position: this.position,
      addedBy: this.addedBy,
      addedAt: this.addedAt,
    };
  }
}
