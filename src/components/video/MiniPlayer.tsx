import { X, Maximize2, Pause, Play } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMiniPlayer } from '@/contexts/MiniPlayerContext';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function MiniPlayer() {
  const { isActive, video, closeMiniPlayer } = useMiniPlayer();
  const navigate = useNavigate();
  const location = useLocation();
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 16, y: 100 });
  const dragRef = useRef({ startX: 0, startY: 0, startPosX: 0, startPosY: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Hide mini player when on watch page for the same video
  const isOnWatchPage = location.pathname.startsWith('/watch/');
  const currentWatchId = isOnWatchPage ? location.pathname.split('/watch/')[1] : null;
  const shouldHide = !isActive || !video || (isOnWatchPage && currentWatchId === video.id);

  // Reset position when activated
  useEffect(() => {
    if (isActive) {
      setPosition({ x: 16, y: window.innerHeight - 200 });
    }
  }, [isActive]);

  const handleExpand = () => {
    if (video) {
      closeMiniPlayer();
      navigate(`/watch/${video.id}`);
    }
  };

  const togglePlayPause = () => {
    if (iframeRef.current?.contentWindow) {
      const command = isPaused ? 'playVideo' : 'pauseVideo';
      iframeRef.current.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: command,
        args: []
      }), '*');
      setIsPaused(!isPaused);
    }
  };

  // Drag handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    dragRef.current = {
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      startPosX: position.x,
      startPosY: position.y
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - dragRef.current.startX;
    const deltaY = e.touches[0].clientY - dragRef.current.startY;
    
    const maxX = window.innerWidth - 180;
    const maxY = window.innerHeight - 160;
    
    setPosition({
      x: Math.max(0, Math.min(maxX, dragRef.current.startPosX + deltaX)),
      y: Math.max(60, Math.min(maxY, dragRef.current.startPosY + deltaY))
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  if (shouldHide) return null;

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed z-50 rounded-xl overflow-hidden shadow-2xl border border-sp-divider bg-background",
        "transition-shadow duration-200",
        isDragging ? "shadow-primary/30" : "shadow-black/50"
      )}
      style={{
        left: position.x,
        top: position.y,
        width: 180,
        height: 140,
      }}
    >
      {/* Drag Handle */}
      <div
        className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/60 to-transparent z-20 cursor-move"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex items-center justify-center pt-1">
          <div className="w-10 h-1 rounded-full bg-white/40" />
        </div>
      </div>

      {/* Video iframe */}
      <iframe
        ref={iframeRef}
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&playsinline=1&enablejsapi=1&modestbranding=1&iv_load_policy=3&controls=0`}
        title="Mini Player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />

      {/* Controls Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40 opacity-0 hover:opacity-100 transition-opacity z-10 flex flex-col justify-between p-2">
        {/* Top Controls */}
        <div className="flex justify-end gap-1">
          <button
            onClick={handleExpand}
            className="p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          >
            <Maximize2 className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={closeMiniPlayer}
            className="p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Center Play/Pause */}
        <div className="flex justify-center">
          <button
            onClick={togglePlayPause}
            className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          >
            {isPaused ? (
              <Play className="w-5 h-5 text-white fill-white" />
            ) : (
              <Pause className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        {/* Bottom Info */}
        <p className="text-white text-xs line-clamp-1 font-medium">{video.title}</p>
      </div>
    </div>
  );
}
