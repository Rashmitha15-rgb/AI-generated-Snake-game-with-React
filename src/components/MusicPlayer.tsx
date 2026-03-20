import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Disc } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "Neon Pulse",
    artist: "AI Synth",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/neon/400/400"
  },
  {
    id: 2,
    title: "Midnight Drive",
    artist: "Cyber Beats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/cyber/400/400"
  },
  {
    id: 3,
    title: "Digital Horizon",
    artist: "Virtual Echo",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/horizon/400/400"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.log("Playback blocked", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const onEnded = () => {
    handleNext();
  };

  return (
    <div className="w-full max-w-md bg-black/60 backdrop-blur-2xl rounded-[2rem] border border-fuchsia-500/30 p-6 shadow-[0_0_50px_-12px_rgba(217,70,239,0.3)]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
      />
      
      <div className="flex items-center gap-6">
        {/* Album Art */}
        <div className="relative group">
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 rounded-full overflow-hidden border-2 border-fuchsia-500/50 shadow-[0_0_20px_rgba(217,70,239,0.4)]"
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-4 h-4 bg-black rounded-full border border-fuchsia-500/50" />
          </div>
        </div>

        {/* Track Info */}
        <div className="flex-1 overflow-hidden">
          <motion.h3 
            key={currentTrack.title}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-fuchsia-400 font-bold text-lg truncate tracking-tight"
          >
            {currentTrack.title}
          </motion.h3>
          <p className="text-fuchsia-500/60 text-sm font-medium truncate uppercase tracking-widest">
            {currentTrack.artist}
          </p>
          
          <div className="mt-4 flex items-center gap-4">
            <button onClick={handlePrev} className="text-fuchsia-500 hover:text-fuchsia-400 transition-colors">
              <SkipBack className="w-5 h-5 fill-current" />
            </button>
            <button 
              onClick={togglePlay}
              className="w-10 h-10 flex items-center justify-center bg-fuchsia-500 text-black rounded-full hover:bg-fuchsia-400 transition-all shadow-[0_0_15px_rgba(217,70,239,0.5)]"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current translate-x-0.5" />}
            </button>
            <button onClick={handleNext} className="text-fuchsia-500 hover:text-fuchsia-400 transition-colors">
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="h-1 w-full bg-fuchsia-900/30 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <div className="flex items-center gap-1 text-[10px] text-fuchsia-500/40 font-mono uppercase tracking-widest">
            <Volume2 className="w-3 h-3" />
            <span>Stereo Output</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-fuchsia-500/40 font-mono uppercase tracking-widest">
            <Disc className="w-3 h-3 animate-spin-slow" />
            <span>320kbps</span>
          </div>
        </div>
      </div>
    </div>
  );
}
