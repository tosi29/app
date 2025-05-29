import React, { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import commentStyles from '../styles/Comments.module.css';

interface Comment {
  id: number;
  episodeId: number;
  text: string;
  positiveScore: number; // 0 to 1 where 1 is most positive
  opinionScore: number; // 0 to 1 where 1 is pure opinion (vs reaction)
  author: string;
}

interface PastBroadcast {
  id: number;
  date: string;
  title: string;
  description: string;
  series: string;
}

interface CommentsSectionProps {
  pastBroadcasts: PastBroadcast[];
  selectedEpisodeId?: number;
  selectedCommentId?: number | null;
  onCommentSelect?: (commentId: number) => void;
}

// Static fallback data that matches the API response
const fallbackComments: Comment[] = [
  { id: 8, episodeId: 3, text: '素晴らしい内容でした！', positiveScore: 0.9, opinionScore: 0.2, author: 'リスナー8' },
  { id: 3, episodeId: 2, text: 'わかりやすい説明をありがとうございます！', positiveScore: 0.9, opinionScore: 0.5, author: 'リスナー3' },
  { id: 5, episodeId: 4, text: 'ゲストのお話が特に参考になりました！', positiveScore: 0.8, opinionScore: 0.7, author: 'リスナー5' },
  { id: 1, episodeId: 1, text: '面白かったです！次回も楽しみにしています。', positiveScore: 0.8, opinionScore: 0.3, author: 'リスナー1' },
  { id: 4, episodeId: 3, text: 'すごく勉強になりました。', positiveScore: 0.7, opinionScore: 0.6, author: 'リスナー4' },
  { id: 6, episodeId: 5, text: 'もっと詳しく聞きたかったです。', positiveScore: 0.5, opinionScore: 0.8, author: 'リスナー6' },
  { id: 2, episodeId: 1, text: 'もう少し技術的な内容があると良かったです。', positiveScore: 0.4, opinionScore: 0.9, author: 'リスナー2' },
  { id: 7, episodeId: 2, text: 'あまり理解できませんでした...', positiveScore: 0.2, opinionScore: 0.6, author: 'リスナー7' }
];

export default function CommentsSection({ pastBroadcasts, selectedEpisodeId, selectedCommentId, onCommentSelect }: CommentsSectionProps): React.ReactNode {
  const [hoveredComment, setHoveredComment] = useState<Comment | null>(null);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [comments, setComments] = useState<Comment[]>(fallbackComments);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchComments = async () => {
      // Start with static data immediately to show graph
      setComments(fallbackComments);
      
      try {
        // Try to fetch fresh data from API
        const url = selectedEpisodeId 
          ? `/api/comments?episodeId=${selectedEpisodeId}`
          : '/api/comments';
        
        console.log('Fetching comments from:', url);
        const response = await fetch(url);
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Comments data received:', data.length, 'comments');
          setComments(data); // Update with API data if successful
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
        // Keep fallback data - no need to change anything
      }
    };

    fetchComments();
  }, [selectedEpisodeId]);

  // Effect to sync selected comment from external selection
  useEffect(() => {
    if (selectedCommentId && comments.length > 0) {
      const comment = comments.find(c => c.id === selectedCommentId);
      if (comment) {
        setSelectedComment(comment);
        setHoveredComment(null);
      }
    }
  }, [selectedCommentId, comments]);

  // Function to get episode title by id
  const getEpisodeTitle = (episodeId: number): string => {
    const broadcast = pastBroadcasts.find(b => b.id === episodeId);
    return broadcast ? broadcast.title : '不明なエピソード';
  };

  // Function to get episode series by id
  const getEpisodeSeries = (episodeId: number): string => {
    const broadcast = pastBroadcasts.find(b => b.id === episodeId);
    return broadcast ? broadcast.series : '';
  };

  // Function to get series CSS class name
  const getSeriesClassName = (episodeId: number): string => {
    const series = getEpisodeSeries(episodeId);
    return series ? `commentDot-${series.toLowerCase().split(' ')[0]}` : '';
  };

  // Filter by episode if specified  
  const filteredComments = selectedEpisodeId 
    ? comments.filter(c => c.episodeId === selectedEpisodeId)
    : comments;

  // Handle mouse over comment dot
  const handleMouseOver = (comment: Comment): void => {
    if (!selectedComment) {
      setHoveredComment(comment);
    }
  };

  // Handle mouse out from comment dot
  const handleMouseOut = (): void => {
    if (!selectedComment) {
      setHoveredComment(null);
    }
  };

  // Handle click on comment dot
  const handleCommentClick = (comment: Comment): void => {
    setSelectedComment(comment);
    setHoveredComment(null);
    // Notify parent component about the selection
    if (onCommentSelect) {
      onCommentSelect(comment.id);
    }
  };

  // Handle click outside to close selected comment
  const handleClickOutside = (): void => {
    setSelectedComment(null);
  };

  // Handle feedback button clicks
  const handleFeedback = (feedbackType: string): void => {
    console.log(`Feedback "${feedbackType}" given to comment:`, selectedComment?.text);
    // Here you could add API call to save feedback
    // For now, just log it
  };

  return (
    <>
      <p className={styles.description}>
        {selectedEpisodeId 
          ? `エピソード #${selectedEpisodeId} へのリスナーからのコメント` 
          : 'リスナーからのコメントをグラフ上に表示しています'}
      </p>

      {loading ? (
        <div className={styles.loadingContainer}>
          <p className={styles.description}>コメントを読み込んでいます...</p>
          <div className={styles.loadingIndicator}></div>
        </div>
      ) : (

      <div className={commentStyles.graphContainer}>
        <div 
          className={commentStyles.graphAxes}
          onClick={handleClickOutside}
        >
          <div className={commentStyles.yAxisLabel}>ポジティブ ↑</div>
          <div className={commentStyles.xAxisLabel}>← リアクション | 意見 →</div>

          <svg width="600" height="600" className={commentStyles.graph}>
            {/* X-axis line */}
            <line x1="50" y1="550" x2="550" y2="550" stroke="var(--text-secondary)" strokeWidth="1.5" />
            
            {/* Y-axis line */}
            <line x1="50" y1="50" x2="50" y2="550" stroke="var(--text-secondary)" strokeWidth="1.5" />
            
            {/* X-axis label ticks */}
            <line x1="50" y1="550" x2="50" y2="560" stroke="var(--text-secondary)" strokeWidth="1.5" />
            <text x="50" y="575" textAnchor="middle" fontSize="12" fill="var(--text-secondary)">0</text>
            
            <line x1="300" y1="550" x2="300" y2="560" stroke="var(--text-secondary)" strokeWidth="1.5" />
            <text x="300" y="575" textAnchor="middle" fontSize="12" fill="var(--text-secondary)">0.5</text>
            
            <line x1="550" y1="550" x2="550" y2="560" stroke="var(--text-secondary)" strokeWidth="1.5" />
            <text x="550" y="575" textAnchor="middle" fontSize="12" fill="var(--text-secondary)">1.0</text>
            
            {/* Y-axis label ticks */}
            <line x1="40" y1="550" x2="50" y2="550" stroke="var(--text-secondary)" strokeWidth="1.5" />
            <text x="35" y="555" textAnchor="end" fontSize="12" fill="var(--text-secondary)">0</text>
            
            <line x1="40" y1="300" x2="50" y2="300" stroke="var(--text-secondary)" strokeWidth="1.5" />
            <text x="35" y="305" textAnchor="end" fontSize="12" fill="var(--text-secondary)">0.5</text>
            
            <line x1="40" y1="50" x2="50" y2="50" stroke="var(--text-secondary)" strokeWidth="1.5" />
            <text x="35" y="55" textAnchor="end" fontSize="12" fill="var(--text-secondary)">1.0</text>
            
            {/* Plot comment dots */}
            {filteredComments.map((comment) => {
              const x = 50 + comment.opinionScore * 500; // Scale to fit within the graph
              const y = 550 - comment.positiveScore * 500; // Invert Y-axis to have positive values going up
              const seriesClass = getSeriesClassName(comment.episodeId);
              
              return (
                <circle
                  key={comment.id}
                  cx={x}
                  cy={y}
                  className={`${commentStyles.commentDot} ${seriesClass ? commentStyles[seriesClass] : ''} ${
                    selectedComment?.id === comment.id ? commentStyles.commentDotSelected : ''
                  }`}
                  onMouseOver={() => handleMouseOver(comment)}
                  onMouseOut={handleMouseOut}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCommentClick(comment);
                  }}
                />
              );
            })}
          </svg>
          
          {/* Comment tooltip with episode information */}
          {(hoveredComment || selectedComment) && (
            <div
              className={`${commentStyles.commentTooltip} ${
                selectedComment ? commentStyles.commentTooltipInteractive : ''
              } ${
                (selectedComment || hoveredComment)!.opinionScore > 0.5
                  ? ((selectedComment || hoveredComment)!.positiveScore > 0.5
                    ? commentStyles['commentTooltip-bottomLeft']
                    : commentStyles['commentTooltip-topLeft'])
                  : ((selectedComment || hoveredComment)!.positiveScore > 0.5
                    ? commentStyles['commentTooltip-bottomRight']
                    : commentStyles['commentTooltip-topRight'])
              }`}
              style={{
                left: `${50 + (selectedComment || hoveredComment)!.opinionScore * 500}px`,
                top: `${550 - (selectedComment || hoveredComment)!.positiveScore * 500}px`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className={commentStyles.commentEpisode}>
                {getEpisodeTitle((selectedComment || hoveredComment)!.episodeId)} 
                <span className={commentStyles.commentSeries}>
                  ({getEpisodeSeries((selectedComment || hoveredComment)!.episodeId)})
                </span>
              </p>
              <p className={commentStyles.commentText}>{(selectedComment || hoveredComment)!.text}</p>
              <p className={commentStyles.commentAuthor}>by {(selectedComment || hoveredComment)!.author}</p>
              
              {/* Feedback buttons - only show for selected comments */}
              {selectedComment && (
                <div className={commentStyles.feedbackContainer}>
                  <button 
                    className={commentStyles.feedbackButton}
                    onClick={() => handleFeedback('empathy')}
                    title="共感"
                  >
                    👍
                  </button>
                  <button 
                    className={commentStyles.feedbackButton}
                    onClick={() => handleFeedback('insight')}
                    title="なるほど"
                  >
                    💡
                  </button>
                  <button 
                    className={commentStyles.feedbackButton}
                    onClick={() => handleFeedback('on-target')}
                    title="的を射ている"
                  >
                    🎯
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={commentStyles.legend}>
          {!selectedEpisodeId && (
            <>
              <div className={commentStyles.legendItem}>
                <div className={`${commentStyles.legendColorBox} ${commentStyles["commentDot-basic"]}`}></div>
                <div>Basic Series</div>
              </div>
              <div className={commentStyles.legendItem}>
                <div className={`${commentStyles.legendColorBox} ${commentStyles["commentDot-guest"]}`}></div>
                <div>Guest Series</div>
              </div>
              <div className={commentStyles.legendItem}>
                <div className={`${commentStyles.legendColorBox} ${commentStyles["commentDot-community"]}`}></div>
                <div>Community Series</div>
              </div>
            </>
          )}
          {selectedEpisodeId && (
            <div className={commentStyles.legendItem}>
              <div className={`${commentStyles.legendColorBox} ${commentStyles[getSeriesClassName(selectedEpisodeId)]}`}></div>
              <div>{getEpisodeSeries(selectedEpisodeId)}</div>
            </div>
          )}
        </div>
      </div>
      )}
    </>
  );
}