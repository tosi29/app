import React from 'react';
import { PastBroadcast, PopularBroadcast } from '../types/broadcast';

interface SummaryButtonProps<T extends PastBroadcast | PopularBroadcast> {
  broadcast: T;
  onOpenSummary: (broadcast: T) => void;
}

const SummaryButton = <T extends PastBroadcast | PopularBroadcast>({ 
  broadcast, 
  onOpenSummary 
}: SummaryButtonProps<T>) => {
  if (!broadcast.summary) {
    return null;
  }

  return (
    <>
      {' '}
      <button
        type="button"
        onClick={() => onOpenSummary(broadcast)}
        className="inline-flex items-center justify-center p-2 min-w-10 h-10 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-lg text-base cursor-pointer transition-all duration-200 ease-out hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:-translate-y-px hover:shadow-md active:translate-y-0 active:shadow-sm focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 no-underline"
        aria-label="要約を見る"
      >
        📋
      </button>
    </>
  );
};

export default SummaryButton;