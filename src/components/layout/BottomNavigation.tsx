import { Home, Flame, Users, Library } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Flame, label: 'Shorts', path: '/shorts' },
  { icon: Users, label: 'Subscriptions', path: '/subscriptions' },
  { icon: Library, label: 'Library', path: '/library' },
];

export function BottomNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-nav-background border-t border-nav-border safe-bottom">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors',
                isActive ? 'text-nav-active' : 'text-nav-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    'w-6 h-6 transition-all',
                    isActive ? 'fill-current' : ''
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="text-[10px] font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
