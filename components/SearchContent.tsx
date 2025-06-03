import React, { useState, useCallback } from 'react';
import styles from '../styles/Home.module.css';
import searchStyles from '../styles/Search.module.css';
import BroadcastEmbed from './BroadcastEmbed';
import { PastBroadcast } from '../types/broadcast';
import { NextRouter } from 'next/router';

interface SearchContentProps {
  visibleEmbeds: Set<number>;
  toggleEmbedVisibility: (id: number) => void;
  router: NextRouter;
  embedType: 'youtube' | 'spotify';
}

const SearchContent = React.memo(({ 
  visibleEmbeds, 
  toggleEmbedVisibility, 
  router,
  embedType
}: SearchContentProps) => {
  // State for search form
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // State for search results
  const [searchResults, setSearchResults] = useState<PastBroadcast[]>([]);
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Handle search form submission
  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    if (searchQuery) queryParams.append('query', searchQuery);
    
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
  }, [searchQuery]);
  
  return (
    <>
      <div className={searchStyles.searchContainer}>
        <form onSubmit={handleSearch} className={searchStyles.searchForm}>
          <div className={searchStyles.formGroup}>
            <div className={searchStyles.inputButtonContainer}>
              <input
                type="text"
                id="searchQuery"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="タイトルまたは概要で検索"
                className={searchStyles.input}
              />
              <button type="submit" className={searchStyles.searchButton} disabled={isLoading}>
                {isLoading ? '検索中...' : '検索'}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {isSearched && (
        <div className={styles.tableContainer}>
          <h2 className={searchStyles.resultsTitle}>
            検索結果: {searchResults.length}件
          </h2>
          
          {searchResults.length > 0 ? (
            <div className={searchStyles.searchResults}>
              {searchResults.map((broadcast) => (
                <div key={broadcast.id} className={searchStyles.resultCard}>
                  <h3 className={searchStyles.resultTitle}>{broadcast.title}</h3>
                  <div className={searchStyles.resultSeries}>{broadcast.series}</div>
                  <div className={searchStyles.resultExcerpt}>{broadcast.excerpt}</div>
                  {broadcast.likeCount && (
                    <div className={searchStyles.resultLikes}>👍 {broadcast.likeCount}</div>
                  )}
                  <div className={searchStyles.resultActions}>
                    <button
                      type="button"
                      onClick={() => toggleEmbedVisibility(broadcast.id)}
                      className={styles.iconButton}
                      aria-label={visibleEmbeds.has(broadcast.id) ? '非表示' : '再生'}
                    >
                      {visibleEmbeds.has(broadcast.id) ? '⏹️' : '▶️'}
                    </button>
                    {' '}
                    <button
                      onClick={() => router.push(`/?tab=comments&episodeId=${broadcast.id}`)}
                      className={styles.iconButton}
                      aria-label="コメントを見る"
                    >
                      💬
                    </button>
                  </div>
                  {visibleEmbeds.has(broadcast.id) && (
                    <div style={{ marginTop: '1rem' }}>
                      <BroadcastEmbed 
                        broadcast={broadcast}
                        embedType={embedType}
                        height="152"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className={searchStyles.noResults}>該当する配信はありません。</p>
          )}
        </div>
      )}
    </>
  );
});

SearchContent.displayName = 'SearchContent';

export default SearchContent;