import { ReactNode } from 'react';
import { TopBar } from './TopBar';
import { BottomNavigation } from './BottomNavigation';

interface MainLayoutProps {
  children: ReactNode;
  hideTopBar?: boolean;
  hideBottomNav?: boolean;
}

export function MainLayout({ children, hideTopBar, hideBottomNav }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {!hideTopBar && <TopBar />}
      <main className={`${!hideTopBar ? 'pt-14' : ''} ${!hideBottomNav ? 'pb-14' : ''}`}>
        {children}
      </main>
      {!hideBottomNav && <BottomNavigation />}
    </div>
  );
}
