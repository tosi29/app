import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

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

  // Function to get series CSS class name
  const getSeriesClassName = (episodeId: number): string => {
    const series = getEpisodeSeries(episodeId);
    return series ? `series-${series.toLowerCase().split(' ')[0]}` : '';
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
      <div className="mb-4 text-center">
        <label htmlFor="episode-filter" className="mr-2 font-semibold">
          配信で絞り込み:
        </label>
        <select
          id="episode-filter"
          value={dropdownEpisodeId || ''}
          onChange={handleDropdownChange}
          className="p-2 rounded border border-border-color bg-background text-text-primary text-sm"
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
        <div className="flex flex-col items-center gap-4 my-8">
          <p className="text-center text-base text-text-secondary">コメントを読み込んでいます...</p>
          <div className="w-10 h-10 border-3 border-opacity-10 rounded-full border-t-primary animate-spin"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center my-8 text-text-secondary">
          コメントはありません
        </div>
      ) : (
      <div className="w-full max-w-[1400px] my-8 p-6 border border-border-color rounded bg-card overflow-x-auto shadow-md">
        <div className="flex gap-8 w-full">
          {/* Left side: Graph */}
          <div className="flex-1 min-w-0">
            <div 
              className="relative w-[600px] h-[600px] mx-auto"
              onClick={handleClickOutside}
            >
              <div className="absolute left-1/2 -top-6 transform -translate-x-1/2 font-semibold text-text-secondary">ポジティブ ↑</div>
              <div className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 font-semibold text-text-secondary">← リアクション | 意見 →</div>

              <svg width="600" height="600" className="graph">
                {/* X-axis line */}
                <line x1="50" y1="550" x2="550" y2="550" stroke="#666666" strokeWidth="1.5" />
                
                {/* Y-axis line */}
                <line x1="50" y1="50" x2="50" y2="550" stroke="#666666" strokeWidth="1.5" />
                
                {/* X-axis label ticks */}
                <line x1="50" y1="550" x2="50" y2="560" stroke="#666666" strokeWidth="1.5" />
                <text x="50" y="575" textAnchor="middle" fontSize="12" fill="#666666">0</text>
                
                <line x1="300" y1="550" x2="300" y2="560" stroke="#666666" strokeWidth="1.5" />
                <text x="300" y="575" textAnchor="middle" fontSize="12" fill="#666666">0.5</text>
                
                <line x1="550" y1="550" x2="550" y2="560" stroke="#666666" strokeWidth="1.5" />
                <text x="550" y="575" textAnchor="middle" fontSize="12" fill="#666666">1.0</text>
                
                {/* Y-axis label ticks */}
                <line x1="40" y1="550" x2="50" y2="550" stroke="#666666" strokeWidth="1.5" />
                <text x="35" y="555" textAnchor="end" fontSize="12" fill="#666666">0</text>
                
                <line x1="40" y1="300" x2="50" y2="300" stroke="#666666" strokeWidth="1.5" />
                <text x="35" y="305" textAnchor="end" fontSize="12" fill="#666666">0.5</text>
                
                <line x1="40" y1="50" x2="50" y2="50" stroke="#666666" strokeWidth="1.5" />
                <text x="35" y="55" textAnchor="end" fontSize="12" fill="#666666">1.0</text>
                
                {/* Plot comment dots */}
                {filteredComments.map((comment) => {
                  const x = 50 + comment.opinionScore * 500; // Scale to fit within the graph
                  const y = 550 - comment.positiveScore * 500; // Invert Y-axis to have positive values going up
                  const seriesClass = getSeriesClassName(comment.episodeId);
                  
                  let dotClasses = "cursor-pointer transition-all duration-200 hover:stroke-white";
                  
                  // Add series-specific classes
                  if (seriesClass === 'series-basic') {
                    dotClasses += " fill-green-100 stroke-green-300";
                  } else if (seriesClass === 'series-guest') {
                    dotClasses += " fill-blue-100 stroke-blue-300";
                  } else if (seriesClass === 'series-community') {
                    dotClasses += " fill-pink-100 stroke-pink-300";
                  }
                  
                  // Add selected class
                  if (selectedComment?.id === comment.id) {
                    dotClasses += " fill-white";
                    
                    if (seriesClass === 'series-basic') {
                      dotClasses += " stroke-green-500";
                    } else if (seriesClass === 'series-guest') {
                      dotClasses += " stroke-blue-500";
                    } else if (seriesClass === 'series-community') {
                      dotClasses += " stroke-pink-500";
                    }
                  }
                  
                  return (
                    <circle
                      key={comment.id}
                      cx={x}
                      cy={y}
                      r={selectedComment?.id === comment.id ? 6 : 4}
                      strokeWidth={selectedComment?.id === comment.id ? 2 : 1}
                      className={dotClasses}
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
                  className={`absolute z-10 p-3 bg-white shadow-lg rounded-lg border border-border-color max-w-xs
                    ${hoveredComment.opinionScore > 0.5
                      ? (hoveredComment.positiveScore > 0.5
                        ? "translate-x-4 translate-y-4" // Bottom Left
                        : "translate-x-4 -translate-y-full -mt-4") // Top Left
                      : (hoveredComment.positiveScore > 0.5
                        ? "-translate-x-full translate-y-4 -ml-4" // Bottom Right
                        : "-translate-x-full -translate-y-full -ml-4 -mt-4") // Top Right
                    }`}
                  style={{
                    left: `${50 + hoveredComment.opinionScore * 500}px`,
                    top: `${550 - hoveredComment.positiveScore * 500}px`,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="text-sm font-medium mb-1">
                    {getEpisodeTitle(hoveredComment.episodeId)} 
                    <span className="text-text-secondary text-xs ml-1">
                      ({getEpisodeSeries(hoveredComment.episodeId)})
                    </span>
                  </p>
                  <p className="text-text-primary mb-2 text-sm">{hoveredComment.text}</p>
                  <p className="m-0 text-xs text-text-muted text-right italic">by {hoveredComment.author}</p>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-4 mt-4">
              {!dropdownEpisodeId && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-100 border-2 border-green-300"></div>
                    <div>Basic Series</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-300"></div>
                    <div>Guest Series</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-pink-100 border-2 border-pink-300"></div>
                    <div>Community Series</div>
                  </div>
                </>
              )}
              {dropdownEpisodeId && (
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${
                    getSeriesClassName(dropdownEpisodeId) === 'series-basic' ? 'bg-green-100 border-2 border-green-300' :
                    getSeriesClassName(dropdownEpisodeId) === 'series-guest' ? 'bg-blue-100 border-2 border-blue-300' :
                    'bg-pink-100 border-2 border-pink-300'
                  }`}></div>
                  <div>{getEpisodeSeries(dropdownEpisodeId)}</div>
                </div>
              )}
            </div>
          </div>

          {/* Right side: Comments List */}
          <div className="flex-1 min-w-0">
            <div className="max-h-[600px] overflow-y-auto p-3 rounded bg-card" ref={commentsListRef}>
              <h3 className="m-0 mb-4 text-lg font-semibold text-text-primary pb-2 border-b border-border-color">
                コメント一覧 (フィードバック順)
              </h3>
              {sortedComments.map((comment) => (
                <div
                  key={comment.id}
                  data-comment-id={comment.id}
                  className={`p-3 mb-2 border rounded bg-background cursor-pointer transition-all duration-200 hover:border-primary hover:shadow-sm hover:-translate-y-px
                    ${selectedComment?.id === comment.id ? 'border-primary shadow-sm bg-opacity-50' : 'border-border-color'}`}
                  onClick={() => handleCommentItemClick(comment)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="m-0 text-sm font-medium">
                      {getEpisodeTitle(comment.episodeId)}
                      <span className="text-text-secondary text-xs ml-1">
                        ({getEpisodeSeries(comment.episodeId)})
                      </span>
                    </p>
                    <span className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                      {Math.round(comment.positiveScore * 100)}%
                    </span>
                  </div>
                  <p className="my-2 text-text-primary">{comment.text}</p>
                  <p className="text-right text-xs text-text-muted mb-2">by {comment.author}</p>
                  
                  {/* Feedback buttons */}
                  <div className="flex justify-end gap-2">
                    <button 
                      className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFeedback('empathy', comment);
                      }}
                      title="共感"
                    >
                      👍
                    </button>
                    <button 
                      className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFeedback('insight', comment);
                      }}
                      title="なるほど"
                    >
                      💡
                    </button>
                    <button 
                      className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
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