import React, { useState, useEffect } from 'react';
import commentStyles from '../styles/Comments.module.css';

interface Comment {
  id: number;
  episodeId: number;
  text: string;
  positiveScore: number; // 0 to 1 where 1 is most positive
  opinionScore: number; // 0 to 1 where 1 is pure opinion (vs reaction)
  author: string;
}

interface CommentsListSectionProps {
  selectedEpisodeId?: number;
  selectedCommentId?: number | null;
  onCommentSelect: (commentId: number) => void;
}

export default function CommentsListSection({ 
  selectedEpisodeId, 
  selectedCommentId, 
  onCommentSelect 
}: CommentsListSectionProps): React.ReactNode {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        // Construct API URL with episodeId if it exists
        const url = selectedEpisodeId 
          ? `/api/comments?episodeId=${selectedEpisodeId}`
          : '/api/comments';
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Sort comments by feedback score (positiveScore) in descending order
        const sortedComments = data.sort((a: Comment, b: Comment) => {
          return b.positiveScore - a.positiveScore;
        });
        
        setComments(sortedComments);
        
      } catch (error) {
        console.error('Error fetching comments:', error);
        // Fallback to empty array
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    // Only run on client side
    if (typeof window !== 'undefined') {
      fetchComments();
    } else {
      // For SSR, set loading to false and use empty array
      setLoading(false);
    }
  }, [selectedEpisodeId]);

  const formatFeedbackScore = (score: number): string => {
    return `${Math.round(score * 100)}%`;
  };

  const handleCommentClick = (commentId: number) => {
    onCommentSelect(commentId);
  };

  return (
    <div className={commentStyles.commentsList}>
      <h3 className={commentStyles.commentsListTitle}>
        {selectedEpisodeId 
          ? `エピソード #${selectedEpisodeId} のコメント` 
          : 'すべてのコメント'}
        <span style={{ fontSize: '0.8rem', fontWeight: 'normal', marginLeft: '0.5rem' }}>
          (フィードバック順)
        </span>
      </h3>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
          コメントを読み込んでいます...
        </div>
      ) : comments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
          コメントがありません
        </div>
      ) : (
        comments.map((comment) => (
          <div 
            key={comment.id}
            className={`${commentStyles.commentItem} ${
              selectedCommentId === comment.id ? commentStyles.selected : ''
            }`}
            onClick={() => handleCommentClick(comment.id)}
          >
            <div className={commentStyles.commentHeader}>
              <div className={commentStyles.commentEpisodeInfo}>
                エピソード #{comment.episodeId}
              </div>
              <div className={commentStyles.commentFeedbackScore}>
                フィードバック: {formatFeedbackScore(comment.positiveScore)}
              </div>
            </div>
            
            <div className={commentStyles.commentContent}>
              {comment.text}
            </div>
            
            <div className={commentStyles.commentAuthor}>
              by {comment.author}
            </div>
          </div>
        ))
      )}
    </div>
  );
}