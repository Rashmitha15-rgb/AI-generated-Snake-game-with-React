import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Gamepad2, Music as MusicIcon, Zap } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30 overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a1a1a_0%,#050505_100%)]" />
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)`,
             backgroundSize: '40px 40px' 
           }} />
      
      {/* Animated Glows */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1] 
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/20 blur-[120px] rounded-full"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.15, 0.1] 
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-500/10 blur-[150px] rounded-full"
      />

      <main className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen gap-12">
        {/* Header */}
        <header className="text-center space-y-2">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center justify-center gap-3 mb-2"
          >
            <Zap className="w-8 h-8 text-cyan-400 fill-current animate-pulse" />
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              Neon Snake
            </h1>
          </motion.div>
          <p className="text-cyan-500/60 font-mono text-xs uppercase tracking-[0.4em] font-bold">
            Retro-Future Gaming Experience
          </p>
        </header>

        {/* Game and Player Container */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 w-full max-w-6xl">
          {/* Left Side - Info/Stats (Optional) */}
          <div className="hidden xl:flex flex-col gap-6 w-64">
            <div className="p-6 bg-black/40 border border-cyan-500/20 rounded-3xl backdrop-blur-md">
              <div className="flex items-center gap-2 text-cyan-400 mb-4">
                <Gamepad2 className="w-4 h-4" />
                <span className="text-[10px] font-mono uppercase tracking-widest">Controls</span>
              </div>
              <ul className="space-y-3 text-xs font-mono text-cyan-500/60">
                <li className="flex justify-between"><span>UP</span> <span className="text-cyan-400">↑</span></li>
                <li className="flex justify-between"><span>DOWN</span> <span className="text-cyan-400">↓</span></li>
                <li className="flex justify-between"><span>LEFT</span> <span className="text-cyan-400">←</span></li>
                <li className="flex justify-between"><span>RIGHT</span> <span className="text-cyan-400">→</span></li>
                <li className="flex justify-between"><span>PAUSE</span> <span className="text-cyan-400">SPACE</span></li>
              </ul>
            </div>
            
            <div className="p-6 bg-black/40 border border-fuchsia-500/20 rounded-3xl backdrop-blur-md">
              <div className="flex items-center gap-2 text-fuchsia-400 mb-4">
                <MusicIcon className="w-4 h-4" />
                <span className="text-[10px] font-mono uppercase tracking-widest">Audio Engine</span>
              </div>
              <div className="space-y-2">
                <div className="h-1 w-full bg-fuchsia-900/20 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: ["20%", "80%", "40%", "90%", "30%"] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="h-full bg-fuchsia-500/50" 
                  />
                </div>
                <p className="text-[8px] font-mono text-fuchsia-500/40 uppercase tracking-widest text-center">
                  Processing Neural Beats...
                </p>
              </div>
            </div>
          </div>

          {/* Center - Game */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex justify-center"
          >
            <SnakeGame />
          </motion.div>

          {/* Right Side - Music Player */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-md"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-3 px-4">
                <div className="w-2 h-2 rounded-full bg-fuchsia-500 animate-ping" />
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-fuchsia-500 font-bold">Now Playing</span>
              </div>
              <MusicPlayer />
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-12 flex flex-col items-center gap-4 opacity-40 hover:opacity-100 transition-opacity">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
          <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-cyan-500">
            System Online • 2026 • AI Studio
          </p>
        </footer>
      </main>

      {/* Custom Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #22d3ee33; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #22d3ee66; }
      `}} />
    </div>
  );
}
