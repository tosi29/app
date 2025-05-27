import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import styles from '../styles/Home.module.css'
import commentStyles from '../styles/Comments.module.css'

interface Comment {
  id: number;
  episodeId: number;
  text: string;
  positiveScore: number; // 0 to 1 where 1 is most positive
  opinionScore: number; // 0 to 1 where 1 is pure opinion (vs reaction)
  author: string;
}

export default function Comments() {
  const [hoveredComment, setHoveredComment] = useState<Comment | null>(null);

  // Sample data for comments
  const comments: Comment[] = [
    { 
      id: 1, 
      episodeId: 1, 
      text: '面白かったです！次回も楽しみにしています。', 
      positiveScore: 0.8, // 0 to 1 where 1 is most positive
      opinionScore: 0.3,  // 0 to 1 where 1 is pure opinion (vs reaction)
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

  // Handle mouse over comment dot
  const handleMouseOver = (comment: Comment): void => {
    setHoveredComment(comment);
  };

  // Handle mouse out from comment dot
  const handleMouseOut = (): void => {
    setHoveredComment(null);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>コメント一覧 | Next.js App</title>
        <meta name="description" content="コメント一覧ページ" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>コメント一覧</h1>
        
        <p className={styles.description}>
          リスナーからのコメントをグラフ上に表示しています
        </p>

        <div className={commentStyles.graphContainer}>
          <div className={commentStyles.graphAxes}>
            <div className={commentStyles.yAxisLabel}>ポジティブ ↑</div>
            <div className={commentStyles.xAxisLabel}>← リアクション | 意見 →</div>

            <svg width="600" height="600" className={commentStyles.graph}>
              {/* X-axis line */}
              <line x1="50" y1="550" x2="550" y2="550" stroke="#333" strokeWidth="2" />
              
              {/* Y-axis line */}
              <line x1="50" y1="50" x2="50" y2="550" stroke="#333" strokeWidth="2" />
              
              {/* X-axis label ticks */}
              <line x1="50" y1="550" x2="50" y2="560" stroke="#333" strokeWidth="2" />
              <text x="50" y="575" textAnchor="middle" fontSize="12">0</text>
              
              <line x1="300" y1="550" x2="300" y2="560" stroke="#333" strokeWidth="2" />
              <text x="300" y="575" textAnchor="middle" fontSize="12">0.5</text>
              
              <line x1="550" y1="550" x2="550" y2="560" stroke="#333" strokeWidth="2" />
              <text x="550" y="575" textAnchor="middle" fontSize="12">1.0</text>
              
              {/* Y-axis label ticks */}
              <line x1="40" y1="550" x2="50" y2="550" stroke="#333" strokeWidth="2" />
              <text x="35" y="555" textAnchor="end" fontSize="12">0</text>
              
              <line x1="40" y1="300" x2="50" y2="300" stroke="#333" strokeWidth="2" />
              <text x="35" y="305" textAnchor="end" fontSize="12">0.5</text>
              
              <line x1="40" y1="50" x2="50" y2="50" stroke="#333" strokeWidth="2" />
              <text x="35" y="55" textAnchor="end" fontSize="12">1.0</text>
              
              {/* Plot comment dots */}
              {comments.map((comment) => {
                const x = 50 + comment.opinionScore * 500; // Scale to fit within the graph
                const y = 550 - comment.positiveScore * 500; // Invert Y-axis to have positive values going up
                
                return (
                  <circle
                    key={comment.id}
                    cx={x}
                    cy={y}
                    r="8"
                    className={commentStyles.commentDot}
                    onMouseOver={() => handleMouseOver(comment)}
                    onMouseOut={handleMouseOut}
                  />
                );
              })}
            </svg>
            
            {/* Comment tooltip */}
            {hoveredComment && (
              <div
                className={commentStyles.commentTooltip}
                style={{
                  left: `${50 + hoveredComment.opinionScore * 500 + 20}px`,
                  top: `${550 - hoveredComment.positiveScore * 500 - 20}px`,
                }}
              >
                <p className={commentStyles.commentText}>{hoveredComment.text}</p>
                <p className={commentStyles.commentAuthor}>by {hoveredComment.author}</p>
              </div>
            )}
          </div>

          <div className={commentStyles.legend}>
            <div className={commentStyles.legendItem}>
              <div className={commentStyles.legendColorBox}></div>
              <div>コメント</div>
            </div>
          </div>
        </div>

        <div className={styles.backToHome}>
          <Link href="/past-broadcasts">
            ← 過去の配信一覧に戻る
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            Next.js
          </span>
        </a>
      </footer>
    </div>
  )
}