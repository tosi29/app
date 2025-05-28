import Head from 'next/head'
import React, { useState, useEffect, useMemo } from 'react'
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
    // State to track sorting
    const [sortColumn, setSortColumn] = useState<keyof PastBroadcast>('date');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    // Sort broadcasts based on the selected column and direction
    const sortBroadcasts = (broadcasts: PastBroadcast[], column: keyof PastBroadcast, direction: 'asc' | 'desc') => {
      return [...broadcasts].sort((a, b) => {
        let comparison = 0;
        if (a[column] < b[column]) {
          comparison = -1;
        } else if (a[column] > b[column]) {
          comparison = 1;
        }
        return direction === 'asc' ? comparison : -comparison;
      });
    };

    // Group broadcasts by series
    const broadcastsBySeries = useMemo(() => {
      const grouped: Record<string, PastBroadcast[]> = {};
      pastBroadcasts.forEach(broadcast => {
        if (!grouped[broadcast.series]) {
          grouped[broadcast.series] = [];
        }
        grouped[broadcast.series].push(broadcast);
      });

      // Sort broadcasts within each series
      Object.keys(grouped).forEach(seriesKey => {
        grouped[seriesKey] = sortBroadcasts(grouped[seriesKey], sortColumn, sortDirection);
      });

      return grouped;
    }, [sortColumn, sortDirection]);

    // Handle column header click for sorting
    const handleSort = (column: keyof PastBroadcast) => {
      if (column === sortColumn) {
        // Toggle sort direction if clicking the same column
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
      } else {
        // Set new sort column and default to ascending
        setSortColumn(column);
        setSortDirection('asc');
      }
    };

    // Get sort indicator for a column
    const getSortIndicator = (column: keyof PastBroadcast) => {
      if (column === sortColumn) {
        return sortDirection === 'asc' ? '↑' : '↓';
      }
      return null;
    };

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
        <h1 className={styles.title}>過去の配信一覧</h1>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th 
                  className={styles.sortableHeader} 
                  onClick={() => handleSort('date')}
                >
                  日付 {getSortIndicator('date')}
                </th>
                <th 
                  className={styles.sortableHeader} 
                  onClick={() => handleSort('series')}
                >
                  シリーズ {getSortIndicator('series')}
                </th>
                <th 
                  className={styles.sortableHeader} 
                  onClick={() => handleSort('title')}
                >
                  タイトル {getSortIndicator('title')}
                </th>
                <th 
                  className={styles.sortableHeader} 
                  onClick={() => handleSort('description')}
                >
                  説明 {getSortIndicator('description')}
                </th>
                <th 
                  className={styles.sortableHeader} 
                  onClick={() => handleSort('duration')}
                >
                  再生時間 {getSortIndicator('duration')}
                </th>
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
                    <td colSpan={6}>
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
                      <td>{broadcast.description}</td>
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