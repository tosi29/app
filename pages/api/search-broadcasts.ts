import { NextApiRequest, NextApiResponse } from 'next';
import { sampleRetrievalResults } from '../../data/search-sample-data';
import { SearchResultItem } from '../../types/search';
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

// Convert the new format data to the old format for API compatibility
const pastBroadcasts: PastBroadcast[] = sampleRetrievalResults.results.map(convertToPastBroadcast);

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<PastBroadcast[]>
) {
  // Get search parameters from query
  const { query } = req.query;
  
  // Filter broadcasts based on search criteria
  let filteredBroadcasts = [...pastBroadcasts];
  
  // Filter by query (search in title and excerpt)
  if (query && typeof query === 'string' && query.trim() !== '') {
    const searchQuery = query.toLowerCase();
    filteredBroadcasts = filteredBroadcasts.filter(broadcast => {
      const titleMatch = broadcast.title.toLowerCase().includes(searchQuery);
      const excerptMatch = broadcast.excerpt.toLowerCase().includes(searchQuery);
      
      return titleMatch || excerptMatch;
    });
  }
  
  // Return filtered broadcasts
  res.status(200).json(filteredBroadcasts);
}