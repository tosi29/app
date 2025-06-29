import React, { useState, useCallback } from 'react';
import BroadcastEmbed from './BroadcastEmbed';
import { SearchResultBroadcast } from '../types/broadcast';
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
  const [searchResults, setSearchResults] = useState<SearchResultBroadcast[]>([]);
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Handle search form submission
  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if search query is empty
    if (!searchQuery || searchQuery.trim() === '') {
      setIsSearched(true);
      setSearchResults([]);
      return;
    }
    
    setIsLoading(true);
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('query', searchQuery);
    
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
      <div className="w-full max-w-3xl my-8 p-6 border border-gray-200 rounded-lg bg-white shadow-md max-md:p-4">
        <form onSubmit={handleSearch} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-3 items-center max-md:flex-col max-md:gap-3">
              <input
                type="text"
                id="searchQuery"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="タイトルまたは概要で検索"
                className="px-3 py-3 border border-gray-300 rounded-lg text-base bg-white text-gray-900 transition-all duration-300 flex-1 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.2)]"
              />
              <button type="submit" className={`px-6 py-3 border-none rounded-lg text-base font-medium cursor-pointer transition-all duration-200 flex-shrink-0 whitespace-nowrap max-md:w-full ${isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 hover:-translate-y-px focus:outline-2 focus:outline-blue-500 focus:outline-offset-2'}`} disabled={isLoading}>
                {isLoading ? '検索中...' : '検索'}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {isSearched && (
        <div className="w-full max-w-4xl my-6 overflow-x-auto rounded-lg shadow-md bg-white">
          <h2 className="my-6 mx-8 mt-6 mb-3 text-2xl font-semibold text-gray-900 max-md:mx-2">
            検索結果: {searchResults.length}件
          </h2>
          
          {searchResults.length > 0 ? (
            <div className="flex flex-col gap-3 my-3 mx-8 mb-6 max-md:mx-2">
              {searchResults.map((broadcast) => (
                <div key={broadcast.id} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
                  <h3 className="text-xl font-semibold mb-1 text-gray-900">{broadcast.title}</h3>
                  <div className="text-sm text-gray-600 mb-2">
                    {broadcast.series && broadcast.series.trim() ? broadcast.series.trim() : 'その他'}
                  </div>
                  <div className="text-base leading-relaxed text-gray-900 bg-gray-50 p-3 rounded-lg border-l-3 border-l-blue-500 mb-3">{broadcast.excerpt}</div>
                  {broadcast.likeCount && (
                    <div className="text-sm text-gray-600 mb-2">👍 {broadcast.likeCount}</div>
                  )}
                  <div className="flex justify-end mt-1">
                    <button
                      type="button"
                      onClick={() => toggleEmbedVisibility(broadcast.id)}
                      className="inline-flex items-center justify-center p-2 min-w-10 h-10 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-lg text-base cursor-pointer transition-all duration-200 ease-out hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:-translate-y-px hover:shadow-md active:translate-y-0 active:shadow-sm focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 no-underline"
                      aria-label={visibleEmbeds.has(broadcast.id) ? '非表示' : '再生'}
                    >
                      {visibleEmbeds.has(broadcast.id) ? '⏹️' : '▶️'}
                    </button>
                    {' '}
                    <button
                      onClick={() => router.push(`/?tab=hypotheses&episodeId=${broadcast.id}`)}
                      className="inline-flex items-center justify-center p-2 min-w-10 h-10 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-lg text-base cursor-pointer transition-all duration-200 ease-out hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:-translate-y-px hover:shadow-md active:translate-y-0 active:shadow-sm focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 no-underline"
                      aria-label="仮説を見る"
                    >
                      💬
                    </button>
                  </div>
                  {visibleEmbeds.has(broadcast.id) && (
                    <div style={{ marginTop: '1rem' }}>
                      <BroadcastEmbed 
                        broadcast={broadcast}
                        embedType={embedType}
                        height={152}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="p-8 text-center text-gray-600 text-lg bg-gray-50 rounded-lg border border-gray-200">
              {!searchQuery || searchQuery.trim() === '' 
                ? '検索クエリを入力してください。' 
                : '該当する配信はありません。'
              }
            </p>
          )}
        </div>
      )}
    </>
  );
});

SearchContent.displayName = 'SearchContent';

export default SearchContent;