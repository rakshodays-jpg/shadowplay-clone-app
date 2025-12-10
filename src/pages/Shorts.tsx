import { useShorts } from '@/hooks/useYouTube';
import { ShortsPlayer } from '@/components/shorts/ShortsPlayer';
import { useMemo } from 'react';

export default function Shorts() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useShorts();

  const allShorts = useMemo(() => 
    data?.pages.flatMap(page => page.items) ?? [], 
    [data]
  );

  if (isLoading && allShorts.length === 0) {
    return (
      <div className="fixed inset-0 bg-sp-overlay z-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-foreground/70 text-sm">Loading Shorts...</p>
        </div>
      </div>
    );
  }

  return (
    <ShortsPlayer
      shorts={allShorts}
      initialIndex={0}
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
