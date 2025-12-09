import { MoreVertical, Play, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useSavedVideos } from '@/hooks/useSavedVideos';

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
  const { isSaved, toggleSave } = useSavedVideos();
  const saved = isSaved(id);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave({ id, title, channelName, channelAvatar, thumbnailUrl, viewCount, publishedAt, duration });
  };

  if (variant === 'compact') {
    return (
      <Link to={`/watch/${id}`} className="flex gap-3 p-2 hover:bg-sp-hover transition-colors rounded-xl group">
        <div className="relative w-40 aspect-video rounded-xl overflow-hidden bg-muted flex-shrink-0 border-t-2 border-primary">
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {duration && (
            <div className="absolute bottom-1 right-1 bg-sp-overlay/90 text-foreground text-xs px-1.5 py-0.5 rounded font-medium">
              {duration}
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-sp-overlay/30">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
              <Play className="w-5 h-5 text-accent-foreground fill-current" />
            </div>
          </div>
        </div>
        
        <div className="flex-1 min-w-0 py-0.5">
          <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
            {title}
          </h3>
          <p className="text-xs text-sp-text-secondary mt-1">
            {channelName}
          </p>
          <p className="text-xs text-sp-text-secondary">
            {viewCount} views • {formattedDate}
          </p>
        </div>

        <button 
          onClick={handleSave}
          className="p-1 self-start -mr-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className={cn("w-5 h-5", saved ? "text-accent fill-current" : "text-sp-icon")} />
        </button>
      </Link>
    );
  }

  if (variant === 'shorts') {
    return (
      <Link to={`/shorts/${id}`} className="block group">
        <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-muted border-t-2 border-primary">
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-sp-overlay/30">
            <div className="w-14 h-14 rounded-full bg-accent animate-pulse-glow flex items-center justify-center">
              <Play className="w-7 h-7 text-accent-foreground fill-current" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-sp-overlay via-sp-overlay/70 to-transparent">
            <p className="text-foreground text-sm font-medium line-clamp-2">{title}</p>
            <p className="text-foreground/80 text-xs mt-1">{viewCount} views</p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/watch/${id}`} className="block animate-fade-in group">
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted border-t-2 border-primary">
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
          loading="lazy"
        />
        {duration && (
          <div className="absolute bottom-2 right-2 bg-sp-overlay/90 text-foreground text-xs px-1.5 py-0.5 rounded font-medium">
            {duration}
          </div>
        )}
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-sp-overlay/30">
          <div className="w-14 h-14 rounded-full bg-accent animate-pulse-glow flex items-center justify-center">
            <Play className="w-7 h-7 text-accent-foreground fill-current" />
          </div>
        </div>
      </div>
      
      <div className="flex gap-3 mt-3 px-1">
        {channelAvatar && (
          <div className="w-9 h-9 rounded-full overflow-hidden bg-muted flex-shrink-0 ring-2 ring-primary/30">
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
          <p className="text-xs text-sp-text-secondary mt-1">
            {channelName}
          </p>
          <p className="text-xs text-sp-text-secondary">
            {viewCount} views • {formattedDate}
          </p>
        </div>

        <div className="flex items-start gap-1 -mr-1">
          <button
            onClick={handleSave}
            className="p-1 hover:bg-sp-hover rounded-full transition-colors"
          >
            <Heart className={cn("w-5 h-5", saved ? "text-accent fill-current" : "text-sp-icon")} />
          </button>
          <button
            onClick={(e) => e.preventDefault()}
            className="p-1 hover:bg-sp-hover rounded-full transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-sp-icon" />
          </button>
        </div>
      </div>
    </Link>
  );
}

export function VideoCardSkeleton({ variant = 'default' }: { variant?: 'default' | 'compact' }) {
  if (variant === 'compact') {
    return (
      <div className="flex gap-3 p-2">
        <div className="w-40 aspect-video rounded-xl skeleton-shimmer flex-shrink-0" />
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
      <div className="aspect-video rounded-2xl skeleton-shimmer" />
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
