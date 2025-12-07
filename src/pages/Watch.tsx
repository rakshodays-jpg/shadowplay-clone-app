import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ThumbsUp, ThumbsDown, Share2, Download, MoreHorizontal, Bell } from 'lucide-react';
import { VideoCard } from '@/components/video/VideoCard';
import { useState } from 'react';

const mockVideo = {
  id: '1',
  title: 'Building a Modern Web Application with React and TypeScript in 2025 - Complete Tutorial',
  channelName: 'Tech Tutorials',
  channelAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
  subscribers: '2.4M',
  viewCount: '1.2M views',
  publishedAt: '2 weeks ago',
  description: 'In this comprehensive tutorial, we build a modern web application using React and TypeScript. Perfect for beginners and intermediate developers looking to level up their skills.',
  likes: '45K',
};

const relatedVideos = [
  {
    id: 'r1',
    title: 'Advanced React Patterns Every Developer Should Know',
    channelName: 'Code Masters',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=320&h=180&fit=crop',
    viewCount: '567K',
    publishedAt: '2024-11-20T10:00:00Z',
    duration: '24:15',
  },
  {
    id: 'r2',
    title: 'TypeScript Tips and Tricks for 2025',
    channelName: 'Dev Tips',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=320&h=180&fit=crop',
    viewCount: '234K',
    publishedAt: '2024-11-18T14:30:00Z',
    duration: '18:42',
  },
  {
    id: 'r3',
    title: 'Build a Full Stack App in 1 Hour',
    channelName: 'Quick Tutorials',
    thumbnailUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=320&h=180&fit=crop',
    viewCount: '1.1M',
    publishedAt: '2024-11-15T08:00:00Z',
    duration: '58:33',
  },
];

export default function Watch() {
  const { id } = useParams();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-4">
      {/* Video Player */}
      <div className="relative aspect-video bg-black">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&rel=0`}
          title="Video Player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
        
        {/* Back Button Overlay */}
        <Link
          to="/"
          className="absolute top-4 left-4 p-2 rounded-full bg-youtube-overlay/50 hover:bg-youtube-overlay/70 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </Link>
      </div>

      {/* Video Info */}
      <div className="px-4 py-3">
        <h1 className="text-lg font-medium text-foreground leading-snug">
          {mockVideo.title}
        </h1>
        
        <button
          onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
          className="text-sm text-muted-foreground mt-2"
        >
          {mockVideo.viewCount} • {mockVideo.publishedAt}
          <span className="text-foreground ml-1">
            {isDescriptionExpanded ? '...less' : '...more'}
          </span>
        </button>

        {isDescriptionExpanded && (
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed animate-fade-in">
            {mockVideo.description}
          </p>
        )}
      </div>

      {/* Channel & Actions */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={mockVideo.channelAvatar}
              alt={mockVideo.channelName}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-sm font-medium text-foreground">{mockVideo.channelName}</p>
              <p className="text-xs text-muted-foreground">{mockVideo.subscribers} subscribers</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsSubscribed(!isSubscribed)}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
              isSubscribed
                ? 'bg-muted text-foreground'
                : 'bg-primary text-primary-foreground'
            }`}
          >
            {isSubscribed ? (
              <span className="flex items-center gap-1">
                <Bell className="w-4 h-4" /> Subscribed
              </span>
            ) : (
              'Subscribe'
            )}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto hide-scrollbar">
        <button className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
          <ThumbsUp className="w-5 h-5 text-youtube-icon" />
          <span className="text-sm font-medium text-foreground">{mockVideo.likes}</span>
          <div className="w-px h-5 bg-border mx-1" />
          <ThumbsDown className="w-5 h-5 text-youtube-icon" />
        </button>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
          <Share2 className="w-5 h-5 text-youtube-icon" />
          <span className="text-sm font-medium text-foreground">Share</span>
        </button>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
          <Download className="w-5 h-5 text-youtube-icon" />
          <span className="text-sm font-medium text-foreground">Remix</span>
        </button>
        
        <button className="p-2 bg-muted rounded-full">
          <MoreHorizontal className="w-5 h-5 text-youtube-icon" />
        </button>
      </div>

      {/* Divider */}
      <div className="h-px bg-youtube-divider mx-4 my-2" />

      {/* Related Videos */}
      <div className="px-2 space-y-1">
        {relatedVideos.map((video, index) => (
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
  );
}
