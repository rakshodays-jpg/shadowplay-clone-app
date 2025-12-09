import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ThumbsUp, ThumbsDown, MessageCircle, Share2, MoreVertical, Heart } from 'lucide-react';
import { useVideoDetails } from '@/hooks/useYouTube';
import { useSavedVideos } from '@/hooks/useSavedVideos';
import { cn } from '@/lib/utils';

export default function WatchShort() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: video, isLoading } = useVideoDetails(id || '');
  const { isSaved, toggleSave } = useSavedVideos();
  
  const saved = isSaved(id || '');

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

  return (
    <div className="fixed inset-0 bg-sp-overlay z-50 flex flex-col">
      {/* Video Player - Fullscreen Vertical */}
      <div className="relative flex-1 flex items-center justify-center">
        <iframe
          className="w-full h-full max-w-[100vw] max-h-[100vh]"
          src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&playsinline=1&loop=1&playlist=${id}&controls=0`}
          title="Shorts Player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 rounded-full bg-sp-overlay/40 hover:bg-sp-overlay/60 transition-colors backdrop-blur-sm z-10"
        >
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>

        {/* Right Side Actions */}
        <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5 z-10">
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
        <div className="absolute bottom-4 left-4 right-20 z-10">
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-4 w-32 bg-foreground/20 rounded animate-pulse" />
              <div className="h-3 w-48 bg-foreground/20 rounded animate-pulse" />
            </div>
          ) : video ? (
            <>
              <div className="flex items-center gap-2 mb-2">
                {video.channelAvatar && (
                  <img
                    src={video.channelAvatar}
                    alt={video.channelName}
                    className="w-9 h-9 rounded-full ring-2 ring-primary/50"
                  />
                )}
                <span className="text-foreground font-medium text-sm">@{video.channelName}</span>
                <button className="ml-2 px-4 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full hover:bg-primary/90 transition-colors">
                  Subscribe
                </button>
              </div>
              <p className="text-foreground text-sm line-clamp-2">{video.title}</p>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
