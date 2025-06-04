import React from 'react';
import styles from '../styles/SettingsModal.module.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  embedType: 'youtube' | 'spotify';
  onEmbedTypeChange: (type: 'youtube' | 'spotify') => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  embedType,
  onEmbedTypeChange
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>設定</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="設定を閉じる"
          >
            ✕
          </button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.settingGroup}>
            <label className={styles.settingLabel}>再生プラットフォーム:</label>
            <div className={styles.toggleGroup}>
              <button
                onClick={() => onEmbedTypeChange('spotify')}
                className={`${styles.toggleButton} ${embedType === 'spotify' ? styles.active : ''}`}
              >
                Spotify
              </button>
              <button
                onClick={() => onEmbedTypeChange('youtube')}
                className={`${styles.toggleButton} ${embedType === 'youtube' ? styles.active : ''}`}
              >
                YouTube
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;