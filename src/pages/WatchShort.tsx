import { useParams, useLocation } from 'react-router-dom';
import { useShorts } from '@/hooks/useYouTube';
import { ShortsPlayer } from '@/components/shorts/ShortsPlayer';
import { useMemo } from 'react';

export default function WatchShort() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useShorts();

  const allShorts = useMemo(() => 
    data?.pages.flatMap(page => page) ?? [], 
    [data]
  );

  // Find the initial index based on the video ID
  const initialIndex = useMemo(() => {
    if (!id) return 0;
    const index = allShorts.findIndex(short => short.id === id);
    return index >= 0 ? index : 0;
  }, [id, allShorts]);

  // Get shorts from location state if passed, otherwise use fetched data
  const shortsFromState = location.state?.shorts as typeof allShorts | undefined;
  const initialIndexFromState = location.state?.initialIndex as number | undefined;

  const shorts = shortsFromState || allShorts;
  const startIndex = initialIndexFromState ?? initialIndex;

  if (shorts.length === 0) {
    return (
      <div className="fixed inset-0 bg-sp-overlay z-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ShortsPlayer
      shorts={shorts}
      initialIndex={startIndex}
      onLoadMore={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      hasMore={hasNextPage}
    />
  );
}
