import { ChevronLeft, Trash2, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSavedVideos } from '@/hooks/useSavedVideos';
import { VideoCard } from '@/components/video/VideoCard';

export default function Saved() {
  const { savedVideos, clearAll } = useSavedVideos();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-sp-divider safe-top">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-sp-hover transition-colors">
              <ChevronLeft className="w-6 h-6 text-sp-icon" />
            </Link>
            <h1 className="text-lg font-semibold text-foreground">Saved Videos</h1>
          </div>
          
          {savedVideos.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 rounded-full transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>
      </header>

      {savedVideos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-20 h-20 rounded-full bg-sp-surface flex items-center justify-center mb-4">
            <Heart className="w-10 h-10 text-sp-icon" />
          </div>
          <h2 className="text-lg font-medium text-foreground mb-2">No saved videos</h2>
          <p className="text-sm text-muted-foreground text-center max-w-xs">
            Videos you save will appear here. Tap the heart icon on any video to save it.
          </p>
          <Link
            to="/"
            className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition-colors"
          >
            Explore Videos
          </Link>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            {savedVideos.length} video{savedVideos.length !== 1 ? 's' : ''} saved
          </p>
          
          <div className="grid gap-4">
            {savedVideos.map((video, index) => (
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
      )}
    </div>
  );
}
