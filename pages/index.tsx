import Head from 'next/head'
import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import Tabs from '../components/Tabs'
import CommentsSection from '../components/CommentsSection'

interface PastBroadcast {
  id: number;
  date: string;
  title: string;
  excerpt: string;
  series: string;
  duration: string;
  url: string;
}

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
    // Use replace instead of push to prevent unnecessary history entries
    router.replace({
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
          <div className="text-center text-text-secondary py-8">配信データを読み込み中...</div>
        ) : (
        <div className="w-full max-w-[1000px] my-6 overflow-x-auto rounded-lg shadow-md bg-card">
          <table className="w-full border-collapse border-spacing-0 mb-0">
            <thead>
              <tr>
                <th className="p-3 text-left border-b border-border-color bg-opacity-5 bg-black font-semibold text-text-primary sticky top-0 first:rounded-tl-lg last:rounded-tr-lg">日付</th>
                <th className="p-3 text-left border-b border-border-color bg-opacity-5 bg-black font-semibold text-text-primary sticky top-0">タイトル</th>
                <th className="p-3 text-left border-b border-border-color bg-opacity-5 bg-black font-semibold text-text-primary sticky top-0">再生時間</th>
                <th className="p-3 text-left border-b border-border-color bg-opacity-5 bg-black font-semibold text-text-primary sticky top-0 last:rounded-tr-lg">リンク</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(broadcastsBySeries)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([series, broadcasts]) => (
                <React.Fragment key={series}>
                  <tr 
                    className={`cursor-pointer font-semibold transition-colors duration-200 hover:bg-opacity-5 hover:bg-black
                      ${series.toLowerCase().includes('basic') ? 'bg-green-50 border-l-4 border-green-300' : 
                      series.toLowerCase().includes('guest') ? 'bg-blue-50 border-l-4 border-blue-300' : 
                      'bg-pink-50 border-l-4 border-pink-300'}`}
                    onClick={() => toggleSeries(series)}
                  >
                    <td colSpan={4}>
                      <div className="flex items-center gap-1.5 py-1.5">
                        <span className="inline-flex items-center justify-center text-xs transition-transform duration-200 w-4 h-4">
                          {expandedSeries[series] ? '▼' : '▶'}
                        </span>
                        <span className="font-semibold">{series} ({broadcasts.length})</span>
                      </div>
                    </td>
                  </tr>
                  {expandedSeries[series] && broadcasts.map((broadcast) => (
                    <tr 
                      key={broadcast.id} 
                      className={`
                        ${series.toLowerCase().includes('basic') ? 'bg-green-50 border-l-4 border-green-300' : 
                        series.toLowerCase().includes('guest') ? 'bg-blue-50 border-l-4 border-blue-300' : 
                        'bg-pink-50 border-l-4 border-pink-300'}`}
                    >
                      <td className="p-3 text-left border-b border-border-color">{broadcast.date}</td>
                      <td className="p-3 text-left border-b border-border-color">{broadcast.title}</td>
                      <td className="p-3 text-left border-b border-border-color">{broadcast.duration}</td>
                      <td className="p-3 text-left border-b border-border-color">
                        <a 
                          href={broadcast.url} 
                          className="text-primary no-underline px-3 py-1.5 rounded bg-primary bg-opacity-10 transition-all duration-200 inline-block font-medium hover:bg-primary hover:text-white"
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          再生
                        </a>
                        {' | '}
                        <button
                          type="button"
                          onClick={() => router.push(`/?tab=comments&episodeId=${broadcast.id}`)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md border-none text-sm font-semibold cursor-pointer transition-all duration-300 shadow-sm hover:-translate-y-0.5 hover:shadow-md relative overflow-hidden"
                        >
                          <span className="text-base opacity-90">💬</span>
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
        <div className="w-full max-w-[800px] p-6 bg-card rounded-lg shadow-md mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="flex flex-col space-y-2">
              <label htmlFor="searchQuery" className="font-medium text-text-primary">検索キーワード</label>
              <input
                type="text"
                id="searchQuery"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="タイトルまたは概要で検索"
                className="p-3 rounded-md border border-border-color bg-background text-text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div className="flex flex-col space-y-2">
              <label htmlFor="series" className="font-medium text-text-primary">シリーズ</label>
              <select
                id="series"
                value={selectedSeries}
                onChange={(e) => setSelectedSeries(e.target.value)}
                className="p-3 rounded-md border border-border-color bg-background text-text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">すべて</option>
                <option value="Basic Series">Basic Series</option>
                <option value="Guest Series">Guest Series</option>
                <option value="Community Series">Community Series</option>
              </select>
            </div>
            
            <div className="flex justify-center md:justify-end pt-2">
              <button 
                type="submit" 
                className="px-6 py-3 bg-primary text-white rounded-md shadow-sm transition-all duration-200 hover:bg-opacity-90 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none"
                disabled={isLoading}
              >
                {isLoading ? '検索中...' : '検索'}
              </button>
            </div>
          </form>
        </div>
        
        {isSearched && (
          <div className="w-full max-w-[1000px] my-6 overflow-x-auto">
            <h2 className="mx-8 mt-8 mb-4 text-2xl font-semibold text-text-primary">
              検索結果: {searchResults.length}件
            </h2>
            
            {searchResults.length > 0 ? (
              <div className="flex flex-col gap-4 mx-8 my-4">
                {searchResults.map((broadcast) => (
                  <div key={broadcast.id} className="p-6 border border-border-color rounded-lg bg-card shadow-sm transition-shadow duration-300 hover:shadow-md">
                    <h3 className="text-xl font-semibold mb-2 text-text-primary">{broadcast.title}</h3>
                    <div className="text-sm text-text-secondary mb-4">{broadcast.series}</div>
                    <div className="text-base leading-relaxed text-text-primary bg-opacity-5 bg-black p-4 rounded-lg border-l-4 border-primary mb-4">{broadcast.excerpt}</div>
                    <div className="flex justify-end mt-2">
                      <a 
                        href={broadcast.url} 
                        className="text-primary no-underline px-3 py-1.5 rounded bg-primary bg-opacity-10 transition-all duration-200 inline-block font-medium hover:bg-primary hover:text-white"
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        再生
                      </a>
                      {' | '}
                      <button
                        onClick={() => router.push(`/?tab=comments&episodeId=${broadcast.id}`)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md border-none text-sm font-semibold cursor-pointer transition-all duration-300 shadow-sm hover:-translate-y-0.5 hover:shadow-md relative overflow-hidden"
                      >
                        <span className="text-base opacity-90">💬</span>
                        コメントを見る
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-text-secondary text-lg bg-opacity-5 bg-black rounded-lg">該当する配信はありません。</p>
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
                 key="comments-section" // Add a stable key to prevent remounting
               />
    }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-start items-center bg-background">
      <Head>
        <title>配信一覧 | Next.js App</title>
        <meta name="description" content="配信一覧ページ" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full flex justify-center py-6 px-4 sticky top-0 bg-background z-10 border-b border-transparent">
        <Tabs 
          active={activeTab} 
          tabs={tabs} 
          onTabChange={handleTabChange} 
        />
      </div>

      <main className="py-8 flex-1 flex flex-col justify-start items-center w-full max-w-[1200px]">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </main>
    </div>
  )
}