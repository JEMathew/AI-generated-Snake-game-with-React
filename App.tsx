import React, { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Terminal, Cpu, ShieldAlert } from 'lucide-react';

export default function App() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-cyan-400 flex flex-col items-center relative overflow-x-hidden selection:bg-magenta-500 selection:text-white">
      
      {/* Glitch Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
          <div className="absolute top-[10%] left-[5%] w-64 h-64 border border-magenta-500 animate-pulse" />
          <div className="absolute bottom-[20%] right-[10%] w-96 h-96 border border-cyan-500 opacity-50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[2px] bg-yellow-400 opacity-30 rotate-45" />
      </div>

      {/* Header */}
      <header className="w-full border-b-4 border-cyan-500 bg-black z-10 relative">
        <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-magenta-500 flex items-center justify-center clip-corner-rev">
                    <Terminal className="text-black w-8 h-8" />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold tracking-tighter text-white glitch-text" data-text="CYBER_SNAKE">
                        CYBER_SNAKE
                    </h1>
                    <span className="text-xs text-yellow-400 tracking-[0.3em] bg-black inline-block">SYSTEM_READY</span>
                </div>
            </div>
            
            <div className="hidden md:flex gap-4 items-center font-mono text-xs">
                <div className="px-2 py-1 bg-cyan-900/30 border border-cyan-500/50 text-cyan-300">
                    RAM: 64TB
                </div>
                <div className="px-2 py-1 bg-magenta-900/30 border border-magenta-500/50 text-magenta-300 animate-pulse">
                    CPU: OVERCLOCKED
                </div>
            </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col lg:flex-row items-start justify-center gap-12 z-10">
        
        {/* Left Column: Data Log */}
        <div className="hidden lg:block w-72 space-y-8">
           <div className="border-l-4 border-yellow-400 pl-4 py-2 bg-yellow-900/10">
             <h3 className="text-yellow-400 font-bold mb-4 text-xl flex items-center gap-2">
                <ShieldAlert size={20} /> INSTRUCTIONS
             </h3>
             <ul className="space-y-3 font-mono text-sm text-gray-400">
                <li className="flex gap-2">
                    <span className="text-cyan-500">[>]</span> Use ARROW keys for navigation
                </li>
                <li className="flex gap-2">
                    <span className="text-magenta-500">[>]</span> CONSUME data packets (food)
                </li>
                <li className="flex gap-2">
                    <span className="text-red-500">[!]</span> AVOID system boundaries
                </li>
             </ul>
           </div>
           
           <div className="border border-cyan-500 p-1 bg-black relative">
               <div className="absolute -top-2 -right-2 w-4 h-4 bg-cyan-500" />
               <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-cyan-500" />
               <div className="bg-cyan-950/20 p-4">
                 <h3 className="text-cyan-400 font-bold mb-2">SYSTEM_LOG</h3>
                 <div className="font-mono text-xs text-cyan-700 space-y-1 h-32 overflow-hidden relative">
                    <p>> Initializing graphics engine...</p>
                    <p>> Loading assets...</p>
                    <p>> Audio stream buffered.</p>
                    <p>> Connection established.</p>
                    <p className="animate-pulse">> WAITING_FOR_INPUT_</p>
                 </div>
               </div>
           </div>
        </div>

        {/* Center: Snake Game */}
        <div className="flex-shrink-0 relative">
            {/* Decorative brackets around game */}
            <div className="absolute -left-4 -top-4 w-8 h-8 border-l-4 border-t-4 border-white pointer-events-none" />
            <div className="absolute -right-4 -bottom-4 w-8 h-8 border-r-4 border-b-4 border-white pointer-events-none" />
            
            <SnakeGame isPlayingMusic={isPlaying} />
        </div>

        {/* Right Column: Music Player */}
        <div className="w-full lg:w-96">
            <div className="border-t-4 border-magenta-500 pt-4 lg:pt-0 lg:border-t-0">
                <MusicPlayer 
                    currentTrackIndex={currentTrackIndex}
                    setCurrentTrackIndex={setCurrentTrackIndex}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                />
            </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full p-6 bg-black border-t border-gray-800 z-10 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-gray-600">
             <div className="flex items-center gap-2">
                 <Cpu size={16} />
                 <span>RENDERING_ENGINE: REACT_DOM_v19</span>
             </div>
             <p className="tracking-widest">NO_COPYRIGHT_INTENDED // OPEN_SOURCE</p>
        </div>
      </footer>
    </div>
  );
}