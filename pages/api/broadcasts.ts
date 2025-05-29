import { NextApiRequest, NextApiResponse } from 'next';

// Define the PastBroadcast interface
interface PastBroadcast {
  id: number;
  date: string;
  title: string;
  description: string;
  series: string;
  duration: string;
}

// Sample data for past broadcasts
const pastBroadcasts: PastBroadcast[] = [
  { id: 1, date: '2023-04-15', title: 'Episode 1: Introduction', description: 'The first episode of our podcast series', series: 'Basic Series', duration: '25:30' },
  { id: 2, date: '2023-04-22', title: 'Episode 2: Getting Started', description: 'How to get started with our topic', series: 'Basic Series', duration: '31:45' },
  { id: 3, date: '2023-04-29', title: 'Episode 3: Advanced Techniques', description: 'Deep dive into advanced techniques', series: 'Basic Series', duration: '42:18' },
  { id: 4, date: '2023-05-06', title: 'Episode 4: Special Guest Interview', description: 'Interview with a special guest', series: 'Guest Series', duration: '38:22' },
  { id: 5, date: '2023-05-13', title: 'Episode 5: Community Questions', description: 'Answering questions from our community', series: 'Community Series', duration: '27:55' },
  { id: 6, date: '2023-05-20', title: 'Episode 6: Data Analysis Fundamentals', description: 'Understanding the basics of data analysis and visualization', series: 'Basic Series', duration: '33:12' },
  { id: 7, date: '2023-05-27', title: 'Episode 7: Industry Expert Panel', description: 'Panel discussion with leading industry experts', series: 'Guest Series', duration: '45:18' },
  { id: 8, date: '2023-06-03', title: 'Episode 8: User Feedback Session', description: 'Addressing user questions and feedback from our community', series: 'Community Series', duration: '29:44' },
  { id: 9, date: '2023-06-10', title: 'Episode 9: Best Practices Guide', description: 'Essential best practices and common pitfalls to avoid', series: 'Basic Series', duration: '37:21' },
  { id: 10, date: '2023-06-17', title: 'Episode 10: Special Achievement Milestone', description: 'Celebrating our 10th episode with special guests and reflections', series: 'Guest Series', duration: '52:15' },
  { id: 11, date: '2023-06-24', title: 'Episode 11: Live Q&A Session', description: 'Interactive live session answering real-time community questions', series: 'Community Series', duration: '41:33' },
  { id: 12, date: '2023-07-01', title: 'Episode 12: Advanced Implementation Strategies', description: 'Advanced techniques for real-world implementation scenarios', series: 'Basic Series', duration: '39:07' },
  { id: 13, date: '2023-07-08', title: 'Episode 13: Innovation Showcase', description: 'Featuring innovative approaches from guest innovators', series: 'Guest Series', duration: '44:52' },
  { id: 14, date: '2023-07-15', title: 'Episode 14: Community Success Stories', description: 'Highlighting success stories and achievements from our community', series: 'Community Series', duration: '35:28' },
  { id: 15, date: '2023-07-22', title: 'Episode 15: Future Trends and Predictions', description: 'Exploring future trends and making predictions for the industry', series: 'Basic Series', duration: '40:19' },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<PastBroadcast[]>
) {
  // Return all broadcasts
  res.status(200).json(pastBroadcasts);
}