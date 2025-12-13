import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Disc, Zap } from 'lucide-react';
import { PLAYLIST } from '../constants';

interface MusicPlayerProps {
  currentTrackIndex: number;
  setCurrentTrackIndex: (index: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  currentTrackIndex, 
  setCurrentTrackIndex,
  isPlaying,
  setIsPlaying
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentTrack = PLAYLIST[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-black border-2 border-gray-700 p-1 shadow-[10px_10px_0_0_rgba(20,20,20,1)] relative">
      {/* Decorative bolts */}
      <div className="absolute top-1 left-1 w-2 h-2 bg-gray-600 rounded-full" />
      <div className="absolute top-1 right-1 w-2 h-2 bg-gray-600 rounded-full" />
      <div className="absolute bottom-1 left-1 w-2 h-2 bg-gray-600 rounded-full" />
      <div className="absolute bottom-1 right-1 w-2 h-2 bg-gray-600 rounded-full" />

      <div className="bg-[#1a1a1a] p-6 border-b-4 border-gray-800">
        <audio
            ref={audioRef}
            src={currentTrack.src}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => {
                setCurrentTrackIndex((currentTrackIndex + 1) % PLAYLIST.length);
                setIsPlaying(true);
            }}
        />

        {/* Display Screen */}
        <div className="bg-[#0a0a0a] border-2 border-gray-600 mb-6 p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-green-900/10 pointer-events-none" 
                 style={{ backgroundImage: 'linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px)', backgroundSize: '100% 3px' }}
            />
            
            <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] text-green-600 uppercase">Stereo Output</span>
                <span className="text-[10px] text-green-600 uppercase animate-pulse">{isPlaying ? 'PLAYING' : 'PAUSED'}</span>
            </div>
            
            <h3 className="text-xl text-green-400 font-bold uppercase truncate font-mono tracking-tighter">
                {currentTrack.title}
            </h3>
            <p className="text-sm text-green-700 uppercase font-mono mb-4">
                ARTIST: {currentTrack.artist}
            </p>

            {/* Retro Progress Bar */}
            <div className="w-full h-4 bg-[#111] border border-green-900 relative cursor-pointer" 
                 onClick={(e) => {
                    if (!audioRef.current) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    audioRef.current.currentTime = percent * duration;
                 }}>
                <div 
                    className="h-full bg-green-500 relative"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                >
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white opacity-50" />
                </div>
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-green-800 font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
            </div>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-3 gap-4">
            <button 
                onClick={() => {
                    setCurrentTrackIndex((currentTrackIndex - 1 + PLAYLIST.length) % PLAYLIST.length);
                    setIsPlaying(true);
                }}
                className="bg-[#222] border-b-4 border-black hover:border-gray-600 hover:bg-[#333] active:border-t-4 active:border-b-0 text-gray-400 h-12 flex items-center justify-center transition-all"
            >
                <SkipBack size={20} />
            </button>
            
            <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className={`border-b-4 h-12 flex items-center justify-center transition-all ${
                    isPlaying 
                    ? 'bg-yellow-600 border-yellow-800 text-black' 
                    : 'bg-yellow-500 border-yellow-700 text-black hover:bg-yellow-400'
                }`}
            >
                {isPlaying ? <Pause size={24} fill="black" /> : <Play size={24} fill="black" />}
            </button>
            
            <button 
                onClick={() => {
                    setCurrentTrackIndex((currentTrackIndex + 1) % PLAYLIST.length);
                    setIsPlaying(true);
                }}
                className="bg-[#222] border-b-4 border-black hover:border-gray-600 hover:bg-[#333] active:border-t-4 active:border-b-0 text-gray-400 h-12 flex items-center justify-center transition-all"
            >
                <SkipForward size={20} />
            </button>
        </div>
        
        {/* Decorative Elements */}
        <div className="mt-6 flex justify-between items-center opacity-40">
            <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-1 h-3 bg-red-500 rounded-sm" />
                ))}
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono text-gray-500">
                <Disc size={12} className="animate-spin" style={{ animationDuration: '3s' }} /> 
                <span>AI_SYNTH_DRIVE_v4</span>
            </div>
        </div>
      </div>
    </div>
  );
};
