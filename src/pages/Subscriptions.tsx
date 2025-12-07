import { MainLayout } from '@/components/layout/MainLayout';
import { VideoCard } from '@/components/video/VideoCard';
import { Bell, User } from 'lucide-react';

const mockChannels = [
  {
    id: 'c1',
    name: 'Tech Tutorials',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    hasNew: true,
  },
  {
    id: 'c2',
    name: 'GameZone',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    hasNew: true,
  },
  {
    id: 'c3',
    name: 'Lofi Vibes',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    hasNew: false,
  },
  {
    id: 'c4',
    name: 'Nature Explorer',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
    hasNew: true,
  },
  {
    id: 'c5',
    name: 'Cooking Masters',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    hasNew: false,
  },
];

const mockSubscriptionVideos = [
  {
    id: 'sv1',
    title: 'New React 19 Features You Need to Know About',
    channelName: 'Tech Tutorials',
    channelAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&h=360&fit=crop',
    viewCount: '234K',
    publishedAt: '2024-12-06T10:00:00Z',
    duration: '18:22',
  },
  {
    id: 'sv2',
    title: 'The Game Awards 2024 - Full Recap and Highlights',
    channelName: 'GameZone',
    channelAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1493711662062-fa541f7f2b3b?w=640&h=360&fit=crop',
    viewCount: '1.1M',
    publishedAt: '2024-12-05T20:00:00Z',
    duration: '45:33',
  },
  {
    id: 'sv3',
    title: 'Hidden Waterfalls of New Zealand - 8K Documentary',
    channelName: 'Nature Explorer',
    channelAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=640&h=360&fit=crop',
    viewCount: '445K',
    publishedAt: '2024-12-04T14:00:00Z',
    duration: '32:15',
  },
];

export default function Subscriptions() {
  return (
    <MainLayout>
      {/* Channel Row */}
      <div className="bg-background border-b border-youtube-divider">
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-base font-medium text-foreground">Subscriptions</h2>
          <button className="text-sm font-medium text-primary">All</button>
        </div>
        
        <div className="flex gap-4 px-4 pb-3 overflow-x-auto hide-scrollbar">
          {mockChannels.map((channel) => (
            <div key={channel.id} className="flex flex-col items-center gap-1.5 min-w-[60px]">
              <div className="relative">
                <div className={`w-14 h-14 rounded-full overflow-hidden ${channel.hasNew ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}>
                  <img
                    src={channel.avatar}
                    alt={channel.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {channel.hasNew && (
                  <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                    NEW
                  </div>
                )}
              </div>
              <span className="text-xs text-muted-foreground truncate max-w-[60px]">
                {channel.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Videos */}
      <div className="px-4 py-4 space-y-6">
        {mockSubscriptionVideos.map((video, index) => (
          <div
            key={video.id}
            style={{ animationDelay: `${index * 50}ms` }}
            className="animate-fade-in"
          >
            <VideoCard {...video} />
          </div>
        ))}
      </div>

      {/* Empty State (hidden when there are videos) */}
      {mockSubscriptionVideos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
            <Bell className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            Don't miss new videos
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Sign in to see updates from your favorite YouTube channels
          </p>
          <button className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition-colors">
            Sign in
          </button>
        </div>
      )}
    </MainLayout>
  );
}
