const YOUTUBE_API_KEY = 'AIzaSyCiakiYY-qHq02LX02U3lbXQ27uX-0rWQ8';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideo {
  id: string;
  title: string;
  channelName: string;
  channelId: string;
  channelAvatar?: string;
  thumbnailUrl: string;
  viewCount: string;
  publishedAt: string;
  duration?: string;
  description?: string;
}

export interface YouTubeChannel {
  id: string;
  name: string;
  avatar: string;
  subscriberCount: string;
  description: string;
}

function formatViewCount(count: string): string {
  const num = parseInt(count, 10);
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return count;
}

function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '';
  
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export async function fetchTrendingVideos(regionCode: string = 'IN', maxResults: number = 20): Promise<YouTubeVideo[]> {
  const response = await fetch(
    `${BASE_URL}/videos?part=snippet,contentDetails,statistics&chart=mostPopular&regionCode=${regionCode}&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`
  );
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error('YouTube API Error:', errorData);
    throw new Error(errorData.error?.message || 'Failed to fetch trending videos');
  }
  
  const data = await response.json();
  
  if (!data.items || data.items.length === 0) {
    return [];
  }
  
  const channelIds = [...new Set(data.items.map((item: any) => item.snippet.channelId))];
  const channelAvatars = await fetchChannelAvatars(channelIds as string[]);
  
  return data.items.map((item: any) => ({
    id: item.id,
    title: item.snippet.title,
    channelName: item.snippet.channelTitle,
    channelId: item.snippet.channelId,
    channelAvatar: channelAvatars[item.snippet.channelId] || '',
    thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
    viewCount: formatViewCount(item.statistics?.viewCount || '0'),
    publishedAt: item.snippet.publishedAt,
    duration: formatDuration(item.contentDetails?.duration || ''),
    description: item.snippet.description,
  }));
}

export async function searchVideos(query: string, maxResults: number = 20): Promise<YouTubeVideo[]> {
  const response = await fetch(
    `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`
  );
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error('YouTube API Error:', errorData);
    throw new Error(errorData.error?.message || 'Failed to search videos');
  }
  
  const data = await response.json();
  
  if (!data.items || data.items.length === 0) {
    return [];
  }
  
  const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
  
  const statsResponse = await fetch(
    `${BASE_URL}/videos?part=contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
  );
  
  const statsData = await statsResponse.json();
  const statsMap: Record<string, any> = {};
  statsData.items?.forEach((item: any) => {
    statsMap[item.id] = item;
  });
  
  const channelIds = [...new Set(data.items.map((item: any) => item.snippet.channelId))];
  const channelAvatars = await fetchChannelAvatars(channelIds as string[]);
  
  return data.items.map((item: any) => {
    const stats = statsMap[item.id.videoId];
    return {
      id: item.id.videoId,
      title: item.snippet.title,
      channelName: item.snippet.channelTitle,
      channelId: item.snippet.channelId,
      channelAvatar: channelAvatars[item.snippet.channelId] || '',
      thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
      viewCount: stats ? formatViewCount(stats.statistics?.viewCount || '0') : '0',
      publishedAt: item.snippet.publishedAt,
      duration: stats ? formatDuration(stats.contentDetails?.duration || '') : '',
      description: item.snippet.description,
    };
  });
}

export async function fetchShorts(maxResults: number = 20): Promise<YouTubeVideo[]> {
  const response = await fetch(
    `${BASE_URL}/search?part=snippet&q=%23shorts&type=video&videoDuration=short&maxResults=${maxResults}&regionCode=IN&key=${YOUTUBE_API_KEY}`
  );
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error('YouTube API Error:', errorData);
    throw new Error(errorData.error?.message || 'Failed to fetch shorts');
  }
  
  const data = await response.json();
  
  if (!data.items || data.items.length === 0) {
    return [];
  }
  
  const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
  
  const statsResponse = await fetch(
    `${BASE_URL}/videos?part=statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
  );
  
  const statsData = await statsResponse.json();
  const statsMap: Record<string, any> = {};
  statsData.items?.forEach((item: any) => {
    statsMap[item.id] = item;
  });
  
  return data.items.map((item: any) => {
    const stats = statsMap[item.id.videoId];
    return {
      id: item.id.videoId,
      title: item.snippet.title,
      channelName: item.snippet.channelTitle,
      channelId: item.snippet.channelId,
      thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
      viewCount: stats ? formatViewCount(stats.statistics?.viewCount || '0') : '0',
      publishedAt: item.snippet.publishedAt,
    };
  });
}

export async function fetchVideoDetails(videoId: string): Promise<YouTubeVideo | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!response.ok) throw new Error('Failed to fetch video details');
    
    const data = await response.json();
    if (!data.items || data.items.length === 0) return null;
    
    const item = data.items[0];
    const channelAvatars = await fetchChannelAvatars([item.snippet.channelId]);
    
    return {
      id: item.id,
      title: item.snippet.title,
      channelName: item.snippet.channelTitle,
      channelId: item.snippet.channelId,
      channelAvatar: channelAvatars[item.snippet.channelId] || '',
      thumbnailUrl: item.snippet.thumbnails.high?.url,
      viewCount: formatViewCount(item.statistics.viewCount),
      publishedAt: item.snippet.publishedAt,
      duration: formatDuration(item.contentDetails.duration),
      description: item.snippet.description,
    };
  } catch (error) {
    console.error('Error fetching video details:', error);
    return null;
  }
}

export async function fetchRelatedVideos(videoId: string, maxResults: number = 10): Promise<YouTubeVideo[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/search?part=snippet&relatedToVideoId=${videoId}&type=video&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!response.ok) throw new Error('Failed to fetch related videos');
    
    const data = await response.json();
    const videoIds = data.items.filter((item: any) => item.id?.videoId).map((item: any) => item.id.videoId).join(',');
    
    if (!videoIds) return [];
    
    const statsResponse = await fetch(
      `${BASE_URL}/videos?part=contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    );
    
    const statsData = await statsResponse.json();
    const statsMap: Record<string, any> = {};
    statsData.items.forEach((item: any) => {
      statsMap[item.id] = item;
    });
    
    return data.items
      .filter((item: any) => item.id?.videoId)
      .map((item: any) => {
        const stats = statsMap[item.id.videoId];
        return {
          id: item.id.videoId,
          title: item.snippet.title,
          channelName: item.snippet.channelTitle,
          channelId: item.snippet.channelId,
          thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
          viewCount: stats ? formatViewCount(stats.statistics.viewCount) : '0',
          publishedAt: item.snippet.publishedAt,
          duration: stats ? formatDuration(stats.contentDetails.duration) : '',
        };
      });
  } catch (error) {
    console.error('Error fetching related videos:', error);
    return [];
  }
}

export async function fetchPopularChannels(maxResults: number = 10): Promise<YouTubeChannel[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/search?part=snippet&type=channel&q=popular&regionCode=IN&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!response.ok) throw new Error('Failed to fetch channels');
    
    const data = await response.json();
    const channelIds = data.items.map((item: any) => item.snippet.channelId).join(',');
    
    const detailsResponse = await fetch(
      `${BASE_URL}/channels?part=snippet,statistics&id=${channelIds}&key=${YOUTUBE_API_KEY}`
    );
    
    const detailsData = await detailsResponse.json();
    
    return detailsData.items.map((item: any) => ({
      id: item.id,
      name: item.snippet.title,
      avatar: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      subscriberCount: formatViewCount(item.statistics.subscriberCount),
      description: item.snippet.description,
    }));
  } catch (error) {
    console.error('Error fetching channels:', error);
    return [];
  }
}

export async function fetchChannelVideos(channelId: string, maxResults: number = 10): Promise<YouTubeVideo[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!response.ok) throw new Error('Failed to fetch channel videos');
    
    const data = await response.json();
    const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
    
    const statsResponse = await fetch(
      `${BASE_URL}/videos?part=contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    );
    
    const statsData = await statsResponse.json();
    const statsMap: Record<string, any> = {};
    statsData.items.forEach((item: any) => {
      statsMap[item.id] = item;
    });
    
    const channelAvatars = await fetchChannelAvatars([channelId]);
    
    return data.items.map((item: any) => {
      const stats = statsMap[item.id.videoId];
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        channelName: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        channelAvatar: channelAvatars[channelId] || '',
        thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
        viewCount: stats ? formatViewCount(stats.statistics.viewCount) : '0',
        publishedAt: item.snippet.publishedAt,
        duration: stats ? formatDuration(stats.contentDetails.duration) : '',
      };
    });
  } catch (error) {
    console.error('Error fetching channel videos:', error);
    return [];
  }
}

async function fetchChannelAvatars(channelIds: string[]): Promise<Record<string, string>> {
  try {
    if (channelIds.length === 0) return {};
    
    const response = await fetch(
      `${BASE_URL}/channels?part=snippet&id=${channelIds.join(',')}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!response.ok) return {};
    
    const data = await response.json();
    const avatars: Record<string, string> = {};
    
    data.items.forEach((item: any) => {
      avatars[item.id] = item.snippet.thumbnails.default?.url || '';
    });
    
    return avatars;
  } catch {
    return {};
  }
}
