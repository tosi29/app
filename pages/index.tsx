import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import Tabs from '../components/Tabs'
import CommentsSection from '../components/CommentsSection'
import { GetStaticProps } from 'next'

interface PastBroadcast {
  id: number;
  date: string;
  title: string;
  description: string;
  series: string;
}

interface HomeProps {
  pastBroadcasts: PastBroadcast[];
}

export default function Home({ pastBroadcasts }: HomeProps) {
  const router = useRouter();
  const { tab, episodeId } = router.query;
  
  // Set active tab based on URL parameter
  const [activeTab, setActiveTab] = useState<string>('broadcasts');
  
  useEffect(() => {
    if (tab === 'comments') {
      setActiveTab('comments');
    }
  }, [tab]);

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.push({
      pathname: '/',
      query: tabId === 'comments' ? { tab: tabId } : {}
    }, undefined, { shallow: true });
  };

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

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            Next.js
          </span>
        </a>
      </footer>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    // In a production environment, we'd use an absolute URL with proper protocol and domain
    // For local development and SSG, we need to use a different approach
    // This is a simplified version for this example
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = process.env.VERCEL_URL || 'localhost:3000';
    const res = await fetch(`${protocol}://${host}/api/broadcasts`);
    const pastBroadcasts = await res.json();

    return {
      props: {
        pastBroadcasts,
      },
      // Revalidate the data every 10 seconds
      revalidate: 10,
    };
  } catch (error) {
    console.error('Error fetching broadcasts:', error);
    
    // Return empty data in case of an error
    return {
      props: {
        pastBroadcasts: [],
      },
      revalidate: 10,
    };
  }
}