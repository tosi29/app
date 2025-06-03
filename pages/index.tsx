import Head from 'next/head'
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import searchStyles from '../styles/Search.module.css'
import Tabs from '../components/Tabs'
import CommentsSection from '../components/CommentsSection'
import SpotifyPodcastEmbed from '../components/SpotifyPodcastEmbed'
import YouTube from '../components/YouTube'

interface PastBroadcast {
  id: number;
  date: string;
  title: string;
  excerpt: string;
  series: string;
  duration: string;
  url: string;
  youtube_video_id: string;
  spotify_episode_id: string;
  likeCount?: number;
}

// BroadcastsContent component extracted to prevent recreation on every render
const BroadcastsContent = React.memo(({ 
  pastBroadcasts, 
  isLoadingBroadcasts, 
  visibleEmbeds, 
  toggleEmbedVisibility, 
  router,
  embedType
}: {
  pastBroadcasts: PastBroadcast[];
  isLoadingBroadcasts: boolean;
  visibleEmbeds: Set<number>;
  toggleEmbedVisibility: (id: number) => void;
  router: any;
  embedType: 'youtube' | 'spotify';
}) => {
  // State to track which series are expanded
  const [expandedSeries, setExpandedSeries] = useState<Record<string, boolean>>({});
  
  // State for group display mode
  const [groupDisplayMode, setGroupDisplayMode] = useState<boolean>(true);
  
  // State for sorting in non-group mode
  const [sortColumn, setSortColumn] = useState<'date' | 'title' | 'duration' | 'likeCount'>('date');
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
        case 'likeCount':
          aValue = a.likeCount || 0;
          bValue = b.likeCount || 0;
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
  const handleSort = useCallback((column: 'date' | 'title' | 'duration' | 'likeCount') => {
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
                      <th>👍</th>
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
                      <th 
                        className={styles.sortableHeader}
                        onClick={() => handleSort('likeCount')}
                      >
                        👍 {sortColumn === 'likeCount' && (sortDirection === 'asc' ? '↑' : '↓')}
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
                        <td colSpan={5}>
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
                            <td>{broadcast.likeCount || ''}</td>
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
                              <td colSpan={5}>
                                {embedType === 'spotify' ? (
                                  <SpotifyPodcastEmbed 
                                    episodeId={broadcast.spotify_episode_id}
                                    height="152"
                                  />
                                ) : (
                                  <YouTube 
                                    videoId={broadcast.youtube_video_id}
                                    width={560}
                                    height={315}
                                  />
                                )}
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
                        <td>{broadcast.likeCount || ''}</td>
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
                          <td colSpan={5}>
                            {embedType === 'spotify' ? (
                              <SpotifyPodcastEmbed 
                                episodeId={broadcast.spotify_episode_id}
                                height="152"
                              />
                            ) : (
                              <YouTube 
                                videoId={broadcast.youtube_video_id}
                                width={560}
                                height={315}
                              />
                            )}
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

// SearchContent component extracted to prevent recreation on every render
const SearchContent = React.memo(({ 
  visibleEmbeds, 
  toggleEmbedVisibility, 
  router,
  embedType
}: {
  visibleEmbeds: Set<number>;
  toggleEmbedVisibility: (id: number) => void;
  router: any;
  embedType: 'youtube' | 'spotify';
}) => {
  // State for search form
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // State for search results
  const [searchResults, setSearchResults] = useState<PastBroadcast[]>([]);
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Handle search form submission
  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    if (searchQuery) queryParams.append('query', searchQuery);
    
    try {
      // Call the API endpoint
      const response = await fetch(`/api/search-broadcasts?${queryParams.toString()}`);
      const data = await response.json();
      
      setSearchResults(data);
      setIsSearched(true);
    } catch (error) {
      console.error('Error searching broadcasts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);
  
  return (
    <>
      <div className={searchStyles.searchContainer}>
        <form onSubmit={handleSearch} className={searchStyles.searchForm}>
          <div className={searchStyles.formGroup}>
            <label htmlFor="searchQuery">検索キーワード</label>
            <div className={searchStyles.inputButtonContainer}>
              <input
                type="text"
                id="searchQuery"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="タイトルまたは概要で検索"
                className={searchStyles.input}
              />
              <button type="submit" className={searchStyles.searchButton} disabled={isLoading}>
                {isLoading ? '検索中...' : '検索'}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {isSearched && (
        <div className={styles.tableContainer}>
          <h2 className={searchStyles.resultsTitle}>
            検索結果: {searchResults.length}件
          </h2>
          
          {searchResults.length > 0 ? (
            <div className={searchStyles.searchResults}>
              {searchResults.map((broadcast) => (
                <div key={broadcast.id} className={searchStyles.resultCard}>
                  <h3 className={searchStyles.resultTitle}>{broadcast.title}</h3>
                  <div className={searchStyles.resultSeries}>{broadcast.series}</div>
                  <div className={searchStyles.resultExcerpt}>{broadcast.excerpt}</div>
                  {broadcast.likeCount && (
                    <div className={searchStyles.resultLikes}>👍 {broadcast.likeCount}</div>
                  )}
                  <div className={searchStyles.resultActions}>
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
                      onClick={() => router.push(`/?tab=comments&episodeId=${broadcast.id}`)}
                      className={styles.iconButton}
                      aria-label="コメントを見る"
                    >
                      💬
                    </button>
                  </div>
                  {visibleEmbeds.has(broadcast.id) && (
                    <div style={{ marginTop: '1rem' }}>
                      {embedType === 'spotify' ? (
                        <SpotifyPodcastEmbed 
                          episodeId={broadcast.spotify_episode_id}
                          height="200"
                        />
                      ) : (
                        <YouTube 
                          videoId={broadcast.youtube_video_id}
                          width={560}
                          height={315}
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className={searchStyles.noResults}>該当する配信はありません。</p>
          )}
        </div>
      )}
    </>
  );
});

SearchContent.displayName = 'SearchContent';

export default function Home() {
  const router = useRouter();
  const { tab, episodeId } = router.query;
  
  // State for broadcasts data
  const [pastBroadcasts, setPastBroadcasts] = useState<PastBroadcast[]>([]);
  const [isLoadingBroadcasts, setIsLoadingBroadcasts] = useState<boolean>(true);
  
  // State for tracking visible embeds
  const [visibleEmbeds, setVisibleEmbeds] = useState<Set<number>>(new Set());
  
  // State for tracking embed type preference (YouTube or Spotify)
  const [embedType, setEmbedType] = useState<'youtube' | 'spotify'>('spotify');
  
  // Set active tab based on URL parameter
  const [activeTab, setActiveTab] = useState<string>(
    router.query.tab === 'comments' ? 'comments' : 
    router.query.tab === 'search' ? 'search' : 'broadcasts'
  );
  
  // Fetch broadcasts data from API
  useEffect(() => {
    const fetchBroadcasts = async () => {
      try {
        setIsLoadingBroadcasts(true);
        const response = await fetch('/api/broadcasts');
        if (response.ok) {
          const data = await response.json();
          setPastBroadcasts(data);
        } else {
          console.error('Failed to fetch broadcasts');
        }
      } catch (error) {
        console.error('Error fetching broadcasts:', error);
      } finally {
        setIsLoadingBroadcasts(false);
      }
    };

    fetchBroadcasts();
  }, []);
  
  useEffect(() => {
    if (router.isReady) {
      if (tab === 'comments') {
        setActiveTab('comments');
      } else if (tab === 'search') {
        setActiveTab('search');
      } else {
        setActiveTab('broadcasts');
      }
    }
  }, [router.isReady, tab]);

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Use replace instead of push to prevent unnecessary history entries
    router.replace({
      pathname: '/',
      query: tabId === 'comments' ? { tab: tabId } : 
             tabId === 'search' ? { tab: tabId } : {}
    }, undefined, { shallow: true });
  };

  // Toggle Spotify embed visibility
  const toggleEmbedVisibility = useCallback((broadcastId: number) => {
    setVisibleEmbeds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(broadcastId)) {
        newSet.delete(broadcastId);
      } else {
        newSet.add(broadcastId);
      }
      return newSet;
    });
  }, []);

  // Pass the episodeId to CommentsSection when available
  const tabs = [
    {
      id: 'broadcasts',
      label: '配信一覧',
      content: <BroadcastsContent 
                pastBroadcasts={pastBroadcasts}
                isLoadingBroadcasts={isLoadingBroadcasts}
                visibleEmbeds={visibleEmbeds}
                toggleEmbedVisibility={toggleEmbedVisibility}
                router={router}
                embedType={embedType}
              />
    },
    {
      id: 'search',
      label: '配信検索',
      content: <SearchContent 
                visibleEmbeds={visibleEmbeds}
                toggleEmbedVisibility={toggleEmbedVisibility}
                router={router}
                embedType={embedType}
              />
    },
    {
      id: 'comments',
      label: 'コメント',
      content: <CommentsSection 
                 pastBroadcasts={pastBroadcasts}
                 selectedEpisodeId={episodeId ? Number(episodeId) : undefined}
                 key="comments-section" // Add a stable key to prevent remounting
               />
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>配信一覧 | Next.js App</title>
        <meta name="description" content="配信一覧ページ" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.tabsSection}>
        <Tabs 
          active={activeTab} 
          tabs={tabs} 
          onTabChange={handleTabChange} 
        />
        <div className={styles.globalToggle}>
          <label style={{ marginRight: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>再生プラットフォーム:</label>
          <button
            onClick={() => setEmbedType('spotify')}
            style={{
              marginRight: '0.5rem',
              padding: '0.5rem 1rem',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius)',
              backgroundColor: embedType === 'spotify' ? 'var(--primary-color)' : 'var(--card-background)',
              color: embedType === 'spotify' ? 'white' : 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            Spotify
          </button>
          <button
            onClick={() => setEmbedType('youtube')}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius)',
              backgroundColor: embedType === 'youtube' ? 'var(--primary-color)' : 'var(--card-background)',
              color: embedType === 'youtube' ? 'white' : 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            YouTube
          </button>
        </div>
      </div>

      <main className={styles.main}>
        {tabs.find(tab => tab.id === activeTab)?.content}
      </main>
    </div>
  )
}