import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CategoryChips } from '@/components/video/CategoryChips';
import { VideoCard, VideoCardSkeleton } from '@/components/video/VideoCard';
import { DisclaimerModal } from '@/components/modals/DisclaimerModal';
import { useTrendingVideos } from '@/hooks/useYouTube';

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { data: videos, isLoading, error } = useTrendingVideos('IN');

  return (
    <MainLayout>
      <DisclaimerModal />
      
      <CategoryChips selected={selectedCategory} onSelect={setSelectedCategory} />

      <div className="px-4 py-4 space-y-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <VideoCardSkeleton key={i} />)
        ) : error ? (
          <div className="text-center py-10 text-muted-foreground">
            <p>Failed to load videos. Please try again.</p>
          </div>
        ) : (
          videos?.map((video, index) => (
            <div
              key={video.id}
              style={{ animationDelay: `${index * 50}ms` }}
              className="animate-fade-in"
            >
              <VideoCard {...video} />
            </div>
          ))
        )}
      </div>
    </MainLayout>
  );
}
