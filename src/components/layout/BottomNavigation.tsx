import { Home, Zap, Bookmark, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Zap, label: 'Shorts', path: '/shorts' },
  { icon: Bookmark, label: 'Saved', path: '/saved' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export function BottomNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-sp-divider safe-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-1 w-full h-full transition-all duration-200',
                isActive ? 'text-nav-active' : 'text-nav-foreground hover:text-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cn(
                  'p-1.5 rounded-xl transition-all duration-200',
                  isActive ? 'bg-primary/20' : ''
                )}>
                  <item.icon
                    className={cn(
                      'w-6 h-6 transition-all',
                      isActive ? 'text-accent' : ''
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                    fill={isActive ? 'currentColor' : 'none'}
                  />
                </div>
                <span className={cn(
                  'text-[10px] font-medium',
                  isActive ? 'text-accent' : ''
                )}>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
