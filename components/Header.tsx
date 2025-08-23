import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ActionButton, IconButton } from './Buttons';

const ThemeToggle = ({ theme, onToggle }: { theme: 'light' | 'dark', onToggle: () => void }) => {
    const titleText = `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`;
    return (
        <IconButton
            onClick={onToggle}
            aria-label={titleText}
            title={titleText}
        >
            {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )}
        </IconButton>
    );
};

interface ProAiToggleProps {
  isPro: boolean;
  onToggle: () => void;
  isDisabled: boolean;
}

const ProAiToggle = ({ isPro, onToggle, isDisabled }: ProAiToggleProps) => {
  const disabledClasses = isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <div className={`flex items-center space-x-2 ${disabledClasses}`} title={isDisabled ? "PRO mode is only available for text generation" : ""}>
       <div title="Base AI model used, usually fast.">
        <span className={`text-sm font-medium transition-colors ${!isPro && !isDisabled ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-500'}`}>AI</span>
       </div>
       <button
        onClick={onToggle}
        role="switch"
        aria-checked={isPro}
        disabled={isDisabled}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 ${isPro && !isDisabled ? 'bg-purple-600' : 'bg-slate-400 dark:bg-slate-600'} ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
       >
        <span
          aria-hidden="true"
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isPro ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
      <div title="PRO mode provides exceptionally detailed results, which may take longer to generate.">
        <span className={`text-sm font-bold transition-colors ${isPro && !isDisabled ? 'text-purple-500 dark:text-purple-400' : 'text-slate-500'}`}>
          PRO AI
        </span>
      </div>
    </div>
  );
};

const CrystalIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 15L22 7L12 2zm0 2.31L19.38 7L12 17.69L4.62 7L12 4.31z"/>
    </svg>
);


const CreditDisplay = ({ credits }: { credits: number }) => (
    <div className="flex items-center space-x-2" title="Your remaining generation credits. Each action has a cost.">
        <CrystalIcon className="h-5 w-5 text-purple-500 dark:text-purple-400" />
        <span className="text-sm font-bold text-cyan-700 dark:text-cyan-400 bg-cyan-100 dark:bg-slate-700/50 rounded-md px-3 py-1">
            {credits}
        </span>
    </div>
);


const TokenDisplay = ({ tokens }: { tokens: number }) => (
    <div className="flex items-center space-x-2" title="Shows the total tokens consumed by text generation API calls (developer feature).">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Tokens Used:</span>
        <span className="text-sm font-bold text-orange-700 dark:text-orange-400 bg-orange-100 dark:bg-slate-700/50 rounded-md px-3 py-1">
            {tokens.toLocaleString()}
        </span>
    </div>
);


export default function Header() {
  const {
    activeProject,
    isProAiMode,
    handleProAiModeToggle,
    isProAiToggleDisabled,
    credits,
    totalTokensUsed,
    theme,
    handleThemeToggle,
    handleShowSignIn,
    handleBackToProjects,
    handleShowPricing,
  } = useAppContext();

  return (
    <header className="flex-shrink-0 bg-white dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 px-6 md:px-8 py-4">
      <div className="flex items-center justify-between">
         <div className="flex items-center">
            <button
              onClick={handleBackToProjects}
              className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800 rounded-md -ml-2 p-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700/50"
              aria-label="Back to project selection"
            >
              <svg className="h-8 w-8 text-cyan-600 dark:text-cyan-400 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              <div className="truncate">
                <span className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">Project</span>
                <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate" title={activeProject?.name}>
                  {activeProject ? activeProject.name : 'Select Project'}
                </h1>
              </div>
            </button>
         </div>
        <div className="flex items-center space-x-4">
          <ProAiToggle isPro={isProAiMode} onToggle={handleProAiModeToggle} isDisabled={isProAiToggleDisabled}/>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
          <TokenDisplay tokens={totalTokensUsed} />
          <CreditDisplay credits={credits} />
           <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
           <button onClick={handleShowPricing} className="hidden sm:inline-block text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Pricing</button>
          <ActionButton onClick={handleShowSignIn} className="hidden sm:inline-block !py-2 !px-4" title="Sign In for cloud sync (coming soon)">
            Sign In
          </ActionButton>
          <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
        </div>
      </div>
    </header>
  );
}
