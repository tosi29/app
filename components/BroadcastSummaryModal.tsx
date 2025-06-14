import React from 'react';
import { PastBroadcast } from '../types/broadcast';
import styles from '../styles/BroadcastSummaryModal.module.css';

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
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{broadcast.title}</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="閉じる"
          >
            ×
          </button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>今回の配信概要</h3>
            <p className={styles.overview}>{summary.overview}</p>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>事実や出来事</h3>
            <ul className={styles.list}>
              {summary.facts.map((fact, index) => (
                <li key={index} className={styles.listItem}>{fact}</li>
              ))}
            </ul>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>学び・教訓・法則</h3>
            <ul className={styles.list}>
              {summary.lessons.map((lesson, index) => (
                <li key={index} className={styles.listItem}>{lesson}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}