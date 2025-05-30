import Head from 'next/head'
import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import searchStyles from '../styles/Search.module.css'
import Tabs from '../components/Tabs'
import CommentsSection from '../components/CommentsSection'
import { PastBroadcast } from '../lib/broadcastData'

export default function Home() {
  const router = useRouter();
  const { tab, episodeId } = router.query;
  
  // State for broadcasts data
  const [pastBroadcasts, setPastBroadcasts] = useState<PastBroadcast[]>([]);
  const [isLoadingBroadcasts, setIsLoadingBroadcasts] = useState<boolean>(true);
  
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
    router.push({
      pathname: '/',
      query: tabId === 'comments' ? { tab: tabId } : 
             tabId === 'search' ? { tab: tabId } : {}
    }, undefined, { shallow: true });
  };

  // Content for the broadcasts tab
  const BroadcastsContent = () => {
    // State to track which series are expanded
    const [expandedSeries, setExpandedSeries] = useState<Record<string, boolean>>({});

    // Group broadcasts by series
    const broadcastsBySeries = useMemo(() => {
      const grouped: Record<string, PastBroadcast[]> = {};
      pastBroadcasts.forEach(broadcast => {
        if (!grouped[broadcast.series]) {
          grouped[broadcast.series] = [];
        }
        grouped[broadcast.series].push(broadcast);
      });
      return grouped;
    }, [pastBroadcasts]);

    // Initialize all series as expanded when component mounts
    useEffect(() => {
      const initialExpandedState: Record<string, boolean> = {};
      Object.keys(broadcastsBySeries).forEach(series => {
        initialExpandedState[series] = true; // Initially expanded
      });
      setExpandedSeries(initialExpandedState);
    }, [broadcastsBySeries]);

    // Toggle expanded state for a series
    const toggleSeries = (series: string) => {
      setExpandedSeries(prev => ({
        ...prev,
        [series]: !prev[series]
      }));
    };

    return (
      <>
        {isLoadingBroadcasts ? (
          <div className={styles.loading}>配信データを読み込み中...</div>
        ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>日付</th>
                <th>タイトル</th>
                <th>再生時間</th>
                <th>リンク</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(broadcastsBySeries)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([series, broadcasts]) => (
                <React.Fragment key={series}>
                  <tr 
                    className={`${styles.seriesHeader} ${styles[`series-${series.toLowerCase().split(' ')[0]}`]}`}
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
                    <tr 
                      key={broadcast.id} 
                      className={styles[`series-${broadcast.series.toLowerCase().split(' ')[0]}`]}
                    >
                      <td>{broadcast.date}</td>
                      <td>{broadcast.title}</td>
                      <td>{broadcast.duration}</td>
                      <td>
                        <a href="#" className={styles.link}>
                          再生
                        </a>
                        {' | '}
                        <button
                          type="button"
                          onClick={() => router.push(`/?tab=comments&episodeId=${broadcast.id}`)}
                          className={styles.commentButton}
                        >
                          <span className={styles.commentIcon}>💬</span>
                          コメントを見る
                        </button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </>
    );
  };

  // Content for the search tab
  const SearchContent = () => {
    // State for search form
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedSeries, setSelectedSeries] = useState<string>('');
    
    // State for search results
    const [searchResults, setSearchResults] = useState<PastBroadcast[]>([]);
    const [isSearched, setIsSearched] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    // Handle search form submission
    const handleSearch = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append('query', searchQuery);
      if (selectedSeries) queryParams.append('series', selectedSeries);
      
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
    };
    
    return (
      <>
        <div className={searchStyles.searchContainer}>
          <form onSubmit={handleSearch} className={searchStyles.searchForm}>
            <div className={searchStyles.formGroup}>
              <label htmlFor="searchQuery">検索キーワード</label>
              <input
                type="text"
                id="searchQuery"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="タイトルまたは概要で検索"
                className={searchStyles.input}
              />
            </div>
            
            <div className={searchStyles.formGroup}>
              <label htmlFor="series">シリーズ</label>
              <select
                id="series"
                value={selectedSeries}
                onChange={(e) => setSelectedSeries(e.target.value)}
                className={searchStyles.select}
              >
                <option value="">すべて</option>
                <option value="Basic Series">Basic Series</option>
                <option value="Guest Series">Guest Series</option>
                <option value="Community Series">Community Series</option>
              </select>
            </div>
            
            <div className={searchStyles.buttonContainer}>
              <button type="submit" className={searchStyles.searchButton} disabled={isLoading}>
                {isLoading ? '検索中...' : '検索'}
              </button>
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
                    <div className={searchStyles.resultActions}>
                      <button
                        onClick={() => router.push(`/?tab=comments&episodeId=${broadcast.id}`)}
                        className={styles.commentButton}
                      >
                        <span className={styles.commentIcon}>💬</span>
                        コメントを見る
                      </button>
                    </div>
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
  };

  // Pass the episodeId to CommentsSection when available
  const tabs = [
    {
      id: 'broadcasts',
      label: '配信一覧',
      content: <BroadcastsContent />
    },
    {
      id: 'search',
      label: '配信検索',
      content: <SearchContent />
    },
    {
      id: 'comments',
      label: 'コメント',
      content: <CommentsSection 
                 pastBroadcasts={pastBroadcasts}
                 selectedEpisodeId={episodeId ? Number(episodeId) : undefined}
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
      </div>

      <main className={styles.main}>
        {tabs.find(tab => tab.id === activeTab)?.content}
      </main>
    </div>
  )
}