import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
  fetchTrendingVideos,
  searchVideos,
  fetchShorts,
  fetchVideoDetails,
  fetchRelatedVideos,
  fetchPopularChannels,
  fetchChannelVideos,
} from '@/lib/youtube';

export function useTrendingVideos(regionCode: string = 'IN') {
  return useInfiniteQuery({
    queryKey: ['trending', regionCode],
    queryFn: ({ pageParam }) => fetchTrendingVideos(regionCode, 20, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
    initialPageParam: undefined as string | undefined,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSearchVideos(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => searchVideos(query, 25),
    enabled: !!query,
    staleTime: 5 * 60 * 1000,
  });
}

export function useShorts() {
  return useInfiniteQuery({
    queryKey: ['shorts'],
    queryFn: ({ pageParam }) => fetchShorts(20, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPageToken || 'more',
    initialPageParam: undefined as string | undefined,
    staleTime: 2 * 60 * 1000, // Shorter cache for fresh content
  });
}

export function useVideoDetails(videoId: string) {
  return useQuery({
    queryKey: ['video', videoId],
    queryFn: () => fetchVideoDetails(videoId),
    enabled: !!videoId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRelatedVideos(videoId: string) {
  return useQuery({
    queryKey: ['related', videoId],
    queryFn: () => fetchRelatedVideos(videoId, 15),
    enabled: !!videoId,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePopularChannels() {
  return useQuery({
    queryKey: ['popularChannels'],
    queryFn: () => fetchPopularChannels(15),
    staleTime: 10 * 60 * 1000,
  });
}

export function useChannelVideos(channelId: string) {
  return useQuery({
    queryKey: ['channelVideos', channelId],
    queryFn: () => fetchChannelVideos(channelId, 10),
    enabled: !!channelId,
    staleTime: 5 * 60 * 1000,
  });
}
