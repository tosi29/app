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
          <div className="text-center py-8 text-lg text-text-secondary">配信データを読み込み中...</div>
        ) : (
        <div className="w-full max-w-[1000px] my-6 overflow-x-auto rounded-lg shadow-md bg-card">
          <table className="w-full border-collapse border-spacing-0 mb-0">
            <thead>
              <tr>
                <th className="p-3 text-left border-b border-border bg-[rgba(0,0,0,0.02)] font-semibold text-text-primary sticky top-0 first:rounded-tl-lg">日付</th>
                <th className="p-3 text-left border-b border-border bg-[rgba(0,0,0,0.02)] font-semibold text-text-primary sticky top-0">タイトル</th>
                <th className="p-3 text-left border-b border-border bg-[rgba(0,0,0,0.02)] font-semibold text-text-primary sticky top-0">再生時間</th>
                <th className="p-3 text-left border-b border-border bg-[rgba(0,0,0,0.02)] font-semibold text-text-primary sticky top-0 last:rounded-tr-lg">リンク</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(broadcastsBySeries)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([series, broadcasts]) => (
                <React.Fragment key={series}>
                  <tr 
                    className={`cursor-pointer font-semibold transition-colors duration-200 hover:bg-[rgba(0,0,0,0.05)] ${
                      series.toLowerCase().includes('basic') ? 'series-basic' : 
                      series.toLowerCase().includes('guest') ? 'series-guest' : 
                      series.toLowerCase().includes('community') ? 'series-community' : ''
                    }`}
                    onClick={() => toggleSeries(series)}
                  >
                    <td colSpan={4} className="p-3 border-b border-border">
                      <div className="flex items-center gap-1.5 py-1.5">
                        <span className={`inline-flex items-center justify-center text-xs w-4 h-4 transition-transform duration-200 ${expandedSeries[series] ? 'rotate-0' : ''}`}>
                          {expandedSeries[series] ? '▼' : '▶'}
                        </span>
                        <span className="font-semibold">{series} ({broadcasts.length})</span>
                      </div>
                    </td>
                  </tr>
                  {expandedSeries[series] && broadcasts.map((broadcast) => (
                    <tr 
                      key={broadcast.id} 
                      className={`hover:bg-[rgba(0,0,0,0.02)] ${
                        broadcast.series.toLowerCase().includes('basic') ? 'bg-[rgba(144,238,144,0.05)]' : 
                        broadcast.series.toLowerCase().includes('guest') ? 'bg-[rgba(173,216,230,0.05)]' : 
                        broadcast.series.toLowerCase().includes('community') ? 'bg-[rgba(255,182,193,0.05)]' : ''
                      }`}
                    >
                      <td className="p-3 border-b border-border">{broadcast.date}</td>
                      <td className="p-3 border-b border-border">{broadcast.title}</td>
                      <td className="p-3 border-b border-border">{broadcast.duration}</td>
                      <td className="p-3 border-b border-border">
                        <a href={broadcast.url} className="text-primary hover:text-accent transition-colors duration-200 mr-2" target="_blank" rel="noopener noreferrer">
                          再生
                        </a>
                        {' | '}
                        <button
                          type="button"
                          onClick={() => router.push(`/?tab=comments&episodeId=${broadcast.id}`)}
                          className="comment-button ml-2"
                        >
                          <span className="flex items-center">💬</span>
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
        <div className="w-full max-w-[600px] mb-8">
          <form onSubmit={handleSearch} className="p-6 border border-border rounded-lg bg-card shadow-md">
            <div className="mb-4">
              <label htmlFor="searchQuery" className="block mb-2 font-medium">検索キーワード</label>
              <input
                type="text"
                id="searchQuery"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="タイトルまたは概要で検索"
                className="w-full p-3 border border-border rounded-md bg-background text-text-primary"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="series" className="block mb-2 font-medium">シリーズ</label>
              <select
                id="series"
                value={selectedSeries}
                onChange={(e) => setSelectedSeries(e.target.value)}
                className="w-full p-3 border border-border rounded-md bg-background text-text-primary appearance-none"
              >
                <option value="">すべて</option>
                <option value="Basic Series">Basic Series</option>
                <option value="Guest Series">Guest Series</option>
                <option value="Community Series">Community Series</option>
              </select>
            </div>
            
            <div className="flex justify-center mt-6">
              <button type="submit" className="px-6 py-3 bg-primary text-white border-none rounded-lg text-base font-medium cursor-pointer transition-all duration-300 hover:bg-primary-dark hover:-translate-y-px" disabled={isLoading}>
                {isLoading ? '検索中...' : '検索'}
              </button>
            </div>
          </form>
        </div>
        
        {isSearched && (
          <div className="w-full max-w-[1000px] mt-6">
            <h2 className="text-xl font-semibold mb-4 text-center">
              検索結果: {searchResults.length}件
            </h2>
            
            {searchResults.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((broadcast) => (
                  <div key={broadcast.id} className="p-5 border border-border rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold mb-2">{broadcast.title}</h3>
                    <div className="text-sm text-text-secondary mb-2">{broadcast.series}</div>
                    <div className="text-base mb-4 line-clamp-3">{broadcast.excerpt}</div>
                    <div className="flex gap-2 mt-auto">
                      <a 
                        href={broadcast.url} 
                        className="text-primary hover:text-accent transition-colors duration-200" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        再生
                      </a>
                      {' | '}
                      <button
                        onClick={() => router.push(`/?tab=comments&episodeId=${broadcast.id}`)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-br from-indigo-600 to-purple-500 text-white no-underline rounded-md border-none text-sm font-semibold cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-px"
                      >
                        <span className="flex items-center">💬</span>
                        コメントを見る
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-text-secondary my-8">該当する配信はありません。</p>
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
    <div className="min-h-screen p-0 md:p-4 flex flex-col justify-start items-center bg-background">
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

      <main className="py-8 md:py-10 px-4 flex-1 flex flex-col justify-start items-center w-full max-w-[1200px]">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </main>
    </div>
  )
}