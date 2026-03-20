import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, RefreshCw, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 150;

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food is on snake
      const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    setFood(newFood);
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    generateFood();
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y,
      };

      // Check collisions
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if food eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, isPaused, isGameOver]);

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-black/40 backdrop-blur-xl rounded-3xl border border-cyan-500/30 shadow-[0_0_50px_-12px_rgba(6,182,212,0.3)]">
      <div className="flex justify-between w-full items-center px-4">
        <div className="flex items-center gap-2 text-cyan-400">
          <Trophy className="w-5 h-5" />
          <span className="font-mono text-xl font-bold tracking-wider">{score}</span>
        </div>
        <div className="text-cyan-500/50 text-xs font-mono uppercase tracking-widest">
          Neon Grid v1.0
        </div>
      </div>

      <div 
        className="relative grid bg-slate-900/50 border-2 border-cyan-500/20 rounded-lg overflow-hidden"
        style={{ 
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: 'min(80vw, 400px)',
          height: 'min(80vw, 400px)'
        }}
      >
        {/* Grid Lines */}
        <div className="absolute inset-0 grid opacity-10 pointer-events-none" 
             style={{ 
               gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
               gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` 
             }}>
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-cyan-500" />
          ))}
        </div>

        {/* Food */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          className="absolute bg-rose-500 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.8)]"
          style={{
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
          }}
        />

        {/* Snake */}
        {snake.map((segment, i) => (
          <div
            key={`${i}-${segment.x}-${segment.y}`}
            className={`absolute rounded-sm transition-all duration-150 ${
              i === 0 
                ? 'bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] z-10' 
                : 'bg-cyan-600/80'
            }`}
            style={{
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              left: `${(segment.x / GRID_SIZE) * 100}%`,
              top: `${(segment.y / GRID_SIZE) * 100}%`,
            }}
          />
        ))}

        {/* Game Over Overlay */}
        <AnimatePresence>
          {isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20"
            >
              <h2 className="text-rose-500 text-4xl font-black italic uppercase tracking-tighter mb-4">Game Over</h2>
              <button
                onClick={resetGame}
                className="flex items-center gap-2 px-6 py-3 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.5)]"
              >
                <RefreshCw className="w-5 h-5" />
                RETRY
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pause Overlay */}
        <AnimatePresence>
          {isPaused && !isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20"
            >
              <button
                onClick={() => setIsPaused(false)}
                className="p-6 bg-cyan-500/20 border border-cyan-500/50 rounded-full text-cyan-400 hover:bg-cyan-500/30 transition-all group"
              >
                <Play className="w-12 h-12 fill-current group-hover:scale-110 transition-transform" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setIsPaused(p => !p)}
          className="p-3 rounded-xl bg-slate-800 text-cyan-400 hover:bg-slate-700 transition-colors border border-cyan-500/20"
        >
          {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
        </button>
        <button
          onClick={resetGame}
          className="p-3 rounded-xl bg-slate-800 text-cyan-400 hover:bg-slate-700 transition-colors border border-cyan-500/20"
        >
          <RefreshCw className="w-6 h-6" />
        </button>
      </div>
      
      <div className="text-cyan-500/40 text-[10px] font-mono uppercase tracking-[0.3em]">
        Use Arrows to Move • Space to Pause
      </div>
    </div>
  );
}
