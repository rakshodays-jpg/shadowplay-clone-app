import { useState, useEffect, useCallback } from 'react';

interface SavedVideo {
  id: string;
  title: string;
  channelName: string;
  channelAvatar?: string;
  thumbnailUrl: string;
  viewCount: string;
  publishedAt: string;
  duration?: string;
  savedAt: number;
}

const STORAGE_KEY = 'shadowplay-saved-videos';

export function useSavedVideos() {
  const [savedVideos, setSavedVideos] = useState<SavedVideo[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSavedVideos(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse saved videos:', e);
      }
    }
  }, []);

  const saveToStorage = useCallback((videos: SavedVideo[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
  }, []);

  const isSaved = useCallback((id: string) => {
    return savedVideos.some(v => v.id === id);
  }, [savedVideos]);

  const toggleSave = useCallback((video: Omit<SavedVideo, 'savedAt'>) => {
    setSavedVideos(prev => {
      const exists = prev.find(v => v.id === video.id);
      let newVideos: SavedVideo[];
      
      if (exists) {
        newVideos = prev.filter(v => v.id !== video.id);
      } else {
        newVideos = [{ ...video, savedAt: Date.now() }, ...prev];
      }
      
      saveToStorage(newVideos);
      return newVideos;
    });
  }, [saveToStorage]);

  const removeSaved = useCallback((id: string) => {
    setSavedVideos(prev => {
      const newVideos = prev.filter(v => v.id !== id);
      saveToStorage(newVideos);
      return newVideos;
    });
  }, [saveToStorage]);

  const clearAll = useCallback(() => {
    setSavedVideos([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    savedVideos,
    isSaved,
    toggleSave,
    removeSaved,
    clearAll,
  };
}
