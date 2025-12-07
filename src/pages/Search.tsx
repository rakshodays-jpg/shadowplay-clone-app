import { useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { VideoCard, VideoCardSkeleton } from '@/components/video/VideoCard';
import { Search as SearchIcon } from 'lucide-react';
import { useSearchVideos } from '@/hooks/useYouTube';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { data: videos, isLoading } = useSearchVideos(query);

  return (
    <MainLayout>
      {/* Search Results Header */}
      <div className="px-4 py-3 border-b border-youtube-divider">
        <div className="flex items-center gap-2 text-muted-foreground">
          <SearchIcon className="w-4 h-4" />
          <span className="text-sm">
            Results for "<span className="text-foreground font-medium">{query}</span>"
          </span>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto hide-scrollbar border-b border-youtube-divider">
        {['All', 'Videos', 'Channels', 'Playlists', 'Live'].map((filter, i) => (
          <button
            key={filter}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              i === 0
                ? 'bg-youtube-chip-active text-youtube-chip-active-text'
                : 'bg-youtube-chip text-youtube-chip-text hover:bg-youtube-hover'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="px-4 py-4 space-y-6">
        {!query ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <SearchIcon className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Search ShadowPlay</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Enter a search term to find videos, channels, and playlists
            </p>
          </div>
        ) : isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <VideoCardSkeleton key={i} />)
        ) : videos && videos.length > 0 ? (
          videos.map((video, index) => (
            <div
              key={video.id}
              style={{ animationDelay: `${index * 50}ms` }}
              className="animate-fade-in"
            >
              <VideoCard {...video} />
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            <p>No results found for "{query}"</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
