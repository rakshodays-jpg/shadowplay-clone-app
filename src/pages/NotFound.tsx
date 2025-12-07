import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
      <div className="w-24 h-24 mb-6">
        <svg viewBox="0 0 90 64" fill="none" className="w-full h-full opacity-50">
          <rect x="31" y="22" width="28" height="20" rx="4" fill="hsl(var(--youtube-red))" />
          <path d="M42 28L50 32L42 36V28Z" fill="white" />
          <circle cx="24" cy="32" r="8" stroke="currentColor" strokeWidth="2" className="text-muted-foreground" />
          <circle cx="66" cy="32" r="8" stroke="currentColor" strokeWidth="2" className="text-muted-foreground" />
          <path d="M32 32H58" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-muted-foreground" />
        </svg>
      </div>
      
      <h1 className="text-6xl font-bold text-foreground mb-2">404</h1>
      <p className="text-xl text-muted-foreground mb-8">This page isn't available</p>
      
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition-colors"
      >
        <Home className="w-5 h-5" />
        Go to Home
      </Link>
    </div>
  );
}
