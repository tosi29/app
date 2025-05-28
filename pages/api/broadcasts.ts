import { NextApiRequest, NextApiResponse } from 'next';

// Define the PastBroadcast interface
interface PastBroadcast {
  id: number;
  date: string;
  title: string;
  description: string;
  series: string;
}

// Sample data for past broadcasts
const pastBroadcasts: PastBroadcast[] = [
  { id: 1, date: '2023-04-15', title: 'Episode 1: Introduction', description: 'The first episode of our podcast series', series: 'Basic Series' },
  { id: 2, date: '2023-04-22', title: 'Episode 2: Getting Started', description: 'How to get started with our topic', series: 'Basic Series' },
  { id: 3, date: '2023-04-29', title: 'Episode 3: Advanced Techniques', description: 'Deep dive into advanced techniques', series: 'Basic Series' },
  { id: 4, date: '2023-05-06', title: 'Episode 4: Special Guest Interview', description: 'Interview with a special guest', series: 'Guest Series' },
  { id: 5, date: '2023-05-13', title: 'Episode 5: Community Questions', description: 'Answering questions from our community', series: 'Community Series' },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<PastBroadcast[]>
) {
  // Return all broadcasts
  res.status(200).json(pastBroadcasts);
}