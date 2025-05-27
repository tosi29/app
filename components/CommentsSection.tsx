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
}

export default function CommentsSection({ pastBroadcasts, selectedEpisodeId }: CommentsSectionProps): React.ReactNode {
  const [hoveredComment, setHoveredComment] = useState<Comment | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

  // Handle mouse over comment dot
  const handleMouseOver = (comment: Comment): void => {
    setHoveredComment(comment);
  };

  // Handle mouse out from comment dot
  const handleMouseOut = (): void => {
    setHoveredComment(null);
  };

  return (
    <>
      <h1 className={styles.title}>
        {selectedEpisodeId 
          ? `${getEpisodeTitle(selectedEpisodeId)}のコメント` 
          : 'コメント一覧'}
      </h1>
      
      <p className={styles.description}>
        {selectedEpisodeId 
          ? `エピソード #${selectedEpisodeId} へのリスナーからのコメント` 
          : 'リスナーからのコメントをグラフ上に表示しています'}
      </p>

      {loading ? (
        <p className={styles.description}>コメントを読み込んでいます...</p>
      ) : (

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
            {filteredComments.map((comment) => {
              const x = 50 + comment.opinionScore * 500; // Scale to fit within the graph
              const y = 550 - comment.positiveScore * 500; // Invert Y-axis to have positive values going up
              const seriesClass = getSeriesClassName(comment.episodeId);
              
              return (
                <circle
                  key={comment.id}
                  cx={x}
                  cy={y}
                  r="8"
                  className={`${commentStyles.commentDot} ${seriesClass ? commentStyles[seriesClass] : ''}`}
                  onMouseOver={() => handleMouseOver(comment)}
                  onMouseOut={handleMouseOut}
                />
              );
            })}
          </svg>
          
          {/* Comment tooltip with episode information */}
          {hoveredComment && (
            <div
              className={commentStyles.commentTooltip}
              style={{
                left: `${50 + hoveredComment.opinionScore * 500 + 20}px`,
                top: `${550 - hoveredComment.positiveScore * 500 - 20}px`,
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
      )}
    </>
  );
}