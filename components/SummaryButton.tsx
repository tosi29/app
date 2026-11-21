import React from 'react';
import type { PastBroadcast, PopularBroadcast } from '../types/broadcast';
import { FileTextIcon } from './icons';

interface SummaryButtonProps<T extends PastBroadcast | PopularBroadcast> {
  broadcast: T;
  onOpenSummary: (broadcast: T) => void;
}

const SummaryButton = <T extends PastBroadcast | PopularBroadcast>({
  broadcast,
  onOpenSummary,
}: SummaryButtonProps<T>) => {
  if (!broadcast.summary) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => onOpenSummary(broadcast)}
      className="btn-icon"
      aria-label="要約を見る"
    >
      <FileTextIcon />
    </button>
  );
};

export default SummaryButton;
