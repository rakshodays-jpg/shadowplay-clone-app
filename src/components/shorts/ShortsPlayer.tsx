import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ThumbsUp, ThumbsDown, MessageCircle, Share2, MoreVertical, Heart, ChevronUp, ChevronDown } from 'lucide-react';
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
  const isDragging = useRef(false);
  const [translateY, setTranslateY] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentShort = shorts[currentIndex];
  const saved = currentShort ? isSaved(currentShort.id) : false;

  // Videos to render (current + 2 before + 2 after for smooth scroll)
  const visibleRange = useMemo(() => {
    const start = Math.max(0, currentIndex - 2);
    const end = Math.min(shorts.length - 1, currentIndex + 2);
    return { start, end };
  }, [currentIndex, shorts.length]);

  // Load more when near end
  useEffect(() => {
    if (currentIndex >= shorts.length - 3 && hasMore && onLoadMore && !isLoading) {
      onLoadMore();
    }
  }, [currentIndex, shorts.length, hasMore, onLoadMore, isLoading]);

  const goToIndex = useCallback((newIndex: number) => {
    if (isAnimating || newIndex < 0 || newIndex >= shorts.length) return;
    
    const direction = newIndex > currentIndex ? -1 : 1;
    setIsAnimating(true);
    setTranslateY(direction * 100);
    
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setTranslateY(0);
      setIsAnimating(false);
    }, 250);
  }, [currentIndex, shorts.length, isAnimating]);

  const goToNext = useCallback(() => {
    if (currentIndex < shorts.length - 1) {
      goToIndex(currentIndex + 1);
    } else if (hasMore && onLoadMore) {
      onLoadMore();
    }
  }, [currentIndex, shorts.length, hasMore, onLoadMore, goToIndex]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      goToIndex(currentIndex - 1);
    }
  }, [currentIndex, goToIndex]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isAnimating) return;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || isAnimating) return;
    const diff = touchStartY.current - e.touches[0].clientY;
    const percent = (diff / window.innerHeight) * 100;
    setTranslateY(Math.max(-50, Math.min(50, -percent)));
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    const threshold = 15; // percent
    if (translateY < -threshold && currentIndex < shorts.length - 1) {
      goToNext();
    } else if (translateY > threshold && currentIndex > 0) {
      goToPrev();
    } else {
      setTranslateY(0);
    }
  };

  // Mouse wheel
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    if (isAnimating) return;
    if (e.deltaY > 30) goToNext();
    else if (e.deltaY < -30) goToPrev();
  }, [goToNext, goToPrev, isAnimating]);

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
      } else if (e.key === 'ArrowDown' || e.key === 'j' || e.key === ' ') {
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
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-background z-50 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'none' }}
    >
      {/* Video Container */}
      <div 
        className="relative w-full h-full"
        style={{ 
          transform: `translateY(${translateY}%)`,
          transition: isAnimating ? 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
        }}
      >
        {/* Render visible videos */}
        {shorts.slice(visibleRange.start, visibleRange.end + 1).map((short, idx) => {
          const actualIndex = visibleRange.start + idx;
          const offset = actualIndex - currentIndex;
          
          return (
            <div
              key={short.id}
              className="absolute inset-0 w-full h-full"
              style={{
                transform: `translateY(${offset * 100}%)`,
                zIndex: actualIndex === currentIndex ? 10 : 5,
                visibility: Math.abs(offset) <= 1 ? 'visible' : 'hidden'
              }}
            >
              {/* Thumbnail as background */}
              <img
                src={short.thumbnailUrl}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Video iframe only for current */}
              {actualIndex === currentIndex && (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${short.id}?autoplay=1&rel=0&playsinline=1&loop=1&playlist=${short.id}&controls=0&mute=0&enablejsapi=1`}
                  title="Shorts Player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 p-2.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors backdrop-blur-sm z-30"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      {/* Navigation Buttons */}
      {currentIndex > 0 && (
        <button 
          onClick={goToPrev}
          className="absolute left-1/2 -translate-x-1/2 top-16 z-30 p-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-colors"
        >
          <ChevronUp className="w-5 h-5 text-white" />
        </button>
      )}

      {/* Progress Counter */}
      <div className="absolute top-4 right-16 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm z-30">
        <span className="text-xs font-medium text-white">
          {currentIndex + 1} / {shorts.length}
        </span>
      </div>

      {/* Right Side Actions */}
      <div className="absolute right-3 bottom-36 flex flex-col items-center gap-5 z-30">
        <button className="flex flex-col items-center gap-1 active:scale-95 transition-transform">
          <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <ThumbsUp className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs font-medium">Like</span>
        </button>
        
        <button className="flex flex-col items-center gap-1 active:scale-95 transition-transform">
          <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <ThumbsDown className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs font-medium">Dislike</span>
        </button>
        
        <button className="flex flex-col items-center gap-1 active:scale-95 transition-transform">
          <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs font-medium">Comment</span>
        </button>
        
        <button onClick={handleSave} className="flex flex-col items-center gap-1 active:scale-95 transition-transform">
          <div className={cn(
            "w-12 h-12 rounded-full backdrop-blur-sm flex items-center justify-center",
            saved ? "bg-accent/70" : "bg-black/50"
          )}>
            <Heart className={cn("w-6 h-6", saved ? "text-accent fill-current" : "text-white")} />
          </div>
          <span className={cn("text-xs font-medium", saved ? "text-accent" : "text-white")}>
            {saved ? 'Saved' : 'Save'}
          </span>
        </button>
        
        <button className="flex flex-col items-center gap-1 active:scale-95 transition-transform">
          <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs font-medium">Share</span>
        </button>
        
        <button className="flex flex-col items-center gap-1 active:scale-95 transition-transform">
          <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <MoreVertical className="w-6 h-6 text-white" />
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
              className="w-10 h-10 rounded-full ring-2 ring-white/30"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-white/20 ring-2 ring-white/30 flex items-center justify-center">
              <span className="text-sm font-bold text-white">
                {currentShort.channelName.charAt(0)}
              </span>
            </div>
          )}
          <span className="text-white font-medium text-sm">@{currentShort.channelName}</span>
          <button className="ml-2 px-4 py-1.5 bg-white text-black text-xs font-semibold rounded-full hover:bg-white/90 transition-colors active:scale-95">
            Subscribe
          </button>
        </div>
        <p className="text-white text-sm line-clamp-2 drop-shadow-lg">{currentShort.title}</p>
        <p className="text-white/70 text-xs mt-1">{currentShort.viewCount} views</p>
      </div>

      {/* Swipe Hint */}
      {currentIndex < shorts.length - 1 && (
        <button 
          onClick={goToNext}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 p-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-colors animate-bounce"
        >
          <ChevronDown className="w-5 h-5 text-white" />
        </button>
      )}

      {/* Loading indicator */}
      {isLoading && currentIndex >= shorts.length - 2 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
