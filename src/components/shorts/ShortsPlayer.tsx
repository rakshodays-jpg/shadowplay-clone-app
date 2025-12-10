import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ThumbsUp, ThumbsDown, MessageCircle, Share2, MoreVertical, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSavedVideos } from '@/hooks/useSavedVideos';
import { cn } from '@/lib/utils';

interface ShortVideo {
  id: string;
  title: string;
  channelName: string;
  channelAvatar?: string;
  thumbnailUrl: string;
  viewCount: string;
  publishedAt: string;
}

interface ShortsPlayerProps {
  shorts: ShortVideo[];
  initialIndex?: number;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
}

export function ShortsPlayer({ shorts, initialIndex = 0, onLoadMore, hasMore, isLoading }: ShortsPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const navigate = useNavigate();
  const { isSaved, toggleSave } = useSavedVideos();
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);
  const isScrolling = useRef(false);

  const currentShort = shorts[currentIndex];
  const saved = currentShort ? isSaved(currentShort.id) : false;

  // Load more when near end
  useEffect(() => {
    if (currentIndex >= shorts.length - 3 && hasMore && onLoadMore && !isLoading) {
      onLoadMore();
    }
  }, [currentIndex, shorts.length, hasMore, onLoadMore, isLoading]);

  const goToNext = useCallback(() => {
    if (isScrolling.current) return;
    if (currentIndex < shorts.length - 1) {
      isScrolling.current = true;
      setCurrentIndex(prev => prev + 1);
      setTimeout(() => { isScrolling.current = false; }, 300);
    } else if (hasMore && onLoadMore) {
      onLoadMore();
    }
  }, [currentIndex, shorts.length, hasMore, onLoadMore]);

  const goToPrev = useCallback(() => {
    if (isScrolling.current) return;
    if (currentIndex > 0) {
      isScrolling.current = true;
      setCurrentIndex(prev => prev - 1);
      setTimeout(() => { isScrolling.current = false; }, 300);
    }
  }, [currentIndex]);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const diff = touchStartY.current - touchEndY.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goToNext(); // Swipe up - next video
      } else {
        goToPrev(); // Swipe down - previous video
      }
    }
  };

  // Mouse wheel for desktop
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 30) {
      goToNext();
    } else if (e.deltaY < -30) {
      goToPrev();
    }
  }, [goToNext, goToPrev]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'Escape') {
        navigate('/');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, navigate]);

  const handleSave = () => {
    if (currentShort) {
      toggleSave({
        id: currentShort.id,
        title: currentShort.title,
        channelName: currentShort.channelName,
        channelAvatar: currentShort.channelAvatar,
        thumbnailUrl: currentShort.thumbnailUrl,
        viewCount: currentShort.viewCount,
        publishedAt: currentShort.publishedAt,
      });
    }
  };

  if (shorts.length === 0 || !currentShort) {
    return (
      <div className="fixed inset-0 bg-sp-overlay z-50 flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-sp-overlay z-50 overflow-hidden touch-none select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Video Container with Snap Scroll Effect */}
      <div 
        className="relative w-full h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateY(0)` }}
      >
        {/* Current Video */}
        <div className="absolute inset-0 flex items-center justify-center">
          <iframe
            key={currentShort.id}
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${currentShort.id}?autoplay=1&rel=0&playsinline=1&loop=1&playlist=${currentShort.id}&controls=0&mute=0&enablejsapi=1`}
            title="Shorts Player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 p-2.5 rounded-full bg-sp-overlay/50 hover:bg-sp-overlay/70 transition-colors backdrop-blur-sm z-30"
      >
        <ChevronLeft className="w-6 h-6 text-foreground" />
      </button>

      {/* Progress Indicator */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 z-30">
        {shorts.slice(Math.max(0, currentIndex - 2), currentIndex + 3).map((_, idx) => {
          const actualIdx = Math.max(0, currentIndex - 2) + idx;
          return (
            <div
              key={actualIdx}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                actualIdx === currentIndex 
                  ? "w-6 bg-primary" 
                  : "w-1.5 bg-foreground/30"
              )}
            />
          );
        })}
      </div>

      {/* Right Side Actions */}
      <div className="absolute right-3 bottom-36 flex flex-col items-center gap-5 z-30">
        <button className="flex flex-col items-center gap-1 active:scale-95 transition-transform">
          <div className="w-12 h-12 rounded-full bg-sp-overlay/50 backdrop-blur-sm flex items-center justify-center hover:bg-sp-overlay/70 transition-colors">
            <ThumbsUp className="w-6 h-6 text-foreground" />
          </div>
          <span className="text-foreground text-xs font-medium">Like</span>
        </button>
        
        <button className="flex flex-col items-center gap-1 active:scale-95 transition-transform">
          <div className="w-12 h-12 rounded-full bg-sp-overlay/50 backdrop-blur-sm flex items-center justify-center hover:bg-sp-overlay/70 transition-colors">
            <ThumbsDown className="w-6 h-6 text-foreground" />
          </div>
          <span className="text-foreground text-xs font-medium">Dislike</span>
        </button>
        
        <button className="flex flex-col items-center gap-1 active:scale-95 transition-transform">
          <div className="w-12 h-12 rounded-full bg-sp-overlay/50 backdrop-blur-sm flex items-center justify-center hover:bg-sp-overlay/70 transition-colors">
            <MessageCircle className="w-6 h-6 text-foreground" />
          </div>
          <span className="text-foreground text-xs font-medium">Comment</span>
        </button>
        
        <button onClick={handleSave} className="flex flex-col items-center gap-1 active:scale-95 transition-transform">
          <div className={cn(
            "w-12 h-12 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors",
            saved ? "bg-accent/50" : "bg-sp-overlay/50 hover:bg-sp-overlay/70"
          )}>
            <Heart className={cn("w-6 h-6", saved ? "text-accent fill-current" : "text-foreground")} />
          </div>
          <span className={cn("text-xs font-medium", saved ? "text-accent" : "text-foreground")}>
            {saved ? 'Saved' : 'Save'}
          </span>
        </button>
        
        <button className="flex flex-col items-center gap-1 active:scale-95 transition-transform">
          <div className="w-12 h-12 rounded-full bg-sp-overlay/50 backdrop-blur-sm flex items-center justify-center hover:bg-sp-overlay/70 transition-colors">
            <Share2 className="w-6 h-6 text-foreground" />
          </div>
          <span className="text-foreground text-xs font-medium">Share</span>
        </button>
        
        <button className="flex flex-col items-center gap-1 active:scale-95 transition-transform">
          <div className="w-12 h-12 rounded-full bg-sp-overlay/50 backdrop-blur-sm flex items-center justify-center hover:bg-sp-overlay/70 transition-colors">
            <MoreVertical className="w-6 h-6 text-foreground" />
          </div>
        </button>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-8 left-4 right-20 z-30">
        <div className="flex items-center gap-2 mb-2">
          {currentShort.channelAvatar ? (
            <img
              src={currentShort.channelAvatar}
              alt={currentShort.channelName}
              className="w-10 h-10 rounded-full ring-2 ring-primary/50"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/30 ring-2 ring-primary/50 flex items-center justify-center">
              <span className="text-sm font-bold text-foreground">
                {currentShort.channelName.charAt(0)}
              </span>
            </div>
          )}
          <span className="text-foreground font-medium text-sm">@{currentShort.channelName}</span>
          <button className="ml-2 px-4 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full hover:bg-primary/90 transition-colors active:scale-95">
            Subscribe
          </button>
        </div>
        <p className="text-foreground text-sm line-clamp-2">{currentShort.title}</p>
        <p className="text-foreground/70 text-xs mt-1">{currentShort.viewCount} views</p>
      </div>

      {/* Swipe Hint Animation */}
      {currentIndex === 0 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="px-3 py-1.5 rounded-full bg-sp-overlay/60 backdrop-blur-sm">
            <span className="text-xs text-foreground/80">Swipe up for next</span>
          </div>
        </div>
      )}

      {/* Loading indicator for more */}
      {isLoading && currentIndex >= shorts.length - 2 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
