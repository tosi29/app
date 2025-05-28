import Head from 'next/head'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import searchStyles from '../styles/Search.module.css'

interface PastBroadcast {
  id: number;
  date: string;
  title: string;
  description: string;
  series: string;
  duration: string;
}

export default function Search() {
  const router = useRouter();
  
  // State for search form
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSeries, setSelectedSeries] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  
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
    if (dateFrom) queryParams.append('dateFrom', dateFrom);
    if (dateTo) queryParams.append('dateTo', dateTo);
    
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
  
  // Navigate back to home
  const goToHome = () => {
    router.push('/');
  };
  
  return (
    <div className={styles.container}>
      <Head>
        <title>配信検索 | Next.js App</title>
        <meta name="description" content="配信検索ページ" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className={styles.main}>
        <h1 className={styles.title}>配信検索</h1>
        
        <div className={searchStyles.searchContainer}>
          <form onSubmit={handleSearch} className={searchStyles.searchForm}>
            <div className={searchStyles.formGroup}>
              <label htmlFor="searchQuery">検索キーワード</label>
              <input
                type="text"
                id="searchQuery"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="タイトルまたは説明で検索"
                className={searchStyles.input}
              />
            </div>
            
            <div className={searchStyles.formGroup}>
              <label htmlFor="series">シリーズ</label>
              <select
                id="series"
                value={selectedSeries}
                onChange={(e) => setSelectedSeries(e.target.value)}
                className={searchStyles.select}
              >
                <option value="">すべて</option>
                <option value="Basic Series">Basic Series</option>
                <option value="Guest Series">Guest Series</option>
                <option value="Community Series">Community Series</option>
              </select>
            </div>
            
            <div className={searchStyles.formRow}>
              <div className={searchStyles.formGroup}>
                <label htmlFor="dateFrom">日付（から）</label>
                <input
                  type="date"
                  id="dateFrom"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className={searchStyles.input}
                />
              </div>
              
              <div className={searchStyles.formGroup}>
                <label htmlFor="dateTo">日付（まで）</label>
                <input
                  type="date"
                  id="dateTo"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className={searchStyles.input}
                />
              </div>
            </div>
            
            <div className={searchStyles.buttonContainer}>
              <button type="submit" className={searchStyles.searchButton} disabled={isLoading}>
                {isLoading ? '検索中...' : '検索'}
              </button>
              <button 
                type="button" 
                onClick={goToHome} 
                className={searchStyles.backButton}
              >
                戻る
              </button>
            </div>
          </form>
        </div>
        
        {isSearched && (
          <div className={styles.tableContainer}>
            <h2 className={searchStyles.resultsTitle}>
              検索結果: {searchResults.length}件
            </h2>
            
            {searchResults.length > 0 ? (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>日付</th>
                    <th>シリーズ</th>
                    <th>タイトル</th>
                    <th>再生時間</th>
                    <th>詳細</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((broadcast) => (
                    <tr key={broadcast.id}>
                      <td>{broadcast.date}</td>
                      <td>{broadcast.series}</td>
                      <td>{broadcast.title}</td>
                      <td>{broadcast.duration}</td>
                      <td>
                        <button
                          onClick={() => router.push(`/?tab=comments&episodeId=${broadcast.id}`)}
                          className={styles.link}
                        >
                          詳細
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className={searchStyles.noResults}>該当する配信はありません。</p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}