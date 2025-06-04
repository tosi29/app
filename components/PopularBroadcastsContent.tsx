import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { NextRouter } from 'next/router';
import styles from '../styles/Home.module.css';
import BroadcastEmbed from './BroadcastEmbed';
import { PopularBroadcast } from '../types/broadcast';

interface PopularBroadcastsContentProps {
  visibleEmbeds: Set<number>;
  toggleEmbedVisibility: (broadcastId: number) => void;
  router: NextRouter;
  embedType: 'youtube' | 'spotify';
}

export default function PopularBroadcastsContent({
  visibleEmbeds,
  toggleEmbedVisibility,
  router,
  embedType
}: PopularBroadcastsContentProps) {
  const [popularBroadcasts, setPopularBroadcasts] = useState<PopularBroadcast[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sortColumn, setSortColumn] = useState<'viewCount' | 'commentCount' | 'likeCount' | 'title' | 'date'>('viewCount');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Fetch popular broadcasts data
  useEffect(() => {
    const fetchPopularBroadcasts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/popular-broadcasts');
        if (response.ok) {
          const data = await response.json();
          setPopularBroadcasts(data);
        } else {
          console.error('Failed to fetch popular broadcasts');
        }
      } catch (error) {
        console.error('Error fetching popular broadcasts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularBroadcasts();
  }, []);

  // Sort broadcasts
  const sortedBroadcasts = useMemo(() => {
    const sorted = [...popularBroadcasts];
    sorted.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortColumn) {
        case 'viewCount':
          aValue = a.viewCount;
          bValue = b.viewCount;
          break;
        case 'commentCount':
          aValue = a.commentCount;
          bValue = b.commentCount;
          break;
        case 'likeCount':
          aValue = a.likeCount || 0;
          bValue = b.likeCount || 0;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  }, [popularBroadcasts, sortColumn, sortDirection]);

  // Handle sort
  const handleSort = useCallback((column: typeof sortColumn) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  }, [sortColumn]);

  if (isLoading) {
    return <div className={styles.loading}>人気の配信データを読み込み中...</div>;
  }

  return (
    <>
      <div className={styles.tableContainer}>
        {/* Desktop table view */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th 
                className={styles.sortableHeader}
                onClick={() => handleSort('title')}
              >
                タイトル {sortColumn === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className={styles.sortableHeader}
                onClick={() => handleSort('viewCount')}
              >
                再生回数 {sortColumn === 'viewCount' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className={styles.sortableHeader}
                onClick={() => handleSort('commentCount')}
              >
                コメント数 {sortColumn === 'commentCount' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className={styles.sortableHeader}
                onClick={() => handleSort('likeCount')}
              >
                👍 {sortColumn === 'likeCount' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className={styles.sortableHeader}
                onClick={() => handleSort('date')}
              >
                日付 {sortColumn === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th>リンク</th>
            </tr>
          </thead>
          <tbody>
            {sortedBroadcasts.map((broadcast) => (
              <React.Fragment key={broadcast.id}>
                <tr>
                  <td>
                    <div className={styles.titleWithSeries}>
                      <div className={styles.broadcastTitle}>{broadcast.title}</div>
                      <div className={styles.broadcastSeries}>{broadcast.series}</div>
                    </div>
                  </td>
                  <td>{broadcast.viewCount.toLocaleString()}</td>
                  <td>{broadcast.commentCount}</td>
                  <td>{broadcast.likeCount || ''}</td>
                  <td>{broadcast.date}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => toggleEmbedVisibility(broadcast.id)}
                      className={styles.iconButton}
                      aria-label={visibleEmbeds.has(broadcast.id) ? '非表示' : '再生'}
                    >
                      {visibleEmbeds.has(broadcast.id) ? '⏹️' : '▶️'}
                    </button>
                    {' '}
                    <button
                      type="button"
                      onClick={() => router.push(`/?tab=comments&episodeId=${broadcast.id}`)}
                      className={styles.iconButton}
                      aria-label="コメントを見る"
                    >
                      💬
                    </button>
                  </td>
                </tr>
                {visibleEmbeds.has(broadcast.id) && (
                  <tr>
                    <td colSpan={6}>
                      <BroadcastEmbed
                        broadcast={broadcast}
                        embedType={embedType}
                        height={152}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {/* Mobile card view */}
        <div className={styles.mobileCardList}>
          {sortedBroadcasts.map((broadcast) => (
            <div key={broadcast.id} className={styles.mobileCard}>
              <div className={styles.mobileCardContent}>
                <div className={styles.mobileCardRow}>
                  <span className={styles.mobileCardLabel}>シリーズ</span>
                  <span className={styles.mobileCardValue}>{broadcast.series}</span>
                </div>
                <div className={styles.mobileCardRow}>
                  <span className={styles.mobileCardLabel}>タイトル</span>
                  <span className={`${styles.mobileCardValue} ${styles.mobileCardTitle}`}>
                    {broadcast.title}
                  </span>
                </div>
                <div className={styles.mobileCardRow}>
                  <span className={styles.mobileCardLabel}>再生回数</span>
                  <span className={styles.mobileCardValue}>{broadcast.viewCount.toLocaleString()}</span>
                </div>
                <div className={styles.mobileCardRow}>
                  <span className={styles.mobileCardLabel}>コメント数</span>
                  <span className={styles.mobileCardValue}>{broadcast.commentCount}</span>
                </div>
                <div className={styles.mobileCardRow}>
                  <span className={styles.mobileCardLabel}>👍</span>
                  <span className={styles.mobileCardValue}>{broadcast.likeCount || '-'}</span>
                </div>
                <div className={styles.mobileCardRow}>
                  <span className={styles.mobileCardLabel}>日付</span>
                  <span className={styles.mobileCardValue}>{broadcast.date}</span>
                </div>
                <div className={styles.mobileCardActions}>
                  <button
                    type="button"
                    onClick={() => toggleEmbedVisibility(broadcast.id)}
                    className={styles.iconButton}
                    aria-label={visibleEmbeds.has(broadcast.id) ? '非表示' : '再生'}
                  >
                    {visibleEmbeds.has(broadcast.id) ? '⏹️' : '▶️'}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push(`/?tab=comments&episodeId=${broadcast.id}`)}
                    className={styles.iconButton}
                    aria-label="コメントを見る"
                  >
                    💬
                  </button>
                </div>
              </div>
              {visibleEmbeds.has(broadcast.id) && (
                <div className={styles.mobileCardEmbed}>
                  <BroadcastEmbed
                    broadcast={broadcast}
                    embedType={embedType}
                    height={152}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}