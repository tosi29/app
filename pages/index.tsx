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
  duration: string;
}

type SortField = 'date' | 'series' | 'title' | 'description' | 'duration';
type SortDirection = 'asc' | 'desc';

export default function Home() {
  const router = useRouter();
  const { tab, episodeId } = router.query;
  
  // Set active tab based on URL parameter
  const [activeTab, setActiveTab] = useState<string>(
    router.query.tab === 'comments' ? 'comments' : 'broadcasts'
  );
  
  // Add state for sorting
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
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

  // Handle sort change
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // If clicking the same field, toggle sort direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // If clicking a new field, set it as sort field with default 'asc' direction
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sample data for past broadcasts
  const pastBroadcasts: PastBroadcast[] = [
    { id: 1, date: '2023-04-15', title: 'Episode 1: Introduction', description: 'The first episode of our podcast series', series: 'Basic Series', duration: '25:30' },
    { id: 2, date: '2023-04-22', title: 'Episode 2: Getting Started', description: 'How to get started with our topic', series: 'Basic Series', duration: '31:45' },
    { id: 3, date: '2023-04-29', title: 'Episode 3: Advanced Techniques', description: 'Deep dive into advanced techniques', series: 'Basic Series', duration: '42:18' },
    { id: 4, date: '2023-05-06', title: 'Episode 4: Special Guest Interview', description: 'Interview with a special guest', series: 'Guest Series', duration: '38:22' },
    { id: 5, date: '2023-05-13', title: 'Episode 5: Community Questions', description: 'Answering questions from our community', series: 'Community Series', duration: '27:55' },
  ];
  
  // Sort the broadcasts
  const sortedBroadcasts = [...pastBroadcasts].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    // Compare the values based on sort direction
    if (sortDirection === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  // Content for the broadcasts tab
  const BroadcastsContent = () => (
    <>
      <h1 className={styles.title}>過去の配信一覧</h1>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th 
                className={styles.sortableHeader} 
                onClick={() => handleSort('date')}
              >
                日付
                {sortField === 'date' && (
                  <span className={styles.sortIndicator}>
                    {sortDirection === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
              <th 
                className={styles.sortableHeader} 
                onClick={() => handleSort('series')}
              >
                シリーズ
                {sortField === 'series' && (
                  <span className={styles.sortIndicator}>
                    {sortDirection === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
              <th 
                className={styles.sortableHeader} 
                onClick={() => handleSort('title')}
              >
                タイトル
                {sortField === 'title' && (
                  <span className={styles.sortIndicator}>
                    {sortDirection === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
              <th 
                className={styles.sortableHeader} 
                onClick={() => handleSort('description')}
              >
                説明
                {sortField === 'description' && (
                  <span className={styles.sortIndicator}>
                    {sortDirection === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
              <th 
                className={styles.sortableHeader} 
                onClick={() => handleSort('duration')}
              >
                再生時間
                {sortField === 'duration' && (
                  <span className={styles.sortIndicator}>
                    {sortDirection === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
              <th>リンク</th>
            </tr>
          </thead>
          <tbody>
            {sortedBroadcasts.map((broadcast) => (
              <tr 
                key={broadcast.id} 
                className={styles[`series-${broadcast.series.toLowerCase().split(' ')[0]}`]}
              >
                <td>{broadcast.date}</td>
                <td>{broadcast.series}</td>
                <td>{broadcast.title}</td>
                <td>{broadcast.description}</td>
                <td>{broadcast.duration}</td>
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
                 pastBroadcasts={sortedBroadcasts}
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