import React from 'react';
import { PastBroadcast } from '../types/broadcast';

interface BroadcastSummaryModalProps {
  broadcast: PastBroadcast | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BroadcastSummaryModal({
  broadcast,
  isOpen,
  onClose
}: BroadcastSummaryModalProps) {
  if (!isOpen || !broadcast || !broadcast.summary) {
    return null;
  }

  const { summary } = broadcast;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/70 flex justify-center items-center z-[1000] p-4 max-md:p-2" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 max-md:max-h-[95vh]" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start p-6 pb-4 border-b border-gray-200 max-md:p-4 max-md:pb-3">
          <h2 className="m-0 text-xl font-semibold text-gray-900 leading-tight flex-1 pr-4 max-md:text-lg">{broadcast.title}</h2>
          <button 
            className="bg-transparent border-none text-2xl cursor-pointer text-gray-500 p-0 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 hover:bg-gray-100 hover:text-gray-900"
            onClick={onClose}
            aria-label="閉じる"
          >
            ×
          </button>
        </div>
        
        <div className="p-6 max-md:p-4">
          <div className="mb-8 last:mb-0 max-md:mb-6">
            <h3 className="m-0 mb-3 text-lg font-semibold text-blue-500 border-l-4 border-l-blue-500 pl-3 max-md:text-base max-md:pl-2">今回の配信概要</h3>
            <p className="m-0 text-base leading-relaxed text-gray-900 bg-gray-50 p-4 rounded-lg border-l-4 border-l-blue-500 max-md:p-3">{summary.overview}</p>
          </div>

          <div className="mb-8 last:mb-0 max-md:mb-6">
            <h3 className="m-0 mb-3 text-lg font-semibold text-blue-500 border-l-4 border-l-blue-500 pl-3 max-md:text-base max-md:pl-2">事実や出来事</h3>
            <ul className="m-0 p-0 list-none">
              {summary.facts.map((fact, index) => (
                <li key={index} className="mb-3 last:mb-0 p-3 bg-gray-50 rounded-lg border-l-4 border-l-green-500 text-sm leading-normal text-gray-900 relative max-md:p-2 max-md:text-xs">{fact}</li>
              ))}
            </ul>
          </div>

          <div className="mb-8 last:mb-0 max-md:mb-6">
            <h3 className="m-0 mb-3 text-lg font-semibold text-blue-500 border-l-4 border-l-blue-500 pl-3 max-md:text-base max-md:pl-2">学び・教訓・法則</h3>
            <ul className="m-0 p-0 list-none">
              {summary.lessons.map((lesson, index) => (
                <li key={index} className="mb-3 last:mb-0 p-3 bg-gray-50 rounded-lg border-l-4 border-l-green-500 text-sm leading-normal text-gray-900 relative max-md:p-2 max-md:text-xs">{lesson}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}