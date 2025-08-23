import React from 'react';
import { Modal } from './Modal';
import { DangerButton, SecondaryButton } from './Buttons';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmModalProps) {
  if (!isOpen) {
    return null;
  }
  
  const footerContent = (
      <>
        <DangerButton onClick={onConfirm} className="sm:ml-3">Confirm</DangerButton>
        <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
      </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      maxWidth="max-w-md"
      footer={footerContent}
    >
      <div className="flex items-start">
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
          <svg className="h-6 w-6 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {message}
          </p>
        </div>
      </div>
    </Modal>
  );
}
