import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Search, User, Bell, LogOut } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, searchQuery, onSearchChange, onLogout }) => {
  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 px-4 py-3 sticky top-0 z-30"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar músicas, artistas ou playlists..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button onClick={onLogout} className="flex items-center space-x-2 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">Sair</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
