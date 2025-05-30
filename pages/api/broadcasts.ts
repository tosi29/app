import { NextApiRequest, NextApiResponse } from 'next';

// Define the PastBroadcast interface
interface PastBroadcast {
  id: number;
  date: string;
  title: string;
  series: string;
  duration: string;
}

// Sample data for past broadcasts
const pastBroadcasts: PastBroadcast[] = [
  { id: 1, date: '2023-04-15', title: 'Episode 1: Introduction', series: 'Basic Series', duration: '25:30' },
  { id: 2, date: '2023-04-22', title: 'Episode 2: Getting Started', series: 'Basic Series', duration: '31:45' },
  { id: 3, date: '2023-04-29', title: 'Episode 3: Advanced Techniques', series: 'Basic Series', duration: '42:18' },
  { id: 4, date: '2023-05-06', title: 'Episode 4: Special Guest Interview', series: 'Guest Series', duration: '38:22' },
  { id: 5, date: '2023-05-13', title: 'Episode 5: Community Questions', series: 'Community Series', duration: '27:55' },
  { id: 6, date: '2023-05-20', title: 'Episode 6: Data Analysis Fundamentals', series: 'Basic Series', duration: '33:12' },
  { id: 7, date: '2023-05-27', title: 'Episode 7: Industry Expert Panel', series: 'Guest Series', duration: '45:18' },
  { id: 8, date: '2023-06-03', title: 'Episode 8: User Feedback Session', series: 'Community Series', duration: '29:44' },
  { id: 9, date: '2023-06-10', title: 'Episode 9: Best Practices Guide', series: 'Basic Series', duration: '37:21' },
  { id: 10, date: '2023-06-17', title: 'Episode 10: Special Achievement Milestone', series: 'Guest Series', duration: '52:15' },
  { id: 11, date: '2023-06-24', title: 'Episode 11: Live Q&A Session', series: 'Community Series', duration: '41:33' },
  { id: 12, date: '2023-07-01', title: 'Episode 12: Advanced Implementation Strategies', series: 'Basic Series', duration: '39:07' },
  { id: 13, date: '2023-07-08', title: 'Episode 13: Innovation Showcase', series: 'Guest Series', duration: '44:52' },
  { id: 14, date: '2023-07-15', title: 'Episode 14: Community Success Stories', series: 'Community Series', duration: '35:28' },
  { id: 15, date: '2023-07-22', title: 'Episode 15: Future Trends and Predictions', series: 'Basic Series', duration: '40:19' },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<PastBroadcast[]>
) {
  // Return all broadcasts
  res.status(200).json(pastBroadcasts);
}