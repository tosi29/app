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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[1000] p-4 animate-fade-in max-md:p-2" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-app-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-surface-200 animate-slide-in max-md:max-h-[95vh]" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start px-6 py-5 border-b border-surface-100 sticky top-0 bg-white rounded-t-2xl z-10 max-md:px-4 max-md:py-4">
          <h2 className="m-0 text-lg font-semibold text-text-primary leading-snug flex-1 pr-4 max-md:text-base">{broadcast.title}</h2>
          <button
            className="bg-transparent border-none text-text-muted cursor-pointer p-1.5 rounded-lg transition-all duration-200 w-8 h-8 flex items-center justify-center flex-shrink-0 hover:bg-surface-100 hover:text-text-primary"
            onClick={onClose}
            aria-label="閉じる"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        <div className="p-6 max-md:p-4">
          <div className="mb-8 last:mb-0 max-md:mb-6">
            <h3 className="m-0 mb-3 text-sm font-semibold text-primary-600 uppercase tracking-wide max-md:text-xs">概要</h3>
            <p className="m-0 text-sm leading-relaxed text-text-primary bg-primary-50/50 p-4 rounded-xl border-l-3 border-l-primary-400 max-md:p-3">{summary.overview}</p>
          </div>

          <div className="mb-8 last:mb-0 max-md:mb-6">
            <h3 className="m-0 mb-3 text-sm font-semibold text-emerald-600 uppercase tracking-wide max-md:text-xs">事実や出来事</h3>
            <div className="flex flex-col gap-2">
              {summary.facts.map((fact, index) => (
                <div key={index} className="p-3.5 bg-emerald-50/50 rounded-xl border-l-3 border-l-emerald-400 text-sm leading-relaxed text-text-primary max-md:p-2.5 max-md:text-xs">{fact}</div>
              ))}
            </div>
          </div>

          <div className="mb-8 last:mb-0 max-md:mb-6">
            <h3 className="m-0 mb-3 text-sm font-semibold text-amber-600 uppercase tracking-wide max-md:text-xs">学び・教訓・法則</h3>
            <div className="flex flex-col gap-2">
              {summary.lessons.map((lesson, index) => (
                <div key={index} className="p-3.5 bg-amber-50/50 rounded-xl border-l-3 border-l-amber-400 text-sm leading-relaxed text-text-primary max-md:p-2.5 max-md:text-xs">{lesson}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
