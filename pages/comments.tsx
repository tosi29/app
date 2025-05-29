import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import commentStyles from '../styles/Comments.module.css';
import CommentsSection from '../components/CommentsSection';
import CommentsListSection from '../components/CommentsListSection';

interface PastBroadcast {
  id: number;
  date: string;
  title: string;
  description: string;
  series: string;
}

export default function Comments() {
  const router = useRouter();
  const { episodeId } = router.query;
  const [pastBroadcasts, setPastBroadcasts] = useState<PastBroadcast[]>([]);
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);

  // Parse episodeId safely
  const selectedEpisodeId = episodeId && typeof episodeId === 'string' ? Number(episodeId) : undefined;

  useEffect(() => {
    // Fetch past broadcasts data (same as in index.tsx)
    const fetchBroadcasts = async () => {
      try {
        const response = await fetch('/api/broadcasts');
        const data = await response.json();
        setPastBroadcasts(data);
      } catch (error) {
        console.error('Error fetching broadcasts:', error);
      }
    };

    fetchBroadcasts();
  }, []);

  const handleCommentSelect = (commentId: number) => {
    setSelectedCommentId(commentId);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>コメント | Next.js App</title>
        <meta name="description" content="リスナーコメント表示ページ" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>コメント</h1>
        
        <div className={commentStyles.commentsPageLayout}>
          <div className={commentStyles.commentsGraphSide}>
            <CommentsSection 
              pastBroadcasts={pastBroadcasts}
              selectedEpisodeId={selectedEpisodeId}
              selectedCommentId={selectedCommentId}
              onCommentSelect={handleCommentSelect}
            />
          </div>
          
          <div className={commentStyles.commentsListSide}>
            <CommentsListSection
              selectedEpisodeId={selectedEpisodeId}
              selectedCommentId={selectedCommentId}
              onCommentSelect={handleCommentSelect}
            />
          </div>
        </div>
      </main>
    </div>
  );
}