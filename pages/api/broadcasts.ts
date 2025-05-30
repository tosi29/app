import { NextApiRequest, NextApiResponse } from 'next';
import { PastBroadcast, pastBroadcasts } from '../../lib/broadcastData';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<PastBroadcast[]>
) {
  // Return all broadcasts
  res.status(200).json(pastBroadcasts);
}