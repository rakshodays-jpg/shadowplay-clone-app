import { useState, useEffect, useCallback } from 'react';

interface PlaybackSettings {
  speed: number;
  sleepTimer: number | null; // minutes, null = off
  sleepTimerEndTime: number | null;
}

const STORAGE_KEY = 'shadowplay-playback-settings';

const defaultSettings: PlaybackSettings = {
  speed: 1,
  sleepTimer: null,
  sleepTimerEndTime: null,
};

export const playbackSpeeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
export const sleepTimerOptions = [
  { value: null, label: 'Off' },
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
];

export function usePlaybackSettings() {
  const [settings, setSettings] = useState<PlaybackSettings>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return { ...defaultSettings, ...JSON.parse(stored) };
      } catch (e) {
        console.error('Failed to parse playback settings:', e);
      }
    }
    return defaultSettings;
  });

  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Sleep timer countdown
  useEffect(() => {
    if (!settings.sleepTimerEndTime) {
      setTimeRemaining(null);
      return;
    }

    const interval = setInterval(() => {
      const remaining = settings.sleepTimerEndTime! - Date.now();
      if (remaining <= 0) {
        // Timer ended - could trigger pause here
        setSettings(prev => ({ ...prev, sleepTimer: null, sleepTimerEndTime: null }));
        setTimeRemaining(null);
        // Trigger sleep action
        window.dispatchEvent(new CustomEvent('shadowplay-sleep-timer-end'));
      } else {
        setTimeRemaining(Math.ceil(remaining / 1000 / 60)); // minutes
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [settings.sleepTimerEndTime]);

  const setSpeed = useCallback((speed: number) => {
    setSettings(prev => ({ ...prev, speed }));
  }, []);

  const setSleepTimer = useCallback((minutes: number | null) => {
    const endTime = minutes ? Date.now() + minutes * 60 * 1000 : null;
    setSettings(prev => ({ ...prev, sleepTimer: minutes, sleepTimerEndTime: endTime }));
  }, []);

  const cancelSleepTimer = useCallback(() => {
    setSettings(prev => ({ ...prev, sleepTimer: null, sleepTimerEndTime: null }));
  }, []);

  return {
    speed: settings.speed,
    sleepTimer: settings.sleepTimer,
    timeRemaining,
    setSpeed,
    setSleepTimer,
    cancelSleepTimer,
    playbackSpeeds,
    sleepTimerOptions,
  };
}
