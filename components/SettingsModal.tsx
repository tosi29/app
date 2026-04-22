import React from 'react';

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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[1000] animate-fade-in" onClick={handleBackdropClick}>
      <div className="bg-white rounded-2xl shadow-app-xl border border-surface-200 w-[90%] max-w-md animate-slide-in max-md:w-[95%]">
        <div className="flex justify-between items-center px-6 py-5 border-b border-surface-100">
          <h2 className="m-0 text-lg font-semibold text-text-primary">設定</h2>
          <button
            className="bg-transparent border-none text-text-muted cursor-pointer p-1.5 rounded-lg transition-all duration-200 w-8 h-8 flex items-center justify-center hover:bg-surface-100 hover:text-text-primary"
            onClick={onClose}
            aria-label="設定を閉じる"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-3">再生プラットフォーム</label>
            <div className="flex gap-2 max-md:flex-col">
              <button
                onClick={() => onEmbedTypeChange('spotify')}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 border ${
                  embedType === 'spotify'
                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                    : 'bg-white text-text-secondary border-surface-200 hover:border-primary-300 hover:text-primary-600'
                }`}
              >
                Spotify
              </button>
              <button
                onClick={() => onEmbedTypeChange('youtube')}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 border ${
                  embedType === 'youtube'
                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                    : 'bg-white text-text-secondary border-surface-200 hover:border-primary-300 hover:text-primary-600'
                }`}
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
