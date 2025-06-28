import { NextApiRequest, NextApiResponse } from 'next';
import { sampleRetrievalResults } from '../../data/search-sample-data';
import { SearchResultItem, SearchResponse } from '../../types/search';
import { PastBroadcast } from '../../types/broadcast';

// Helper function to convert seconds to MM:SS format
function secondsToMMSS(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Function to extract YouTube video ID from URL
function extractYouTubeId(url: string): string {
  const match = url.match(/[?&]v=([^&#]*)/);
  return match ? match[1] : '';
}

// Function to convert SearchResultItem to PastBroadcast for API compatibility
function convertToPastBroadcast(result: SearchResultItem, index: number): PastBroadcast {
  return {
    id: index + 1,
    date: '2019-01-23', // Default date for compatibility - could be enhanced later
    title: result.title,
    excerpt: result.description,
    series: result.series,
    duration: secondsToMMSS(result.playback_time),
    url: result.url,
    youtube_video_id: extractYouTubeId(result.url),
    spotify_episode_id: '',
    playback_time: result.playback_time
  };
}

// Function to call external Lambda search API
async function callSearchLambda(query: string): Promise<SearchResponse> {
  const lambdaUrl = process.env.SEARCH_LAMBDA_URL;
  
  if (!lambdaUrl) {
    throw new Error('SEARCH_LAMBDA_URL environment variable is not set');
  }

  const url = `${lambdaUrl}?q=${encodeURIComponent(query)}`;
  
  // Set up timeout with AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: controller.signal,
  });

  clearTimeout(timeoutId);

  if (!response.ok) {
    throw new Error(`Lambda API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

// Fallback to sample data for compatibility
function getFallbackResults(query?: string): PastBroadcast[] {
  const pastBroadcasts = sampleRetrievalResults.results.map(convertToPastBroadcast);
  
  if (!query || query.trim() === '') {
    return pastBroadcasts;
  }

  // Filter sample data by query
  const searchQuery = query.toLowerCase();
  return pastBroadcasts.filter(broadcast => {
    const titleMatch = broadcast.title.toLowerCase().includes(searchQuery);
    const excerptMatch = broadcast.excerpt.toLowerCase().includes(searchQuery);
    return titleMatch || excerptMatch;
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PastBroadcast[]>
) {
  // Get search parameters from query
  const { query } = req.query;
  
  // Validate query parameter
  if (!query || typeof query !== 'string' || query.trim() === '') {
    return res.status(200).json(getFallbackResults());
  }

  try {
    // Try to call Lambda API
    const lambdaResult = await callSearchLambda(query);
    const broadcasts = lambdaResult.results.map(convertToPastBroadcast);
    
    res.status(200).json(broadcasts);
  } catch (error) {
    // Log error and fallback to sample data
    console.warn('Lambda API call failed, using sample data:', error);
    
    const fallbackResults = getFallbackResults(query);
    res.status(200).json(fallbackResults);
  }
}