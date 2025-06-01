import Head from 'next/head';
import React from 'react';
import YouTube from '../components/YouTube';
import styles from '../styles/Home.module.css';

export default function YouTubeDemo(): React.ReactNode {
  return (
    <div className={styles.container}>
      <Head>
        <title>YouTube埋め込みデモ | Next.js App</title>
        <meta name="description" content="YouTube埋め込みコンポーネントのデモページ" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 style={{ marginBottom: '2rem', color: 'var(--text-primary)' }}>
          YouTube埋め込みコンポーネント デモ
        </h1>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            基本的な使用例
          </h2>
          <pre style={{ 
            backgroundColor: 'var(--card-background)', 
            padding: '1rem', 
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--border-color)',
            marginBottom: '1rem'
          }}>
            {`<YouTube videoId="WIT_1Ih43Jo" />`}
          </pre>
          <YouTube videoId="WIT_1Ih43Jo" />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            再生開始時間指定 (754秒から開始)
          </h2>
          <pre style={{ 
            backgroundColor: 'var(--card-background)', 
            padding: '1rem', 
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--border-color)',
            marginBottom: '1rem'
          }}>
            {`<YouTube videoId="WIT_1Ih43Jo" startTime={754} />`}
          </pre>
          <YouTube videoId="WIT_1Ih43Jo" startTime={754} />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            カスタムサイズ
          </h2>
          <pre style={{ 
            backgroundColor: 'var(--card-background)', 
            padding: '1rem', 
            borderRadius: 'var(--border-radius)',
            border: '1px solid var(--border-color)',
            marginBottom: '1rem'
          }}>
            {`<YouTube videoId="WIT_1Ih43Jo" width={400} height={225} />`}
          </pre>
          <YouTube videoId="WIT_1Ih43Jo" width={400} height={225} />
        </div>
      </main>
    </div>
  );
}