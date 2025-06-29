import { NextApiRequest, NextApiResponse } from 'next';
import { Hypothesis } from '../../types/hypothesis';
import { hypotheses } from '../../data/hypotheses-sample';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Hypothesis[]>
) {
  const { episodeId } = req.query;
  
  // If episodeId is provided, filter hypotheses for that episode
  if (episodeId && !Array.isArray(episodeId)) {
    const filteredHypotheses = hypotheses.filter(
      hypothesis => hypothesis.episodeId === parseInt(episodeId, 10)
    );
    return res.status(200).json(filteredHypotheses);
  }
  
  // Otherwise return all hypotheses
  res.status(200).json(hypotheses);
}