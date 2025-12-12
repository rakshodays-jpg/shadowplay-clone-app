import { useEffect, useRef } from 'react';

interface BackgroundAudioPlayerProps {
  videoId: string | null;
  isPlaying: boolean;
}

// This component creates a hidden audio element to maintain background playback
// The audio element keeps the browser's audio session alive when minimized
export function BackgroundAudioPlayer({ videoId, isPlaying }: BackgroundAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create a silent audio context to keep audio session alive
    if (!audioRef.current) {
      audioRef.current = new Audio();
      // Use a data URL for a tiny silent audio file
      audioRef.current.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
      audioRef.current.loop = true;
      audioRef.current.volume = 0.01; // Nearly silent
    }

    const audio = audioRef.current;

    if (videoId && isPlaying) {
      // Play silent audio to maintain audio session
      audio.play().catch(() => {
        // Autoplay may be blocked, that's okay
      });
    } else {
      audio.pause();
    }

    return () => {
      audio.pause();
    };
  }, [videoId, isPlaying]);

  return null;
}
