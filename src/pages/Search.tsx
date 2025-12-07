import { useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { VideoCard, VideoCardSkeleton } from '@/components/video/VideoCard';
import { Search as SearchIcon } from 'lucide-react';

const mockSearchResults = [
  {
    id: 'sr1',
    title: 'Complete React Tutorial for Beginners 2025',
    channelName: 'Programming Hub',
    channelAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=640&h=360&fit=crop',
    viewCount: '2.4M',
    publishedAt: '2024-11-15T10:00:00Z',
    duration: '3:45:22',
  },
  {
    id: 'sr2',
    title: 'Learn TypeScript in One Hour - Full Course',
    channelName: 'Code Academy',
    channelAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&h=360&fit=crop',
    viewCount: '1.8M',
    publishedAt: '2024-10-20T14:30:00Z',
    duration: '1:02:45',
  },
  {
    id: 'sr3',
    title: 'Building Modern UIs with Tailwind CSS',
    channelName: 'Design Dev',
    channelAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=640&h=360&fit=crop',
    viewCount: '890K',
    publishedAt: '2024-09-10T08:00:00Z',
    duration: '28:15',
  },
];

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

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
        {query ? (
          mockSearchResults.map((video, index) => (
            <div
              key={video.id}
              style={{ animationDelay: `${index * 50}ms` }}
              className="animate-fade-in"
            >
              <VideoCard {...video} />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <SearchIcon className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Search ShadowPlay</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Enter a search term to find videos, channels, and playlists
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
