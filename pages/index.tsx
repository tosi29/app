import Head from 'next/head'
import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import Tabs from '../components/Tabs'
import CommentsSection from '../components/CommentsSection'
import BroadcastsContent from '../components/BroadcastsContent'
import PopularBroadcastsContent from '../components/PopularBroadcastsContent'
import SearchContent from '../components/SearchContent'
import SettingsModal from '../components/SettingsModal'
import { PastBroadcast } from '../types/broadcast'

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
  
  // State for settings modal
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  
  // Set active tab based on URL parameter
  const [activeTab, setActiveTab] = useState<string>(
    router.query.tab === 'comments' ? 'comments' : 
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
      if (tab === 'comments') {
        setActiveTab('comments');
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
      query: tabId === 'comments' ? { tab: tabId } : 
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
        <button
          className={styles.settingsIcon}
          onClick={() => setIsSettingsOpen(true)}
          aria-label="設定を開く"
        >
          ⚙️
        </button>
      </div>

      <main className={styles.main}>
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