import React, { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export const ActionButton = ({ children, className = '', ...props }: ButtonProps) => (
  <button
    {...props}
    type={props.type || "button"}
    className={`inline-flex items-center justify-center rounded-lg border border-transparent px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 bg-cyan-600 text-white hover:bg-cyan-500 focus:ring-cyan-500 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:text-slate-500 dark:disabled:text-slate-400 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

export const DangerButton = ({ children, className = '', ...props }: ButtonProps) => (
  <button
    {...props}
    type="button"
    className={`inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-red-500 sm:text-sm transition-colors ${className}`}
  >
    {children}
  </button>
);

export const SecondaryButton = ({ children, className = '', ...props }: ButtonProps) => (
  <button
    {...props}
    type="button"
    className={`inline-flex justify-center rounded-md border border-slate-300 dark:border-slate-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-700 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-cyan-500 sm:text-sm transition-colors ${className}`}
  >
    {children}
  </button>
);

export const IconButton = ({ children, className = '', ...props }: ButtonProps) => (
  <button
    {...props}
    type="button"
    className={`p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${className}`}
  >
    {children}
  </button>
);

export const BackButton = ({ children, className = '', ...props }: ButtonProps) => (
    <button {...props} type="button" className={`flex items-center text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors ${className}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        {children}
    </button>
);

export const DeleteButton = ({ className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
      {...props}
      type="button"
      className={`opacity-0 group-hover:opacity-100 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-md transition-opacity ${className}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
    </button>
  );
