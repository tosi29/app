import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styles from '../styles/Home.module.css';
import BroadcastEmbed from './BroadcastEmbed';
import { PastBroadcast } from '../types/broadcast';

interface BroadcastsContentProps {
  pastBroadcasts: PastBroadcast[];
  isLoadingBroadcasts: boolean;
  visibleEmbeds: Set<number>;
  toggleEmbedVisibility: (id: number) => void;
  router: any;
  embedType: 'youtube' | 'spotify';
}

const BroadcastsContent = React.memo(({ 
  pastBroadcasts, 
  isLoadingBroadcasts, 
  visibleEmbeds, 
  toggleEmbedVisibility, 
  router,
  embedType
}: BroadcastsContentProps) => {
  // State to track which series are expanded
  const [expandedSeries, setExpandedSeries] = useState<Record<string, boolean>>({});
  
  // State for group display mode
  const [groupDisplayMode, setGroupDisplayMode] = useState<boolean>(true);
  
  // State for sorting in non-group mode
  const [sortColumn, setSortColumn] = useState<'date' | 'title' | 'duration'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Group broadcasts by series with ID-based sorting within groups
  const broadcastsBySeries = useMemo(() => {
    const grouped: Record<string, PastBroadcast[]> = {};
    pastBroadcasts.forEach(broadcast => {
      if (!grouped[broadcast.series]) {
        grouped[broadcast.series] = [];
      }
      grouped[broadcast.series].push(broadcast);
    });
    
    // Sort broadcasts within each group by ID
    Object.keys(grouped).forEach(series => {
      grouped[series].sort((a, b) => a.id - b.id);
    });
    
    return grouped;
  }, [pastBroadcasts]);

  // Sorted broadcasts for non-group mode
  const sortedBroadcasts = useMemo(() => {
    const sorted = [...pastBroadcasts];
    sorted.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortColumn) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'duration':
          aValue = a.duration;
          bValue = b.duration;
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  }, [pastBroadcasts, sortColumn, sortDirection]);
  
  useEffect(() => {
    const initialExpandedState: Record<string, boolean> = {};
    Object.keys(broadcastsBySeries).forEach(series => {
      initialExpandedState[series] = true; // Initially expanded
    });
    setExpandedSeries(initialExpandedState);
  }, [broadcastsBySeries]);

  // Toggle expanded state for a series
  const toggleSeries = useCallback((series: string) => {
    setExpandedSeries(prev => ({
      ...prev,
      [series]: !prev[series]
    }));
  }, []);
  
  // Expand all series
  const expandAllSeries = useCallback(() => {
    const allExpanded: Record<string, boolean> = {};
    Object.keys(broadcastsBySeries).forEach(series => {
      allExpanded[series] = true;
    });
    setExpandedSeries(allExpanded);
  }, [broadcastsBySeries]);
  
  // Collapse all series
  const collapseAllSeries = useCallback(() => {
    const allCollapsed: Record<string, boolean> = {};
    Object.keys(broadcastsBySeries).forEach(series => {
      allCollapsed[series] = false;
    });
    setExpandedSeries(allCollapsed);
  }, [broadcastsBySeries]);
  
  // Handle column sorting
  const handleSort = useCallback((column: 'date' | 'title' | 'duration') => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  }, [sortColumn]);

  // Get series list and create color mapping
  const seriesList = useMemo(() => Object.keys(broadcastsBySeries), [broadcastsBySeries]);
  
  // Function to get series color class based on index
  const getSeriesColorClass = useCallback((series: string) => {
    const index = seriesList.indexOf(series);
    const colorClasses = ['seriesColor0', 'seriesColor1', 'seriesColor2'];
    return styles[colorClasses[index % colorClasses.length]];
  }, [seriesList]);

  return (
    <>
      {isLoadingBroadcasts ? (
        <div className={styles.loading}>配信データを読み込み中...</div>
      ) : (
        <>
          {/* Display mode controls */}
          <div className={styles.displayControls}>
            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>表示モード:</label>
              <button
                onClick={() => setGroupDisplayMode(true)}
                className={`${styles.controlButton} ${groupDisplayMode ? styles.active : ''}`}
              >
                グループ表示
              </button>
              <button
                onClick={() => setGroupDisplayMode(false)}
                className={`${styles.controlButton} ${!groupDisplayMode ? styles.active : ''}`}
              >
                一覧表示
              </button>
            </div>
            
            {groupDisplayMode && (
              <div className={styles.controlGroup}>
                <button
                  onClick={expandAllSeries}
                  className={styles.controlButton}
                >
                  すべて展開
                </button>
                <button
                  onClick={collapseAllSeries}
                  className={styles.controlButton}
                >
                  すべて閉じる
                </button>
              </div>
            )}
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {groupDisplayMode ? (
                    <>
                      <th>日付</th>
                      <th>タイトル</th>
                      <th>再生時間</th>
                      <th>リンク</th>
                    </>
                  ) : (
                    <>
                      <th 
                        className={styles.sortableHeader}
                        onClick={() => handleSort('date')}
                      >
                        日付 {sortColumn === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th 
                        className={styles.sortableHeader}
                        onClick={() => handleSort('title')}
                      >
                        タイトル {sortColumn === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th 
                        className={styles.sortableHeader}
                        onClick={() => handleSort('duration')}
                      >
                        再生時間 {sortColumn === 'duration' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th>リンク</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {groupDisplayMode ? (
                  // Group display mode
                  Object.entries(broadcastsBySeries)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([series, broadcasts]) => (
                    <React.Fragment key={series}>
                      <tr 
                        className={`${styles.seriesHeader} ${getSeriesColorClass(series)}`}
                        onClick={() => toggleSeries(series)}
                      >
                        <td colSpan={4}>
                          <div className={styles.seriesToggle}>
                            <span className={`${styles.toggleIcon} ${expandedSeries[series] ? styles.expanded : ''}`}>
                              {expandedSeries[series] ? '▼' : '▶'}
                            </span>
                            <span className={styles.seriesName}>{series} ({broadcasts.length})</span>
                          </div>
                        </td>
                      </tr>
                      {expandedSeries[series] && broadcasts.map((broadcast) => (
                        <React.Fragment key={broadcast.id}>
                          <tr>
                            <td>{broadcast.date}</td>
                            <td>{broadcast.title}</td>
                            <td>{broadcast.duration}</td>
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
                              <td colSpan={4}>
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
                    </React.Fragment>
                  ))
                ) : (
                  // List display mode
                  sortedBroadcasts.map((broadcast) => (
                    <React.Fragment key={broadcast.id}>
                      <tr>
                        <td>{broadcast.date}</td>
                        <td>
                          <div className={styles.titleWithSeries}>
                            <div className={styles.broadcastTitle}>{broadcast.title}</div>
                            <div className={styles.broadcastSeries}>{broadcast.series}</div>
                          </div>
                        </td>
                        <td>{broadcast.duration}</td>
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
                          <td colSpan={4}>
                            <BroadcastEmbed 
                              broadcast={broadcast}
                              embedType={embedType}
                              height={152}
                            />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
});

BroadcastsContent.displayName = 'BroadcastsContent';

export default BroadcastsContent;