import React, { useState, useEffect, useMemo, useCallback } from 'react';
import BroadcastEmbed from './BroadcastEmbed';
import BroadcastSummaryModal from './BroadcastSummaryModal';
import SummaryButton from './SummaryButton';
import { PlayIcon, StopIcon, LightbulbIcon, ChevronRightIcon } from './icons';
import { PastBroadcast } from '../types/broadcast';

interface BroadcastsContentProps {
  pastBroadcasts: PastBroadcast[];
  isLoadingBroadcasts: boolean;
  visibleEmbeds: Set<number>;
  toggleEmbedVisibility: (id: number) => void;
  router: any;
  embedType: 'youtube' | 'spotify';
}

type SortColumn = 'date' | 'title' | 'duration';

const thClass = "px-4 py-3 text-left text-xs font-semibold text-text-muted bg-surface-50 border-b border-surface-200 whitespace-nowrap";
const thSortableClass = `${thClass} cursor-pointer select-none hover:text-primary-600 transition-colors`;

const BroadcastsContent = React.memo(({
  pastBroadcasts,
  isLoadingBroadcasts,
  visibleEmbeds,
  toggleEmbedVisibility,
  router,
  embedType
}: BroadcastsContentProps) => {
  const formatDuration = useCallback((seconds: number | undefined): string => {
    if (!seconds) return '—';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  const formatDurationInHours = useCallback((seconds: number | undefined): string => {
    if (!seconds) return '—';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}時間${minutes}分`;
    } else {
      return `${minutes}分`;
    }
  }, []);

  const formatDate = useCallback((date: string | undefined): string => {
    if (!date) return '—';
    return date;
  }, []);

  const [expandedSeries, setExpandedSeries] = useState<Record<string, boolean>>({});
  const [groupDisplayMode, setGroupDisplayMode] = useState<boolean>(true);
  const [sortColumn, setSortColumn] = useState<SortColumn>('date');
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

  const handleSort = useCallback((column: SortColumn) => {
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
      { bar: 'bg-primary-400', headerBg: 'bg-primary-50/60' },
      { bar: 'bg-emerald-400', headerBg: 'bg-emerald-50/60' },
      { bar: 'bg-amber-400', headerBg: 'bg-amber-50/60' },
      { bar: 'bg-rose-400', headerBg: 'bg-rose-50/60' },
      { bar: 'bg-cyan-400', headerBg: 'bg-cyan-50/60' },
      { bar: 'bg-violet-400', headerBg: 'bg-violet-50/60' },
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

  const getHypothesesQuery = useCallback((broadcast: PastBroadcast) => {
    return groupDisplayMode
      ? `/?tab=hypotheses&series=${encodeURIComponent(broadcast.series && broadcast.series.trim() ? broadcast.series.trim() : 'その他')}`
      : `/?tab=hypotheses&episodeId=${broadcast.id}`;
  }, [groupDisplayMode]);

  const renderActions = useCallback((broadcast: PastBroadcast) => (
    <>
      <button type="button" onClick={() => toggleEmbedVisibility(broadcast.id)} className="btn-icon" aria-label={visibleEmbeds.has(broadcast.id) ? '再生を閉じる' : '再生する'}>
        {visibleEmbeds.has(broadcast.id) ? <StopIcon /> : <PlayIcon />}
      </button>
      <button type="button" onClick={() => router.push(getHypothesesQuery(broadcast))} className="btn-icon" aria-label="仮説を見る">
        <LightbulbIcon />
      </button>
      <SummaryButton broadcast={broadcast} onOpenSummary={openSummaryModal} />
    </>
  ), [toggleEmbedVisibility, visibleEmbeds, router, getHypothesesQuery, openSummaryModal]);

  const sortLabels: Record<SortColumn, string> = { date: '日付', title: 'タイトル', duration: '再生時間' };

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

            {groupDisplayMode ? (
              <div className="flex items-center gap-2 max-md:justify-center">
                <button onClick={expandAllSeries} className="btn-secondary text-xs px-3 py-1.5">
                  すべて展開
                </button>
                <button onClick={collapseAllSeries} className="btn-secondary text-xs px-3 py-1.5">
                  すべて閉じる
                </button>
              </div>
            ) : (
              <div className="hidden max-md:flex items-center justify-center gap-2">
                <label htmlFor="broadcast-sort" className="text-sm font-medium text-text-secondary">並び順:</label>
                <select
                  id="broadcast-sort"
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
            )}
          </div>

          {/* Desktop: table view */}
          <div className="w-full card-modern overflow-hidden max-md:hidden">
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  {groupDisplayMode ? (
                    <>
                      <th className={`${thClass} first:rounded-tl-2xl`}>日付</th>
                      <th className={thClass}>タイトル</th>
                      <th className={thClass}>再生時間</th>
                      <th className={`${thClass} last:rounded-tr-2xl`}>リンク</th>
                    </>
                  ) : (
                    <>
                      <th className={`${thSortableClass} first:rounded-tl-2xl`} onClick={() => handleSort('date')}>
                        日付 {sortColumn === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className={thSortableClass} onClick={() => handleSort('title')}>
                        タイトル {sortColumn === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className={thSortableClass} onClick={() => handleSort('duration')}>
                        再生時間 {sortColumn === 'duration' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className={`${thClass} last:rounded-tr-2xl`}>リンク</th>
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
                                  <span className={`w-1 h-8 rounded-full ${accent.bar}`}></span>
                                  <span className="text-text-muted transition-transform duration-200" style={{ transform: expandedSeries[series] ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                                    <ChevronRightIcon />
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
                                <td className="px-4 py-3 text-text-secondary border-b border-surface-100 whitespace-nowrap font-mono text-xs">{formatDuration(broadcast.duration)}</td>
                                <td className="px-4 py-3 border-b border-surface-100 whitespace-nowrap">
                                  <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                                    {renderActions(broadcast)}
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
                        <td className="px-4 py-3 text-text-secondary border-b border-surface-100 whitespace-nowrap font-mono text-xs">{formatDuration(broadcast.duration)}</td>
                        <td className="px-4 py-3 border-b border-surface-100 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                            {renderActions(broadcast)}
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

          {/* Mobile: card view */}
          <div className="hidden max-md:flex w-full flex-col gap-3">
            {groupDisplayMode ? (
              sortSeriesByNumber(Object.entries(broadcastsBySeries))
                .map(([series, broadcasts]) => {
                  const accent = getSeriesAccent(series);
                  return (
                    <div key={series} className="card-modern overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleSeries(series)}
                        className={`w-full flex items-center justify-between gap-2 px-4 py-3 text-left border-none cursor-pointer ${accent.headerBg}`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-1 h-8 rounded-full flex-shrink-0 ${accent.bar}`}></span>
                          <span className="text-text-muted flex-shrink-0 transition-transform duration-200" style={{ transform: expandedSeries[series] ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                            <ChevronRightIcon />
                          </span>
                          <span className="font-semibold text-sm text-text-primary truncate">{series}</span>
                          <span className="text-xs text-text-muted bg-surface-100 px-2 py-0.5 rounded-full flex-shrink-0">{broadcasts.length}</span>
                        </div>
                        <span className="text-xs text-text-muted font-medium whitespace-nowrap flex-shrink-0">
                          {calculateSeresTotalDuration(broadcasts)}
                        </span>
                      </button>
                      {expandedSeries[series] && (
                        <div className="flex flex-col divide-y divide-surface-100 border-t border-surface-100">
                          {broadcasts.map((broadcast) => (
                            <div key={broadcast.id} className="px-4 py-3">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                  <p className="m-0 text-sm font-medium text-text-primary leading-snug">{broadcast.title}</p>
                                  <p className="m-0 mt-1 text-xs text-text-muted">
                                    {formatDate(broadcast.date)}
                                    <span className="mx-1.5">·</span>
                                    {formatDuration(broadcast.duration)}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  {renderActions(broadcast)}
                                </div>
                              </div>
                              {visibleEmbeds.has(broadcast.id) && (
                                <div className="mt-3">
                                  <BroadcastEmbed broadcast={broadcast} embedType={embedType} height={152} />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
            ) : (
              sortedBroadcasts.map((broadcast) => (
                <div key={broadcast.id} className="card-modern p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="m-0 text-sm font-medium text-text-primary leading-snug">{broadcast.title}</p>
                      <p className="m-0 mt-1 text-xs text-text-muted">
                        {broadcast.series && broadcast.series.trim() ? broadcast.series.trim() : '999. その他'}
                      </p>
                      <p className="m-0 mt-1 text-xs text-text-muted">
                        {formatDate(broadcast.date)}
                        <span className="mx-1.5">·</span>
                        {formatDuration(broadcast.duration)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {renderActions(broadcast)}
                    </div>
                  </div>
                  {visibleEmbeds.has(broadcast.id) && (
                    <div className="mt-3 pt-3 border-t border-surface-100">
                      <BroadcastEmbed broadcast={broadcast} embedType={embedType} height={152} />
                    </div>
                  )}
                </div>
              ))
            )}
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
