import { ChevronLeft, ChevronRight, Palette, Bell, Shield, HelpCircle, Info, FileText, Moon, Sun, Monitor } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const settingsGroups = [
  {
    title: 'General',
    items: [
      { icon: Palette, label: 'Appearance', path: '/settings/appearance' },
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

const themeOptions = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'system', icon: Monitor, label: 'System' },
] as const;

export default function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-youtube-divider safe-top">
        <div className="flex items-center h-14 px-4 gap-4">
          <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-youtube-hover transition-colors">
            <ChevronLeft className="w-6 h-6 text-youtube-icon" />
          </Link>
          <h1 className="text-lg font-medium text-foreground">Settings</h1>
        </div>
      </header>

      {/* Appearance Section */}
      <div className="px-4 py-4">
        <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1">Appearance</h2>
        <div className="grid grid-cols-3 gap-2">
          {themeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                theme === option.value
                  ? 'border-primary bg-primary/5'
                  : 'border-transparent bg-muted hover:bg-muted/80'
              )}
            >
              <option.icon
                className={cn(
                  'w-6 h-6',
                  theme === option.value ? 'text-primary' : 'text-muted-foreground'
                )}
              />
              <span
                className={cn(
                  'text-sm font-medium',
                  theme === option.value ? 'text-primary' : 'text-foreground'
                )}
              >
                {option.label}
              </span>
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
          <div className="bg-card">
            {group.items.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center justify-between px-4 py-3.5 hover:bg-youtube-hover transition-colors',
                  index !== group.items.length - 1 && 'border-b border-youtube-divider'
                )}
              >
                <div className="flex items-center gap-4">
                  <item.icon className="w-5 h-5 text-youtube-icon" />
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
