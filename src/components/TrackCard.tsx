import React from 'react';
import { motion } from 'framer-motion';
import { Play, Heart, MoreHorizontal, Pause } from 'lucide-react';
import { Track } from '../types';

interface TrackCardProps {
  track: Track;
  onPlay: (track: Track) => void;
  isPlaying: boolean;
  index: number;
}

const TrackCard: React.FC<TrackCardProps> = ({ track, onPlay, isPlaying, index }) => {
  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlay(track);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all duration-300 cursor-pointer"
      onClick={() => onPlay(track)}
    >
      <div className="relative mb-4">
        <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
          {track.coverUrl ? (
            <img
              src={track.coverUrl}
              alt={track.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {track.title.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          className={`absolute bottom-2 right-2 w-10 h-10 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 ${
            isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          onClick={handlePlayClick}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" />
          )}
        </motion.button>
      </div>
      
      <div className="space-y-1">
        <h3 className={`font-medium truncate transition-colors ${isPlaying ? 'text-primary-500' : 'text-white group-hover:text-primary-400'}`}>
          {track.title}
        </h3>
        <p className="text-sm text-gray-400 truncate">{track.artist}</p>
        {track.album && (
          <p className="text-xs text-gray-500 truncate">{track.album}</p>
        )}
      </div>
      
      <div className="flex items-center justify-between mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          className="p-1 text-gray-400 hover:text-primary-500 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Heart className="w-4 h-4" />
        </button>
        <button 
          className="p-1 text-gray-400 hover:text-white transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default TrackCard;
