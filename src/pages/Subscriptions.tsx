import { MainLayout } from '@/components/layout/MainLayout';
import { VideoCard, VideoCardSkeleton } from '@/components/video/VideoCard';
import { Bell } from 'lucide-react';
import { usePopularChannels, useChannelVideos } from '@/hooks/useYouTube';
import { useState, useEffect } from 'react';
import type { YouTubeVideo } from '@/lib/youtube';

export default function Subscriptions() {
  const { data: channels, isLoading: channelsLoading } = usePopularChannels();
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const { data: channelVideos, isLoading: videosLoading } = useChannelVideos(selectedChannelId || '');
  const [allVideos, setAllVideos] = useState<YouTubeVideo[]>([]);

  useEffect(() => {
    if (channels && channels.length > 0 && !selectedChannelId) {
      setSelectedChannelId(channels[0].id);
    }
  }, [channels, selectedChannelId]);

  useEffect(() => {
    if (channelVideos) {
      setAllVideos(channelVideos);
    }
  }, [channelVideos]);

  return (
    <MainLayout>
      {/* Channel Row */}
      <div className="bg-background border-b border-youtube-divider">
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-base font-medium text-foreground">Popular Channels</h2>
          <button className="text-sm font-medium text-primary">All</button>
        </div>
        
        <div className="flex gap-4 px-4 pb-3 overflow-x-auto hide-scrollbar">
          {channelsLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 min-w-[60px]">
                <div className="w-14 h-14 rounded-full skeleton-shimmer" />
                <div className="h-3 w-12 skeleton-shimmer rounded" />
              </div>
            ))
          ) : (
            channels?.map((channel) => (
              <button
                key={channel.id}
                onClick={() => setSelectedChannelId(channel.id)}
                className="flex flex-col items-center gap-1.5 min-w-[60px]"
              >
                <div className="relative">
                  <div className={`w-14 h-14 rounded-full overflow-hidden ${
                    selectedChannelId === channel.id 
                      ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' 
                      : ''
                  }`}>
                    <img
                      src={channel.avatar}
                      alt={channel.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground truncate max-w-[60px]">
                  {channel.name}
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Videos */}
      <div className="px-4 py-4 space-y-6">
        {videosLoading ? (
          Array.from({ length: 5 }).map((_, i) => <VideoCardSkeleton key={i} />)
        ) : allVideos.length > 0 ? (
          allVideos.map((video, index) => (
            <div
              key={video.id}
              style={{ animationDelay: `${index * 50}ms` }}
              className="animate-fade-in"
            >
              <VideoCard {...video} />
            </div>
          ))
        ) : (
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
      </div>
    </MainLayout>
  );
}
