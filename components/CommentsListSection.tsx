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
  // Use static data that matches the API response
  const apiComments: Comment[] = [
    { id: 8, episodeId: 3, text: '素晴らしい内容でした！', positiveScore: 0.9, opinionScore: 0.2, author: 'リスナー8' },
    { id: 3, episodeId: 2, text: 'わかりやすい説明をありがとうございます！', positiveScore: 0.9, opinionScore: 0.5, author: 'リスナー3' },
    { id: 5, episodeId: 4, text: 'ゲストのお話が特に参考になりました！', positiveScore: 0.8, opinionScore: 0.7, author: 'リスナー5' },
    { id: 1, episodeId: 1, text: '面白かったです！次回も楽しみにしています。', positiveScore: 0.8, opinionScore: 0.3, author: 'リスナー1' },
    { id: 4, episodeId: 3, text: 'すごく勉強になりました。', positiveScore: 0.7, opinionScore: 0.6, author: 'リスナー4' },
    { id: 6, episodeId: 5, text: 'もっと詳しく聞きたかったです。', positiveScore: 0.5, opinionScore: 0.8, author: 'リスナー6' },
    { id: 2, episodeId: 1, text: 'もう少し技術的な内容があると良かったです。', positiveScore: 0.4, opinionScore: 0.9, author: 'リスナー2' },
    { id: 7, episodeId: 2, text: 'あまり理解できませんでした...', positiveScore: 0.2, opinionScore: 0.6, author: 'リスナー7' }
  ];

  // Filter by episode if specified
  const filteredComments = selectedEpisodeId 
    ? apiComments.filter(c => c.episodeId === selectedEpisodeId)
    : apiComments;

  // Sort by feedback score (positiveScore) in descending order
  const comments = filteredComments.sort((a, b) => b.positiveScore - a.positiveScore);
  
  const loading = false;

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