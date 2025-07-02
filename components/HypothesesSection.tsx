import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Hypothesis } from '../types/hypothesis';

interface PastBroadcast {
  id: number;
  date?: string;
  title: string;
  series: string;
}

interface HypothesesSectionProps {
  pastBroadcasts: PastBroadcast[];
  selectedEpisodeId?: number;
}

export default function HypothesesSection({ pastBroadcasts, selectedEpisodeId }: HypothesesSectionProps): React.ReactNode {
  const [selectedHypothesis, setSelectedHypothesis] = useState<Hypothesis | null>(null);
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dropdownEpisodeId, setDropdownEpisodeId] = useState<number | undefined>(selectedEpisodeId);
  const [hiddenTopics, setHiddenTopics] = useState<Set<string>>(new Set());
  const [isolatedTopic, setIsolatedTopic] = useState<string | null>(null);
  const hypothesesListRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  // Sync dropdown state with selectedEpisodeId prop
  useEffect(() => {
    // Only update the dropdown state if the selectedEpisodeId is different
    if (selectedEpisodeId !== dropdownEpisodeId) {
      setDropdownEpisodeId(selectedEpisodeId);
    }
  }, [selectedEpisodeId, dropdownEpisodeId]);

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
        // Use dropdownEpisodeId as the single source of truth for data fetching
        const url = dropdownEpisodeId 
          ? `/api/hypotheses?episodeId=${dropdownEpisodeId}`
          : '/api/hypotheses';
        
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
  }, [dropdownEpisodeId]); // Only depend on dropdownEpisodeId

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
    const topicColors: { [key: string]: string } = {
      'リーダーシップ': '#3b82f6',     // Blue
      '教育手法': '#10b981',          // Green
      'コミュニケーション': '#f59e0b',  // Amber
      '技術革新': '#8b5cf6',          // Purple
      '社会変化': '#ef4444',          // Red
      '認知科学': '#06b6d4',          // Cyan
      '人工知能': '#ec4899',          // Pink
      '仮想現実': '#84cc16',          // Lime
      '先端科学': '#6366f1',          // Indigo
      '人材育成': '#14b8a6',          // Teal
      '学問統合': '#f97316',          // Orange
      '時代背景': '#a855f7',          // Violet
      '学習理論': '#22c55e',          // Green
      'その他': '#6b7280'             // Gray
    };
    
    return topicColors[topic] || '#6b7280';
  };

  // Function to get unique topics from hypotheses
  const getUniqueTopics = (): string[] => {
    return Array.from(new Set(hypotheses.map(h => h.topic))).sort();
  };

  // Function to get filtered hypotheses
  const getFilteredHypotheses = (): Hypothesis[] => {
    return hypotheses;
  };

  // Helper function to check if topic is visible
  const isTopicVisible = (topic: string): boolean => {
    return !hiddenTopics.has(topic);
  };

  // Get filtered hypotheses
  const filteredHypotheses = getFilteredHypotheses();
  
  // Get all hypotheses that are currently visible in the graph (considering hidden topics)
  const graphVisibleHypotheses = filteredHypotheses.filter(h => isTopicVisible(h.topic));
  
  // Sort graph-visible hypotheses for the list display
  const graphSortedHypotheses = [...graphVisibleHypotheses].sort((a, b) => b.confidenceScore - a.confidenceScore);


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
    const episodeId = event.target.value === '' ? undefined : Number(event.target.value);
    
    // Clear existing hypotheses and show loading state immediately
    setHypotheses([]);
    setLoading(true);
    
    // Update dropdown state
    setDropdownEpisodeId(episodeId);
    
    // Update URL to maintain existing functionality but use replace instead of push
    // to prevent adding a new history entry and causing full page reload
    const newQuery = episodeId 
      ? { tab: 'hypotheses', episodeId: episodeId.toString() }
      : { tab: 'hypotheses' };
    
    router.replace({
      pathname: '/',
      query: newQuery
    }, undefined, { shallow: true });
  };


  // Plotly-like legend functions
  const handleTopicSingleClick = (topic: string): void => {
    if (isolatedTopic) {
      // If in isolated mode, exit isolation first
      setIsolatedTopic(null);
      setHiddenTopics(new Set());
    } else {
      // Toggle visibility of the clicked topic
      setHiddenTopics(prev => {
        const newSet = new Set(prev);
        if (newSet.has(topic)) {
          newSet.delete(topic);
        } else {
          newSet.add(topic);
        }
        return newSet;
      });
    }
  };

  const handleTopicDoubleClick = (topic: string): void => {
    if (isolatedTopic === topic) {
      // If double-clicking the same isolated topic, restore all
      setIsolatedTopic(null);
      setHiddenTopics(new Set());
    } else {
      // Isolate the clicked topic (hide all others)
      const allTopics = getUniqueTopics();
      const topicsToHide = allTopics.filter(t => t !== topic);
      setHiddenTopics(new Set(topicsToHide));
      setIsolatedTopic(topic);
    }
  };

  return (
    <>
      {/* Dropdown filter for episodes */}
      <div className="w-full max-w-5xl my-4 px-3 py-3 bg-white rounded-lg shadow-sm border border-gray-200 flex justify-center items-center max-md:px-3">
        <div className="flex items-center gap-3 max-md:w-full">
          <label htmlFor="episode-filter" className="font-semibold text-gray-900 m-0 text-sm whitespace-nowrap">
            配信で絞り込み:
          </label>
          <select
            id="episode-filter"
            value={dropdownEpisodeId || ''}
            onChange={handleDropdownChange}
            className="px-2 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm font-medium cursor-pointer transition-all duration-200 ease-out min-w-[200px] hover:border-blue-500 hover:shadow-[0_0_0_2px_rgba(59,130,246,0.1)] focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] max-md:min-w-0 max-md:flex-1"
          >
            <option value="">すべて</option>
            {pastBroadcasts.map((broadcast) => (
              <option key={broadcast.id} value={broadcast.id}>
                {broadcast.title}
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

      <div className="w-full max-w-7xl my-8 p-6 border border-gray-200 rounded-lg bg-white shadow-md max-md:p-4">
        <div className="flex gap-6 w-full max-lg:flex-col max-lg:gap-4 max-md:gap-3">
          {/* Left side: Graph */}
          <div className="flex-1 min-w-[500px] max-w-[700px] max-lg:flex-none max-lg:min-w-0">
            <div className="w-full h-[600px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={400}>
                <ScatterChart
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 60,
                  }}
                  onClick={handleClickOutside}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    domain={[0, 1]}
                    tick={false}
                    axisLine={false}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    domain={[0, 1]}
                    tick={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as Hypothesis;
                        
                        // Don't show tooltip for hidden topics
                        if (!isTopicVisible(data.topic)) {
                          return null;
                        }
                        
                        return (
                          <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3 max-w-xs">
                            <p className="font-semibold text-sm text-blue-500 mb-1 m-0">
                              {getEpisodeTitle(data.episodeId)}
                              <span className="text-xs text-gray-600 ml-1 font-normal">
                                ({getEpisodeSeries(data.episodeId)})
                              </span>
                            </p>
                            <div className="flex items-center gap-2 mb-1">
                              <div 
                                className="w-2 h-2 rounded-full flex-shrink-0" 
                                style={{ backgroundColor: getTopicColor(data.topic) }}
                              />
                              <span className="text-xs font-medium text-gray-700">{data.topic}</span>
                            </div>
                            <p className="text-sm leading-snug text-gray-900 mb-1 m-0">{data.hypothesis}</p>
                            <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded mb-1">
                              <span className="font-medium">事実:</span> {data.fact}
                            </div>
                            <p className="text-xs text-gray-500 italic m-0">by {data.proposer}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {/* Single scatter with all hypotheses (transparency controlled) */}
                  <Scatter
                    data={filteredHypotheses}
                    onClick={(data) => {
                      if (data && data.payload) {
                        const hypothesis = data.payload as Hypothesis;
                        // Only handle click if topic is visible
                        if (isTopicVisible(hypothesis.topic)) {
                          handleHypothesisClick(hypothesis);
                        }
                      }
                    }}
                  >
                    {filteredHypotheses.map((hypothesis) => (
                      <Cell 
                        key={`cell-${hypothesis.id}`}
                        fill={getTopicColor(hypothesis.topic)}
                        fillOpacity={isTopicVisible(hypothesis.topic) ? 1 : 0.1}
                        stroke={selectedHypothesis?.id === hypothesis.id ? '#000' : 'none'}
                        strokeWidth={selectedHypothesis?.id === hypothesis.id ? 2 : 0}
                        strokeOpacity={isTopicVisible(hypothesis.topic) ? 1 : 0.1}
                        r={selectedHypothesis?.id === hypothesis.id ? 8 : 6}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>

          </div>

          {/* Middle: Topic Legend */}
          <div className="min-w-[160px] max-w-[180px] max-lg:min-w-0 max-lg:max-w-none">
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 h-[600px] overflow-y-auto">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 text-center">トピック</h3>
              <div className="space-y-2">
                {getUniqueTopics().map(topic => {
                  const color = getTopicColor(topic);
                  const hypothesesCount = filteredHypotheses.filter(h => h.topic === topic).length;
                  if (hypothesesCount === 0) return null;
                  
                  const isVisible = isTopicVisible(topic);
                  const isIsolated = isolatedTopic === topic;
                  
                  return (
                    <div 
                      key={topic} 
                      className={`flex items-center gap-2 p-2 rounded-md cursor-pointer select-none transition-all duration-200 ${
                        isVisible 
                          ? 'hover:bg-white hover:shadow-sm' 
                          : 'opacity-50'
                      } ${
                        isIsolated ? 'bg-blue-100 ring-1 ring-blue-300' : ''
                      }`}
                      onClick={() => handleTopicSingleClick(topic)}
                      onDoubleClick={() => handleTopicDoubleClick(topic)}
                      title={`${topic} (${hypothesesCount}件)\nクリック: 表示/非表示切替\nダブルクリック: 単独表示`}
                    >
                      <div 
                        className={`w-3 h-3 rounded-full flex-shrink-0 transition-opacity duration-200 ${
                          !isVisible ? 'opacity-30' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-medium truncate transition-all duration-200 ${
                          !isVisible ? 'line-through text-gray-400' : 'text-gray-800'
                        }`}>
                          {topic}
                        </div>
                        <div className="text-xs text-gray-500">
                          {hypothesesCount}件
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {(hiddenTopics.size > 0 || isolatedTopic) && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <button
                    className="w-full px-3 py-2 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                    onClick={() => {
                      setHiddenTopics(new Set());
                      setIsolatedTopic(null);
                    }}
                    title="すべてのトピックを表示"
                  >
                    すべて表示
                  </button>
                </div>
              )}
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