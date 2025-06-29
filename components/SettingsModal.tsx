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
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center z-[1000] animate-[fadeIn_0.2s_ease-out]" onClick={handleBackdropClick}>
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-[90%] max-w-lg max-h-[80vh] animate-[slideIn_0.2s_ease-out] max-md:w-[95%] max-md:m-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 max-md:p-4">
          <h2 className="m-0 text-xl font-semibold text-gray-900">設定</h2>
          <button
            className="bg-transparent border-none text-xl text-gray-600 cursor-pointer p-1 rounded-lg transition-all duration-200 ease-out w-8 h-8 flex items-center justify-center hover:bg-gray-100 hover:text-gray-900"
            onClick={onClose}
            aria-label="設定を閉じる"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6 max-md:p-4">
          <div className="mb-6 last:mb-0">
            <label className="block text-sm font-semibold text-gray-900 mb-3">優先する再生プラットフォーム:</label>
            <div className="flex gap-2 max-md:flex-col">
              <button
                onClick={() => onEmbedTypeChange('spotify')}
                className={`px-4 py-2 border rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 ease-out whitespace-nowrap hover:-translate-y-px focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 max-md:w-full ${
                  embedType === 'spotify' 
                    ? 'bg-blue-500 text-white border-blue-500 shadow-sm hover:bg-blue-600' 
                    : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-100 hover:border-blue-500'
                }`}
              >
                Spotify
              </button>
              <button
                onClick={() => onEmbedTypeChange('youtube')}
                className={`px-4 py-2 border rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 ease-out whitespace-nowrap hover:-translate-y-px focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 max-md:w-full ${
                  embedType === 'youtube' 
                    ? 'bg-blue-500 text-white border-blue-500 shadow-sm hover:bg-blue-600' 
                    : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-100 hover:border-blue-500'
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