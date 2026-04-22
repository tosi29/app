import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Hypothesis } from '../types/hypothesis';
import { PlotMouseEvent } from 'plotly.js';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface PastBroadcast {
  id: number;
  date?: string;
  title: string;
  series: string;
}

interface HypothesesSectionProps {
  pastBroadcasts: PastBroadcast[];
  selectedSeries?: string;
  selectedEpisodeId?: number;
}

export default function HypothesesSection({ pastBroadcasts, selectedSeries, selectedEpisodeId }: HypothesesSectionProps): React.ReactNode {
  const [selectedHypothesis, setSelectedHypothesis] = useState<Hypothesis | null>(null);
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dropdownSeries, setDropdownSeries] = useState<string | undefined>(selectedSeries);
  const hypothesesListRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    if (selectedSeries !== dropdownSeries) {
      setDropdownSeries(selectedSeries);
    } else if (selectedEpisodeId && !selectedSeries) {
      const broadcast = pastBroadcasts.find(b => b.id === selectedEpisodeId);
      if (broadcast) {
        const series = broadcast.series && broadcast.series.trim() ? broadcast.series.trim() : 'その他';
        setDropdownSeries(series);
      }
    }
  }, [selectedSeries, selectedEpisodeId, dropdownSeries, pastBroadcasts]);

  const extractNumber = (str: string): number | null => {
    const match = str.match(/^(-?\d+)[\.\:]/);
    return match ? parseInt(match[1]) : null;
  };

  const sortByNumericPrefix = (items: string[]): string[] => {
    return items.sort((a, b) => {
      const aNum = extractNumber(a);
      const bNum = extractNumber(b);
      if (aNum !== null && bNum !== null) return aNum - bNum;
      if (aNum === null && bNum === null) return a.localeCompare(b);
      return aNum !== null ? -1 : 1;
    });
  };

  const getUniqueSeries = (): string[] => {
    const seriesSet = new Set(pastBroadcasts.map(b => b.series && b.series.trim() ? b.series.trim() : 'その他'));
    return sortByNumericPrefix(Array.from(seriesSet));
  };

  const latestRequestIdRef = useRef<number>(0);

  useEffect(() => {
    setLoading(true);
    const fetchHypotheses = async () => {
      const thisRequestId = latestRequestIdRef.current + 1;
      latestRequestIdRef.current = thisRequestId;
      try {
        const url = '/api/hypotheses';
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        if (thisRequestId === latestRequestIdRef.current) {
          const data = await response.json();
          setHypotheses(data);
          setLoading(false);
        }
      } catch (error) {
        if (thisRequestId === latestRequestIdRef.current) {
          console.error('Error fetching hypotheses:', error);
          setLoading(false);
        }
      }
    };
    fetchHypotheses();
  }, []);

  const getEpisodeTitle = (episodeId: number): string => {
    const broadcast = pastBroadcasts.find(b => b.id === episodeId);
    return broadcast ? broadcast.title : '不明なエピソード';
  };

  const getEpisodeSeries = (episodeId: number): string => {
    const broadcast = pastBroadcasts.find(b => b.id === episodeId);
    if (!broadcast) return 'その他';
    return broadcast.series && broadcast.series.trim() ? broadcast.series.trim() : 'その他';
  };

  const getTopicColor = (topic: string): string => {
    if (topic.startsWith('-1.')) return '#94a3b8';
    let hash = 0;
    for (let i = 0; i < topic.length; i++) {
      const char = topic.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const hue = Math.abs(hash) % 360;
    const saturation = 55 + (Math.abs(hash) % 15);
    const lightness = 50 + (Math.abs(hash) % 10);
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const getUniqueTopics = (): string[] => {
    const topicsSet = new Set(hypotheses.map(h => h.topic));
    return sortByNumericPrefix(Array.from(topicsSet));
  };

  const wrapText = (text: string, maxWidth: number = 40): string => {
    if (!text) return '';
    const lines: string[] = [];
    let currentLine = '';
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (currentLine.length >= maxWidth) {
        lines.push(currentLine);
        currentLine = char;
      } else {
        currentLine += char;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines.join('<br>');
  };

  const getFilteredHypotheses = (): Hypothesis[] => {
    if (!dropdownSeries) return hypotheses;
    return hypotheses.filter(hypothesis => {
      const episodeSeries = getEpisodeSeries(hypothesis.episodeId);
      return episodeSeries === dropdownSeries;
    });
  };

  const filteredHypotheses = getFilteredHypotheses();
  const graphSortedHypotheses = [...filteredHypotheses];

  const handleHypothesisClick = (hypothesis: Hypothesis): void => {
    setSelectedHypothesis(hypothesis);
    if (hypothesesListRef.current) {
      const hypothesisElement = hypothesesListRef.current.querySelector(`[data-hypothesis-id="${hypothesis.id}"]`);
      if (hypothesisElement) {
        hypothesisElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleHypothesisItemClick = (hypothesis: Hypothesis): void => {
    setSelectedHypothesis(hypothesis);
  };

  const handleClickOutside = (): void => {
    setSelectedHypothesis(null);
  };

  const handleFeedback = (_feedbackType: string, _hypothesis: Hypothesis): void => {
    // TODO: Implement API call to save feedback
  };

  const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const series = event.target.value === '' ? undefined : event.target.value;
    setDropdownSeries(series);
    const newQuery = series
      ? { tab: 'hypotheses', series: series }
      : { tab: 'hypotheses' };
    router.replace({ pathname: '/', query: newQuery }, undefined, { shallow: true });
  };

  return (
    <>
      {/* Dropdown filter for series */}
      <div className="w-full max-w-5xl card-modern p-4 mb-6 flex justify-center items-center max-md:px-3">
        <div className="flex items-center gap-3 max-md:w-full">
          <label htmlFor="series-filter" className="text-sm font-medium text-text-secondary whitespace-nowrap">
            シリーズ:
          </label>
          <select
            id="series-filter"
            value={dropdownSeries || ''}
            onChange={handleDropdownChange}
            className="px-3 py-2 border border-surface-200 rounded-xl bg-surface-50 text-text-primary text-sm cursor-pointer transition-all duration-200 min-w-[200px] hover:border-primary-300 focus:outline-none focus:border-primary-400 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] focus:bg-white max-md:min-w-0 max-md:flex-1"
          >
            <option value="">すべて</option>
            {getUniqueSeries().map((series) => (
              <option key={series} value={series}>{series}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-4 my-16">
          <div className="w-10 h-10 border-3 border-surface-200 rounded-full border-t-primary-500 animate-spin"></div>
          <p className="text-text-muted text-sm">仮説を読み込んでいます...</p>
        </div>
      ) : graphSortedHypotheses.length === 0 ? (
        <div className="card-modern p-10 text-center w-full max-w-5xl">
          <p className="text-text-muted text-sm m-0">仮説はありません</p>
        </div>
      ) : (
        <div className="w-full max-w-7xl card-modern p-6 max-md:p-4">
          <div className="flex gap-6 w-full max-lg:flex-col max-lg:gap-4">
            {/* Left side: Graph */}
            <div className="flex-1 min-w-[600px] max-lg:flex-none max-lg:min-w-0">
              <div className="w-full h-[600px] rounded-xl overflow-hidden bg-white">
                <Plot
                  data={getUniqueTopics().map(topic => {
                    const topicHypotheses = filteredHypotheses.filter(h => h.topic === topic);
                    return {
                      x: topicHypotheses.map(h => h.x),
                      y: topicHypotheses.map(h => h.y),
                      mode: 'markers',
                      type: 'scatter',
                      name: topic,
                      marker: {
                        size: topicHypotheses.map(h => selectedHypothesis?.id === h.id ? 14 : 9),
                        color: getTopicColor(topic),
                        opacity: 0.85,
                        line: {
                          color: topicHypotheses.map(h => selectedHypothesis?.id === h.id ? '#1e293b' : 'rgba(255,255,255,0.8)'),
                          width: topicHypotheses.map(h => selectedHypothesis?.id === h.id ? 2.5 : 1)
                        }
                      },
                      customdata: topicHypotheses.map(h => [
                        h,
                        getEpisodeTitle(h.episodeId),
                        getEpisodeSeries(h.episodeId),
                        wrapText(h.hypothesis, 40),
                        wrapText(h.fact, 40)
                      ]) as any,
                      hovertemplate:
                        '<b>仮説：</b><br>' +
                        '%{customdata[3]}<br>' +
                        '<br>' +
                        '<b>事実：</b><br>' +
                        '%{customdata[4]}<br>' +
                        '<br>' +
                        'トピック：' + topic + '<br>' +
                        '%{customdata[2]} -- %{customdata[1]}' +
                        '<extra></extra>',
                      hoverlabel: {
                        bgcolor: 'white',
                        bordercolor: '#e2e8f0',
                        font: { size: 12, color: '#1e293b' },
                        namelength: -1
                      },
                      showlegend: true
                    };
                  })}
                  layout={{
                    width: undefined,
                    height: 600,
                    xaxis: {
                      autorange: true,
                      showgrid: true,
                      gridcolor: '#f1f5f9',
                      gridwidth: 1,
                      zeroline: false,
                      showline: false,
                      showticklabels: false
                    },
                    yaxis: {
                      autorange: true,
                      showgrid: true,
                      gridcolor: '#f1f5f9',
                      gridwidth: 1,
                      zeroline: false,
                      showline: false,
                      showticklabels: false
                    },
                    plot_bgcolor: '#fafbfc',
                    paper_bgcolor: 'white',
                    margin: { l: 40, r: 20, t: 20, b: 20 },
                    legend: {
                      orientation: 'v',
                      x: 1.02,
                      y: 1,
                      bgcolor: 'rgba(255,255,255,0.9)',
                      bordercolor: '#e2e8f0',
                      borderwidth: 1,
                      font: { size: 11, color: '#475569' }
                    },
                    hoverlabel: {
                      bgcolor: 'white',
                      bordercolor: '#e2e8f0',
                      font: { size: 12, color: '#1e293b' },
                      align: 'left',
                      namelength: -1
                    },
                    hovermode: 'closest'
                  }}
                  config={{
                    displayModeBar: false,
                    responsive: true,
                    toImageButtonOptions: {
                      format: 'png',
                      filename: 'hypothesis-graph',
                      height: 600,
                      width: 800,
                      scale: 1
                    }
                  }}
                  style={{ width: '100%', height: '100%' }}
                  onClick={(data: PlotMouseEvent) => {
                    if (data.points && data.points.length > 0) {
                      const point = data.points[0];
                      const hypothesis = (point as any).customdata[0] as Hypothesis;
                      handleHypothesisClick(hypothesis);
                    } else {
                      handleClickOutside();
                    }
                  }}
                />
              </div>
            </div>

            {/* Right side: Hypotheses List */}
            <div className="flex-1 min-w-[300px] max-lg:flex-none max-lg:min-w-0">
              <div className="max-h-[600px] overflow-y-auto pr-1" ref={hypothesesListRef}>
                <div className="flex flex-col gap-2.5">
                  {graphSortedHypotheses.map((hypothesis) => (
                    <div
                      key={hypothesis.id}
                      data-hypothesis-id={hypothesis.id}
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border max-md:p-3 ${
                        selectedHypothesis?.id === hypothesis.id
                          ? 'border-primary-300 shadow-md shadow-primary-500/10 bg-primary-50/50'
                          : 'border-surface-200 bg-white hover:border-primary-200 hover:shadow-app-sm hover:-translate-y-px'
                      }`}
                      onClick={() => handleHypothesisItemClick(hypothesis)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-primary-600 m-0 mb-1.5">
                            {getEpisodeTitle(hypothesis.episodeId)}
                            <span className="text-xs text-text-muted ml-1.5 font-normal">
                              ({getEpisodeSeries(hypothesis.episodeId)})
                            </span>
                          </p>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0 ring-2 ring-white shadow-sm"
                              style={{ backgroundColor: getTopicColor(hypothesis.topic) }}
                            />
                            <span className="text-xs font-medium text-text-secondary">{hypothesis.topic}</span>
                          </div>
                        </div>
                      </div>
                      <p className="m-0 mb-2 text-sm leading-relaxed text-text-primary">{hypothesis.hypothesis}</p>
                      <div className="text-xs text-primary-700 bg-primary-50 px-3 py-2 rounded-lg mb-2">
                        <span className="font-semibold">事実:</span> {hypothesis.fact}
                      </div>
                      <p className="m-0 text-xs text-text-muted text-right">by {hypothesis.proposer}</p>

                      {/* Feedback buttons */}
                      <div className="flex gap-1.5 mt-2.5 pt-2.5 border-t border-surface-100">
                        <button
                          className="px-2.5 py-1 rounded-lg bg-surface-50 text-text-secondary text-xs font-medium cursor-pointer transition-all duration-200 border border-surface-200 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 active:scale-95"
                          onClick={(e) => { e.stopPropagation(); handleFeedback('interesting', hypothesis); }}
                          title="興味深い"
                        >
                          🤔
                        </button>
                        <button
                          className="px-2.5 py-1 rounded-lg bg-surface-50 text-text-secondary text-xs font-medium cursor-pointer transition-all duration-200 border border-surface-200 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 active:scale-95"
                          onClick={(e) => { e.stopPropagation(); handleFeedback('groundbreaking', hypothesis); }}
                          title="画期的"
                        >
                          ✨
                        </button>
                        <button
                          className="px-2.5 py-1 rounded-lg bg-surface-50 text-text-secondary text-xs font-medium cursor-pointer transition-all duration-200 border border-surface-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 active:scale-95"
                          onClick={(e) => { e.stopPropagation(); handleFeedback('worth-testing', hypothesis); }}
                          title="検証したい"
                        >
                          🎯
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
