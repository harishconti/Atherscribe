import React, { useEffect } from 'react';
import type { Toast as ToastType } from '../types';

interface ToastProps {
  toast: ToastType;
  onDismiss: (id: string) => void;
}

export const Toast = ({ toast, onDismiss }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 5000); // Auto-dismiss after 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [toast.id, onDismiss]);

  const bgColor = toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500';
  const icon = toast.type === 'error' ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  );

  return (
    <div className={`flex items-center p-4 rounded-lg shadow-lg text-white ${bgColor} animate-fade-in-right`}>
      <div className="flex-shrink-0">{icon}</div>
      <div className="ml-3 text-sm font-medium">{toast.message}</div>
      <button onClick={() => onDismiss(toast.id)} className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-lg inline-flex h-8 w-8 text-white hover:bg-white/20">
        <span className="sr-only">Dismiss</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastType[];
  onDismiss: (id: string) => void;
}

export const ToastContainer = ({ toasts, onDismiss }: ToastContainerProps) => {
  return (
    <div className="fixed top-5 right-5 z-[100] w-full max-w-sm space-y-2">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};
