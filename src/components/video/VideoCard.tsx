import { MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface VideoCardProps {
  id: string;
  title: string;
  channelName: string;
  channelAvatar?: string;
  thumbnailUrl: string;
  viewCount: string;
  publishedAt: string;
  duration?: string;
  variant?: 'default' | 'compact' | 'shorts';
}

export function VideoCard({
  id,
  title,
  channelName,
  channelAvatar,
  thumbnailUrl,
  viewCount,
  publishedAt,
  duration,
  variant = 'default',
}: VideoCardProps) {
  const formattedDate = formatDistanceToNow(new Date(publishedAt), { addSuffix: true });

  if (variant === 'compact') {
    return (
      <Link to={`/watch/${id}`} className="flex gap-2 p-2 hover:bg-youtube-hover transition-colors rounded-lg">
        <div className="relative w-40 aspect-video rounded-lg overflow-hidden bg-muted flex-shrink-0">
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {duration && (
            <div className="absolute bottom-1 right-1 bg-youtube-overlay/80 text-white text-xs px-1 py-0.5 rounded font-medium">
              {duration}
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0 py-0.5">
          <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
            {title}
          </h3>
          <p className="text-xs text-youtube-text-secondary mt-1">
            {channelName}
          </p>
          <p className="text-xs text-youtube-text-secondary">
            {viewCount} views • {formattedDate}
          </p>
        </div>

        <button className="p-1 self-start -mr-1">
          <MoreVertical className="w-5 h-5 text-youtube-icon" />
        </button>
      </Link>
    );
  }

  if (variant === 'shorts') {
    return (
      <Link to={`/shorts/${id}`} className="block">
        <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-muted">
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
            <p className="text-white text-sm font-medium line-clamp-2">{title}</p>
            <p className="text-white/80 text-xs mt-0.5">{viewCount} views</p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/watch/${id}`} className="block animate-fade-in">
      <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
          loading="lazy"
        />
        {duration && (
          <div className="absolute bottom-2 right-2 bg-youtube-overlay/80 text-white text-xs px-1 py-0.5 rounded font-medium">
            {duration}
          </div>
        )}
      </div>
      
      <div className="flex gap-3 mt-3 px-1">
        {channelAvatar && (
          <div className="w-9 h-9 rounded-full overflow-hidden bg-muted flex-shrink-0">
            <img
              src={channelAvatar}
              alt={channelName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
            {title}
          </h3>
          <p className="text-xs text-youtube-text-secondary mt-1">
            {channelName}
          </p>
          <p className="text-xs text-youtube-text-secondary">
            {viewCount} views • {formattedDate}
          </p>
        </div>

        <button
          onClick={(e) => e.preventDefault()}
          className="p-1 self-start -mr-1 hover:bg-youtube-hover rounded-full"
        >
          <MoreVertical className="w-5 h-5 text-youtube-icon" />
        </button>
      </div>
    </Link>
  );
}

export function VideoCardSkeleton({ variant = 'default' }: { variant?: 'default' | 'compact' }) {
  if (variant === 'compact') {
    return (
      <div className="flex gap-2 p-2">
        <div className="w-40 aspect-video rounded-lg skeleton-shimmer flex-shrink-0" />
        <div className="flex-1 py-0.5 space-y-2">
          <div className="h-4 w-full skeleton-shimmer rounded" />
          <div className="h-3 w-24 skeleton-shimmer rounded" />
          <div className="h-3 w-32 skeleton-shimmer rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-pulse">
      <div className="aspect-video rounded-xl skeleton-shimmer" />
      <div className="flex gap-3 mt-3 px-1">
        <div className="w-9 h-9 rounded-full skeleton-shimmer flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-full skeleton-shimmer rounded" />
          <div className="h-3 w-24 skeleton-shimmer rounded" />
          <div className="h-3 w-32 skeleton-shimmer rounded" />
        </div>
      </div>
    </div>
  );
}
