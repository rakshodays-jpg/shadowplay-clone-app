import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CategoryChips } from '@/components/video/CategoryChips';
import { VideoCard, VideoCardSkeleton } from '@/components/video/VideoCard';
import { DisclaimerModal } from '@/components/modals/DisclaimerModal';

// Mock data for demonstration
const mockVideos = [
  {
    id: '1',
    title: 'Building a Modern Web Application with React and TypeScript in 2025',
    channelName: 'Tech Tutorials',
    channelAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=640&h=360&fit=crop',
    viewCount: '1.2M',
    publishedAt: '2024-12-01T10:00:00Z',
    duration: '15:42',
  },
  {
    id: '2',
    title: 'Ultimate Gaming Setup Tour 2025 - The Dream Room',
    channelName: 'GameZone',
    channelAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=640&h=360&fit=crop',
    viewCount: '856K',
    publishedAt: '2024-11-28T14:30:00Z',
    duration: '22:18',
  },
  {
    id: '3',
    title: 'Relaxing Lofi Beats for Studying and Working - 3 Hour Mix',
    channelName: 'Lofi Vibes',
    channelAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=640&h=360&fit=crop',
    viewCount: '2.4M',
    publishedAt: '2024-11-25T08:00:00Z',
    duration: '3:02:45',
  },
  {
    id: '4',
    title: 'Epic Mountain Adventure - 4K Drone Footage from the Alps',
    channelName: 'Nature Explorer',
    channelAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=640&h=360&fit=crop',
    viewCount: '567K',
    publishedAt: '2024-11-20T16:45:00Z',
    duration: '18:33',
  },
  {
    id: '5',
    title: 'Making the Perfect Pasta from Scratch - Italian Grandma Recipe',
    channelName: 'Cooking Masters',
    channelAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=640&h=360&fit=crop',
    viewCount: '1.8M',
    publishedAt: '2024-11-15T12:00:00Z',
    duration: '12:07',
  },
  {
    id: '6',
    title: 'AI Revolution: What the Future Holds for Technology',
    channelName: 'Future Tech',
    channelAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=640&h=360&fit=crop',
    viewCount: '3.2M',
    publishedAt: '2024-11-10T09:30:00Z',
    duration: '28:45',
  },
];

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <MainLayout>
      <DisclaimerModal />
      
      <CategoryChips selected={selectedCategory} onSelect={setSelectedCategory} />

      <div className="px-4 py-4 space-y-6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <VideoCardSkeleton key={i} />)
          : mockVideos.map((video, index) => (
              <div
                key={video.id}
                style={{ animationDelay: `${index * 50}ms` }}
                className="animate-fade-in"
              >
                <VideoCard {...video} />
              </div>
            ))}
      </div>
    </MainLayout>
  );
}
