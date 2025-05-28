import Head from 'next/head'
import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import searchStyles from '../styles/Search.module.css'
import Tabs from '../components/Tabs'
import CommentsSection from '../components/CommentsSection'

interface PastBroadcast {
  id: number;
  date: string;
  title: string;
  description: string;
  series: string;
  duration: string;
}

export default function Home() {
  const router = useRouter();
  const { tab, episodeId } = router.query;
  
  // Set active tab based on URL parameter
  const [activeTab, setActiveTab] = useState<string>(
    router.query.tab === 'comments' ? 'comments' : 
    router.query.tab === 'search' ? 'search' : 'broadcasts'
  );
  
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

  // Sample data for past broadcasts
  const pastBroadcasts: PastBroadcast[] = [
    { id: 1, date: '2023-04-15', title: 'Episode 1: Introduction', description: 'The first episode of our podcast series', series: 'Basic Series', duration: '25:30' },
    { id: 2, date: '2023-04-22', title: 'Episode 2: Getting Started', description: 'How to get started with our topic', series: 'Basic Series', duration: '31:45' },
    { id: 3, date: '2023-04-29', title: 'Episode 3: Advanced Techniques', description: 'Deep dive into advanced techniques', series: 'Basic Series', duration: '42:18' },
    { id: 4, date: '2023-05-06', title: 'Episode 4: Special Guest Interview', description: 'Interview with a special guest', series: 'Guest Series', duration: '38:22' },
    { id: 5, date: '2023-05-13', title: 'Episode 5: Community Questions', description: 'Answering questions from our community', series: 'Community Series', duration: '27:55' },
  ]

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
    }, []);

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

    // Navigate to search tab
    const goToSearch = () => {
      handleTabChange('search');
    };

    return (
      <>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>過去の配信一覧</h1>
          <button onClick={goToSearch} className={styles.searchButton}>
            配信検索
          </button>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>日付</th>
                <th>シリーズ</th>
                <th>タイトル</th>
                <th>再生時間</th>
                <th>リンク</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(broadcastsBySeries).map(([series, broadcasts]) => (
                <React.Fragment key={series}>
                  <tr 
                    className={`${styles.seriesHeader} ${styles[`series-${series.toLowerCase().split(' ')[0]}`]}`}
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
                    <tr 
                      key={broadcast.id} 
                      className={styles[`series-${broadcast.series.toLowerCase().split(' ')[0]}`]}
                    >
                      <td>{broadcast.date}</td>
                      <td>{broadcast.series}</td>
                      <td>{broadcast.title}</td>
                      <td>{broadcast.duration}</td>
                      <td>
                        <a href="#" className={styles.link}>
                          再生
                        </a>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  // Content for the search tab
  const SearchContent = () => {
    // State for search form
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedSeries, setSelectedSeries] = useState<string>('');
    const [dateFrom, setDateFrom] = useState<string>('');
    const [dateTo, setDateTo] = useState<string>('');
    
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
      if (dateFrom) queryParams.append('dateFrom', dateFrom);
      if (dateTo) queryParams.append('dateTo', dateTo);
      
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
        <h1 className={styles.title}>配信検索</h1>
        
        <div className={searchStyles.searchContainer}>
          <form onSubmit={handleSearch} className={searchStyles.searchForm}>
            <div className={searchStyles.formGroup}>
              <label htmlFor="searchQuery">検索キーワード</label>
              <input
                type="text"
                id="searchQuery"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="タイトルまたは説明で検索"
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
            
            <div className={searchStyles.formRow}>
              <div className={searchStyles.formGroup}>
                <label htmlFor="dateFrom">日付（から）</label>
                <input
                  type="date"
                  id="dateFrom"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className={searchStyles.input}
                />
              </div>
              
              <div className={searchStyles.formGroup}>
                <label htmlFor="dateTo">日付（まで）</label>
                <input
                  type="date"
                  id="dateTo"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className={searchStyles.input}
                />
              </div>
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
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>日付</th>
                    <th>シリーズ</th>
                    <th>タイトル</th>
                    <th>再生時間</th>
                    <th>詳細</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((broadcast) => (
                    <tr key={broadcast.id}>
                      <td>{broadcast.date}</td>
                      <td>{broadcast.series}</td>
                      <td>{broadcast.title}</td>
                      <td>{broadcast.duration}</td>
                      <td>
                        <button
                          onClick={() => router.push(`/?tab=comments&episodeId=${broadcast.id}`)}
                          className={styles.link}
                        >
                          詳細
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
      label: '過去の配信',
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
        <title>過去の配信一覧 | Next.js App</title>
        <meta name="description" content="過去の配信一覧ページ" />
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