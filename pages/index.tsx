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
  const { tab, series, episodeId } = router.query;

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
                 selectedEpisodeId={episodeId ? Number(episodeId) : undefined}
                 key="hypotheses-section"
               />
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Podcast Library</title>
        <meta name="description" content="ポッドキャスト配信ライブラリ" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <header className="glass-header sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between max-md:px-4 max-md:py-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center shadow-glow">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            <h1 className="text-lg font-semibold text-text-primary m-0 max-md:text-base">Podcast Library</h1>
          </div>
          <div className="flex items-center gap-2">
            <Tabs
              active={activeTab}
              tabs={tabs}
              onTabChange={handleTabChange}
            />
            <button
              className="ml-2 p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-100 transition-all duration-200 max-md:p-1.5"
              onClick={() => setIsSettingsOpen(true)}
              aria-label="設定を開く"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 13a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.5 10a1.5 1.5 0 00.9-2.7l-1-1.7a1.5 1.5 0 00-2.6 0l-.1.2a1.5 1.5 0 01-2.1.5 1.5 1.5 0 01-.7-1.3V4.5A1.5 1.5 0 009.5 3h-1A1.5 1.5 0 007 4.5v.2a1.5 1.5 0 01-.7 1.3 1.5 1.5 0 01-2.1-.5l-.1-.2a1.5 1.5 0 00-2.6 0l-1 1.7A1.5 1.5 0 001.5 10h.2a1.5 1.5 0 011.3.7 1.5 1.5 0 01-.5 2.1l-.2.1a1.5 1.5 0 00-.5 2.1l.5.8a1.5 1.5 0 002 .5l.2-.1a1.5 1.5 0 012.1.5 1.5 1.5 0 01.7 1.3v.2a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-.2a1.5 1.5 0 01.7-1.3 1.5 1.5 0 012.1.5l.1.2a1.5 1.5 0 002.6 0l.5-.8a1.5 1.5 0 00-.5-2.1l-.2-.1a1.5 1.5 0 01-.5-2.1 1.5 1.5 0 011.3-.7h.2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center w-full max-w-7xl mx-auto px-6 py-8 max-md:px-4 max-md:py-6">
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
