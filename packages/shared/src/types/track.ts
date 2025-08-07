export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number; // in seconds
  genre?: string[];
  bpm?: number;
  key?: string;
  coverUrl: string;
  audioUrl: string;
  previewUrl?: string;
  explicit: boolean;
  isrc?: string;
  releaseDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  popularity?: number;
  audioFeatures?: AudioFeatures;
}

export interface AudioFeatures {
  acousticness: number;
  danceability: number;
  energy: number;
  instrumentalness: number;
  liveness: number;
  loudness: number;
  speechiness: number;
  tempo: number;
  timeSignature: number;
  valence: number;
  mode: number;
  key: number;
}

export interface CreateTrackDto {
  title: string;
  artist: string;
  album?: string;
  duration: number;
  genre?: string[];
  bpm?: number;
  key?: string;
  coverUrl: string;
  audioUrl: string;
  previewUrl?: string;
  explicit?: boolean;
  isrc?: string;
  releaseDate?: Date;
  tags?: string[];
  audioFeatures?: Partial<AudioFeatures>;
}

export interface UpdateTrackDto extends Partial<CreateTrackDto> {
  id: string;
}

export interface TrackSearchParams {
  query?: string;
  artist?: string;
  album?: string;
  genre?: string[];
  bpm?: {
    min?: number;
    max?: number;
  };
  key?: string;
  duration?: {
    min?: number;
    max?: number;
  };
  explicit?: boolean;
  tags?: string[];
  sortBy?: 'title' | 'artist' | 'album' | 'duration' | 'bpm' | 'popularity' | 'releaseDate';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
