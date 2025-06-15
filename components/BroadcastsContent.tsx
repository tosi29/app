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
  // State to track which series are expanded
  const [expandedSeries, setExpandedSeries] = useState<Record<string, boolean>>({});
  
  // State for group display mode
  const [groupDisplayMode, setGroupDisplayMode] = useState<boolean>(true);
  
  // State for sorting in non-group mode
  const [sortColumn, setSortColumn] = useState<'date' | 'title' | 'duration'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // State for summary modal
  const [summaryModalOpen, setSummaryModalOpen] = useState<boolean>(false);
  const [selectedBroadcastForSummary, setSelectedBroadcastForSummary] = useState<PastBroadcast | null>(null);

  // Group broadcasts by series with ID-based sorting within groups
  const broadcastsBySeries = useMemo(() => {
    const grouped: Record<string, PastBroadcast[]> = {};
    pastBroadcasts.forEach(broadcast => {
      if (!grouped[broadcast.series]) {
        grouped[broadcast.series] = [];
      }
      grouped[broadcast.series].push(broadcast);
    });
    
    // Sort broadcasts within each group by ID
    Object.keys(grouped).forEach(series => {
      grouped[series].sort((a, b) => a.id - b.id);
    });
    
    return grouped;
  }, [pastBroadcasts]);

  // Sorted broadcasts for non-group mode
  const sortedBroadcasts = useMemo(() => {
    const sorted = [...pastBroadcasts];
    sorted.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortColumn) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'duration':
          aValue = a.duration;
          bValue = b.duration;
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
    const initialExpandedState: Record<string, boolean> = {};
    Object.keys(broadcastsBySeries).forEach(series => {
      initialExpandedState[series] = true; // Initially expanded
    });
    setExpandedSeries(initialExpandedState);
  }, [broadcastsBySeries]);

  // Toggle expanded state for a series
  const toggleSeries = useCallback((series: string) => {
    setExpandedSeries(prev => ({
      ...prev,
      [series]: !prev[series]
    }));
  }, []);
  
  // Expand all series
  const expandAllSeries = useCallback(() => {
    const allExpanded: Record<string, boolean> = {};
    Object.keys(broadcastsBySeries).forEach(series => {
      allExpanded[series] = true;
    });
    setExpandedSeries(allExpanded);
  }, [broadcastsBySeries]);
  
  // Collapse all series
  const collapseAllSeries = useCallback(() => {
    const allCollapsed: Record<string, boolean> = {};
    Object.keys(broadcastsBySeries).forEach(series => {
      allCollapsed[series] = false;
    });
    setExpandedSeries(allCollapsed);
  }, [broadcastsBySeries]);
  
  // Handle column sorting
  const handleSort = useCallback((column: 'date' | 'title' | 'duration') => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  }, [sortColumn]);

  // Get series list and create color mapping
  const seriesList = useMemo(() => Object.keys(broadcastsBySeries), [broadcastsBySeries]);
  
  // Function to get series color class based on index
  const getSeriesColorClass = useCallback((series: string) => {
    const index = seriesList.indexOf(series);
    const colorClasses = [
      'bg-green-500/15 border-l-4 border-l-green-500/80 border-t-2 border-t-green-500/50',
      'bg-blue-500/15 border-l-4 border-l-blue-500/80 border-t-2 border-t-blue-500/50', 
      'bg-pink-500/15 border-l-4 border-l-pink-500/80 border-t-2 border-t-pink-500/50'
    ];
    return colorClasses[index % colorClasses.length];
  }, [seriesList]);

  // Summary modal handlers
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
        <div className="flex flex-col items-center gap-4 my-8">配信データを読み込み中...</div>
      ) : (
        <>
          {/* Display mode controls */}
          <div className="flex justify-between items-center w-full max-w-4xl my-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200 max-md:flex-col max-md:gap-4 max-md:items-stretch">
            <div className="flex items-center gap-2 max-md:justify-center">
              <label className="font-semibold text-gray-900 mr-2">表示モード:</label>
              <button
                onClick={() => setGroupDisplayMode(true)}
                className={`px-4 py-2 border rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 ease-out hover:-translate-y-px focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 ${
                  groupDisplayMode 
                    ? 'bg-blue-500 text-white border-blue-500 shadow-sm hover:bg-blue-600' 
                    : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-100 hover:border-blue-500'
                }`}
              >
                グループ表示
              </button>
              <button
                onClick={() => setGroupDisplayMode(false)}
                className={`px-4 py-2 border rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 ease-out hover:-translate-y-px focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 ${
                  !groupDisplayMode 
                    ? 'bg-blue-500 text-white border-blue-500 shadow-sm hover:bg-blue-600' 
                    : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-100 hover:border-blue-500'
                }`}
              >
                一覧表示
              </button>
            </div>
            
            {groupDisplayMode && (
              <div className="flex items-center gap-2 max-md:justify-center">
                <button
                  onClick={expandAllSeries}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm font-medium cursor-pointer transition-all duration-200 ease-out hover:bg-gray-100 hover:border-blue-500 hover:-translate-y-px focus:outline-2 focus:outline-blue-500 focus:outline-offset-2"
                >
                  すべて展開
                </button>
                <button
                  onClick={collapseAllSeries}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm font-medium cursor-pointer transition-all duration-200 ease-out hover:bg-gray-100 hover:border-blue-500 hover:-translate-y-px focus:outline-2 focus:outline-blue-500 focus:outline-offset-2"
                >
                  すべて閉じる
                </button>
              </div>
            )}
          </div>

          <div className="w-full max-w-4xl my-6 overflow-x-auto rounded-lg shadow-md bg-white">
            <table className="w-full border-separate border-spacing-0 mb-0">
              <thead>
                <tr>
                  {groupDisplayMode ? (
                    <>
                      <th className="px-3 py-2 text-left border-b border-gray-200 bg-gray-100 font-semibold text-gray-900 sticky top-0 first:rounded-tl-lg last:rounded-tr-lg whitespace-nowrap">日付</th>
                      <th className="px-3 py-2 text-left border-b border-gray-200 bg-gray-100 font-semibold text-gray-900 sticky top-0 whitespace-nowrap">タイトル</th>
                      <th className="px-3 py-2 text-left border-b border-gray-200 bg-gray-100 font-semibold text-gray-900 sticky top-0 whitespace-nowrap">再生時間</th>
                      <th className="px-3 py-2 text-left border-b border-gray-200 bg-gray-100 font-semibold text-gray-900 sticky top-0 first:rounded-tl-lg last:rounded-tr-lg whitespace-nowrap">リンク</th>
                    </>
                  ) : (
                    <>
                      <th 
                        className="cursor-pointer select-none transition-all duration-200 ease-out hover:bg-gray-100 hover:text-blue-500 px-3 py-2 text-left border-b border-gray-200 bg-gray-100 font-semibold text-gray-900 sticky top-0 first:rounded-tl-lg last:rounded-tr-lg whitespace-nowrap"
                        onClick={() => handleSort('date')}
                      >
                        日付 {sortColumn === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th 
                        className="cursor-pointer select-none transition-all duration-200 ease-out hover:bg-gray-100 hover:text-blue-500 px-3 py-2 text-left border-b border-gray-200 bg-gray-100 font-semibold text-gray-900 sticky top-0 whitespace-nowrap"
                        onClick={() => handleSort('title')}
                      >
                        タイトル {sortColumn === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th 
                        className="cursor-pointer select-none transition-all duration-200 ease-out hover:bg-gray-100 hover:text-blue-500 px-3 py-2 text-left border-b border-gray-200 bg-gray-100 font-semibold text-gray-900 sticky top-0 whitespace-nowrap"
                        onClick={() => handleSort('duration')}
                      >
                        再生時間 {sortColumn === 'duration' && (sortDirection === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="px-3 py-2 text-left border-b border-gray-200 bg-gray-100 font-semibold text-gray-900 sticky top-0 first:rounded-tl-lg last:rounded-tr-lg whitespace-nowrap">リンク</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {groupDisplayMode ? (
                  // Group display mode
                  Object.entries(broadcastsBySeries)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([series, broadcasts]) => (
                    <React.Fragment key={series}>
                      <tr 
                        className={`cursor-pointer font-bold text-lg transition-all duration-200 ease-out border-t-2 border-b border-gray-100 hover:-translate-y-px hover:shadow-md ${getSeriesColorClass(series)}`}
                        onClick={() => toggleSeries(series)}
                      >
                        <td colSpan={4} className="px-3 py-2 text-left border-b border-gray-200">
                          <div className="flex items-center gap-1.5 py-1.5">
                            <span className="inline-flex items-center justify-center text-sm transition-transform duration-200 ease-out w-5 h-5 font-bold">
                              {expandedSeries[series] ? '▼' : '▶'}
                            </span>
                            <span className="font-bold text-gray-800 drop-shadow-sm">{series} ({broadcasts.length})</span>
                          </div>
                        </td>
                      </tr>
                      {expandedSeries[series] && broadcasts.map((broadcast) => (
                        <React.Fragment key={broadcast.id}>
                          <tr>
                            <td className="px-3 py-2 text-left border-b border-gray-200 hover:bg-gray-100">{broadcast.date}</td>
                            <td className="px-3 py-2 text-left border-b border-gray-200 hover:bg-gray-100">{broadcast.title}</td>
                            <td className="px-3 py-2 text-left border-b border-gray-200 hover:bg-gray-100">{broadcast.duration}</td>
                            <td className="px-3 py-2 text-left border-b border-gray-200 hover:bg-gray-100">
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
                                type="button"
                                onClick={() => router.push(`/?tab=comments&episodeId=${broadcast.id}`)}
                                className="inline-flex items-center justify-center p-2 min-w-10 h-10 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-lg text-base cursor-pointer transition-all duration-200 ease-out hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:-translate-y-px hover:shadow-md active:translate-y-0 active:shadow-sm focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 no-underline"
                                aria-label="コメントを見る"
                              >
                                💬
                              </button>
                              <SummaryButton 
                                broadcast={broadcast}
                                onOpenSummary={openSummaryModal}
                              />
                            </td>
                          </tr>
                          {visibleEmbeds.has(broadcast.id) && (
                            <tr>
                              <td colSpan={4}>
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
                    </React.Fragment>
                  ))
                ) : (
                  // List display mode
                  sortedBroadcasts.map((broadcast) => (
                    <React.Fragment key={broadcast.id}>
                      <tr>
                        <td className="px-3 py-2 text-left border-b border-gray-200 hover:bg-gray-100">{broadcast.date}</td>
                        <td className="px-3 py-2 text-left border-b border-gray-200 hover:bg-gray-100">
                          <div className="flex flex-col gap-1">
                            <div className="font-medium text-gray-900">{broadcast.title}</div>
                            <div className="text-xs text-gray-600 font-normal">{broadcast.series}</div>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-left border-b border-gray-200 hover:bg-gray-100">{broadcast.duration}</td>
                        <td className="px-3 py-2 text-left border-b border-gray-200 hover:bg-gray-100">
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
                            type="button"
                            onClick={() => router.push(`/?tab=comments&episodeId=${broadcast.id}`)}
                            className="inline-flex items-center justify-center p-2 min-w-10 h-10 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-lg text-base cursor-pointer transition-all duration-200 ease-out hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:-translate-y-px hover:shadow-md active:translate-y-0 active:shadow-sm focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 no-underline"
                            aria-label="コメントを見る"
                          >
                            💬
                          </button>
                          <SummaryButton 
                            broadcast={broadcast}
                            onOpenSummary={openSummaryModal}
                          />
                        </td>
                      </tr>
                      {visibleEmbeds.has(broadcast.id) && (
                        <tr>
                          <td colSpan={4}>
                            <BroadcastEmbed 
                              broadcast={broadcast}
                              embedType={embedType}
                              height={152}
                            />
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