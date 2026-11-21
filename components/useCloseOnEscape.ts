import { useEffect } from 'react';

// モーダル表示中に Esc キーで閉じられるようにする。
// 背景クリックで閉じる操作のキーボード代替を、ここで提供する。
export function useCloseOnEscape(isOpen: boolean, onClose: () => void): void {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
}
