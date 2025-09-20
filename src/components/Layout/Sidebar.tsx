import React from 'react';
import { motion } from 'framer-motion';
import { Home, Search, Library, Plus, Heart, Music, User } from 'lucide-react';
import { Playlist } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  playlists: Playlist[];
  onNavigate: (section: string) => void;
  currentSection: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, playlists, onNavigate, currentSection }) => {
  const menuItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'search', label: 'Buscar', icon: Search },
    { id: 'library', label: 'Sua Biblioteca', icon: Library },
  ];

  const libraryItems = [
    { id: 'liked', label: 'Músicas Curtidas', icon: Heart },
    { id: 'recent', label: 'Tocadas Recentemente', icon: Music },
  ];

  return (
    <motion.aside
      initial={{ x: -320 }}
      animate={{ x: isOpen ? 0 : -320 }}
      transition={{ type: 'spring', damping: 20 }}
      className="fixed left-0 top-0 h-full w-80 bg-gray-950 border-r border-gray-800 z-40 lg:relative lg:translate-x-0"
    >
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <Music className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Will Music</h1>
        </div>

        <nav className="mb-8">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    currentSection === item.id
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Sua Biblioteca
            </h2>
            <button className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <ul className="space-y-1">
            {libraryItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    currentSection === item.id
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Playlists
          </h3>
          <ul className="space-y-1 max-h-64 overflow-y-auto">
            {playlists.map((playlist) => (
              <li key={playlist.id}>
                <button
                  onClick={() => onNavigate(`playlist-${playlist.id}`)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    currentSection === `playlist-${playlist.id}`
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <div className="w-4 h-4 bg-gray-600 rounded flex-shrink-0" />
                  <span className="text-sm truncate">{playlist.name}</span>
                  {playlist.isAuto && (
                    <span className="text-xs text-primary-400">Auto</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
