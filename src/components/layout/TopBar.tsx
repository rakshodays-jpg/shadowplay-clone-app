import { useState } from 'react';
import { Search, Mic, ArrowLeft, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export function TopBar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm safe-top border-b border-sp-divider">
      <AnimatePresence mode="wait">
        {isSearchOpen ? (
          <motion.div
            key="search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center h-14 px-2 gap-2"
          >
            <button
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery('');
              }}
              className="p-2 rounded-full hover:bg-sp-hover transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-sp-icon" />
            </button>
            
            <form onSubmit={handleSearch} className="flex-1 flex items-center bg-sp-surface border border-primary/50 rounded-full px-4 py-2 focus-within:border-primary transition-colors">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ShadowPlay"
                autoFocus
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-base"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1"
                >
                  <X className="w-5 h-5 text-sp-icon" />
                </button>
              )}
            </form>
            
            <button className="p-2 rounded-full bg-sp-surface hover:bg-sp-hover transition-colors">
              <Mic className="w-5 h-5 text-accent" />
            </button>
            
            <button
              type="submit"
              onClick={handleSearch}
              className="p-2 rounded-full bg-primary hover:bg-primary/90 transition-colors"
            >
              <Search className="w-5 h-5 text-primary-foreground" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-between h-14 px-4"
          >
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="relative w-9 h-9">
                {/* ShadowPlay Logo - Black circle with glowing play triangle */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sp-surface to-background border border-primary/30 flex items-center justify-center shadow-lg">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                    <path 
                      d="M8 5.5v13l11-6.5L8 5.5z" 
                      fill="url(#playGradient)"
                      className="drop-shadow-lg"
                    />
                    <defs>
                      <linearGradient id="playGradient" x1="8" y1="5.5" x2="19" y2="12">
                        <stop offset="0%" stopColor="hsl(var(--foreground))" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                Shadow<span className="text-primary">Play</span>
              </span>
            </Link>

            {/* Search Bar */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex-1 mx-4 max-w-md flex items-center gap-3 px-4 py-2 bg-sp-surface border border-primary/30 rounded-full hover:border-primary/50 transition-colors"
            >
              <Search className="w-4 h-4 text-sp-icon" />
              <span className="text-sm text-muted-foreground">Search</span>
              <div className="ml-auto">
                <Mic className="w-4 h-4 text-accent" />
              </div>
            </button>

            {/* Profile */}
            <Link
              to="/profile"
              className="p-1.5 rounded-full bg-primary/20 hover:bg-primary/30 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-xs font-semibold text-primary-foreground">S</span>
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
