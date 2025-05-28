import { NextApiRequest, NextApiResponse } from 'next';

// Define the PastBroadcast interface
interface PastBroadcast {
  id: number;
  date: string;
  title: string;
  description: string;
  series: string;
  duration: string;
  matchedChunk?: string; // Optional field for matched text chunk
}

// Sample data for past broadcasts
const pastBroadcasts: PastBroadcast[] = [
  { id: 1, date: '2023-04-15', title: 'Episode 1: Introduction', description: 'The first episode of our podcast series', series: 'Basic Series', duration: '25:30' },
  { id: 2, date: '2023-04-22', title: 'Episode 2: Getting Started', description: 'How to get started with our topic', series: 'Basic Series', duration: '31:45' },
  { id: 3, date: '2023-04-29', title: 'Episode 3: Advanced Techniques', description: 'Deep dive into advanced techniques', series: 'Basic Series', duration: '42:18' },
  { id: 4, date: '2023-05-06', title: 'Episode 4: Special Guest Interview', description: 'Interview with a special guest', series: 'Guest Series', duration: '38:22' },
  { id: 5, date: '2023-05-13', title: 'Episode 5: Community Questions', description: 'Answering questions from our community', series: 'Community Series', duration: '27:55' },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<PastBroadcast[]>
) {
  // Get search parameters from query
  const { query, series, dateFrom, dateTo } = req.query;
  
  // Filter broadcasts based on search criteria
  let filteredBroadcasts = [...pastBroadcasts];
  
  // Filter by query (search in title and description)
  if (query && typeof query === 'string' && query.trim() !== '') {
    const searchQuery = query.toLowerCase();
    filteredBroadcasts = filteredBroadcasts.filter(broadcast => {
      const titleMatch = broadcast.title.toLowerCase().includes(searchQuery);
      const descriptionMatch = broadcast.description.toLowerCase().includes(searchQuery);
      
      // If there's a match, add the matched chunk to the broadcast object
      if (titleMatch || descriptionMatch) {
        let matchedText = '';
        
        if (titleMatch) {
          // Extract context around the matched text in title
          const matchIndex = broadcast.title.toLowerCase().indexOf(searchQuery);
          matchedText = broadcast.title;
        } else if (descriptionMatch) {
          // Extract context around the matched text in description
          const matchIndex = broadcast.description.toLowerCase().indexOf(searchQuery);
          const contextStart = Math.max(0, matchIndex - 20);
          const contextEnd = Math.min(broadcast.description.length, matchIndex + searchQuery.length + 20);
          matchedText = broadcast.description.substring(contextStart, contextEnd);
          
          // Add ellipsis if we're not starting from the beginning or ending at the end
          if (contextStart > 0) {
            matchedText = '...' + matchedText;
          }
          if (contextEnd < broadcast.description.length) {
            matchedText = matchedText + '...';
          }
        }
        
        broadcast.matchedChunk = matchedText;
        return true;
      }
      
      return false;
    });
  }
  
  // Filter by series
  if (series && typeof series === 'string' && series.trim() !== '') {
    filteredBroadcasts = filteredBroadcasts.filter(broadcast => 
      broadcast.series.toLowerCase() === series.toLowerCase()
    );
  }
  
  // Filter by date range
  if (dateFrom && typeof dateFrom === 'string' && dateFrom.trim() !== '') {
    filteredBroadcasts = filteredBroadcasts.filter(broadcast => 
      broadcast.date >= dateFrom
    );
  }
  
  if (dateTo && typeof dateTo === 'string' && dateTo.trim() !== '') {
    filteredBroadcasts = filteredBroadcasts.filter(broadcast => 
      broadcast.date <= dateTo
    );
  }
  
  // Return filtered broadcasts
  res.status(200).json(filteredBroadcasts);
}