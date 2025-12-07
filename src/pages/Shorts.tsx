import { MainLayout } from '@/components/layout/MainLayout';
import { VideoCard } from '@/components/video/VideoCard';

const mockShorts = [
  {
    id: 's1',
    title: 'Mind-blowing magic trick revealed! 🎩✨',
    channelName: 'Magic Master',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=360&h=640&fit=crop',
    viewCount: '5.2M',
    publishedAt: '2024-12-05T10:00:00Z',
  },
  {
    id: 's2',
    title: 'This cat is absolutely hilarious 😂🐱',
    channelName: 'Pet Comedy',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=360&h=640&fit=crop',
    viewCount: '12M',
    publishedAt: '2024-12-04T14:30:00Z',
  },
  {
    id: 's3',
    title: '3 cooking hacks that will change your life',
    channelName: 'Quick Recipes',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=360&h=640&fit=crop',
    viewCount: '890K',
    publishedAt: '2024-12-03T08:00:00Z',
  },
  {
    id: 's4',
    title: 'The most satisfying video ever 🌊',
    channelName: 'Satisfying Things',
    thumbnailUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=360&h=640&fit=crop',
    viewCount: '8.4M',
    publishedAt: '2024-12-02T16:45:00Z',
  },
  {
    id: 's5',
    title: 'Wait for it... 😱 Unexpected ending!',
    channelName: 'Plot Twist',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=360&h=640&fit=crop',
    viewCount: '3.1M',
    publishedAt: '2024-12-01T12:00:00Z',
  },
  {
    id: 's6',
    title: 'Dance tutorial in 30 seconds 💃',
    channelName: 'Dance Quick',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=360&h=640&fit=crop',
    viewCount: '2.7M',
    publishedAt: '2024-11-30T09:30:00Z',
  },
];

export default function Shorts() {
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

        <div className="grid grid-cols-2 gap-2">
          {mockShorts.map((short, index) => (
            <div
              key={short.id}
              style={{ animationDelay: `${index * 50}ms` }}
              className="animate-fade-in"
            >
              <VideoCard {...short} variant="shorts" />
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
