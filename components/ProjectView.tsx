import React, { useState } from 'react';
import { TEMPLATES, ICONS } from '../constants';
import { useAppContext } from '../contexts/AppContext';
import { ActionButton } from './Buttons';

export default function ProjectView() {
  const [newProjectName, setNewProjectName] = useState('');
  const { handleCreateProject } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      handleCreateProject(newProjectName.trim());
      setNewProjectName('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-slate-600 dark:text-slate-400 p-4 md:p-8">
      {/* Main Card */}
      <div className="max-w-xl w-full bg-white/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-8 md:p-12 shadow-2xl shadow-slate-900/10 dark:shadow-slate-950/50 backdrop-blur-sm">
        <svg className="w-20 h-20 mb-6 text-slate-400 dark:text-slate-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
        <h2 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2 tracking-tight">Welcome to AetherScribe</h2>
        <p className="text-lg mb-8">
          Your AI-powered companion for worldbuilding. <br /> Name your new world to begin.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md mx-auto">
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="e.g., The Ashen Empire"
            className="w-full p-3 bg-white dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 text-center text-lg"
          />
          <ActionButton
            type="submit" 
            className="w-full py-3"
            disabled={!newProjectName.trim()}
          >
            Create Project
          </ActionButton>
        </form>
      </div>

      {/* Features section */}
      <div className="mt-16 max-w-3xl w-full">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">What will you create?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {TEMPLATES.map(template => {
                    const IconComponent = ICONS[template.iconId];
                    return (
                        <div key={template.id} className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all duration-200 aspect-square hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600">
                            <div className="mb-3 text-cyan-600 dark:text-cyan-400">
                              {IconComponent && <IconComponent className="w-8 h-8" />}
                            </div>
                            <p className="font-medium text-slate-700 dark:text-slate-300">{template.name}</p>
                        </div>
                    );
                })}
            </div>
      </div>
    </div>
  );
}
