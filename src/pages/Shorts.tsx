import { MainLayout } from '@/components/layout/MainLayout';
import { useShorts } from '@/hooks/useYouTube';
import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';

export default function Shorts() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useShorts();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const option = { root: null, rootMargin: '100px', threshold: 0 };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  const allShorts = data?.pages.flatMap(page => page) ?? [];

  const handleShortClick = (index: number) => {
    navigate(`/shorts/${allShorts[index].id}`, {
      state: { shorts: allShorts, initialIndex: index }
    });
  };

  return (
    <MainLayout>
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-primary-foreground" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.77 10.32l-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zM10 14.65v-5.3L15 12l-5 2.65z"/>
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-foreground">Shorts</h1>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[9/16] rounded-xl skeleton-shimmer" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {allShorts.map((short, index) => (
              <button
                key={`${short.id}-${index}`}
                onClick={() => handleShortClick(index)}
                style={{ animationDelay: `${(index % 10) * 50}ms` }}
                className="animate-fade-in text-left group"
              >
                <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-muted border-t-2 border-primary">
                  <img
                    src={short.thumbnailUrl}
                    alt={short.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-sp-overlay/30">
                    <div className="w-14 h-14 rounded-full bg-accent animate-pulse-glow flex items-center justify-center">
                      <Play className="w-7 h-7 text-accent-foreground fill-current" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-sp-overlay via-sp-overlay/70 to-transparent">
                    <p className="text-foreground text-sm font-medium line-clamp-2">{short.title}</p>
                    <p className="text-foreground/80 text-xs mt-1">{short.viewCount} views</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
          {isFetchingNextPage && (
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
