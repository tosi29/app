import { NextApiRequest, NextApiResponse } from 'next';
import { sampleRetrievalResults } from '../../data/search-sample-data';
import { RetrievalResult } from '../../types/search';

// Define the PastBroadcast interface for API response compatibility
interface PastBroadcast {
  id: number;
  date: string;
  title: string;
  excerpt: string;
  series: string;
  duration: string;
  url: string;
  youtube_video_id: string;
  spotify_episode_id: string;
}

// Helper function to convert seconds to MM:SS format
function secondsToMMSS(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Function to convert RetrievalResult to PastBroadcast for API compatibility
function convertToPastBroadcast(result: RetrievalResult, index: number): PastBroadcast {
  const metadata = result.metadata;
  return {
    id: parseInt(metadata.episode_id),
    date: '2019-01-23', // Default date for compatibility - could be enhanced later
    title: metadata.title,
    excerpt: result.content.text,
    series: metadata.series_name,
    duration: secondsToMMSS(metadata.duration),
    url: metadata.youtube_video_id ? `https://www.youtube.com/watch?v=${metadata.youtube_video_id}` : '',
    youtube_video_id: metadata.youtube_video_id || '',
    spotify_episode_id: metadata.spotify_episode_id || ''
  };
}

// Convert the new format data to the old format for API compatibility
const pastBroadcasts: PastBroadcast[] = sampleRetrievalResults.map(convertToPastBroadcast);

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