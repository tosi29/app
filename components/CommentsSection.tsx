import React, { useState, useEffect, useRef } from 'react';
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
}

export default function CommentsSection({ pastBroadcasts, selectedEpisodeId }: CommentsSectionProps): React.ReactNode {
  const [hoveredComment, setHoveredComment] = useState<Comment | null>(null);
  const [hoveredCommentInList, setHoveredCommentInList] = useState<Comment | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const commentsListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        // Construct API URL with episodeId if it exists
        const url = selectedEpisodeId 
          ? `/api/comments?episodeId=${selectedEpisodeId}`
          : '/api/comments';
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
        // In a real app, you might want to show an error message to the user
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [selectedEpisodeId]);

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

  // Filter comments is no longer needed as the API handles this
  // But we keep the filteredComments variable for compatibility
  const filteredComments = comments;

  // Sort comments by feedback score (using positiveScore as proxy for feedback)
  const sortedComments = [...filteredComments].sort((a, b) => b.positiveScore - a.positiveScore);

  // Handle mouse over comment dot
  const handleMouseOver = (comment: Comment): void => {
    setHoveredComment(comment);
  };

  // Handle mouse out from comment dot
  const handleMouseOut = (): void => {
    setHoveredComment(null);
  };

  // Handle click on comment dot - scroll to comment in list
  const handleCommentClick = (comment: Comment): void => {
    // Scroll to the selected comment in the list
    if (commentsListRef.current) {
      const commentElement = commentsListRef.current.querySelector(`[data-comment-id="${comment.id}"]`);
      if (commentElement) {
        commentElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  };

  // Handle click on comment item in the list
  const handleCommentItemClick = (comment: Comment): void => {
    // You could add specific behavior here for when items in the list are clicked
    console.log('Comment item clicked:', comment.text);
  };

  // Handle mouse enter on comment item in the list
  const handleCommentItemMouseEnter = (comment: Comment): void => {
    setHoveredCommentInList(comment);
  };

  // Handle mouse leave from comment item in the list
  const handleCommentItemMouseLeave = (): void => {
    setHoveredCommentInList(null);
  };

  // Handle feedback button clicks
  const handleFeedback = (feedbackType: string, comment: Comment): void => {
    console.log(`Feedback "${feedbackType}" given to comment:`, comment.text);
    // Here you could add API call to save feedback
    // For now, just log it
  };

  return (
    <>
      {selectedEpisodeId && (
        <p className={styles.description}>
          エピソード #{selectedEpisodeId} へのリスナーからのコメント
        </p>
      )}

      {loading ? (
        <div className={styles.loadingContainer}>
          <p className={styles.description}>コメントを読み込んでいます...</p>
          <div className={styles.loadingIndicator}></div>
        </div>
      ) : (

      <div className={commentStyles.graphContainer}>
        <div className={commentStyles.commentsLayout}>
          {/* Left side: Graph */}
          <div className={commentStyles.graphSection}>
            <div className={commentStyles.graphAxes}>
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
                  const isHighlighted = hoveredCommentInList?.id === comment.id;
                  
                  return (
                    <circle
                      key={comment.id}
                      cx={x}
                      cy={y}
                      className={`${commentStyles.commentDot} ${seriesClass ? commentStyles[seriesClass] : ''} ${
                        isHighlighted ? commentStyles.commentDotHighlighted : ''
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
              {hoveredComment && (
                <div
                  className={`${commentStyles.commentTooltip} ${
                    hoveredComment.opinionScore > 0.5
                      ? (hoveredComment.positiveScore > 0.5
                        ? commentStyles['commentTooltip-bottomLeft']
                        : commentStyles['commentTooltip-topLeft'])
                      : (hoveredComment.positiveScore > 0.5
                        ? commentStyles['commentTooltip-bottomRight']
                        : commentStyles['commentTooltip-topRight'])
                  }`}
                  style={{
                    left: `${50 + hoveredComment.opinionScore * 500}px`,
                    top: `${550 - hoveredComment.positiveScore * 500}px`,
                  }}
                >
                  <p className={commentStyles.commentEpisode}>
                    {getEpisodeTitle(hoveredComment.episodeId)} 
                    <span className={commentStyles.commentSeries}>
                      ({getEpisodeSeries(hoveredComment.episodeId)})
                    </span>
                  </p>
                  <p className={commentStyles.commentText}>{hoveredComment.text}</p>
                  <p className={commentStyles.commentAuthor}>by {hoveredComment.author}</p>
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

          {/* Right side: Comments List */}
          <div className={commentStyles.commentsListSection}>
            <div className={commentStyles.commentsList} ref={commentsListRef}>
              <h3 className={commentStyles.commentsListTitle}>
                コメント一覧 (フィードバック順)
              </h3>
              {sortedComments.map((comment) => (
                <div
                  key={comment.id}
                  data-comment-id={comment.id}
                  className={commentStyles.commentItem}
                  onClick={() => handleCommentItemClick(comment)}
                  onMouseEnter={() => handleCommentItemMouseEnter(comment)}
                  onMouseLeave={handleCommentItemMouseLeave}
                >
                  <div className={commentStyles.commentItemHeader}>
                    <p className={commentStyles.commentItemEpisode}>
                      {getEpisodeTitle(comment.episodeId)}
                      <span className={commentStyles.commentSeries}>
                        ({getEpisodeSeries(comment.episodeId)})
                      </span>
                    </p>
                    <span className={commentStyles.commentItemScore}>
                      {Math.round(comment.positiveScore * 100)}%
                    </span>
                  </div>
                  <p className={commentStyles.commentItemText}>{comment.text}</p>
                  <p className={commentStyles.commentItemAuthor}>by {comment.author}</p>
                  
                  {/* Feedback buttons */}
                  <div className={commentStyles.feedbackContainer}>
                    <button 
                      className={commentStyles.feedbackButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFeedback('empathy', comment);
                      }}
                      title="共感"
                    >
                      👍
                    </button>
                    <button 
                      className={commentStyles.feedbackButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFeedback('insight', comment);
                      }}
                      title="なるほど"
                    >
                      💡
                    </button>
                    <button 
                      className={commentStyles.feedbackButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFeedback('on-target', comment);
                      }}
                      title="的を射ている"
                    >
                      🎯
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      )}
    </>
  );
}