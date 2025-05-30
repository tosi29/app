import { NextApiRequest, NextApiResponse } from 'next';
import { PastBroadcast, pastBroadcasts } from '../../lib/broadcastData';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<PastBroadcast[]>
) {
  // Get search parameters from query
  const { query, series } = req.query;
  
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
  
  // Filter by series
  if (series && typeof series === 'string' && series.trim() !== '') {
    filteredBroadcasts = filteredBroadcasts.filter(broadcast => 
      broadcast.series.toLowerCase() === series.toLowerCase()
    );
  }
  
  // Return filtered broadcasts
  res.status(200).json(filteredBroadcasts);
}