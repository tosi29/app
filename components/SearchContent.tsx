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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResultBroadcast[]>([]);
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery || searchQuery.trim() === '') {
      setIsSearched(true);
      setSearchResults([]);
      return;
    }
    setIsLoading(true);
    const queryParams = new URLSearchParams();
    queryParams.append('query', searchQuery);
    try {
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
      <div className="w-full max-w-2xl card-modern p-6 mb-8 max-md:p-4">
        <form onSubmit={handleSearch} className="flex gap-3 items-center max-md:flex-col max-md:gap-3">
          <div className="relative flex-1 max-md:w-full">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            <input
              type="text"
              id="searchQuery"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="タイトルまたは概要で検索..."
              className="w-full pl-10 pr-4 py-3 border border-surface-200 rounded-xl text-sm bg-surface-50 text-text-primary transition-all duration-200 placeholder:text-text-muted focus:outline-none focus:border-primary-400 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className={`px-6 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 whitespace-nowrap max-md:w-full border-none ${
              isLoading
                ? 'bg-surface-200 text-text-muted cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700 hover:-translate-y-px hover:shadow-glow focus:outline-2 focus:outline-primary-500 focus:outline-offset-2'
            }`}
            disabled={isLoading}
          >
            {isLoading ? '検索中...' : '検索'}
          </button>
        </form>
      </div>

      {isSearched && (
        <div className="w-full animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-semibold text-text-primary m-0">検索結果</h2>
            <span className="text-xs text-text-muted bg-surface-100 px-2.5 py-1 rounded-full font-medium">{searchResults.length}件</span>
          </div>

          {searchResults.length > 0 ? (
            <div className="flex flex-col gap-3">
              {searchResults.map((broadcast) => (
                <div key={broadcast.id} className="card-modern p-5 hover:shadow-app-md max-md:p-4">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="text-base font-semibold text-text-primary m-0 mb-1">{broadcast.title}</h3>
                      <span className="text-xs text-text-muted">
                        {broadcast.series && broadcast.series.trim() ? broadcast.series.trim() : 'その他'}
                      </span>
                    </div>
                    {broadcast.likeCount && (
                      <span className="text-xs text-text-muted bg-surface-100 px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                        いいね {broadcast.likeCount}
                      </span>
                    )}
                  </div>
                  <div className="text-sm leading-relaxed text-text-secondary bg-surface-50 p-3.5 rounded-lg border-l-3 border-l-primary-400 mb-3">
                    {broadcast.excerpt}
                  </div>
                  <div className="flex justify-end gap-1.5">
                    <button type="button" onClick={() => toggleEmbedVisibility(broadcast.id)} className="btn-icon" aria-label={visibleEmbeds.has(broadcast.id) ? '非表示' : '再生'}>
                      {visibleEmbeds.has(broadcast.id) ? '\u23F9\uFE0F' : '\u25B6\uFE0F'}
                    </button>
                    <button
                      onClick={() => {
                        const normalizedSeries = broadcast.series
                          ? broadcast.series.replace(/^(\d+)-\d+\s+/, '$1. ')
                          : 'その他';
                        router.push(`/?tab=hypotheses&series=${encodeURIComponent(normalizedSeries)}`);
                      }}
                      className="btn-icon"
                      aria-label="仮説を見る"
                    >
                      💬
                    </button>
                  </div>
                  {visibleEmbeds.has(broadcast.id) && (
                    <div className="mt-3 pt-3 border-t border-surface-100">
                      <BroadcastEmbed broadcast={broadcast} embedType={embedType} height={152} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="card-modern p-10 text-center">
              <p className="text-text-muted text-sm m-0">
                {!searchQuery || searchQuery.trim() === ''
                  ? '検索クエリを入力してください。'
                  : '該当する配信はありません。'
                }
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
});

SearchContent.displayName = 'SearchContent';

export default SearchContent;
