import React, { useState, useEffect, useMemo, useCallback } from 'react';
import BroadcastEmbed from './BroadcastEmbed';
import BroadcastSummaryModal from './BroadcastSummaryModal';
import SummaryButton from './SummaryButton';
import { PastBroadcast } from '../types/broadcast';

interface BroadcastsContentProps {
  pastBroadcasts: PastBroadcast[];
  isLoadingBroadcasts: boolean;
  visibleEmbeds: Set<number>;
  toggleEmbedVisibility: (id: number) => void;
  router: any;
  embedType: 'youtube' | 'spotify';
}

const BroadcastsContent = React.memo(({
  pastBroadcasts,
  isLoadingBroadcasts,
  visibleEmbeds,
  toggleEmbedVisibility,
  router,
  embedType
}: BroadcastsContentProps) => {
  const formatDuration = useCallback((seconds: number | undefined): string => {
    if (!seconds) return '\u2014';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  const formatDurationInHours = useCallback((seconds: number | undefined): string => {
    if (!seconds) return '\u2014';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}時間${minutes}分`;
    } else {
      return `${minutes}分`;
    }
  }, []);

  const formatDate = useCallback((date: string | undefined): string => {
    if (!date) return '\u2014';
    return date;
  }, []);

  const [expandedSeries, setExpandedSeries] = useState<Record<string, boolean>>({});
  const [groupDisplayMode, setGroupDisplayMode] = useState<boolean>(true);
  const [sortColumn, setSortColumn] = useState<'date' | 'title' | 'duration'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [summaryModalOpen, setSummaryModalOpen] = useState<boolean>(false);
  const [selectedBroadcastForSummary, setSelectedBroadcastForSummary] = useState<PastBroadcast | null>(null);

  const broadcastsBySeries = useMemo(() => {
    const grouped: Record<string, PastBroadcast[]> = {};
    pastBroadcasts.forEach(broadcast => {
      const seriesName = broadcast.series && broadcast.series.trim() ? broadcast.series.trim() : '999. その他';
      if (!grouped[seriesName]) {
        grouped[seriesName] = [];
      }
      grouped[seriesName].push(broadcast);
    });
    Object.keys(grouped).forEach(series => {
      grouped[series].sort((a, b) => a.id - b.id);
    });
    return grouped;
  }, [pastBroadcasts]);

  const calculateSeresTotalDuration = useCallback((broadcasts: PastBroadcast[]): string => {
    const totalSeconds = broadcasts.reduce((sum, broadcast) => {
      return sum + (broadcast.duration || 0);
    }, 0);
    return formatDurationInHours(totalSeconds);
  }, [formatDurationInHours]);

  const extractSeriesNumberFromName = useCallback((seriesName: string): number | null => {
    const match = seriesName.match(/^(\d+)\./);
    return match ? parseInt(match[1]) : null;
  }, []);

  const sortSeriesByNumber = useCallback((entries: [string, PastBroadcast[]][]): [string, PastBroadcast[]][] => {
    return entries.sort(([a], [b]) => {
      const aNum = extractSeriesNumberFromName(a);
      const bNum = extractSeriesNumberFromName(b);
      if (aNum !== null && bNum !== null) return aNum - bNum;
      if (aNum === null && bNum === null) return a.localeCompare(b);
      return aNum !== null ? -1 : 1;
    });
  }, [extractSeriesNumberFromName]);

  const sortedBroadcasts = useMemo(() => {
    const sorted = [...pastBroadcasts];
    sorted.sort((a, b) => {
      let aValue: any, bValue: any;
      switch (sortColumn) {
        case 'date':
          aValue = a.date ? new Date(a.date) : new Date(0);
          bValue = b.date ? new Date(b.date) : new Date(0);
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'duration':
          aValue = a.duration || 0;
          bValue = b.duration || 0;
          break;
        default:
          return 0;
      }
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [pastBroadcasts, sortColumn, sortDirection]);

  useEffect(() => {
    setExpandedSeries(prev => {
      const newState = { ...prev };
      Object.keys(broadcastsBySeries).forEach(series => {
        if (!(series in newState)) {
          newState[series] = false;
        }
      });
      return newState;
    });
  }, [broadcastsBySeries]);

  const toggleSeries = useCallback((series: string) => {
    setExpandedSeries(prev => ({ ...prev, [series]: !prev[series] }));
  }, []);

  const expandAllSeries = useCallback(() => {
    const allExpanded: Record<string, boolean> = {};
    Object.keys(broadcastsBySeries).forEach(series => { allExpanded[series] = true; });
    setExpandedSeries(allExpanded);
  }, [broadcastsBySeries]);

  const collapseAllSeries = useCallback(() => {
    const allCollapsed: Record<string, boolean> = {};
    Object.keys(broadcastsBySeries).forEach(series => { allCollapsed[series] = false; });
    setExpandedSeries(allCollapsed);
  }, [broadcastsBySeries]);

  const handleSort = useCallback((column: 'date' | 'title' | 'duration') => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  }, [sortColumn]);

  const seriesList = useMemo(() => Object.keys(broadcastsBySeries), [broadcastsBySeries]);

  const getSeriesAccent = useCallback((series: string) => {
    const index = seriesList.indexOf(series);
    const accents = [
      { bg: 'bg-primary-50', border: 'border-l-primary-400', headerBg: 'bg-primary-50/60' },
      { bg: 'bg-emerald-50', border: 'border-l-emerald-400', headerBg: 'bg-emerald-50/60' },
      { bg: 'bg-amber-50', border: 'border-l-amber-400', headerBg: 'bg-amber-50/60' },
      { bg: 'bg-rose-50', border: 'border-l-rose-400', headerBg: 'bg-rose-50/60' },
      { bg: 'bg-cyan-50', border: 'border-l-cyan-400', headerBg: 'bg-cyan-50/60' },
      { bg: 'bg-violet-50', border: 'border-l-violet-400', headerBg: 'bg-violet-50/60' },
    ];
    return accents[index % accents.length];
  }, [seriesList]);

  const openSummaryModal = useCallback((broadcast: PastBroadcast) => {
    setSelectedBroadcastForSummary(broadcast);
    setSummaryModalOpen(true);
  }, []);

  const closeSummaryModal = useCallback(() => {
    setSummaryModalOpen(false);
    setSelectedBroadcastForSummary(null);
  }, []);

  return (
    <>
      {isLoadingBroadcasts ? (
        <div className="flex flex-col items-center gap-4 my-16">
          <div className="w-10 h-10 border-3 border-surface-200 rounded-full border-t-primary-500 animate-spin"></div>
          <p className="text-text-muted text-sm">配信データを読み込み中...</p>
        </div>
      ) : (
        <>
          {/* Display mode controls */}
          <div className="flex justify-between items-center w-full card-modern p-4 mb-6 max-md:flex-col max-md:gap-3 max-md:items-stretch">
            <div className="flex items-center gap-2 max-md:justify-center">
              <span className="text-sm font-medium text-text-secondary mr-1">表示:</span>
              <button
                onClick={() => setGroupDisplayMode(true)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 ease-out border ${
                  groupDisplayMode
                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                    : 'bg-white text-text-secondary border-surface-200 hover:border-primary-300 hover:text-primary-600'
                }`}
              >
                グループ
              </button>
              <button
                onClick={() => setGroupDisplayMode(false)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 ease-out border ${
                  !groupDisplayMode
                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                    : 'bg-white text-text-secondary border-surface-200 hover:border-primary-300 hover:text-primary-600'
                }`}
              >
                一覧
              </button>
            </div>

            {groupDisplayMode && (
              <div className="flex items-center gap-2 max-md:justify-center">
                <button onClick={expandAllSeries} className="btn-secondary text-xs px-3 py-1.5">
                  すべて展開
                </button>
                <button onClick={collapseAllSeries} className="btn-secondary text-xs px-3 py-1.5">
                  すべて閉じる
                </button>
              </div>
            )}
          </div>

          <div className="w-full card-modern overflow-hidden">
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  {groupDisplayMode ? (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider bg-surface-50 border-b border-surface-200 first:rounded-tl-2xl whitespace-nowrap">日付</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider bg-surface-50 border-b border-surface-200 whitespace-nowrap">タイトル</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider bg-surface-50 border-b border-surface-200 whitespace-nowrap">再生時間</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider bg-surface-50 border-b border-surface-200 last:rounded-tr-2xl whitespace-nowrap">リンク</th>
                    </>
                  ) : (
                    <>
                      <th className="cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider bg-surface-50 border-b border-surface-200 first:rounded-tl-2xl whitespace-nowrap hover:text-primary-600 transition-colors" onClick={() => handleSort('date')}>
                        日付 {sortColumn === 'date' && (sortDirection === 'asc' ? '\u2191' : '\u2193')}
                      </th>
                      <th className="cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider bg-surface-50 border-b border-surface-200 whitespace-nowrap hover:text-primary-600 transition-colors" onClick={() => handleSort('title')}>
                        タイトル {sortColumn === 'title' && (sortDirection === 'asc' ? '\u2191' : '\u2193')}
                      </th>
                      <th className="cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider bg-surface-50 border-b border-surface-200 whitespace-nowrap hover:text-primary-600 transition-colors" onClick={() => handleSort('duration')}>
                        再生時間 {sortColumn === 'duration' && (sortDirection === 'asc' ? '\u2191' : '\u2193')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider bg-surface-50 border-b border-surface-200 last:rounded-tr-2xl whitespace-nowrap">リンク</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {groupDisplayMode ? (
                  sortSeriesByNumber(Object.entries(broadcastsBySeries))
                    .map(([series, broadcasts]) => {
                      const accent = getSeriesAccent(series);
                      return (
                        <React.Fragment key={series}>
                          <tr
                            className={`cursor-pointer transition-all duration-200 ${accent.headerBg} hover:brightness-95`}
                            onClick={() => toggleSeries(series)}
                          >
                            <td colSpan={4} className="px-4 py-3 border-b border-surface-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className={`w-1 h-8 rounded-full ${accent.border.replace('border-l-', 'bg-')}`}></span>
                                  <span className="text-xs text-text-muted w-5 text-center transition-transform duration-200" style={{ transform: expandedSeries[series] ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                                    ▶
                                  </span>
                                  <span className="font-semibold text-text-primary">{series}</span>
                                  <span className="text-xs text-text-muted bg-surface-100 px-2 py-0.5 rounded-full">{broadcasts.length}</span>
                                </div>
                                <span className="text-xs text-text-muted font-medium">
                                  {calculateSeresTotalDuration(broadcasts)}
                                </span>
                              </div>
                            </td>
                          </tr>
                          {expandedSeries[series] && broadcasts.map((broadcast) => (
                            <React.Fragment key={broadcast.id}>
                              <tr className="hover:bg-primary-50/30 transition-colors duration-150 group">
                                <td className="px-4 py-3 text-sm text-text-secondary border-b border-surface-100 whitespace-nowrap">{formatDate(broadcast.date)}</td>
                                <td className="px-4 py-3 text-sm text-text-primary border-b border-surface-100 font-medium">{broadcast.title}</td>
                                <td className="px-4 py-3 text-sm text-text-secondary border-b border-surface-100 whitespace-nowrap font-mono text-xs">{formatDuration(broadcast.duration)}</td>
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
                                  <td colSpan={4} className="px-4 py-3 bg-surface-50 border-b border-surface-100">
                                    <BroadcastEmbed broadcast={broadcast} embedType={embedType} height={152} />
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          ))}
                        </React.Fragment>
                      );
                    })
                ) : (
                  sortedBroadcasts.map((broadcast, index) => (
                    <React.Fragment key={broadcast.id}>
                      <tr className={`hover:bg-primary-50/30 transition-colors duration-150 group ${index % 2 === 0 ? '' : 'bg-surface-50/50'}`}>
                        <td className="px-4 py-3 text-sm text-text-secondary border-b border-surface-100 whitespace-nowrap">{formatDate(broadcast.date)}</td>
                        <td className="px-4 py-3 border-b border-surface-100">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-medium text-text-primary">{broadcast.title}</span>
                            <span className="text-xs text-text-muted">
                              {broadcast.series && broadcast.series.trim() ? broadcast.series.trim() : '999. その他'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-text-secondary border-b border-surface-100 whitespace-nowrap font-mono text-xs">{formatDuration(broadcast.duration)}</td>
                        <td className="px-4 py-3 border-b border-surface-100 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                            <button type="button" onClick={() => toggleEmbedVisibility(broadcast.id)} className="btn-icon" aria-label={visibleEmbeds.has(broadcast.id) ? '非表示' : '再生'}>
                              {visibleEmbeds.has(broadcast.id) ? '\u23F9\uFE0F' : '\u25B6\uFE0F'}
                            </button>
                            <button type="button" onClick={() => router.push(`/?tab=hypotheses&episodeId=${broadcast.id}`)} className="btn-icon" aria-label="仮説を見る">
                              💬
                            </button>
                            <SummaryButton broadcast={broadcast} onOpenSummary={openSummaryModal} />
                          </div>
                        </td>
                      </tr>
                      {visibleEmbeds.has(broadcast.id) && (
                        <tr>
                          <td colSpan={4} className="px-4 py-3 bg-surface-50 border-b border-surface-100">
                            <BroadcastEmbed broadcast={broadcast} embedType={embedType} height={152} />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
      <BroadcastSummaryModal
        broadcast={selectedBroadcastForSummary}
        isOpen={summaryModalOpen}
        onClose={closeSummaryModal}
      />
    </>
  );
});

BroadcastsContent.displayName = 'BroadcastsContent';

export default BroadcastsContent;
