import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { NextRouter } from 'next/router';
import BroadcastEmbed from './BroadcastEmbed';
import BroadcastSummaryModal from './BroadcastSummaryModal';
import SummaryButton from './SummaryButton';
import { PopularBroadcast } from '../types/broadcast';

interface PopularBroadcastsContentProps {
  visibleEmbeds: Set<number>;
  toggleEmbedVisibility: (broadcastId: number) => void;
  router: NextRouter;
  embedType: 'youtube' | 'spotify';
}

export default function PopularBroadcastsContent({
  visibleEmbeds,
  toggleEmbedVisibility,
  router,
  embedType
}: PopularBroadcastsContentProps) {
  const [popularBroadcasts, setPopularBroadcasts] = useState<PopularBroadcast[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sortColumn, setSortColumn] = useState<'viewCount' | 'hypothesisCount' | 'likeCount' | 'title' | 'date'>('viewCount');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // State for summary modal
  const [summaryModalOpen, setSummaryModalOpen] = useState<boolean>(false);
  const [selectedBroadcastForSummary, setSelectedBroadcastForSummary] = useState<PopularBroadcast | null>(null);

  // Fetch popular broadcasts data
  useEffect(() => {
    const fetchPopularBroadcasts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/popular-broadcasts');
        if (response.ok) {
          const data = await response.json();
          setPopularBroadcasts(data);
        } else {
          console.error('Failed to fetch popular broadcasts');
        }
      } catch (error) {
        console.error('Error fetching popular broadcasts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularBroadcasts();
  }, []);

  // Sort broadcasts
  const sortedBroadcasts = useMemo(() => {
    const sorted = [...popularBroadcasts];
    sorted.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortColumn) {
        case 'viewCount':
          aValue = a.viewCount;
          bValue = b.viewCount;
          break;
        case 'hypothesisCount':
          aValue = a.hypothesisCount;
          bValue = b.hypothesisCount;
          break;
        case 'likeCount':
          aValue = a.likeCount || 0;
          bValue = b.likeCount || 0;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'date':
          aValue = a.date ? new Date(a.date) : new Date(0);
          bValue = b.date ? new Date(b.date) : new Date(0);
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  }, [popularBroadcasts, sortColumn, sortDirection]);

  // Handle sort
  const handleSort = useCallback((column: typeof sortColumn) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  }, [sortColumn]);

  // Summary modal handlers
  const openSummaryModal = useCallback((broadcast: PopularBroadcast) => {
    setSelectedBroadcastForSummary(broadcast);
    setSummaryModalOpen(true);
  }, []);

  const closeSummaryModal = useCallback(() => {
    setSummaryModalOpen(false);
    setSelectedBroadcastForSummary(null);
  }, []);

  if (isLoading) {
    return <div className="flex flex-col items-center gap-4 my-8">人気の配信データを読み込み中...</div>;
  }

  return (
    <>
      <div className="w-full max-w-6xl my-6 overflow-x-auto rounded-lg shadow-md bg-white">
        <table className="w-full border-separate border-spacing-0 mb-0">
          <thead>
            <tr>
              <th 
                className="cursor-pointer select-none transition-all duration-200 ease-out hover:bg-gray-100 hover:text-blue-500 px-3 py-2 text-left border-b border-gray-200 bg-gray-100 font-semibold text-gray-900 sticky top-0 first:rounded-tl-lg last:rounded-tr-lg whitespace-nowrap"
                onClick={() => handleSort('title')}
              >
                タイトル {sortColumn === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="cursor-pointer select-none transition-all duration-200 ease-out hover:bg-gray-100 hover:text-blue-500 px-3 py-2 text-left border-b border-gray-200 bg-gray-100 font-semibold text-gray-900 sticky top-0 first:rounded-tl-lg last:rounded-tr-lg whitespace-nowrap"
                onClick={() => handleSort('viewCount')}
              >
                再生 {sortColumn === 'viewCount' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="cursor-pointer select-none transition-all duration-200 ease-out hover:bg-gray-100 hover:text-blue-500 px-3 py-2 text-left border-b border-gray-200 bg-gray-100 font-semibold text-gray-900 sticky top-0 first:rounded-tl-lg last:rounded-tr-lg whitespace-nowrap"
                onClick={() => handleSort('hypothesisCount')}
              >
                仮説 {sortColumn === 'hypothesisCount' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="cursor-pointer select-none transition-all duration-200 ease-out hover:bg-gray-100 hover:text-blue-500 px-3 py-2 text-left border-b border-gray-200 bg-gray-100 font-semibold text-gray-900 sticky top-0 first:rounded-tl-lg last:rounded-tr-lg whitespace-nowrap"
                onClick={() => handleSort('likeCount')}
              >
                👍 {sortColumn === 'likeCount' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="cursor-pointer select-none transition-all duration-200 ease-out hover:bg-gray-100 hover:text-blue-500 px-3 py-2 text-left border-b border-gray-200 bg-gray-100 font-semibold text-gray-900 sticky top-0 first:rounded-tl-lg last:rounded-tr-lg whitespace-nowrap"
                onClick={() => handleSort('date')}
              >
                日付 {sortColumn === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-3 py-2 text-left border-b border-gray-200 bg-gray-100 font-semibold text-gray-900 sticky top-0 first:rounded-tl-lg last:rounded-tr-lg whitespace-nowrap">リンク</th>
            </tr>
          </thead>
          <tbody>
            {sortedBroadcasts.map((broadcast) => (
              <React.Fragment key={broadcast.id}>
                <tr className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-3 py-2 text-left border-b border-gray-200">
                    <div className="flex flex-col gap-1">
                      <div className="font-medium text-gray-900">{broadcast.title}</div>
                      <div className="text-xs text-gray-600 font-normal">
                        {broadcast.series && broadcast.series.trim() ? broadcast.series.trim() : 'その他'}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-left border-b border-gray-200 whitespace-nowrap">{broadcast.viewCount.toLocaleString()}</td>
                  <td className="px-3 py-2 text-left border-b border-gray-200 whitespace-nowrap">{broadcast.hypothesisCount}</td>
                  <td className="px-3 py-2 text-left border-b border-gray-200 whitespace-nowrap">{broadcast.likeCount || ''}</td>
                  <td className="px-3 py-2 text-left border-b border-gray-200 whitespace-nowrap">{broadcast.date || '—'}</td>
                  <td className="px-3 py-2 text-left border-b border-gray-200 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => toggleEmbedVisibility(broadcast.id)}
                        className="inline-flex items-center justify-center p-2 min-w-10 h-10 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-lg text-base cursor-pointer transition-all duration-200 ease-out hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:-translate-y-px hover:shadow-md active:translate-y-0 active:shadow-sm focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 no-underline"
                        aria-label={visibleEmbeds.has(broadcast.id) ? '非表示' : '再生'}
                      >
                        {visibleEmbeds.has(broadcast.id) ? '⏹️' : '▶️'}
                      </button>
                      <button
                        type="button"
                        onClick={() => router.push(`/?tab=hypotheses&episodeId=${broadcast.id}`)}
                        className="inline-flex items-center justify-center p-2 min-w-10 h-10 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-lg text-base cursor-pointer transition-all duration-200 ease-out hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:-translate-y-px hover:shadow-md active:translate-y-0 active:shadow-sm focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 no-underline"
                        aria-label="仮説を見る"
                      >
                        💬
                      </button>
                      <SummaryButton 
                        broadcast={broadcast}
                        onOpenSummary={openSummaryModal}
                      />
                    </div>
                  </td>
                </tr>
                {visibleEmbeds.has(broadcast.id) && (
                  <tr>
                    <td colSpan={6}>
                      <BroadcastEmbed
                        broadcast={broadcast}
                        embedType={embedType}
                        height={152}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <BroadcastSummaryModal 
        broadcast={selectedBroadcastForSummary}
        isOpen={summaryModalOpen}
        onClose={closeSummaryModal}
      />
    </>
  );
}