import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ThumbsUp, ThumbsDown, Share2, MoreHorizontal, Bell, Heart, Gauge, Clock, PictureInPicture2, Maximize } from 'lucide-react';
import { VideoCard, VideoCardSkeleton } from '@/components/video/VideoCard';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useVideoDetails, useRelatedVideos } from '@/hooks/useYouTube';
import { usePlaybackSettings, playbackSpeeds, sleepTimerOptions } from '@/hooks/usePlaybackSettings';
import { useSavedVideos } from '@/hooks/useSavedVideos';
import { useMiniPlayer } from '@/contexts/MiniPlayerContext';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export default function Watch() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showSleepMenu, setShowSleepMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  
  const { data: video, isLoading: videoLoading } = useVideoDetails(id || '');
  const { data: relatedVideos, isLoading: relatedLoading } = useRelatedVideos(id || '');
  const { speed, setSpeed, sleepTimer, setSleepTimer, timeRemaining } = usePlaybackSettings();
  const { isSaved, toggleSave } = useSavedVideos();
  const { startMiniPlayer, closeMiniPlayer } = useMiniPlayer();

  const formattedDate = video?.publishedAt 
    ? formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true })
    : '';

  const saved = video ? isSaved(id || '') : false;

  // Apply playback speed to iframe
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      // YouTube iframe API for playback rate
      iframeRef.current.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'setPlaybackRate',
        args: [speed]
      }), '*');
    }
  }, [speed]);

  // Listen for sleep timer end
  useEffect(() => {
    const handleSleepEnd = () => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(JSON.stringify({
          event: 'command',
          func: 'pauseVideo',
          args: []
        }), '*');
      }
    };

    window.addEventListener('shadowplay-sleep-timer-end', handleSleepEnd);
    return () => window.removeEventListener('shadowplay-sleep-timer-end', handleSleepEnd);
  }, []);

  // Fullscreen change handler
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);
      
      // Unlock orientation when exiting fullscreen
      if (!isNowFullscreen) {
        try {
          if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
          }
        } catch (error) {
          // Ignore
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Lock to landscape orientation
  const lockLandscape = useCallback(async () => {
    try {
      if (screen.orientation && (screen.orientation as any).lock) {
        await (screen.orientation as any).lock('landscape');
      }
    } catch (error) {
      // Orientation lock not supported or failed
      console.log('Orientation lock not supported');
    }
  }, []);

  // Unlock orientation
  const unlockOrientation = useCallback(() => {
    try {
      if (screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock();
      }
    } catch (error) {
      console.log('Orientation unlock not supported');
    }
  }, []);

  // Toggle fullscreen with landscape orientation
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        const element = playerContainerRef.current;
        if (element) {
          if (element.requestFullscreen) {
            await element.requestFullscreen();
          } else if ((element as any).webkitRequestFullscreen) {
            await (element as any).webkitRequestFullscreen();
          } else if ((element as any).msRequestFullscreen) {
            await (element as any).msRequestFullscreen();
          }
          // Lock to landscape after entering fullscreen
          await lockLandscape();
        }
      } else {
        // Unlock orientation before exiting fullscreen
        unlockOrientation();
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  }, [lockLandscape, unlockOrientation]);

  const handleSave = () => {
    if (video) {
      toggleSave({
        id: id || '',
        title: video.title,
        channelName: video.channelName,
        channelAvatar: video.channelAvatar,
        thumbnailUrl: video.thumbnailUrl,
        viewCount: video.viewCount,
        publishedAt: video.publishedAt,
      });
    }
  };

  const handlePiP = () => {
    if (video && id) {
      startMiniPlayer({
        id,
        title: video.title,
        channelName: video.channelName,
      });
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-4">
      {/* Video Player */}
      <div 
        ref={playerContainerRef}
        className={cn(
          "relative bg-black",
          isFullscreen 
            ? "fixed inset-0 w-screen h-screen z-50 flex items-center justify-center" 
            : "aspect-video"
        )}
      >
        <iframe
          ref={iframeRef}
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&playsinline=1&enablejsapi=1&modestbranding=1&iv_load_policy=3&loop=1&playlist=${id}&controls=1`}
          title="Video Player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
        />
        
        {/* Back Button Overlay */}
        <Link
          to="/"
          className={cn(
            "absolute top-4 left-4 p-2 rounded-full bg-sp-overlay/50 hover:bg-sp-overlay/70 transition-colors backdrop-blur-sm",
            isFullscreen && "hidden"
          )}
        >
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </Link>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="absolute bottom-4 right-4 p-2 rounded-full bg-sp-overlay/50 hover:bg-sp-overlay/70 transition-colors backdrop-blur-sm"
        >
          <Maximize className="w-5 h-5 text-foreground" />
        </button>

        {/* Speed & Sleep Timer Indicator */}
        <div className={cn(
          "absolute top-4 right-4 flex items-center gap-2",
          isFullscreen && "top-6 right-6"
        )}>
          {speed !== 1 && (
            <div className="px-2 py-1 rounded-full bg-primary/80 backdrop-blur-sm text-xs font-medium text-primary-foreground">
              {speed}x
            </div>
          )}
          {timeRemaining && (
            <div className="px-2 py-1 rounded-full bg-accent/80 backdrop-blur-sm text-xs font-medium text-accent-foreground">
              <Clock className="w-3 h-3 inline mr-1" />
              {timeRemaining}m
            </div>
          )}
        </div>

        {/* Exit Fullscreen Hint */}
        {isFullscreen && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-sp-overlay/70 backdrop-blur-sm text-sm text-foreground animate-fade-in">
            Press ESC or tap to exit
          </div>
        )}
      </div>

      {videoLoading ? (
        <div className="px-4 py-3 space-y-3">
          <div className="h-6 w-full skeleton-shimmer rounded" />
          <div className="h-4 w-40 skeleton-shimmer rounded" />
        </div>
      ) : video ? (
        <>
          {/* Video Info */}
          <div className="px-4 py-3">
            <h1 className="text-lg font-semibold text-foreground leading-snug">
              {video.title}
            </h1>
            
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="text-sm text-muted-foreground mt-2"
            >
              {video.viewCount} views • {formattedDate}
              <span className="text-primary ml-1 font-medium">
                {isDescriptionExpanded ? '...less' : '...more'}
              </span>
            </button>

            {isDescriptionExpanded && (
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed animate-fade-in whitespace-pre-wrap">
                {video.description}
              </p>
            )}
          </div>

          {/* Channel & Actions */}
          <div className="px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {video.channelAvatar && (
                  <img
                    src={video.channelAvatar}
                    alt={video.channelName}
                    className="w-10 h-10 rounded-full ring-2 ring-primary/30"
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">{video.channelName}</p>
                </div>
              </div>
              
              <button
                onClick={() => setIsSubscribed(!isSubscribed)}
                className={cn(
                  'px-4 py-2 rounded-full font-medium text-sm transition-all',
                  isSubscribed
                    ? 'bg-sp-chip text-foreground'
                    : 'bg-primary text-primary-foreground glow-primary'
                )}
              >
                {isSubscribed ? (
                  <span className="flex items-center gap-1">
                    <Bell className="w-4 h-4" /> Subscribed
                  </span>
                ) : (
                  'Subscribe'
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 px-4 py-3 overflow-x-auto hide-scrollbar">
            <button className="flex items-center gap-2 px-4 py-2 bg-sp-chip rounded-full hover:bg-sp-hover transition-colors">
              <ThumbsUp className="w-5 h-5 text-sp-icon" />
              <span className="text-sm font-medium text-foreground">Like</span>
              <div className="w-px h-5 bg-border mx-1" />
              <ThumbsDown className="w-5 h-5 text-sp-icon" />
            </button>
            
            <button 
              onClick={handleSave}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
                saved ? "bg-accent/20 text-accent" : "bg-sp-chip hover:bg-sp-hover"
              )}
            >
              <Heart className={cn("w-5 h-5", saved ? "fill-current" : "text-sp-icon")} />
              <span className="text-sm font-medium">{saved ? 'Saved' : 'Save'}</span>
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-sp-chip rounded-full hover:bg-sp-hover transition-colors">
              <Share2 className="w-5 h-5 text-sp-icon" />
              <span className="text-sm font-medium text-foreground">Share</span>
            </button>

            {/* Picture-in-Picture */}
            <button 
              onClick={handlePiP}
              className="flex items-center gap-2 px-4 py-2 bg-sp-chip rounded-full hover:bg-sp-hover transition-colors"
            >
              <PictureInPicture2 className="w-5 h-5 text-sp-icon" />
              <span className="text-sm font-medium text-foreground">PiP</span>
            </button>

            {/* Playback Speed */}
            <div className="relative">
              <button 
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-sp-chip rounded-full hover:bg-sp-hover transition-colors"
              >
                <Gauge className="w-5 h-5 text-sp-icon" />
                <span className="text-sm font-medium text-foreground">{speed}x</span>
              </button>
              
              {showSpeedMenu && (
                <div className="absolute bottom-12 left-0 bg-card border border-sp-divider rounded-xl shadow-lg p-2 min-w-[120px] animate-scale-in z-50">
                  {playbackSpeeds.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setSpeed(s); setShowSpeedMenu(false); }}
                      className={cn(
                        "w-full px-3 py-2 text-sm rounded-lg text-left transition-colors",
                        speed === s ? "bg-primary text-primary-foreground" : "hover:bg-sp-hover"
                      )}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sleep Timer */}
            <div className="relative">
              <button 
                onClick={() => setShowSleepMenu(!showSleepMenu)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
                  sleepTimer ? "bg-accent/20 text-accent" : "bg-sp-chip hover:bg-sp-hover"
                )}
              >
                <Clock className={cn("w-5 h-5", sleepTimer ? "" : "text-sp-icon")} />
                <span className="text-sm font-medium">
                  {timeRemaining ? `${timeRemaining}m` : 'Sleep'}
                </span>
              </button>
              
              {showSleepMenu && (
                <div className="absolute bottom-12 right-0 bg-card border border-sp-divider rounded-xl shadow-lg p-2 min-w-[140px] animate-scale-in z-50">
                  {sleepTimerOptions.map((option) => (
                    <button
                      key={option.label}
                      onClick={() => { setSleepTimer(option.value); setShowSleepMenu(false); }}
                      className={cn(
                        "w-full px-3 py-2 text-sm rounded-lg text-left transition-colors",
                        sleepTimer === option.value ? "bg-accent text-accent-foreground" : "hover:bg-sp-hover"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button className="p-2 bg-sp-chip rounded-full hover:bg-sp-hover transition-colors">
              <MoreHorizontal className="w-5 h-5 text-sp-icon" />
            </button>
          </div>
        </>
      ) : null}

      {/* Divider */}
      <div className="h-px bg-sp-divider mx-4 my-2" />

      {/* Related Videos */}
      <div className="px-2 space-y-1">
        {relatedLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <VideoCardSkeleton key={i} variant="compact" />
          ))
        ) : (
          relatedVideos?.map((video, index) => (
            <div
              key={video.id}
              style={{ animationDelay: `${index * 50}ms` }}
              className="animate-fade-in"
            >
              <VideoCard {...video} variant="compact" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
