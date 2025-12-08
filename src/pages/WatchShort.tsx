import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ThumbsUp, ThumbsDown, MessageCircle, Share2, MoreVertical } from 'lucide-react';
import { useVideoDetails } from '@/hooks/useYouTube';

export default function WatchShort() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: video, isLoading } = useVideoDetails(id || '');

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
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
          className="absolute top-4 left-4 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors z-10"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        {/* Right Side Actions */}
        <div className="absolute right-3 bottom-20 flex flex-col items-center gap-5 z-10">
          <button className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center">
              <ThumbsUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs font-medium">Like</span>
          </button>
          
          <button className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center">
              <ThumbsDown className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs font-medium">Dislike</span>
          </button>
          
          <button className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs font-medium">Comment</span>
          </button>
          
          <button className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs font-medium">Share</span>
          </button>
          
          <button className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-black/30 flex items-center justify-center">
              <MoreVertical className="w-6 h-6 text-white" />
            </div>
          </button>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-4 left-4 right-20 z-10">
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-4 w-32 bg-white/20 rounded animate-pulse" />
              <div className="h-3 w-48 bg-white/20 rounded animate-pulse" />
            </div>
          ) : video ? (
            <>
              <div className="flex items-center gap-2 mb-2">
                {video.channelAvatar && (
                  <img
                    src={video.channelAvatar}
                    alt={video.channelName}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-white font-medium text-sm">@{video.channelName}</span>
                <button className="ml-2 px-3 py-1 bg-white text-black text-xs font-medium rounded-full">
                  Subscribe
                </button>
              </div>
              <p className="text-white text-sm line-clamp-2">{video.title}</p>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
