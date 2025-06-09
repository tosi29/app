import React from 'react';
import styles from '../styles/Home.module.css';
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
        className={styles.iconButton}
        aria-label="要約を見る"
      >
        📋
      </button>
    </>
  );
};

export default SummaryButton;