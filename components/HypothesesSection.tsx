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
}

export default function HypothesesSection({ pastBroadcasts, selectedSeries }: HypothesesSectionProps): React.ReactNode {
  const [selectedHypothesis, setSelectedHypothesis] = useState<Hypothesis | null>(null);
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dropdownSeries, setDropdownSeries] = useState<string | undefined>(selectedSeries);
  const hypothesesListRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  // Sync dropdown state with selectedSeries prop
  useEffect(() => {
    if (selectedSeries !== dropdownSeries) {
      setDropdownSeries(selectedSeries);
    }
  }, [selectedSeries, dropdownSeries]);

  // Function to extract number from string (e.g., "9. xxxx" → 9)
  const extractNumber = (str: string): number | null => {
    const match = str.match(/^(-?\d+)[\.\:]/);
    return match ? parseInt(match[1]) : null;
  };

  // Function to sort strings with numeric prefixes
  const sortByNumericPrefix = (items: string[]): string[] => {
    return items.sort((a, b) => {
      const aNum = extractNumber(a);
      const bNum = extractNumber(b);
      
      // 両方に数値がある場合は数値順ソート
      if (aNum !== null && bNum !== null) {
        return aNum - bNum;
      }
      
      // 数値がない場合は文字列ソート
      if (aNum === null && bNum === null) {
        return a.localeCompare(b);
      }
      
      // 数値があるものを先に表示
      return aNum !== null ? -1 : 1;
    });
  };

  // Get unique series from pastBroadcasts
  const getUniqueSeries = (): string[] => {
    const seriesSet = new Set(pastBroadcasts.map(b => b.series && b.series.trim() ? b.series.trim() : 'その他'));
    return sortByNumericPrefix(Array.from(seriesSet));
  };

  // Use a ref to keep track of the latest request
  const latestRequestIdRef = useRef<number>(0);

  useEffect(() => {
    // Set loading state immediately when dropdown changes
    setLoading(true);
    
    const fetchHypotheses = async () => {
      // Generate a unique request ID to track this specific request
      const thisRequestId = latestRequestIdRef.current + 1;
      latestRequestIdRef.current = thisRequestId;
      
      try {
        // Always fetch all hypotheses without API-level filtering
        const url = '/api/hypotheses';
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        // Only update state if this is still the latest request
        if (thisRequestId === latestRequestIdRef.current) {
          const data = await response.json();
          setHypotheses(data);
          setLoading(false);
        }
      } catch (error) {
        // Only update error state if this is still the latest request
        if (thisRequestId === latestRequestIdRef.current) {
          console.error('Error fetching hypotheses:', error);
          setLoading(false);
          // In a real app, you might want to show an error message to the user
        }
      }
    };

    fetchHypotheses();
  }, []); // Fetch all hypotheses once on component mount

  // Function to get episode title by id
  const getEpisodeTitle = (episodeId: number): string => {
    const broadcast = pastBroadcasts.find(b => b.id === episodeId);
    return broadcast ? broadcast.title : '不明なエピソード';
  };

  // Function to get episode series by id
  const getEpisodeSeries = (episodeId: number): string => {
    const broadcast = pastBroadcasts.find(b => b.id === episodeId);
    if (!broadcast) return 'その他';
    return broadcast.series && broadcast.series.trim() ? broadcast.series.trim() : 'その他';
  };

  // Function to map topic names to colors
  const getTopicColor = (topic: string): string => {
    // Outlierトピック（-1.で始まる）は薄いグレーを強制適用
    if (topic.startsWith('-1.')) {
      return '#9ca3af'; // gray-400
    }
    
    // Generate a hash from the topic string
    let hash = 0;
    for (let i = 0; i < topic.length; i++) {
      const char = topic.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Convert hash to a color with good saturation and lightness
    const hue = Math.abs(hash) % 360;
    const saturation = 65 + (Math.abs(hash) % 20); // 65-85%
    const lightness = 45 + (Math.abs(hash) % 15);  // 45-60%
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  // Function to get unique topics from hypotheses
  const getUniqueTopics = (): string[] => {
    const topicsSet = new Set(hypotheses.map(h => h.topic));
    return sortByNumericPrefix(Array.from(topicsSet));
  };

  // Function to wrap text at specified width (Japanese-friendly)
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
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines.join('<br>');
  };

  // Function to get filtered hypotheses by series
  const getFilteredHypotheses = (): Hypothesis[] => {
    if (!dropdownSeries) {
      return hypotheses;
    }
    return hypotheses.filter(hypothesis => {
      const episodeSeries = getEpisodeSeries(hypothesis.episodeId);
      return episodeSeries === dropdownSeries;
    });
  };

  // Get filtered hypotheses
  const filteredHypotheses = getFilteredHypotheses();
  
  // Use filtered hypotheses without sorting
  const graphSortedHypotheses = [...filteredHypotheses];


  // Handle click on hypothesis dot
  const handleHypothesisClick = (hypothesis: Hypothesis): void => {
    setSelectedHypothesis(hypothesis);
    
    // Scroll to the selected hypothesis in the list
    if (hypothesesListRef.current) {
      const hypothesisElement = hypothesesListRef.current.querySelector(`[data-hypothesis-id="${hypothesis.id}"]`);
      if (hypothesisElement) {
        hypothesisElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  };

  // Handle click on hypothesis item in the list
  const handleHypothesisItemClick = (hypothesis: Hypothesis): void => {
    setSelectedHypothesis(hypothesis);
  };

  // Handle click outside to close selected hypothesis
  const handleClickOutside = (): void => {
    setSelectedHypothesis(null);
  };

  // Handle feedback button clicks
  const handleFeedback = (_feedbackType: string, _hypothesis: Hypothesis): void => {
    // TODO: Implement API call to save feedback
    // Feedback type: _feedbackType, Hypothesis: _hypothesis.hypothesis
  };

  // Handle dropdown change
  const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const series = event.target.value === '' ? undefined : event.target.value;
    
    // Update dropdown state (this will trigger re-filtering via getFilteredHypotheses)
    setDropdownSeries(series);
    
    // Update URL to maintain existing functionality but use replace instead of push
    // to prevent adding a new history entry and causing full page reload
    const newQuery = series 
      ? { tab: 'hypotheses', series: series }
      : { tab: 'hypotheses' };
    
    router.replace({
      pathname: '/',
      query: newQuery
    }, undefined, { shallow: true });
  };

  return (
    <>
      {/* Dropdown filter for series */}
      <div className="w-full max-w-5xl my-4 px-3 py-3 bg-white rounded-lg shadow-sm border border-gray-200 flex justify-center items-center max-md:px-3">
        <div className="flex items-center gap-3 max-md:w-full">
          <label htmlFor="series-filter" className="font-semibold text-gray-900 m-0 text-sm whitespace-nowrap">
            シリーズで絞り込み:
          </label>
          <select
            id="series-filter"
            value={dropdownSeries || ''}
            onChange={handleDropdownChange}
            className="px-2 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm font-medium cursor-pointer transition-all duration-200 ease-out min-w-[200px] hover:border-blue-500 hover:shadow-[0_0_0_2px_rgba(59,130,246,0.1)] focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] max-md:min-w-0 max-md:flex-1"
          >
            <option value="">すべて</option>
            {getUniqueSeries().map((series) => (
              <option key={series} value={series}>
                {series}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-4 my-8">
          <p style={{ textAlign: 'center', fontSize: '1rem', color: 'var(--text-secondary)' }}>仮説を読み込んでいます...</p>
          <div className="w-10 h-10 border-3 border-gray-200 rounded-full border-t-blue-500 animate-spin"></div>
        </div>
      ) : graphSortedHypotheses.length === 0 ? (
        <div style={{ textAlign: 'center', margin: '2rem 0', color: 'var(--text-secondary)' }}>
          仮説はありません
        </div>
      ) : (

      <div className="w-full max-w-6xl my-8 p-6 border border-gray-200 rounded-lg bg-white shadow-md max-md:p-4">
        <div className="flex gap-6 w-full max-lg:flex-col max-lg:gap-4 max-md:gap-3">
          {/* Left side: Graph */}
          <div className="flex-1 min-w-[600px] max-lg:flex-none max-lg:min-w-0">
            <div className="w-full h-[600px]">
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
                      size: topicHypotheses.map(h => selectedHypothesis?.id === h.id ? 12 : 8),
                      color: getTopicColor(topic),
                      line: {
                        color: topicHypotheses.map(h => selectedHypothesis?.id === h.id ? '#000' : 'rgba(0,0,0,0)'),
                        width: 2
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
                      bordercolor: '#d1d5db',
                      font: { size: 12 },
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
                    gridcolor: '#e5e7eb',
                    gridwidth: 1,
                    zeroline: false,
                    showline: false,
                    showticklabels: false
                  },
                  yaxis: {
                    autorange: true,
                    showgrid: true,
                    gridcolor: '#e5e7eb',
                    gridwidth: 1,
                    zeroline: false,
                    showline: false,
                    showticklabels: false
                  },
                  plot_bgcolor: 'white',
                  paper_bgcolor: 'white',
                  margin: {
                    l: 60,
                    r: 20,
                    t: 20,
                    b: 20
                  },
                  legend: {
                    orientation: 'v',
                    x: 1.02,
                    y: 1,
                    bgcolor: 'rgba(255,255,255,0.8)',
                    bordercolor: '#d1d5db',
                    borderwidth: 1,
                    font: { size: 12 }
                  },
                  hoverlabel: {
                    bgcolor: 'white',
                    bordercolor: '#d1d5db',
                    font: { 
                      size: 12,
                      color: '#111827'
                    },
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
                style={{
                  width: '100%',
                  height: '100%'
                }}
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
            <div className="max-h-[600px] overflow-y-auto p-3 rounded-lg bg-white max-md:p-2" ref={hypothesesListRef}>
              {graphSortedHypotheses.map((hypothesis) => (
                <div
                  key={hypothesis.id}
                  data-hypothesis-id={hypothesis.id}
                  className={`p-3 mb-2 border border-gray-200 rounded-lg bg-white cursor-pointer transition-all duration-200 hover:border-blue-500 hover:shadow-sm hover:-translate-y-px max-md:p-2 max-md:mb-1.5 ${
                    selectedHypothesis?.id === hypothesis.id ? 'border-blue-500 shadow-md shadow-blue-500/10 bg-blue-500/5' : ''
                  }`}
                  onClick={() => handleHypothesisItemClick(hypothesis)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-blue-500 m-0 mb-1">
                        {getEpisodeTitle(hypothesis.episodeId)}
                        <span className="text-xs text-gray-600 ml-1.5 font-normal">
                          ({getEpisodeSeries(hypothesis.episodeId)})
                        </span>
                      </p>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full flex-shrink-0" 
                          style={{ backgroundColor: getTopicColor(hypothesis.topic) }}
                        />
                        <span className="text-xs font-medium text-gray-700">{hypothesis.topic}</span>
                      </div>
                    </div>
                  </div>
                  <p className="m-0 mb-1 text-sm leading-snug text-gray-900">{hypothesis.hypothesis}</p>
                  <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded mb-2">
                    <span className="font-medium">事実:</span> {hypothesis.fact}
                  </div>
                  <p className="m-0 text-xs text-gray-500 text-right italic">by {hypothesis.proposer}</p>
                  
                  {/* Feedback buttons */}
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <button 
                      className="px-2 py-1 border border-gray-300 rounded-lg bg-white text-gray-900 text-xs font-medium cursor-pointer transition-all duration-200 flex items-center gap-1 hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:-translate-y-px active:translate-y-0 focus:outline-2 focus:outline-blue-500 focus:outline-offset-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFeedback('interesting', hypothesis);
                      }}
                      title="興味深い"
                    >
                      🤔
                    </button>
                    <button 
                      className="px-2 py-1 border border-gray-300 rounded-lg bg-white text-gray-900 text-xs font-medium cursor-pointer transition-all duration-200 flex items-center gap-1 hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:-translate-y-px active:translate-y-0 focus:outline-2 focus:outline-blue-500 focus:outline-offset-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFeedback('groundbreaking', hypothesis);
                      }}
                      title="画期的"
                    >
                      ✨
                    </button>
                    <button 
                      className="px-2 py-1 border border-gray-300 rounded-lg bg-white text-gray-900 text-xs font-medium cursor-pointer transition-all duration-200 flex items-center gap-1 hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:-translate-y-px active:translate-y-0 focus:outline-2 focus:outline-blue-500 focus:outline-offset-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFeedback('worth-testing', hypothesis);
                      }}
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
      )}
    </>
  );
}