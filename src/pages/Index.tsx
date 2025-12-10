import { useState, useEffect, useRef, useCallback } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CategoryChips } from '@/components/video/CategoryChips';
import { VideoCard, VideoCardSkeleton } from '@/components/video/VideoCard';
import { DisclaimerModal } from '@/components/modals/DisclaimerModal';
import { useTrendingVideos } from '@/hooks/useYouTube';

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useTrendingVideos('IN');
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const option = { root: null, rootMargin: '200px', threshold: 0 };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  const allVideos = data?.pages.flatMap(page => page.items) ?? [];

  return (
    <MainLayout>
      <DisclaimerModal />
      
      <CategoryChips selected={selectedCategory} onSelect={setSelectedCategory} />

      <div className="px-4 py-4 space-y-6">
        {isLoading && allVideos.length === 0 ? (
          Array.from({ length: 6 }).map((_, i) => <VideoCardSkeleton key={i} />)
        ) : error ? (
          <div className="text-center py-10 text-muted-foreground">
            <p>Failed to load videos. Please try again.</p>
          </div>
        ) : (
          <>
            {allVideos.map((video, index) => (
              <div
                key={`${video.id}-${index}`}
                style={{ animationDelay: `${(index % 10) * 50}ms` }}
                className="animate-fade-in"
              >
                <VideoCard {...video} />
              </div>
            ))}
          </>
        )}

        {/* Infinite scroll trigger */}
        <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
          {isFetchingNextPage && (
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
