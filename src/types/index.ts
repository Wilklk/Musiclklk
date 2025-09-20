export interface Track {
  id: string;
  user_id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  coverUrl?: string;
  audioUrl: string;
  genre?: string;
  year?: number;
  isLiked?: boolean;
  playCount?: number;
  created_at?: string;
}

export interface Playlist {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  tracks: Track[];
  createdAt: Date;
  isAuto?: boolean;
}

export interface AppConfig {
  premiumMode: boolean;
  fraudCheckEnabled: boolean;
  offlineMode: boolean;
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
  queue: Track[];
  currentIndex: number;
}
