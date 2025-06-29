import { NextApiRequest, NextApiResponse } from 'next';
import { PopularBroadcast } from '../../types/broadcast';
import { pastBroadcasts } from '../../data/broadcasts-sample';
import { hypotheses } from '../../data/hypotheses-sample';

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<PopularBroadcast[]>
) {
  // Count hypotheses for each episode
  const hypothesisCounts: Record<number, number> = {};
  hypotheses.forEach(hypothesis => {
    hypothesisCounts[hypothesis.episodeId] = (hypothesisCounts[hypothesis.episodeId] || 0) + 1;
  });
  
  // Create popular broadcasts data
  const popularBroadcasts: PopularBroadcast[] = pastBroadcasts.map(broadcast => {
    const hypothesisCount = hypothesisCounts[broadcast.id] || 0;
    // Calculate a view count based on likes and hypotheses (simulated data)
    const viewCount = (broadcast.likeCount || 0) * 10 + hypothesisCount * 5;
    
    return {
      ...broadcast,
      hypothesisCount,
      viewCount
    };
  });
  
  res.status(200).json(popularBroadcasts);
}