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
  const [summaryModalOpen, setSummaryModalOpen] = useState<boolean>(false);
  const [selectedBroadcastForSummary, setSelectedBroadcastForSummary] = useState<PopularBroadcast | null>(null);

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

  const sortedBroadcasts = useMemo(() => {
    const sorted = [...popularBroadcasts];
    sorted.sort((a, b) => {
      let aValue: any, bValue: any;
      switch (sortColumn) {
        case 'viewCount': aValue = a.viewCount; bValue = b.viewCount; break;
        case 'hypothesisCount': aValue = a.hypothesisCount; bValue = b.hypothesisCount; break;
        case 'likeCount': aValue = a.likeCount || 0; bValue = b.likeCount || 0; break;
        case 'title': aValue = a.title.toLowerCase(); bValue = b.title.toLowerCase(); break;
        case 'date': aValue = a.date ? new Date(a.date) : new Date(0); bValue = b.date ? new Date(b.date) : new Date(0); break;
        default: return 0;
      }
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [popularBroadcasts, sortColumn, sortDirection]);

  const handleSort = useCallback((column: typeof sortColumn) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  }, [sortColumn]);

  const openSummaryModal = useCallback((broadcast: PopularBroadcast) => {
    setSelectedBroadcastForSummary(broadcast);
    setSummaryModalOpen(true);
  }, []);

  const closeSummaryModal = useCallback(() => {
    setSummaryModalOpen(false);
    setSelectedBroadcastForSummary(null);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-4 my-16">
        <div className="w-10 h-10 border-3 border-surface-200 rounded-full border-t-primary-500 animate-spin"></div>
        <p className="text-text-muted text-sm">人気の配信データを読み込み中...</p>
      </div>
    );
  }

  const thClass = "cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider bg-surface-50 border-b border-surface-200 whitespace-nowrap hover:text-primary-600 transition-colors";

  return (
    <>
      <div className="w-full card-modern overflow-hidden">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th className={`${thClass} first:rounded-tl-2xl`} onClick={() => handleSort('title')}>
                タイトル {sortColumn === 'title' && (sortDirection === 'asc' ? '\u2191' : '\u2193')}
              </th>
              <th className={thClass} onClick={() => handleSort('viewCount')}>
                再生 {sortColumn === 'viewCount' && (sortDirection === 'asc' ? '\u2191' : '\u2193')}
              </th>
              <th className={thClass} onClick={() => handleSort('hypothesisCount')}>
                仮説 {sortColumn === 'hypothesisCount' && (sortDirection === 'asc' ? '\u2191' : '\u2193')}
              </th>
              <th className={thClass} onClick={() => handleSort('likeCount')}>
                いいね {sortColumn === 'likeCount' && (sortDirection === 'asc' ? '\u2191' : '\u2193')}
              </th>
              <th className={thClass} onClick={() => handleSort('date')}>
                日付 {sortColumn === 'date' && (sortDirection === 'asc' ? '\u2191' : '\u2193')}
              </th>
              <th className={`px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider bg-surface-50 border-b border-surface-200 last:rounded-tr-2xl whitespace-nowrap`}>リンク</th>
            </tr>
          </thead>
          <tbody>
            {sortedBroadcasts.map((broadcast, index) => (
              <React.Fragment key={broadcast.id}>
                <tr className={`hover:bg-primary-50/30 transition-colors duration-150 group ${index % 2 === 0 ? '' : 'bg-surface-50/50'}`}>
                  <td className="px-4 py-3 border-b border-surface-100">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-text-primary">{broadcast.title}</span>
                      <span className="text-xs text-text-muted">
                        {broadcast.series && broadcast.series.trim() ? broadcast.series.trim() : 'その他'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary border-b border-surface-100 whitespace-nowrap font-mono text-xs">{broadcast.viewCount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary border-b border-surface-100 whitespace-nowrap font-mono text-xs">{broadcast.hypothesisCount}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary border-b border-surface-100 whitespace-nowrap font-mono text-xs">{broadcast.likeCount || ''}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary border-b border-surface-100 whitespace-nowrap">{broadcast.date || '\u2014'}</td>
                  <td className="px-4 py-3 border-b border-surface-100 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                      <button type="button" onClick={() => toggleEmbedVisibility(broadcast.id)} className="btn-icon" aria-label={visibleEmbeds.has(broadcast.id) ? '非表示' : '再生'}>
                        {visibleEmbeds.has(broadcast.id) ? '\u23F9\uFE0F' : '\u25B6\uFE0F'}
                      </button>
                      <button type="button" onClick={() => router.push(`/?tab=hypotheses&series=${encodeURIComponent(broadcast.series && broadcast.series.trim() ? broadcast.series.trim() : 'その他')}`)} className="btn-icon" aria-label="仮説を見る">
                        💬
                      </button>
                      <SummaryButton broadcast={broadcast} onOpenSummary={openSummaryModal} />
                    </div>
                  </td>
                </tr>
                {visibleEmbeds.has(broadcast.id) && (
                  <tr>
                    <td colSpan={6} className="px-4 py-3 bg-surface-50 border-b border-surface-100">
                      <BroadcastEmbed broadcast={broadcast} embedType={embedType} height={152} />
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
