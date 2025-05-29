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
  matchedChunk?: string; // Optional field for matched text chunk
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
    { id: 6, date: '2023-05-20', title: 'Episode 6: Data Analysis Fundamentals', description: 'Understanding the basics of data analysis and visualization', series: 'Basic Series', duration: '33:12' },
    { id: 7, date: '2023-05-27', title: 'Episode 7: Industry Expert Panel', description: 'Panel discussion with leading industry experts', series: 'Guest Series', duration: '45:18' },
    { id: 8, date: '2023-06-03', title: 'Episode 8: User Feedback Session', description: 'Addressing user questions and feedback from our community', series: 'Community Series', duration: '29:44' },
    { id: 9, date: '2023-06-10', title: 'Episode 9: Best Practices Guide', description: 'Essential best practices and common pitfalls to avoid', series: 'Basic Series', duration: '37:21' },
    { id: 10, date: '2023-06-17', title: 'Episode 10: Special Achievement Milestone', description: 'Celebrating our 10th episode with special guests and reflections', series: 'Guest Series', duration: '52:15' },
    { id: 11, date: '2023-06-24', title: 'Episode 11: Live Q&A Session', description: 'Interactive live session answering real-time community questions', series: 'Community Series', duration: '41:33' },
    { id: 12, date: '2023-07-01', title: 'Episode 12: Advanced Implementation Strategies', description: 'Advanced techniques for real-world implementation scenarios', series: 'Basic Series', duration: '39:07' },
    { id: 13, date: '2023-07-08', title: 'Episode 13: Innovation Showcase', description: 'Featuring innovative approaches from guest innovators', series: 'Guest Series', duration: '44:52' },
    { id: 14, date: '2023-07-15', title: 'Episode 14: Community Success Stories', description: 'Highlighting success stories and achievements from our community', series: 'Community Series', duration: '35:28' },
    { id: 15, date: '2023-07-22', title: 'Episode 15: Future Trends and Predictions', description: 'Exploring future trends and making predictions for the industry', series: 'Basic Series', duration: '40:19' },
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

    return (
      <>
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
                    {broadcast.matchedChunk && (
                      <div className={searchStyles.resultChunk}>{broadcast.matchedChunk}</div>
                    )}
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