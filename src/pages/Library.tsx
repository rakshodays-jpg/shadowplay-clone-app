import { MainLayout } from '@/components/layout/MainLayout';
import { VideoCard } from '@/components/video/VideoCard';
import { History, Clock, ThumbsUp, Download, PlaySquare, ChevronRight, User } from 'lucide-react';

const libraryItems = [
  { icon: History, label: 'History', count: 156 },
  { icon: PlaySquare, label: 'Your videos', count: 0 },
  { icon: Download, label: 'Downloads', count: 3 },
  { icon: Clock, label: 'Watch later', count: 24 },
  { icon: ThumbsUp, label: 'Liked videos', count: 89 },
];

const recentVideos = [
  {
    id: 'h1',
    title: 'How to Build a Startup in 2025 - Complete Guide',
    channelName: 'Startup Academy',
    thumbnailUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=320&h=180&fit=crop',
    viewCount: '890K',
    publishedAt: '2024-12-01T10:00:00Z',
    duration: '42:18',
  },
  {
    id: 'h2',
    title: 'Best JavaScript Tips and Tricks',
    channelName: 'Code With Me',
    thumbnailUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=320&h=180&fit=crop',
    viewCount: '1.2M',
    publishedAt: '2024-11-28T14:30:00Z',
    duration: '15:44',
  },
  {
    id: 'h3',
    title: 'Minimalist Room Tour 2024',
    channelName: 'Home Design',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=320&h=180&fit=crop',
    viewCount: '567K',
    publishedAt: '2024-11-25T08:00:00Z',
    duration: '10:22',
  },
];

export default function Library() {
  return (
    <MainLayout>
      <div className="py-4">
        {/* Profile Section */}
        <div className="flex items-center gap-4 px-4 pb-4 border-b border-youtube-divider">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
            <User className="w-10 h-10 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-foreground">Guest User</h2>
            <button className="text-sm text-primary font-medium mt-1">Sign in</button>
          </div>
        </div>

        {/* Library Items */}
        <div className="py-2">
          {libraryItems.map((item) => (
            <button
              key={item.label}
              className="flex items-center justify-between w-full px-4 py-3 hover:bg-youtube-hover transition-colors"
            >
              <div className="flex items-center gap-4">
                <item.icon className="w-6 h-6 text-youtube-icon" />
                <span className="text-base text-foreground">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.count > 0 && (
                  <span className="text-sm text-muted-foreground">{item.count}</span>
                )}
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>

        {/* Recent Section */}
        <div className="mt-4 border-t border-youtube-divider">
          <div className="flex items-center justify-between px-4 py-3">
            <h3 className="text-base font-medium text-foreground">Recent</h3>
            <button className="text-sm font-medium text-primary">View all</button>
          </div>
          
          <div className="px-2 space-y-1">
            {recentVideos.map((video, index) => (
              <div
                key={video.id}
                style={{ animationDelay: `${index * 50}ms` }}
                className="animate-fade-in"
              >
                <VideoCard {...video} variant="compact" />
              </div>
            ))}
          </div>
        </div>

        {/* Playlists Section */}
        <div className="mt-4 border-t border-youtube-divider">
          <div className="flex items-center justify-between px-4 py-3">
            <h3 className="text-base font-medium text-foreground">Playlists</h3>
            <button className="text-sm font-medium text-primary">
              Recently added
            </button>
          </div>
          
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No playlists yet
            </p>
            <button className="mt-3 text-sm font-medium text-primary">
              Create playlist
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
