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
          className="p-2 rounded border border-border bg-background text-text-primary text-sm"
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
          <div className="w-10 h-10 border-3 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center my-8 text-text-secondary">
          コメントはありません
        </div>
      ) : (

      <div className="w-full max-w-[1400px] my-8 p-6 border border-border rounded-lg bg-card overflow-x-auto shadow-md">
        <div className="flex gap-8 w-full md:flex-row flex-col">
          {/* Left side: Graph */}
          <div className="flex-1 min-w-0">
            <div 
              className="relative w-[600px] h-[600px] mx-auto sm:scale-100 sm:origin-top-left xs:scale-75 xs:origin-top-left"
              onClick={handleClickOutside}
            >
              <div className="absolute top-1/2 left-[-40px] transform -translate-y-1/2 -rotate-90 text-sm text-text-secondary font-medium">ポジティブ ↑</div>
              <div className="absolute bottom-[10px] left-1/2 transform -translate-x-1/2 text-sm text-text-secondary font-medium">← リアクション | 意見 →</div>

              <svg width="600" height="600" className="bg-black/[0.02] rounded transition-all duration-300 hover:shadow-sm">
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
                      r={selectedComment?.id === comment.id ? 10 : 5}
                      className={`cursor-pointer transition-all duration-300 hover:stroke-white hover:stroke-2 hover:r-[10px] ${
                        selectedComment?.id === comment.id ? 'stroke-white stroke-2 filter drop-shadow-lg' : 'stroke-white stroke-1'
                      }`}
                      style={{
                        fill: seriesClass === 'commentDot-basic' ? 'rgba(144, 238, 144, 0.7)' : 
                              seriesClass === 'commentDot-guest' ? 'rgba(173, 216, 230, 0.7)' : 
                              seriesClass === 'commentDot-community' ? 'rgba(255, 182, 193, 0.7)' : 'var(--primary-color)'
                      }}
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
                  className={`absolute bg-card border border-border rounded-lg p-3 w-[250px] shadow-lg z-10 transition-all duration-200 ${
                    hoveredComment.opinionScore > 0.5
                      ? (hoveredComment.positiveScore > 0.5
                        ? 'translate-y-[10px] -translate-x-1/2' // bottom-left
                        : '-translate-y-full -translate-x-1/2 -translate-y-[10px]') // top-left
                      : (hoveredComment.positiveScore > 0.5
                        ? 'translate-y-[10px] translate-x-1/2' // bottom-right
                        : '-translate-y-full translate-x-1/2 -translate-y-[10px]') // top-right
                  }`}
                  style={{
                    left: `${50 + hoveredComment.opinionScore * 500}px`,
                    top: `${550 - hoveredComment.positiveScore * 500}px`,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="text-sm text-text-secondary mb-1">
                    {getEpisodeTitle(hoveredComment.episodeId)} 
                    <span className="ml-1 text-xs text-text-muted">
                      ({getEpisodeSeries(hoveredComment.episodeId)})
                    </span>
                  </p>
                  <p className="text-base mb-2">{hoveredComment.text}</p>
                  <p className="text-xs text-text-muted italic">by {hoveredComment.author}</p>
                </div>
              )}
            </div>

            <div className="flex justify-center mt-4 gap-4 flex-wrap">
              {!dropdownEpisodeId && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-400"></div>
                    <div className="text-sm">Basic Series</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-400"></div>
                    <div className="text-sm">Guest Series</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-pink-400"></div>
                    <div className="text-sm">Community Series</div>
                  </div>
                </>
              )}
              {dropdownEpisodeId && (
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${
                    getSeriesClassName(dropdownEpisodeId) === 'commentDot-basic' ? 'bg-green-400' : 
                    getSeriesClassName(dropdownEpisodeId) === 'commentDot-guest' ? 'bg-blue-400' : 
                    getSeriesClassName(dropdownEpisodeId) === 'commentDot-community' ? 'bg-pink-400' : 'bg-primary'
                  }`}></div>
                  <div className="text-sm">{getEpisodeSeries(dropdownEpisodeId)}</div>
                </div>
              )}
            </div>
          </div>

          {/* Right side: Comments List */}
          <div className="flex-1 min-w-0">
            <div className="p-4 overflow-y-auto max-h-[600px]" ref={commentsListRef}>
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-border">
                コメント一覧 (フィードバック順)
              </h3>
              {sortedComments.map((comment) => (
                <div
                  key={comment.id}
                  data-comment-id={comment.id}
                  className={`p-4 mb-3 rounded-lg border border-border bg-white transition-all cursor-pointer hover:shadow-md ${
                    selectedComment?.id === comment.id ? 'border-primary-dark shadow-md' : ''
                  }`}
                  onClick={() => handleCommentItemClick(comment)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm text-text-secondary mb-1">
                      {getEpisodeTitle(comment.episodeId)}
                      <span className="ml-1 text-xs text-text-muted">
                        ({getEpisodeSeries(comment.episodeId)})
                      </span>
                    </p>
                    <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-full">
                      {Math.round(comment.positiveScore * 100)}%
                    </span>
                  </div>
                  <p className="text-base mb-2">{comment.text}</p>
                  <p className="text-xs text-text-muted italic text-right">by {comment.author}</p>
                  
                  {/* Feedback buttons */}
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <button 
                      className="px-2 py-1 border border-border rounded bg-background text-text-primary text-xs font-medium cursor-pointer transition-all duration-200 flex items-center gap-1 hover:bg-primary hover:text-white hover:border-primary hover:-translate-y-px active:translate-y-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFeedback('empathy', comment);
                      }}
                      title="共感"
                    >
                      👍
                    </button>
                    <button 
                      className="px-2 py-1 border border-border rounded bg-background text-text-primary text-xs font-medium cursor-pointer transition-all duration-200 flex items-center gap-1 hover:bg-primary hover:text-white hover:border-primary hover:-translate-y-px active:translate-y-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFeedback('insight', comment);
                      }}
                      title="なるほど"
                    >
                      💡
                    </button>
                    <button 
                      className="px-2 py-1 border border-border rounded bg-background text-text-primary text-xs font-medium cursor-pointer transition-all duration-200 flex items-center gap-1 hover:bg-primary hover:text-white hover:border-primary hover:-translate-y-px active:translate-y-0"
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