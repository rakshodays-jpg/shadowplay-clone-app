import { useEffect, useCallback } from 'react';

interface MediaSessionOptions {
  title: string;
  artist: string;
  artwork?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onSeekBackward?: () => void;
  onSeekForward?: () => void;
}

export function useMediaSession(options: MediaSessionOptions | null) {
  const updatePositionState = useCallback((duration: number, position: number) => {
    if ('mediaSession' in navigator && 'setPositionState' in navigator.mediaSession) {
      try {
        navigator.mediaSession.setPositionState({
          duration: Math.max(0, duration),
          playbackRate: 1,
          position: Math.min(Math.max(0, position), duration),
        });
      } catch (e) {
        console.log('Position state update failed:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (!options || !('mediaSession' in navigator)) return;

    const { title, artist, artwork, onPlay, onPause, onSeekBackward, onSeekForward } = options;

    // Set metadata for lock screen / notification
    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist,
      album: 'ShadowPlay',
      artwork: artwork ? [
        { src: artwork, sizes: '96x96', type: 'image/jpeg' },
        { src: artwork, sizes: '128x128', type: 'image/jpeg' },
        { src: artwork, sizes: '192x192', type: 'image/jpeg' },
        { src: artwork, sizes: '256x256', type: 'image/jpeg' },
        { src: artwork, sizes: '384x384', type: 'image/jpeg' },
        { src: artwork, sizes: '512x512', type: 'image/jpeg' },
      ] : [],
    });

    // Set up action handlers
    const handlers: [MediaSessionAction, MediaSessionActionHandler | null][] = [
      ['play', onPlay || null],
      ['pause', onPause || null],
      ['seekbackward', onSeekBackward || null],
      ['seekforward', onSeekForward || null],
    ];

    handlers.forEach(([action, handler]) => {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch (e) {
        console.log(`Action handler ${action} not supported`);
      }
    });

    return () => {
      // Clean up handlers
      handlers.forEach(([action]) => {
        try {
          navigator.mediaSession.setActionHandler(action, null);
        } catch (e) {
          // Ignore cleanup errors
        }
      });
    };
  }, [options]);

  const setPlaybackState = useCallback((state: 'playing' | 'paused' | 'none') => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = state;
    }
  }, []);

  return { setPlaybackState, updatePositionState };
}
