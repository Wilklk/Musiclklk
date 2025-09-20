import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import MiniPlayer from './components/Player/MiniPlayer';
import FullScreenPlayer from './components/Player/FullScreenPlayer';
import TrackCard from './components/TrackCard';
import PlaylistCard from './components/PlaylistCard';
import FileUpload from './components/FileUpload';
import AuthPage from './pages/AuthPage';
import { usePlayer } from './hooks/usePlayer';
import { useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabaseClient';
import { Track, Playlist } from './types';
import { Plus, Upload } from 'lucide-react';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isFullScreenPlayerOpen, setFullScreenPlayerOpen] = useState(false);

  const { session, user, loading: authLoading } = useAuth();

  // Data state from Supabase
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Player state
  const playerControls = usePlayer(tracks);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setIsLoadingData(true);
    try {
      const { data: tracksData, error: tracksError } = await supabase
        .from('tracks')
        .select('*')
        .eq('user_id', user.id);

      if (tracksError) throw tracksError;
      setTracks(tracksData || []);

      const { data: playlistsData, error: playlistsError } = await supabase
        .from('playlists')
        .select('*, playlist_tracks(tracks(*))')
        .eq('user_id', user.id);

      if (playlistsError) throw playlistsError;

      const formattedPlaylists = playlistsData.map(p => ({
        ...p,
        tracks: p.playlist_tracks.map((pt: any) => pt.tracks),
        createdAt: new Date(p.created_at)
      }));
      setPlaylists(formattedPlaylists || []);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoadingData(false);
    }
  }, [user]);

  useEffect(() => {
    if (session) {
      fetchData();
    } else {
      setTracks([]);
      setPlaylists([]);
    }
  }, [session, fetchData]);

  const handlePlayTrack = (track: Track, trackList: Track[]) => {
    const trackIndex = trackList.findIndex(t => t.id === track.id);
    playerControls.setQueue(trackList, trackIndex);
    playerControls.play(track);
  };

  const handlePlayPlaylist = (playlist: Playlist) => {
    if (playlist.tracks.length > 0) {
      playerControls.setQueue(playlist.tracks, 0);
      playerControls.play(playlist.tracks[0]);
    }
  };
  
  const handleUpload = async (files: File[]) => {
    if (!user) return;

    setIsUploading(true);
    setUploadProgress(0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = `${user.id}/${Date.now()}-${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('audio')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        continue;
      }
      
      const { data: { publicUrl } } = supabase.storage.from('audio').getPublicUrl(fileName);

      const audio = new Audio(publicUrl);
      await new Promise(resolve => {
        audio.onloadedmetadata = () => {
          const newTrack: Omit<Track, 'id' | 'created_at'> = {
            user_id: user.id,
            title: file.name.replace(/\.[^/.]+$/, ''),
            artist: 'Artista Desconhecido',
            album: 'Uploads',
            duration: Math.round(audio.duration), 
            audioUrl: publicUrl,
            coverUrl: `https://img-wrapper.vercel.app/image?url=https://placehold.co/300x300/10b981/white?text=${file.name.charAt(0).toUpperCase()}`,
          };

          supabase.from('tracks').insert(newTrack).select().single().then(({ data, error }) => {
            if (error) {
              console.error('Error saving track metadata:', error);
            } else if (data) {
              setTracks(prev => [...prev, data as Track]);
            }
            resolve(true);
          });
        };
        audio.onerror = () => {
          console.error("Error loading audio metadata for duration calculation.");
          resolve(false);
        };
      });

      setUploadProgress(((i + 1) / files.length) * 100);
    }

    setIsUploading(false);
    setShowUpload(false);
    setUploadProgress(0);
  };

  const filteredTracks = tracks.filter(track =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderHome = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Feito para você</h2>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Adicionar Música</span>
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {playlists.map((playlist, index) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              onPlay={handlePlayPlaylist}
              onClick={() => setCurrentSection(`playlist-${playlist.id}`)}
              index={index}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-6">Suas Músicas</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {tracks.slice(0, 12).map((track, index) => (
            <TrackCard
              key={track.id}
              track={track}
              onPlay={(t) => handlePlayTrack(t, tracks)}
              isPlaying={playerControls.playerState.currentTrack?.id === track.id && playerControls.playerState.isPlaying}
              index={index}
            />
          ))}
        </div>
      </section>
    </motion.div>
  );

  const renderSearch = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white">Buscar</h2>
      {searchQuery ? (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white">
            Resultados para "{searchQuery}"
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredTracks.map((track, index) => (
              <TrackCard
                key={track.id}
                track={track}
                onPlay={(t) => handlePlayTrack(t, filteredTracks)}
                isPlaying={playerControls.playerState.currentTrack?.id === track.id && playerControls.playerState.isPlaying}
                index={index}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            Busque por suas músicas e artistas favoritos.
          </p>
        </div>
      )}
    </motion.div>
  );

  const renderLibrary = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Sua Biblioteca</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          <span>Nova Playlist</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {playlists.map((playlist, index) => (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            onPlay={handlePlayPlaylist}
            onClick={() => setCurrentSection(`playlist-${playlist.id}`)}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );

  const renderContent = () => {
    if (isLoadingData) {
      return <div className="text-center text-gray-400 p-10">Carregando sua música...</div>;
    }
    switch (currentSection) {
      case 'home':
        return renderHome();
      case 'search':
        return renderSearch();
      case 'library':
        return renderLibrary();
      default:
        return renderHome();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (showSplash || authLoading) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (!session) {
    return <AuthPage />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <div className="flex">
          <Sidebar
            isOpen={sidebarOpen}
            playlists={playlists}
            onNavigate={setCurrentSection}
            currentSection={currentSection}
          />
          
          <div className="flex-1 lg:ml-0">
            <Header
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onLogout={handleLogout}
            />
            
            <main className="p-6 pb-32">
              {renderContent()}
            </main>
          </div>
        </div>

        {playerControls.playerState.currentTrack && (
            <MiniPlayer
                {...playerControls}
                onOpenFullScreen={() => setFullScreenPlayerOpen(true)}
            />
        )}

        <AnimatePresence>
          {isFullScreenPlayerOpen && (
            <FullScreenPlayer
              {...playerControls}
              onClose={() => setFullScreenPlayerOpen(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showUpload && (
            <FileUpload
              onUpload={handleUpload}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
              onClose={() => setShowUpload(false)}
            />
          )}
        </AnimatePresence>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
