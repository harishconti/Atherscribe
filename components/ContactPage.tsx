import React from 'react';
import { BackButton } from './Buttons';

interface ContactPageProps {
  onBack: () => void;
}

export default function ContactPage({ onBack }: ContactPageProps) {
  return (
    <div className="max-w-4xl mx-auto text-slate-700 dark:text-slate-300">
      <BackButton onClick={onBack} className="mb-8">
        Back to App
      </BackButton>

      <div className="bg-white dark:bg-slate-800/50 rounded-xl p-8 border border-slate-200 dark:border-slate-700/50">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">Contact & Support</h1>
        <p className="text-sm leading-relaxed mb-6">
          AetherScribe is an open-source project. The best way to provide feedback, report a bug, or contribute to the project is through our official GitHub repository.
        </p>
        
        <div className="flex justify-center">
            <a 
                href="https://github.com/[YOUR_USERNAME]/[YOUR_REPO_NAME]"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
                <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.492.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.942.359.308.678.92.678 1.855 0 1.338-.012 2.419-.012 2.745 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd"></path>
                </svg>
                Visit on GitHub
            </a>
        </div>
      </div>
    </div>
  );
}
