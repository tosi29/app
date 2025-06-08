import React from 'react';
import { BroadcastSummary, PastBroadcast } from '../types/broadcast';
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
            <h3 className={styles.sectionTitle}>事実や出来事と学び・教訓・法則</h3>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.tableHeader}>事実や出来事</th>
                    <th className={styles.tableHeader}>学び・教訓・法則</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.facts.map((fact, index) => (
                    <tr key={index} className={styles.tableRow}>
                      <td className={styles.tableCell} data-label="事実や出来事">{fact}</td>
                      <td className={styles.tableCell} data-label="学び・教訓・法則">{summary.lessons[index] || ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}