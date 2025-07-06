import Head from 'next/head'
import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Tabs from '../components/Tabs'
import HypothesesSection from '../components/HypothesesSection'
import BroadcastsContent from '../components/BroadcastsContent'
import PopularBroadcastsContent from '../components/PopularBroadcastsContent'
import SearchContent from '../components/SearchContent'
import SettingsModal from '../components/SettingsModal'
import { PastBroadcast } from '../types/broadcast'

export default function Home() {
  const router = useRouter();
  const { tab, series } = router.query;
  
  // State for broadcasts data
  const [pastBroadcasts, setPastBroadcasts] = useState<PastBroadcast[]>([]);
  const [isLoadingBroadcasts, setIsLoadingBroadcasts] = useState<boolean>(true);
  
  // State for tracking visible embeds
  const [visibleEmbeds, setVisibleEmbeds] = useState<Set<number>>(new Set());
  
  // State for tracking embed type preference (YouTube or Spotify)
  const [embedType, setEmbedType] = useState<'youtube' | 'spotify'>('spotify');
  
  // State for settings modal
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  
  // Set active tab based on URL parameter
  const [activeTab, setActiveTab] = useState<string>(
    router.query.tab === 'hypotheses' ? 'hypotheses' : 
    router.query.tab === 'search' ? 'search' :
    router.query.tab === 'popular' ? 'popular' : 'broadcasts'
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
      if (tab === 'hypotheses') {
        setActiveTab('hypotheses');
      } else if (tab === 'search') {
        setActiveTab('search');
      } else if (tab === 'popular') {
        setActiveTab('popular');
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
      query: tabId === 'hypotheses' ? { tab: tabId } : 
             tabId === 'search' ? { tab: tabId } : 
             tabId === 'popular' ? { tab: tabId } : {}
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

  // Pass the episodeId to HypothesesSection when available
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
      id: 'popular',
      label: '人気の配信',
      content: <PopularBroadcastsContent 
                visibleEmbeds={visibleEmbeds}
                toggleEmbedVisibility={toggleEmbedVisibility}
                router={router}
                embedType={embedType}
              />
    },
    {
      id: 'search',
      label: '検索',
      content: <SearchContent 
                visibleEmbeds={visibleEmbeds}
                toggleEmbedVisibility={toggleEmbedVisibility}
                router={router}
                embedType={embedType}
              />
    },
    {
      id: 'hypotheses',
      label: '仮説',
      content: <HypothesesSection 
                 pastBroadcasts={pastBroadcasts}
                 selectedSeries={series ? String(series) : undefined}
                 key="hypotheses-section" // Add a stable key to prevent remounting
               />
    }
  ];

  return (
    <div className="min-h-screen px-4 flex flex-col justify-start items-center bg-app">
      <Head>
        <title>配信一覧 | Next.js App</title>
        <meta name="description" content="配信一覧ページ" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full flex justify-center items-center px-4 py-4 pb-3 sticky top-0 bg-white z-10 border-b border-transparent gap-8 relative md:flex-row md:gap-8 max-md:flex-col max-md:gap-4 max-md:px-3">
        <Tabs 
          active={activeTab} 
          tabs={tabs} 
          onTabChange={handleTabChange} 
        />
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none text-2xl cursor-pointer p-2 rounded-lg transition-all duration-200 ease-out flex items-center justify-center hover:bg-black/5 hover:scale-110 hover:-translate-y-1/2 focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2 max-md:right-2 max-md:text-xl max-md:p-1.5"
          onClick={() => setIsSettingsOpen(true)}
          aria-label="設定を開く"
        >
          ⚙️
        </button>
      </div>

      <main className="py-8 pb-20 flex-1 flex flex-col justify-start items-center w-full max-w-6xl">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </main>
      
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        embedType={embedType}
        onEmbedTypeChange={setEmbedType}
      />
    </div>
  )
}