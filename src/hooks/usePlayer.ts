import { useState, useRef, useCallback, useEffect } from 'react';
import { Track, PlayerState } from '../types';

export const usePlayer = (initialQueue: Track[] = []) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    volume: 1,
    currentTime: 0,
    duration: 0,
    shuffle: false,
    repeat: 'none',
    queue: initialQueue,
    currentIndex: -1,
  });

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      // Set crossOrigin to "anonymous" to avoid CORS issues with some audio sources
      audioRef.current.crossOrigin = "anonymous";
    }
  }, []);

  const play = useCallback((track?: Track) => {
    const audio = audioRef.current;
    if (!audio) return;

    const trackToPlay = track || playerState.currentTrack;
    if (trackToPlay) {
      if (audio.src !== trackToPlay.audioUrl) {
        setPlayerState(prev => ({ ...prev, currentTime: 0, duration: 0 }));
        audio.src = trackToPlay.audioUrl;
      }
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setPlayerState(prev => ({
            ...prev,
            isPlaying: true,
            currentTrack: trackToPlay,
          }));
        }).catch(error => {
          console.error("Error playing audio:", error);
          setPlayerState(prev => ({ ...prev, isPlaying: false }));
        });
      }
    }
  }, [playerState.currentTrack]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setPlayerState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const togglePlay = useCallback(() => {
    if (playerState.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [playerState.isPlaying, play, pause]);

  const handleNext = useCallback(() => {
    const { queue, currentIndex, repeat, shuffle } = playerState;
    if (queue.length === 0) return;

    let nextIndex;
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = currentIndex + 1;
    }

    if (nextIndex >= queue.length) {
      if (repeat === 'all') {
        nextIndex = 0;
      } else {
        pause();
        setPlayerState(prev => ({ ...prev, currentTrack: null, currentIndex: -1 }));
        return;
      }
    }
    
    const nextTrack = queue[nextIndex];
    setPlayerState(prev => ({ ...prev, currentIndex: nextIndex, currentTrack: nextTrack }));
    play(nextTrack);

  }, [playerState, play, pause]);

  const next = useCallback(() => {
    handleNext();
  }, [handleNext]);

  const previous = useCallback(() => {
    const { queue, currentIndex, repeat } = playerState;
    if (queue.length === 0) return;

    if(audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = repeat === 'all' ? queue.length - 1 : -1;
    }
    
    if (prevIndex === -1) {
        if(audioRef.current) audioRef.current.currentTime = 0;
        return;
    }

    const prevTrack = queue[prevIndex];
    setPlayerState(prev => ({ ...prev, currentIndex: prevIndex, currentTrack: prevTrack }));
    play(prevTrack);

  }, [playerState, play]);

  const setQueue = useCallback((tracks: Track[], startIndex = 0) => {
    setPlayerState(prev => ({
      ...prev,
      queue: tracks,
      currentIndex: startIndex,
      currentTrack: tracks[startIndex] || null,
    }));
  }, []);

  const toggleShuffle = useCallback(() => {
    setPlayerState(prev => ({ ...prev, shuffle: !prev.shuffle }));
  }, []);

  const toggleRepeat = useCallback(() => {
    setPlayerState(prev => ({
      ...prev,
      repeat: prev.repeat === 'none' ? 'all' : prev.repeat === 'all' ? 'one' : 'none',
    }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newVolume = Math.max(0, Math.min(1, volume));
    audio.volume = newVolume;
    setPlayerState(prev => ({ ...prev, volume: newVolume }));
  }, []);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio || isNaN(time)) return;
    audio.currentTime = time;
    setPlayerState(prev => ({ ...prev, currentTime: time }));
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (!isNaN(audio.currentTime)) {
        setPlayerState(prev => ({
          ...prev,
          currentTime: audio.currentTime,
        }));
      }
    };
    
    const handleLoadedMetadata = () => {
      if (!isNaN(audio.duration)) {
        setPlayerState(prev => ({
          ...prev,
          duration: audio.duration,
        }));
      }
    };

    const handleEnded = () => {
      if (playerState.repeat === 'one') {
        audio.currentTime = 0;
        play();
      } else {
        handleNext();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', (e) => {
        console.error("Audio Element Error:", e);
        pause();
    });

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', (e) => console.error("Audio Element Error:", e));
    };
  }, [handleNext, playerState.repeat, play, pause]);
  
  // Update queue in player state if initialQueue changes
  useEffect(() => {
    setPlayerState(prev => ({...prev, queue: initialQueue}));
  }, [initialQueue]);

  return {
    playerState,
    play,
    pause,
    togglePlay,
    next,
    previous,
    setQueue,
    toggleShuffle,
    toggleRepeat,
    setVolume,
    seek,
  };
};
