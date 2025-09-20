import React from 'react';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  MoreHorizontal,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  Volume1,
  VolumeX,
  Heart,
} from 'lucide-react';
import { PlayerState, Track } from '../../types';

interface FullScreenPlayerProps {
  playerState: PlayerState;
  onClose: () => void;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onVolumeChange: (volume: number) => void;
  onSeek: (time: number) => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
}

const FullScreenPlayer: React.FC<FullScreenPlayerProps> = ({
  playerState,
  onClose,
  onTogglePlay,
  onNext,
  onPrevious,
  onVolumeChange,
  onSeek,
  onToggleShuffle,
  onToggleRepeat,
}) => {
  const { currentTrack, isPlaying, currentTime, duration, volume, shuffle, repeat } = playerState;

  if (!currentTrack) return null;

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
      className="fixed inset-0 bg-gradient-to-b from-gray-800 to-black z-50 flex flex-col p-4 md:p-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-white">
          <ChevronDown size={28} />
        </button>
        <div className="text-center">
          <p className="text-xs text-gray-400 uppercase">Tocando do álbum</p>
          <p className="font-semibold text-white">{currentTrack.album || 'Single'}</p>
        </div>
        <button className="p-2 text-gray-400 hover:text-white">
          <MoreHorizontal size={28} />
        </button>
      </div>

      {/* Cover Art */}
      <div className="flex-grow flex items-center justify-center my-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full max-w-sm md:max-w-md aspect-square shadow-2xl shadow-black/50 rounded-lg overflow-hidden"
        >
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      {/* Track Info & Controls */}
      <div className="flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">{currentTrack.title}</h2>
            <p className="text-base md:text-lg text-gray-400">{currentTrack.artist}</p>
          </div>
          <button className="p-2 text-gray-400 hover:text-primary-500">
            <Heart size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="relative h-1.5 bg-gray-700 rounded-full">
            <div
              className="absolute h-full bg-white rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
            <div
              className="absolute h-3 w-3 -top-1 bg-white rounded-full"
              style={{ left: `calc(${progressPercentage}% - 6px)` }}
            />
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={(e) => onSeek(Number(e.target.value))}
              className="absolute w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onToggleShuffle}
            className={`p-2 transition-colors ${shuffle ? 'text-primary-500' : 'text-gray-400 hover:text-white'}`}
          >
            <Shuffle size={20} />
          </button>
          <button onClick={onPrevious} className="p-2 text-gray-300 hover:text-white">
            <SkipBack size={28} />
          </button>
          <button
            onClick={onTogglePlay}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black shadow-lg hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
          </button>
          <button onClick={onNext} className="p-2 text-gray-300 hover:text-white">
            <SkipForward size={28} />
          </button>
          <button
            onClick={onToggleRepeat}
            className={`p-2 transition-colors ${repeat !== 'none' ? 'text-primary-500' : 'text-gray-400 hover:text-white'}`}
          >
            {repeat === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center justify-center space-x-2">
          <VolumeIcon size={20} className="text-gray-400" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default FullScreenPlayer;
