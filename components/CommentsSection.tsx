import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
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
  series: string;
}

interface CommentsSectionProps {
  pastBroadcasts: PastBroadcast[];
  selectedEpisodeId?: number;
}

export default function CommentsSection({ pastBroadcasts, selectedEpisodeId }: CommentsSectionProps): React.ReactNode {
  const [hoveredComment, setHoveredComment] = useState<Comment | null>(null);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dropdownEpisodeId, setDropdownEpisodeId] = useState<number | undefined>(selectedEpisodeId);
  const commentsListRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  // Sync dropdown state with selectedEpisodeId prop
  useEffect(() => {
    // Only update the dropdown state if the selectedEpisodeId is different
    if (selectedEpisodeId !== dropdownEpisodeId) {
      setDropdownEpisodeId(selectedEpisodeId);
    }
  }, [selectedEpisodeId, dropdownEpisodeId]);

  // Use a ref to keep track of the latest request
  const latestRequestIdRef = useRef<number>(0);

  useEffect(() => {
    // Set loading state immediately when dropdown changes
    setLoading(true);
    
    const fetchComments = async () => {
      // Generate a unique request ID to track this specific request
      const thisRequestId = latestRequestIdRef.current + 1;
      latestRequestIdRef.current = thisRequestId;
      
      try {
        // Use dropdownEpisodeId as the single source of truth for data fetching
        const url = dropdownEpisodeId 
          ? `/api/comments?episodeId=${dropdownEpisodeId}`
          : '/api/comments';
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        // Only update state if this is still the latest request
        if (thisRequestId === latestRequestIdRef.current) {
          const data = await response.json();
          setComments(data);
          setLoading(false);
        }
      } catch (error) {
        // Only update error state if this is still the latest request
        if (thisRequestId === latestRequestIdRef.current) {
          console.error('Error fetching comments:', error);
          setLoading(false);
          // In a real app, you might want to show an error message to the user
        }
      }
    };

    fetchComments();
  }, [dropdownEpisodeId]); // Only depend on dropdownEpisodeId

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

  // Function to map series names to color types
  const getSeriesColorType = (seriesName: string): string => {
    // Get all unique series from broadcasts
    const allSeries = Array.from(new Set(pastBroadcasts.map(b => b.series)));
    const colorTypes = ['basic', 'guest', 'community'];
    
    // Sort series alphabetically for consistent assignment
    const sortedSeries = allSeries.sort();
    const seriesIndex = sortedSeries.indexOf(seriesName);
    
    // Assign color type cyclically
    return seriesIndex >= 0 ? colorTypes[seriesIndex % colorTypes.length] : 'basic';
  };

  // Function to get series CSS class name
  const getSeriesClassName = (episodeId: number): string => {
    const series = getEpisodeSeries(episodeId);
    if (!series) return '';
    
    const colorType = getSeriesColorType(series);
    return `commentDot-${colorType}`;
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

  // Handle click on comment dot
  const handleCommentClick = (comment: Comment): void => {
    setSelectedComment(comment);
    setHoveredComment(null);
    
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
    setSelectedComment(comment);
    setHoveredComment(null);
  };

  // Handle click outside to close selected comment
  const handleClickOutside = (): void => {
    setSelectedComment(null);
  };

  // Handle feedback button clicks
  const handleFeedback = (feedbackType: string, comment: Comment): void => {
    console.log(`Feedback "${feedbackType}" given to comment:`, comment.text);
    // Here you could add API call to save feedback
    // For now, just log it
  };

  // Handle dropdown change
  const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const episodeId = event.target.value === '' ? undefined : Number(event.target.value);
    
    // Clear existing comments and show loading state immediately
    setComments([]);
    setLoading(true);
    
    // Update dropdown state
    setDropdownEpisodeId(episodeId);
    
    // Update URL to maintain existing functionality but use replace instead of push
    // to prevent adding a new history entry and causing full page reload
    const newQuery = episodeId 
      ? { tab: 'comments', episodeId: episodeId.toString() }
      : { tab: 'comments' };
    
    router.replace({
      pathname: '/',
      query: newQuery
    }, undefined, { shallow: true });
  };

  return (
    <>
      {/* Dropdown filter for episodes */}
      <div className={commentStyles.filterContainer}>
        <label htmlFor="episode-filter" className={commentStyles.filterLabel}>
          配信で絞り込み:
        </label>
        <select
          id="episode-filter"
          value={dropdownEpisodeId || ''}
          onChange={handleDropdownChange}
          className={commentStyles.filterSelect}
        >
          <option value="">すべて</option>
          {pastBroadcasts.map((broadcast) => (
            <option key={broadcast.id} value={broadcast.id}>
              {broadcast.title}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <p style={{ textAlign: 'center', fontSize: '1rem', color: 'var(--text-secondary)' }}>コメントを読み込んでいます...</p>
          <div className={styles.loadingIndicator}></div>
        </div>
      ) : comments.length === 0 ? (
        <div style={{ textAlign: 'center', margin: '2rem 0', color: 'var(--text-secondary)' }}>
          コメントはありません
        </div>
      ) : (

      <div className={commentStyles.graphContainer}>
        <div className={commentStyles.commentsLayout}>
          {/* Left side: Graph */}
          <div className={commentStyles.graphSection}>
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
                  onClick={(e) => e.stopPropagation()}
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
              {!dropdownEpisodeId ? (
                // Show all series when no filter is applied
                Array.from(new Set(pastBroadcasts.map(b => b.series)))
                  .sort()
                  .map(series => {
                    const colorType = getSeriesColorType(series);
                    return (
                      <div key={series} className={commentStyles.legendItem}>
                        <div className={`${commentStyles.legendColorBox} ${commentStyles[`commentDot-${colorType}`]}`}></div>
                        <div>{series}</div>
                      </div>
                    );
                  })
              ) : (
                // Show only the selected episode's series when filtered
                <div className={commentStyles.legendItem}>
                  <div className={`${commentStyles.legendColorBox} ${commentStyles[getSeriesClassName(dropdownEpisodeId)]}`}></div>
                  <div>{getEpisodeSeries(dropdownEpisodeId)}</div>
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
                  className={`${commentStyles.commentItem} ${
                    selectedComment?.id === comment.id ? commentStyles.selected : ''
                  }`}
                  onClick={() => handleCommentItemClick(comment)}
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