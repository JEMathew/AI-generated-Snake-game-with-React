export interface Track {
  id: number;
  title: string;
  artist: string;
  src: string;
  duration: string; // Display string like "3:45"
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Coordinate {
  x: number;
  y: number;
}

export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  PAUSED = 'PAUSED'
}
