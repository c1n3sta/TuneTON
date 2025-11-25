export interface Track {
  id: string | number;
  title: string;
  artist: string;
  cover: string;
  duration: string;
  isPlaying?: boolean;
}

export interface Playlist {
  id: string | number;
  title: string;
  description: string;
  cover: string;
  tracks: number;
  tracksCount: number;
  duration: string;
}

export interface Contest {
  id: string | number;
  title: string;
  description: string;
  cover: string;
  prize: string;
  deadline: string;
  participants: number;
  remixer: {
    name: string;
    avatar: string;
  };
}