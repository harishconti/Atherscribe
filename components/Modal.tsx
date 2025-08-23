import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
}

export const Modal = ({ isOpen, onClose, title, children, footer, maxWidth = 'max-w-2xl' }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-2xl w-full ${maxWidth} max-h-[90vh] flex flex-col`}>
        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700/50 flex-shrink-0">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
        {footer && (
          <div className="flex justify-end items-center gap-3 p-4 border-t border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/50 rounded-b-xl flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
