import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
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
}

export function ShortsPlayer({ shorts, initialIndex = 0, onLoadMore, hasMore }: ShortsPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  const navigate = useNavigate();
  const { isSaved, toggleSave } = useSavedVideos();
  const containerRef = useRef<HTMLDivElement>(null);

  const currentShort = shorts[currentIndex];
  const saved = currentShort ? isSaved(currentShort.id) : false;

  // Preload next video
  useEffect(() => {
    if (currentIndex >= shorts.length - 3 && hasMore && onLoadMore) {
      onLoadMore();
    }
  }, [currentIndex, shorts.length, hasMore, onLoadMore]);

  const goToNext = () => {
    if (currentIndex < shorts.length - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    const velocity = info.velocity.y;
    const offset = info.offset.y;

    if (offset < -threshold || velocity < -500) {
      goToNext();
    } else if (offset > threshold || velocity > 500) {
      goToPrev();
    }
  };

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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'Escape') {
        navigate(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, shorts.length]);

  const variants = {
    enter: (direction: number) => ({
      y: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      y: direction > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  if (!currentShort) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 bg-sp-overlay z-50 overflow-hidden touch-none">
      {/* Navigation Hints */}
      <div className="absolute left-1/2 -translate-x-1/2 top-20 z-20 flex flex-col items-center gap-1 opacity-0 animate-fade-in" style={{ animationDelay: '1s' }}>
        {currentIndex > 0 && (
          <button onClick={goToPrev} className="p-2 rounded-full bg-sp-overlay/40 backdrop-blur-sm">
            <ChevronUp className="w-5 h-5 text-foreground" />
          </button>
        )}
      </div>

      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentShort.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            y: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 flex items-center justify-center"
        >
          {/* Video Player */}
          <iframe
            className="w-full h-full max-w-[100vw] max-h-[100vh] pointer-events-auto"
            src={`https://www.youtube.com/embed/${currentShort.id}?autoplay=1&rel=0&playsinline=1&loop=1&playlist=${currentShort.id}&controls=0&mute=0`}
            title="Shorts Player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </motion.div>
      </AnimatePresence>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 p-2 rounded-full bg-sp-overlay/40 hover:bg-sp-overlay/60 transition-colors backdrop-blur-sm z-30"
      >
        <ChevronLeft className="w-6 h-6 text-foreground" />
      </button>

      {/* Counter */}
      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-sp-overlay/40 backdrop-blur-sm z-30">
        <span className="text-xs font-medium text-foreground">
          {currentIndex + 1} / {shorts.length}
        </span>
      </div>

      {/* Right Side Actions */}
      <div className="absolute right-3 bottom-32 flex flex-col items-center gap-5 z-30">
        <button className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-sp-overlay/40 backdrop-blur-sm flex items-center justify-center hover:bg-sp-overlay/60 transition-colors">
            <ThumbsUp className="w-6 h-6 text-foreground" />
          </div>
          <span className="text-foreground text-xs font-medium">Like</span>
        </button>
        
        <button className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-sp-overlay/40 backdrop-blur-sm flex items-center justify-center hover:bg-sp-overlay/60 transition-colors">
            <ThumbsDown className="w-6 h-6 text-foreground" />
          </div>
          <span className="text-foreground text-xs font-medium">Dislike</span>
        </button>
        
        <button className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-sp-overlay/40 backdrop-blur-sm flex items-center justify-center hover:bg-sp-overlay/60 transition-colors">
            <MessageCircle className="w-6 h-6 text-foreground" />
          </div>
          <span className="text-foreground text-xs font-medium">Comment</span>
        </button>
        
        <button onClick={handleSave} className="flex flex-col items-center gap-1">
          <div className={cn(
            "w-12 h-12 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors",
            saved ? "bg-accent/40" : "bg-sp-overlay/40 hover:bg-sp-overlay/60"
          )}>
            <Heart className={cn("w-6 h-6", saved ? "text-accent fill-current" : "text-foreground")} />
          </div>
          <span className={cn("text-xs font-medium", saved ? "text-accent" : "text-foreground")}>
            {saved ? 'Saved' : 'Save'}
          </span>
        </button>
        
        <button className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-sp-overlay/40 backdrop-blur-sm flex items-center justify-center hover:bg-sp-overlay/60 transition-colors">
            <Share2 className="w-6 h-6 text-foreground" />
          </div>
          <span className="text-foreground text-xs font-medium">Share</span>
        </button>
        
        <button className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-sp-overlay/40 backdrop-blur-sm flex items-center justify-center hover:bg-sp-overlay/60 transition-colors">
            <MoreVertical className="w-6 h-6 text-foreground" />
          </div>
        </button>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-8 left-4 right-20 z-30">
        <div className="flex items-center gap-2 mb-2">
          {currentShort.channelAvatar && (
            <img
              src={currentShort.channelAvatar}
              alt={currentShort.channelName}
              className="w-10 h-10 rounded-full ring-2 ring-primary/50"
            />
          )}
          <span className="text-foreground font-medium text-sm">@{currentShort.channelName}</span>
          <button className="ml-2 px-4 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full hover:bg-primary/90 transition-colors">
            Subscribe
          </button>
        </div>
        <p className="text-foreground text-sm line-clamp-2">{currentShort.title}</p>
        <p className="text-foreground/70 text-xs mt-1">{currentShort.viewCount} views</p>
      </div>

      {/* Swipe Indicator */}
      {currentIndex < shorts.length - 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
          <button onClick={goToNext} className="p-2 rounded-full bg-sp-overlay/40 backdrop-blur-sm animate-bounce">
            <ChevronDown className="w-5 h-5 text-foreground" />
          </button>
        </div>
      )}
    </div>
  );
}
