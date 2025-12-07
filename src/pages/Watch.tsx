import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ThumbsUp, ThumbsDown, Share2, MoreHorizontal, Bell } from 'lucide-react';
import { VideoCard, VideoCardSkeleton } from '@/components/video/VideoCard';
import { useState } from 'react';
import { useVideoDetails, useRelatedVideos } from '@/hooks/useYouTube';
import { formatDistanceToNow } from 'date-fns';

export default function Watch() {
  const { id } = useParams<{ id: string }>();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  const { data: video, isLoading: videoLoading } = useVideoDetails(id || '');
  const { data: relatedVideos, isLoading: relatedLoading } = useRelatedVideos(id || '');

  const formattedDate = video?.publishedAt 
    ? formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true })
    : '';

  return (
    <div className="min-h-screen bg-background pb-4">
      {/* Video Player */}
      <div className="relative aspect-video bg-black">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&playsinline=1&enablejsapi=1`}
          title="Video Player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
        
        {/* Back Button Overlay */}
        <Link
          to="/"
          className="absolute top-4 left-4 p-2 rounded-full bg-youtube-overlay/50 hover:bg-youtube-overlay/70 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </Link>
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
            <h1 className="text-lg font-medium text-foreground leading-snug">
              {video.title}
            </h1>
            
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="text-sm text-muted-foreground mt-2"
            >
              {video.viewCount} views • {formattedDate}
              <span className="text-foreground ml-1">
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
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">{video.channelName}</p>
                </div>
              </div>
              
              <button
                onClick={() => setIsSubscribed(!isSubscribed)}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                  isSubscribed
                    ? 'bg-muted text-foreground'
                    : 'bg-primary text-primary-foreground'
                }`}
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
            <button className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
              <ThumbsUp className="w-5 h-5 text-youtube-icon" />
              <span className="text-sm font-medium text-foreground">Like</span>
              <div className="w-px h-5 bg-border mx-1" />
              <ThumbsDown className="w-5 h-5 text-youtube-icon" />
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
              <Share2 className="w-5 h-5 text-youtube-icon" />
              <span className="text-sm font-medium text-foreground">Share</span>
            </button>
            
            <button className="p-2 bg-muted rounded-full">
              <MoreHorizontal className="w-5 h-5 text-youtube-icon" />
            </button>
          </div>
        </>
      ) : null}

      {/* Divider */}
      <div className="h-px bg-youtube-divider mx-4 my-2" />

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
