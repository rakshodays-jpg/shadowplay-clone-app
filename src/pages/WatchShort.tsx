import { useParams } from 'react-router-dom';
import { useShorts } from '@/hooks/useYouTube';
import { ShortsPlayer } from '@/components/shorts/ShortsPlayer';
import { useMemo } from 'react';

export default function WatchShort() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useShorts();

  const allShorts = useMemo(() => 
    data?.pages.flatMap(page => page.items) ?? [], 
    [data]
  );

  // Find the initial index based on the video ID
  const initialIndex = useMemo(() => {
    if (!id) return 0;
    const index = allShorts.findIndex(short => short.id === id);
    return index >= 0 ? index : 0;
  }, [id, allShorts]);

  if (isLoading && allShorts.length === 0) {
    return (
      <div className="fixed inset-0 bg-sp-overlay z-50 flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ShortsPlayer
      shorts={allShorts}
      initialIndex={initialIndex}
      onLoadMore={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      hasMore={hasNextPage}
      isLoading={isFetchingNextPage}
    />
  );
}
