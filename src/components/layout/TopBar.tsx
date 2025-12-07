import { useState } from 'react';
import { Search, Mic, Cast, Bell, User, ArrowLeft, X } from 'lucide-react';
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-background safe-top">
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
              className="p-2 rounded-full hover:bg-youtube-hover transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-youtube-icon" />
            </button>
            
            <form onSubmit={handleSearch} className="flex-1 flex items-center">
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
                  className="p-2"
                >
                  <X className="w-5 h-5 text-youtube-icon" />
                </button>
              )}
            </form>
            
            <button className="p-2 rounded-full hover:bg-youtube-hover transition-colors">
              <Mic className="w-6 h-6 text-youtube-icon" />
            </button>
            
            <button
              type="submit"
              onClick={handleSearch}
              className="p-2 rounded-full hover:bg-youtube-hover transition-colors"
            >
              <Search className="w-6 h-6 text-youtube-icon" />
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
            <Link to="/" className="flex items-center gap-1">
              <div className="relative">
                <svg className="w-8 h-8" viewBox="0 0 90 20" fill="none">
                  <rect width="28" height="20" rx="4" fill="hsl(var(--youtube-red))" />
                  <path d="M11 6L19 10L11 14V6Z" fill="white" />
                </svg>
              </div>
              <span className="text-lg font-semibold tracking-tight text-foreground">
                ShadowPlay
              </span>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-full hover:bg-youtube-hover transition-colors">
                <Cast className="w-6 h-6 text-youtube-icon" />
              </button>
              
              <button className="p-2 rounded-full hover:bg-youtube-hover transition-colors">
                <Bell className="w-6 h-6 text-youtube-icon" />
              </button>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-full hover:bg-youtube-hover transition-colors"
              >
                <Search className="w-6 h-6 text-youtube-icon" />
              </button>

              <Link
                to="/settings"
                className="p-1.5 rounded-full hover:bg-youtube-hover transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
