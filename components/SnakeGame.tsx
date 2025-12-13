import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Coordinate, Direction, GameStatus } from '../types';
import { GRID_SIZE, INITIAL_SPEED } from '../constants';
import { Play, RotateCcw, AlertTriangle } from 'lucide-react';

interface SnakeGameProps {
  isPlayingMusic: boolean;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ isPlayingMusic }) => {
  const [snake, setSnake] = useState<Coordinate[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Coordinate>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const directionRef = useRef<Direction>('RIGHT');
  const gameLoopRef = useRef<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('snake_highscore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snake_highscore', score.toString());
    }
  }, [score, highScore]);

  const generateFood = useCallback((currentSnake: Coordinate[]): Coordinate => {
    let newFood: Coordinate;
    let isCollision;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      isCollision = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    } while (isCollision);
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setScore(0);
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setStatus(GameStatus.PLAYING);
    setFood(generateFood([{ x: 10, y: 10 }]));
  };

  const gameOver = () => {
    setStatus(GameStatus.GAME_OVER);
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
  };

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (directionRef.current) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      if (
        newHead.x < 0 || 
        newHead.x >= GRID_SIZE || 
        newHead.y < 0 || 
        newHead.y >= GRID_SIZE
      ) {
        gameOver();
        return prevSnake;
      }

      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        gameOver();
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, generateFood]);

  useEffect(() => {
    if (status === GameStatus.PLAYING) {
      const speed = Math.max(50, INITIAL_SPEED - Math.floor(score / 50) * 5);
      gameLoopRef.current = window.setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [status, moveSnake, score]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== GameStatus.PLAYING) {
        if (e.code === 'Space' && (status === GameStatus.IDLE || status === GameStatus.GAME_OVER)) {
            resetGame();
            e.preventDefault();
        }
        return;
      }
      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp': if (currentDir !== 'DOWN') directionRef.current = 'UP'; e.preventDefault(); break;
        case 'ArrowDown': if (currentDir !== 'UP') directionRef.current = 'DOWN'; e.preventDefault(); break;
        case 'ArrowLeft': if (currentDir !== 'RIGHT') directionRef.current = 'LEFT'; e.preventDefault(); break;
        case 'ArrowRight': if (currentDir !== 'LEFT') directionRef.current = 'RIGHT'; e.preventDefault(); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status]);

  return (
    <div className="flex flex-col items-center gap-2">
      
      {/* HUD */}
      <div className="w-full flex justify-between items-end mb-2 font-mono uppercase">
        <div className="bg-cyan-900/30 border-l-4 border-cyan-500 pl-2 pr-4 py-1">
            <span className="text-xs text-cyan-600 block">CURRENT_SCORE</span>
            <span className="text-2xl font-bold text-cyan-400">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="text-right bg-magenta-900/30 border-r-4 border-magenta-500 pr-2 pl-4 py-1">
            <span className="text-xs text-magenta-600 block">RECORD</span>
            <span className="text-2xl font-bold text-magenta-400">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      {/* Game Grid */}
      <div 
        className="relative bg-black border-4 border-double border-gray-800 shadow-[0_0_0_2px_#0ff] overflow-hidden"
        style={{
          width: 'min(90vw, 400px)',
          height: 'min(90vw, 400px)',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* CRT Scanline Overlay specifically for game */}
        <div className="absolute inset-0 pointer-events-none z-30" 
             style={{ 
               background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
               backgroundSize: '100% 2px, 3px 100%'
             }} 
        />
        
        {/* Subtle grid lines */}
        <div className="absolute inset-0 z-0 opacity-20" 
            style={{ 
                backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%`
            }} 
        />

        {/* Snake & Food */}
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          
          const isFood = food.x === x && food.y === y;
          const snakeIndex = snake.findIndex(s => s.x === x && s.y === y);
          const isHead = snakeIndex === 0;
          const isBody = snakeIndex > 0;

          if (isFood) {
            return (
              <div key={i} className="relative z-10 flex items-center justify-center">
                 <div className="w-full h-full bg-magenta-500 animate-pulse shadow-[0_0_10px_#f0f]" 
                      style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
                 />
              </div>
            );
          }

          if (isHead) {
             return (
              <div key={i} className="bg-cyan-300 z-20 relative shadow-[0_0_15px_#0ff]">
                  {/* Glitchy face */}
                  <div className="absolute inset-0 bg-white opacity-0 animate-ping" />
              </div>
             )
          }

          if (isBody) {
              return (
                <div key={i} className="bg-cyan-700/80 border border-cyan-900 z-10" />
              )
          }

          return <div key={i} className="z-0" />;
        })}

        {/* Start Overlay */}
        {status === GameStatus.IDLE && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center text-center p-6 z-40">
            <h2 className="text-4xl font-bold text-white mb-6 glitch-text" data-text="READY?">READY?</h2>
            <button 
                onClick={resetGame}
                className="group relative px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-black font-bold uppercase tracking-widest clip-corner transition-all"
            >
                <div className="flex items-center gap-2">
                    <Play size={20} className="fill-black" /> INITIATE
                </div>
            </button>
            <p className="mt-8 text-xs text-cyan-800 animate-pulse">PRESS [SPACE] TO START</p>
          </div>
        )}

        {/* Game Over Overlay */}
        {status === GameStatus.GAME_OVER && (
          <div className="absolute inset-0 bg-red-900/90 flex flex-col items-center justify-center text-center p-6 z-40">
            <div className="mb-4 text-red-500 animate-pulse">
                <AlertTriangle size={48} />
            </div>
            <h2 className="text-4xl font-bold text-white mb-2 glitch-text" data-text="FATAL ERROR">FATAL ERROR</h2>
            <div className="w-full h-px bg-red-500 my-4"></div>
            <p className="text-red-300 mb-6 font-mono text-xl">SCORE: {score}</p>
            <button 
                onClick={resetGame}
                className="group px-8 py-3 border-2 border-white hover:bg-white hover:text-red-900 text-white font-bold uppercase tracking-widest transition-all"
            >
                <div className="flex items-center gap-2">
                    <RotateCcw size={16} /> REBOOT_SYSTEM
                </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
