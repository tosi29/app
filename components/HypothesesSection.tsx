import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Hypothesis } from '../types/hypothesis';

interface PastBroadcast {
  id: number;
  date: string;
  title: string;
  series: string;
}

interface HypothesesSectionProps {
  pastBroadcasts: PastBroadcast[];
  selectedEpisodeId?: number;
}

export default function HypothesesSection({ pastBroadcasts, selectedEpisodeId }: HypothesesSectionProps): React.ReactNode {
  const [hoveredHypothesis, setHoveredHypothesis] = useState<Hypothesis | null>(null);
  const [selectedHypothesis, setSelectedHypothesis] = useState<Hypothesis | null>(null);
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [dropdownEpisodeId, setDropdownEpisodeId] = useState<number | undefined>(selectedEpisodeId);
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
    return broadcast ? broadcast.series : '';
  };

  // Function to map series names to color types
  const getSeriesColorType = (seriesName: string): string => {
    // Get all unique series from broadcasts
    const allSeries = Array.from(new Set(pastBroadcasts.map(b => b.series)));
    const colorTypes = ['basic', 'guest', 'community'];
    
    // Sort series alphabetically for consistent assignment
    const sortedSeries = allSeries.sort();
    const seriesIndex = sortedSeries.indexOf(seriesName);
    
    // Assign color type cyclically
    return seriesIndex >= 0 ? colorTypes[seriesIndex % colorTypes.length] : 'basic';
  };

  // Function to get series CSS class name
  const getSeriesClassName = (episodeId: number): string => {
    const series = getEpisodeSeries(episodeId);
    if (!series) return '';
    
    const colorType = getSeriesColorType(series);
    return `hypothesisDot-${colorType}`;
  };

  // Sort hypotheses by confidence score
  const sortedHypotheses = [...hypotheses].sort((a, b) => b.confidenceScore - a.confidenceScore);

  // Handle mouse over hypothesis dot
  const handleMouseOver = (hypothesis: Hypothesis): void => {
    setHoveredHypothesis(hypothesis);
  };

  // Handle mouse out from hypothesis dot
  const handleMouseOut = (): void => {
    setHoveredHypothesis(null);
  };

  // Handle click on hypothesis dot
  const handleHypothesisClick = (hypothesis: Hypothesis): void => {
    setSelectedHypothesis(hypothesis);
    setHoveredHypothesis(null);
    
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
    setHoveredHypothesis(null);
  };

  // Handle click outside to close selected hypothesis
  const handleClickOutside = (): void => {
    setSelectedHypothesis(null);
  };

  // Handle feedback button clicks
  const handleFeedback = (feedbackType: string, hypothesis: Hypothesis): void => {
    console.log(`Feedback "${feedbackType}" given to hypothesis:`, hypothesis.hypothesis);
    // Here you could add API call to save feedback
    // For now, just log it
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

  return (
    <>
      {/* Dropdown filter for episodes */}
      <div className="w-full max-w-4xl my-4 px-3 py-3 bg-white rounded-lg shadow-sm border border-gray-200 flex justify-center items-center gap-3 max-md:flex-col max-md:gap-2 max-md:px-3">
        <label htmlFor="episode-filter" className="font-semibold text-gray-900 m-0 text-sm">
          配信で絞り込み:
        </label>
        <select
          id="episode-filter"
          value={dropdownEpisodeId || ''}
          onChange={handleDropdownChange}
          className="px-2 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm font-medium cursor-pointer transition-all duration-200 ease-out min-w-[200px] hover:border-blue-500 hover:shadow-[0_0_0_2px_rgba(59,130,246,0.1)] focus:outline-none focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] max-md:min-w-0 max-md:w-full"
        >
          <option value="">すべて</option>
          {pastBroadcasts.map((broadcast) => (
            <option key={broadcast.id} value={broadcast.id}>
              {broadcast.title}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-4 my-8">
          <p style={{ textAlign: 'center', fontSize: '1rem', color: 'var(--text-secondary)' }}>仮説を読み込んでいます...</p>
          <div className="w-10 h-10 border-3 border-gray-200 rounded-full border-t-blue-500 animate-spin"></div>
        </div>
      ) : hypotheses.length === 0 ? (
        <div style={{ textAlign: 'center', margin: '2rem 0', color: 'var(--text-secondary)' }}>
          仮説はありません
        </div>
      ) : (

      <div className="w-full max-w-7xl my-8 p-6 border border-gray-200 rounded-lg bg-white shadow-md max-md:p-4">
        <div className="flex gap-6 w-full max-lg:flex-col max-lg:gap-4 max-md:gap-3">
          {/* Left side: Graph */}
          <div className="flex-shrink-0 max-lg:flex-none">
            <div 
              className="relative w-[600px] h-[600px] mx-auto max-md:w-[450px] max-md:h-[450px] max-md:scale-75 max-md:origin-top-left"
              onClick={handleClickOutside}
            >
              <div className="absolute top-1/2 -left-10 -translate-y-1/2 -rotate-90 text-sm text-gray-600 font-medium">確信度 ↑</div>
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 text-sm text-gray-600 font-medium">← 一般的 | 独創的 →</div>

              <svg width="600" height="600" className="bg-gray-50 rounded-lg transition-all duration-300 hover:shadow-sm">
                {/* X-axis line */}
                <line x1="50" y1="550" x2="550" y2="550" stroke="var(--text-secondary)" strokeWidth="1.5" />
                
                {/* Y-axis line */}
                <line x1="50" y1="50" x2="50" y2="550" stroke="var(--text-secondary)" strokeWidth="1.5" />
                
                {/* X-axis label ticks */}
                <line x1="50" y1="550" x2="50" y2="560" stroke="var(--text-secondary)" strokeWidth="1.5" />
                <text x="50" y="575" textAnchor="middle" fontSize="12" fill="var(--text-secondary)">0</text>
                
                <line x1="300" y1="550" x2="300" y2="560" stroke="var(--text-secondary)" strokeWidth="1.5" />
                <text x="300" y="575" textAnchor="middle" fontSize="12" fill="var(--text-secondary)">0.5</text>
                
                <line x1="550" y1="550" x2="550" y2="560" stroke="var(--text-secondary)" strokeWidth="1.5" />
                <text x="550" y="575" textAnchor="middle" fontSize="12" fill="var(--text-secondary)">1.0</text>
                
                {/* Y-axis label ticks */}
                <line x1="40" y1="550" x2="50" y2="550" stroke="var(--text-secondary)" strokeWidth="1.5" />
                <text x="35" y="555" textAnchor="end" fontSize="12" fill="var(--text-secondary)">0</text>
                
                <line x1="40" y1="300" x2="50" y2="300" stroke="var(--text-secondary)" strokeWidth="1.5" />
                <text x="35" y="305" textAnchor="end" fontSize="12" fill="var(--text-secondary)">0.5</text>
                
                <line x1="40" y1="50" x2="50" y2="50" stroke="var(--text-secondary)" strokeWidth="1.5" />
                <text x="35" y="55" textAnchor="end" fontSize="12" fill="var(--text-secondary)">1.0</text>
                
                {/* Plot hypothesis dots */}
                {hypotheses.map((hypothesis) => {
                  const x = 50 + hypothesis.originalityScore * 500; // Scale to fit within the graph
                  const y = 550 - hypothesis.confidenceScore * 500; // Invert Y-axis to have positive values going up
                  const seriesClass = getSeriesClassName(hypothesis.episodeId);
                  
                  return (
                    <circle
                      key={hypothesis.id}
                      cx={x}
                      cy={y}
                      className={`r-2 cursor-pointer transition-all duration-200 hover:r-3 hover:opacity-80 ${seriesClass === 'hypothesisDot-basic' ? 'fill-blue-500' : seriesClass === 'hypothesisDot-guest' ? 'fill-green-500' : seriesClass === 'hypothesisDot-community' ? 'fill-purple-500' : 'fill-blue-500'} ${
                        selectedHypothesis?.id === hypothesis.id ? 'r-3 stroke-2 stroke-black' : ''
                      }`}
                      r="6"
                      onMouseOver={() => handleMouseOver(hypothesis)}
                      onMouseOut={handleMouseOut}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleHypothesisClick(hypothesis);
                      }}
                    />
                  );
                })}
              </svg>
              
              {/* Hypothesis tooltip with episode information */}
              {hoveredHypothesis && (
                <div
                  className={`absolute z-10 p-3 bg-white border border-gray-300 rounded-lg shadow-lg max-w-xs min-w-48 pointer-events-none transform ${
                    hoveredHypothesis.originalityScore > 0.5
                      ? (hoveredHypothesis.confidenceScore > 0.5
                        ? '-translate-x-full -translate-y-full'
                        : '-translate-x-full translate-y-2')
                      : (hoveredHypothesis.confidenceScore > 0.5
                        ? 'translate-x-2 -translate-y-full'
                        : 'translate-x-2 translate-y-2')
                  }`}
                  style={{
                    left: `${50 + hoveredHypothesis.originalityScore * 500}px`,
                    top: `${550 - hoveredHypothesis.confidenceScore * 500}px`,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="font-semibold text-sm text-blue-500 mb-1 m-0">
                    {getEpisodeTitle(hoveredHypothesis.episodeId)} 
                    <span className="text-xs text-gray-600 ml-1 font-normal">
                      ({getEpisodeSeries(hoveredHypothesis.episodeId)})
                    </span>
                  </p>
                  <p className="text-sm leading-snug text-gray-900 mb-1 m-0">{hoveredHypothesis.hypothesis}</p>
                  <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded mb-1">
                    <span className="font-medium">事実:</span> {hoveredHypothesis.fact}
                  </div>
                  <p className="text-xs text-gray-500 italic m-0">by {hoveredHypothesis.proposer}</p>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-6 mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 max-md:flex-col max-md:gap-2">
              {!dropdownEpisodeId ? (
                // Show all series when no filter is applied
                Array.from(new Set(pastBroadcasts.map(b => b.series)))
                  .sort()
                  .map(series => {
                    const colorType = getSeriesColorType(series);
                    return (
                      <div key={series} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${colorType === 'basic' ? 'bg-blue-500' : colorType === 'guest' ? 'bg-green-500' : colorType === 'community' ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                        <div>{series}</div>
                      </div>
                    );
                  })
              ) : (
                // Show only the selected episode's series when filtered
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getSeriesClassName(dropdownEpisodeId) === 'hypothesisDot-basic' ? 'bg-blue-500' : getSeriesClassName(dropdownEpisodeId) === 'hypothesisDot-guest' ? 'bg-green-500' : getSeriesClassName(dropdownEpisodeId) === 'hypothesisDot-community' ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                  <div>{getEpisodeSeries(dropdownEpisodeId)}</div>
                </div>
              )}
            </div>
          </div>

          {/* Right side: Hypotheses List */}
          <div className="flex-1 min-w-[300px] max-lg:flex-none max-lg:min-w-0">
            <div className="max-h-[600px] overflow-y-auto p-3 rounded-lg bg-white max-md:p-2" ref={hypothesesListRef}>
              <h3 className="m-0 mb-4 text-lg font-semibold text-gray-900 pb-2 border-b border-gray-200">
                仮説一覧 (確信度順)
              </h3>
              {sortedHypotheses.map((hypothesis) => (
                <div
                  key={hypothesis.id}
                  data-hypothesis-id={hypothesis.id}
                  className={`p-3 mb-2 border border-gray-200 rounded-lg bg-white cursor-pointer transition-all duration-200 hover:border-blue-500 hover:shadow-sm hover:-translate-y-px max-md:p-2 max-md:mb-1.5 ${
                    selectedHypothesis?.id === hypothesis.id ? 'border-blue-500 shadow-md shadow-blue-500/10 bg-blue-500/5' : ''
                  }`}
                  onClick={() => handleHypothesisItemClick(hypothesis)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-semibold text-blue-500 m-0">
                      {getEpisodeTitle(hypothesis.episodeId)}
                      <span className="text-xs text-gray-600 ml-1.5 font-normal">
                        ({getEpisodeSeries(hypothesis.episodeId)})
                      </span>
                    </p>
                    <span className="text-xs text-gray-600 bg-blue-500/10 px-2 py-1 rounded-full">
                      {Math.round(hypothesis.confidenceScore * 100)}%
                    </span>
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