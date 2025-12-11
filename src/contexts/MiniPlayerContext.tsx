import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface VideoInfo {
  id: string;
  title: string;
  channelName: string;
}

interface MiniPlayerContextType {
  isActive: boolean;
  video: VideoInfo | null;
  startMiniPlayer: (video: VideoInfo) => void;
  closeMiniPlayer: () => void;
  expandMiniPlayer: () => void;
}

const MiniPlayerContext = createContext<MiniPlayerContextType | null>(null);

export function MiniPlayerProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [video, setVideo] = useState<VideoInfo | null>(null);

  const startMiniPlayer = useCallback((videoInfo: VideoInfo) => {
    setVideo(videoInfo);
    setIsActive(true);
  }, []);

  const closeMiniPlayer = useCallback(() => {
    setIsActive(false);
    setVideo(null);
  }, []);

  const expandMiniPlayer = useCallback(() => {
    // This will be handled by navigation in the component
  }, []);

  return (
    <MiniPlayerContext.Provider value={{ isActive, video, startMiniPlayer, closeMiniPlayer, expandMiniPlayer }}>
      {children}
    </MiniPlayerContext.Provider>
  );
}

export function useMiniPlayer() {
  const context = useContext(MiniPlayerContext);
  if (!context) {
    throw new Error('useMiniPlayer must be used within a MiniPlayerProvider');
  }
  return context;
}
