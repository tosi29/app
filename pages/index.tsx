import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import Tabs from '../components/Tabs'
import CommentsSection from '../components/CommentsSection'

interface PastBroadcast {
  id: number;
  date: string;
  title: string;
  description: string;
  series: string;
}

export default function Home() {
  const router = useRouter();
  const { tab, episodeId } = router.query;
  
  // Set active tab based on URL parameter
  const [activeTab, setActiveTab] = useState<string>(
    router.query.tab === 'comments' ? 'comments' : 'broadcasts'
  );
  
  useEffect(() => {
    if (router.isReady) {
      if (tab === 'comments') {
        setActiveTab('comments');
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
      query: tabId === 'comments' ? { tab: tabId } : {}
    }, undefined, { shallow: true });
  };

  // Sample data for past broadcasts
  const pastBroadcasts: PastBroadcast[] = [
    { id: 1, date: '2023-04-15', title: 'Episode 1: Introduction', description: 'The first episode of our podcast series', series: 'Basic Series' },
    { id: 2, date: '2023-04-22', title: 'Episode 2: Getting Started', description: 'How to get started with our topic', series: 'Basic Series' },
    { id: 3, date: '2023-04-29', title: 'Episode 3: Advanced Techniques', description: 'Deep dive into advanced techniques', series: 'Basic Series' },
    { id: 4, date: '2023-05-06', title: 'Episode 4: Special Guest Interview', description: 'Interview with a special guest', series: 'Guest Series' },
    { id: 5, date: '2023-05-13', title: 'Episode 5: Community Questions', description: 'Answering questions from our community', series: 'Community Series' },
  ]

  // Content for the broadcasts tab
  const BroadcastsContent = () => (
    <>
      <h1 className={styles.title}>過去の配信一覧</h1>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>日付</th>
              <th>シリーズ</th>
              <th>タイトル</th>
              <th>説明</th>
              <th>リンク</th>
            </tr>
          </thead>
          <tbody>
            {pastBroadcasts.map((broadcast) => (
              <tr 
                key={broadcast.id} 
                className={styles[`series-${broadcast.series.toLowerCase().split(' ')[0]}`]}
              >
                <td>{broadcast.date}</td>
                <td>{broadcast.series}</td>
                <td>{broadcast.title}</td>
                <td>{broadcast.description}</td>
                <td>
                  <a href="#" className={styles.link}>
                    再生
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  // Pass the episodeId to CommentsSection when available
  const tabs = [
    {
      id: 'broadcasts',
      label: '過去の配信',
      content: <BroadcastsContent />
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