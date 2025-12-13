import { Track } from './types';

// Using stable, royalty-free MP3s commonly used for web audio demos to simulate "AI Generated" synth music
export const PLAYLIST: Track[] = [
  {
    id: 1,
    title: "Neural Network Drive",
    artist: "AI Synth Gen v1.0",
    src: "https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg",
    duration: "4:32"
  },
  {
    id: 2,
    title: "Cybernetic Pulse",
    artist: "AI Synth Gen v2.4",
    src: "https://commondatastorage.googleapis.com/codeskulptor-demos/riceracer_assets/music/race1.ogg",
    duration: "2:15"
  },
  {
    id: 3,
    title: "Binary Sunset",
    artist: "AI Synth Gen v0.9",
    src: "https://commondatastorage.googleapis.com/codeskulptor-demos/pyman_assets/eatedpill.ogg",
    duration: "3:10"
  }
];

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;
