import { NextApiRequest, NextApiResponse } from 'next';

// Define the Comment interface
interface Comment {
  id: number;
  episodeId: number;
  text: string;
  positiveScore: number; // 0 to 1 where 1 is most positive
  opinionScore: number; // 0 to 1 where 1 is pure opinion (vs reaction)
  author: string;
}

// Sample data for comments
const comments: Comment[] = [
  { 
    id: 1, 
    episodeId: 1, 
    text: '面白かったです！次回も楽しみにしています。', 
    positiveScore: 0.8, 
    opinionScore: 0.3,
    author: 'リスナー1',
  },
  { 
    id: 2, 
    episodeId: 1, 
    text: 'もう少し技術的な内容があると良かったです。', 
    positiveScore: 0.4, 
    opinionScore: 0.9,
    author: 'リスナー2',
  },
  { 
    id: 3, 
    episodeId: 2, 
    text: 'わかりやすい説明をありがとうございます！', 
    positiveScore: 0.9, 
    opinionScore: 0.5,
    author: 'リスナー3',
  },
  { 
    id: 4, 
    episodeId: 3, 
    text: 'すごく勉強になりました。', 
    positiveScore: 0.7, 
    opinionScore: 0.6,
    author: 'リスナー4',
  },
  { 
    id: 5, 
    episodeId: 4, 
    text: 'ゲストのお話が特に参考になりました！', 
    positiveScore: 0.8, 
    opinionScore: 0.7,
    author: 'リスナー5',
  },
  { 
    id: 6, 
    episodeId: 5, 
    text: 'もっと詳しく聞きたかったです。', 
    positiveScore: 0.5, 
    opinionScore: 0.8,
    author: 'リスナー6',
  },
  { 
    id: 7, 
    episodeId: 2, 
    text: 'あまり理解できませんでした...', 
    positiveScore: 0.2, 
    opinionScore: 0.6,
    author: 'リスナー7',
  },
  { 
    id: 8, 
    episodeId: 3, 
    text: '素晴らしい内容でした！', 
    positiveScore: 0.9, 
    opinionScore: 0.2,
    author: 'リスナー8',
  },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Comment[]>
) {
  const { episodeId } = req.query;
  
  // If episodeId is provided, filter comments for that episode
  if (episodeId && !Array.isArray(episodeId)) {
    const filteredComments = comments.filter(
      comment => comment.episodeId === parseInt(episodeId, 10)
    );
    return res.status(200).json(filteredComments);
  }
  
  // Otherwise return all comments
  res.status(200).json(comments);
}