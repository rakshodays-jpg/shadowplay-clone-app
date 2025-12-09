import { ChevronLeft, ChevronRight, Palette, Bell, Shield, HelpCircle, Info, FileText, Gauge, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme, colorThemes } from '@/contexts/ThemeContext';
import { usePlaybackSettings, playbackSpeeds, sleepTimerOptions } from '@/hooks/usePlaybackSettings';
import { cn } from '@/lib/utils';

const settingsGroups = [
  {
    title: 'General',
    items: [
      { icon: Bell, label: 'Notifications', path: '/settings/notifications' },
      { icon: Shield, label: 'Privacy', path: '/settings/privacy' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: HelpCircle, label: 'Help', path: '/help' },
      { icon: Info, label: 'About', path: '/about' },
      { icon: FileText, label: 'Privacy Policy', path: '/privacy' },
    ],
  },
];

export default function Settings() {
  const { colorTheme, setColorTheme } = useTheme();
  const { speed, setSpeed, sleepTimer, setSleepTimer, timeRemaining } = usePlaybackSettings();

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-sp-divider safe-top">
        <div className="flex items-center h-14 px-4 gap-4">
          <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-sp-hover transition-colors">
            <ChevronLeft className="w-6 h-6 text-sp-icon" />
          </Link>
          <h1 className="text-lg font-semibold text-foreground">Settings</h1>
        </div>
      </header>

      {/* Color Theme Section */}
      <div className="px-4 py-4">
        <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1 flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Color Theme
        </h2>
        <div className="grid grid-cols-6 gap-3">
          {colorThemes.map((theme) => (
            <button
              key={theme.value}
              onClick={() => setColorTheme(theme.value)}
              className={cn(
                'aspect-square rounded-xl flex items-center justify-center transition-all duration-200',
                colorTheme === theme.value 
                  ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110' 
                  : 'hover:scale-105'
              )}
              style={{ backgroundColor: theme.color }}
              title={theme.label}
            >
              {colorTheme === theme.value && (
                <svg className="w-5 h-5 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2 px-1">
          Current: {colorThemes.find(t => t.value === colorTheme)?.label}
        </p>
      </div>

      {/* Playback Speed */}
      <div className="px-4 py-4">
        <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1 flex items-center gap-2">
          <Gauge className="w-4 h-4" />
          Default Playback Speed
        </h2>
        <div className="flex flex-wrap gap-2">
          {playbackSpeeds.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                speed === s
                  ? 'bg-primary text-primary-foreground glow-primary'
                  : 'bg-sp-chip text-sp-chip-text hover:bg-sp-hover'
              )}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Sleep Timer */}
      <div className="px-4 py-4">
        <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Sleep Timer
          {timeRemaining && (
            <span className="ml-auto text-accent text-xs font-semibold">
              {timeRemaining} min remaining
            </span>
          )}
        </h2>
        <div className="flex flex-wrap gap-2">
          {sleepTimerOptions.map((option) => (
            <button
              key={option.label}
              onClick={() => setSleepTimer(option.value)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                sleepTimer === option.value
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-sp-chip text-sp-chip-text hover:bg-sp-hover'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Settings Groups */}
      {settingsGroups.map((group) => (
        <div key={group.title} className="mt-4">
          <h2 className="text-sm font-medium text-muted-foreground px-5 mb-2">
            {group.title}
          </h2>
          <div className="bg-card border-y border-sp-divider">
            {group.items.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center justify-between px-4 py-3.5 hover:bg-sp-hover transition-colors',
                  index !== group.items.length - 1 && 'border-b border-sp-divider'
                )}
              >
                <div className="flex items-center gap-4">
                  <item.icon className="w-5 h-5 text-sp-icon" />
                  <span className="text-base text-foreground">{item.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      ))}

      {/* App Version */}
      <div className="mt-8 pb-8 text-center">
        <p className="text-sm text-muted-foreground">ShadowPlay v1.0.0</p>
        <p className="text-xs text-muted-foreground mt-1">
          Not affiliated with YouTube or Google
        </p>
      </div>
    </div>
  );
}
