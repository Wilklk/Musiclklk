import React from 'react';
import { motion } from 'framer-motion';
import { Play, Music } from 'lucide-react';
import { Playlist } from '../types';

interface PlaylistCardProps {
  playlist: Playlist;
  onPlay: (playlist: Playlist) => void;
  onClick: (playlist: Playlist) => void;
  index: number;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, onPlay, onClick, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all duration-300 cursor-pointer"
      onClick={() => onClick(playlist)}
    >
      <div className="relative mb-4">
        <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
          {playlist.coverUrl ? (
            <img
              src={playlist.coverUrl}
              alt={playlist.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
              <Music className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
        
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          className="absolute bottom-2 right-2 w-10 h-10 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation();
            onPlay(playlist);
          }}
        >
          <Play className="w-4 h-4 ml-0.5" />
        </motion.button>
      </div>
      
      <div className="space-y-1">
        <h3 className="font-medium text-white truncate group-hover:text-primary-400 transition-colors">
          {playlist.name}
        </h3>
        <p className="text-sm text-gray-400 truncate">
          {playlist.tracks.length} música{playlist.tracks.length !== 1 ? 's' : ''}
        </p>
        {playlist.description && (
          <p className="text-xs text-gray-500 truncate">{playlist.description}</p>
        )}
        {playlist.isAuto && (
          <span className="inline-block px-2 py-0.5 text-xs bg-primary-600 text-white rounded-full">
            Automática
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default PlaylistCard;
