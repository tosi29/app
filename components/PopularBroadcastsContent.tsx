import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { NextRouter } from 'next/router';
import BroadcastEmbed from './BroadcastEmbed';
import BroadcastSummaryModal from './BroadcastSummaryModal';
import SummaryButton from './SummaryButton';
import { PlayIcon, StopIcon, LightbulbIcon } from './icons';
import { PopularBroadcast } from '../types/broadcast';

interface PopularBroadcastsContentProps {
  visibleEmbeds: Set<number>;
  toggleEmbedVisibility: (broadcastId: number) => void;
  router: NextRouter;
  embedType: 'youtube' | 'spotify';
}

type SortColumn = 'viewCount' | 'hypothesisCount' | 'likeCount' | 'commentCount' | 'title' | 'date';

export default function PopularBroadcastsContent({
  visibleEmbeds,
  toggleEmbedVisibility,
  router,
  embedType
}: PopularBroadcastsContentProps) {
  const [popularBroadcasts, setPopularBroadcasts] = useState<PopularBroadcast[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sortColumn, setSortColumn] = useState<SortColumn>('viewCount');
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
        case 'commentCount': aValue = a.commentCount || 0; bValue = b.commentCount || 0; break;
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

  const handleSort = useCallback((column: SortColumn) => {
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

  const renderActions = useCallback((broadcast: PopularBroadcast) => (
    <>
      <button type="button" onClick={() => toggleEmbedVisibility(broadcast.id)} className="btn-icon" aria-label={visibleEmbeds.has(broadcast.id) ? '再生を閉じる' : '再生する'}>
        {visibleEmbeds.has(broadcast.id) ? <StopIcon /> : <PlayIcon />}
      </button>
      <button type="button" onClick={() => router.push(`/?tab=hypotheses&series=${encodeURIComponent(broadcast.series && broadcast.series.trim() ? broadcast.series.trim() : 'その他')}`)} className="btn-icon" aria-label="仮説を見る">
        <LightbulbIcon />
      </button>
      <SummaryButton broadcast={broadcast} onOpenSummary={openSummaryModal} />
    </>
  ), [toggleEmbedVisibility, visibleEmbeds, router, openSummaryModal]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-4 my-16">
        <div className="w-10 h-10 border-3 border-surface-200 rounded-full border-t-primary-500 animate-spin"></div>
        <p className="text-text-muted text-sm">人気の配信データを読み込み中...</p>
      </div>
    );
  }

  // 統計が未取得のエピソードは「—」で表示する
  const formatCount = (count: number | undefined): string =>
    count != null ? count.toLocaleString() : '—';

  const thClass = "cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold text-text-muted bg-surface-50 border-b border-surface-200 whitespace-nowrap hover:text-primary-600 transition-colors";
  const sortLabels: Record<SortColumn, string> = {
    viewCount: '再生数',
    hypothesisCount: '仮説数',
    likeCount: 'いいね数',
    commentCount: 'コメント数',
    title: 'タイトル',
    date: '日付',
  };

  return (
    <>
      {/* Mobile: sort controls */}
      <div className="hidden max-md:flex w-full card-modern p-4 mb-4 items-center justify-center gap-2">
        <label htmlFor="popular-sort" className="text-sm font-medium text-text-secondary">並び順:</label>
        <select
          id="popular-sort"
          value={sortColumn}
          onChange={(e) => setSortColumn(e.target.value as SortColumn)}
          className="px-3 py-1.5 border border-surface-200 rounded-lg bg-surface-50 text-text-primary text-sm cursor-pointer focus:outline-none focus:border-primary-400"
        >
          {(Object.keys(sortLabels) as SortColumn[]).map(column => (
            <option key={column} value={column}>{sortLabels[column]}</option>
          ))}
        </select>
        <button
          onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
          className="btn-secondary text-xs px-3 py-1.5"
          aria-label={sortDirection === 'asc' ? '昇順' : '降順'}
        >
          {sortDirection === 'asc' ? '昇順 ↑' : '降順 ↓'}
        </button>
      </div>

      {/* Desktop: table view */}
      <div className="w-full card-modern overflow-hidden max-md:hidden">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th className={`${thClass} first:rounded-tl-2xl`} onClick={() => handleSort('title')}>
                タイトル {sortColumn === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className={thClass} onClick={() => handleSort('viewCount')}>
                再生 {sortColumn === 'viewCount' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className={thClass} onClick={() => handleSort('hypothesisCount')}>
                仮説 {sortColumn === 'hypothesisCount' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className={thClass} onClick={() => handleSort('likeCount')}>
                いいね {sortColumn === 'likeCount' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className={thClass} onClick={() => handleSort('commentCount')}>
                コメント {sortColumn === 'commentCount' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className={thClass} onClick={() => handleSort('date')}>
                日付 {sortColumn === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted bg-surface-50 border-b border-surface-200 last:rounded-tr-2xl whitespace-nowrap">リンク</th>
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
                  <td className="px-4 py-3 text-text-secondary border-b border-surface-100 whitespace-nowrap font-mono text-xs">{broadcast.viewCount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-text-secondary border-b border-surface-100 whitespace-nowrap font-mono text-xs">{broadcast.hypothesisCount}</td>
                  <td className="px-4 py-3 text-text-secondary border-b border-surface-100 whitespace-nowrap font-mono text-xs">{formatCount(broadcast.likeCount)}</td>
                  <td className="px-4 py-3 text-text-secondary border-b border-surface-100 whitespace-nowrap font-mono text-xs">{formatCount(broadcast.commentCount)}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary border-b border-surface-100 whitespace-nowrap">{broadcast.date || '—'}</td>
                  <td className="px-4 py-3 border-b border-surface-100 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                      {renderActions(broadcast)}
                    </div>
                  </td>
                </tr>
                {visibleEmbeds.has(broadcast.id) && (
                  <tr>
                    <td colSpan={7} className="px-4 py-3 bg-surface-50 border-b border-surface-100">
                      <BroadcastEmbed broadcast={broadcast} embedType={embedType} height={152} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: card view */}
      <div className="hidden max-md:flex w-full flex-col gap-3">
        {sortedBroadcasts.map((broadcast) => (
          <div key={broadcast.id} className="card-modern p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="m-0 text-sm font-medium text-text-primary leading-snug">{broadcast.title}</p>
                <p className="m-0 mt-1 text-xs text-text-muted">
                  {broadcast.series && broadcast.series.trim() ? broadcast.series.trim() : 'その他'}
                  {broadcast.date && (
                    <>
                      <span className="mx-1.5">·</span>
                      {broadcast.date}
                    </>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {renderActions(broadcast)}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
              <span className="text-xs text-text-secondary bg-surface-100 px-2 py-0.5 rounded-full">再生 {broadcast.viewCount.toLocaleString()}</span>
              <span className="text-xs text-text-secondary bg-surface-100 px-2 py-0.5 rounded-full">仮説 {broadcast.hypothesisCount}</span>
              {broadcast.likeCount != null ? (
                <span className="text-xs text-text-secondary bg-surface-100 px-2 py-0.5 rounded-full">いいね {broadcast.likeCount.toLocaleString()}</span>
              ) : null}
              {broadcast.commentCount != null ? (
                <span className="text-xs text-text-secondary bg-surface-100 px-2 py-0.5 rounded-full">コメント {broadcast.commentCount.toLocaleString()}</span>
              ) : null}
            </div>
            {visibleEmbeds.has(broadcast.id) && (
              <div className="mt-3 pt-3 border-t border-surface-100">
                <BroadcastEmbed broadcast={broadcast} embedType={embedType} height={152} />
              </div>
            )}
          </div>
        ))}
      </div>

      <BroadcastSummaryModal
        broadcast={selectedBroadcastForSummary}
        isOpen={summaryModalOpen}
        onClose={closeSummaryModal}
      />
    </>
  );
}
