import React, { useState } from 'react';
import { BackButton } from './Buttons';

interface PricingPageProps {
  onBack: () => void;
}

const CheckIcon = () => (
    <svg className="w-5 h-5 mr-2 text-emerald-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

export default function PricingPage({ onBack }: PricingPageProps) {
  const [isSubscribed, setIsSubscribed] = useState(false); // Mock state for demo purposes

  return (
    <div className="max-w-6xl mx-auto text-slate-700 dark:text-slate-300">
      <BackButton onClick={onBack} className="mb-8">
        Back to App
      </BackButton>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2 tracking-tight">AetherScribe Plans</h1>
        <p className="text-lg text-slate-500 dark:text-slate-400">Choose a base plan to start your journey. All purchases are cosmetic for this demo.</p>
      </div>

      {/* Subscription Tiers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 items-stretch">
        {/* Free Tier */}
        <div className="bg-white dark:bg-slate-800/50 rounded-xl p-8 border border-slate-200 dark:border-slate-700/50 h-full flex flex-col">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">🧭 Wanderer's Satchel</h2>
          <p className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-6">$0 <span className="text-lg font-medium text-slate-500 dark:text-slate-400">/ month</span></p>
          <ul className="space-y-3 mb-8 text-slate-600 dark:text-slate-300 text-sm flex-grow">
            <li className="flex items-start"><CheckIcon /> <strong>100 Aether Crystals</strong> (one-time)</li>
            <li className="flex items-start"><CheckIcon /> Standard AI Access</li>
            <li className="flex items-start"><CheckIcon /> 3 Projects</li>
            <li className="flex items-start"><CheckIcon /> 20 Documents per Project</li>
          </ul>
          <button className="w-full bg-slate-500 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 mt-auto">
            Your Current Plan
          </button>
        </div>

        {/* Pro Tier */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border-2 border-cyan-500 relative h-full flex flex-col shadow-2xl shadow-cyan-500/10">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-cyan-500 text-white text-xs font-bold uppercase px-3 py-1 rounded-full">Most Popular</div>
          <h2 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">📚 Loremaster's Library</h2>
          <p className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-6">$12 <span className="text-lg font-medium text-slate-500 dark:text-slate-400">/ month</span></p>
          <ul className="space-y-3 mb-8 text-slate-600 dark:text-slate-300 text-sm flex-grow">
            <li className="flex items-start"><CheckIcon /> <strong>500 Aether Crystals</strong> / month</li>
            <li className="flex items-start"><CheckIcon /> PRO AI & Visual AI Access</li>
            <li className="flex items-start"><CheckIcon /> Unlimited Projects</li>
            <li className="flex items-start"><CheckIcon /> Unlimited Documents</li>
            <li className="flex items-start"><CheckIcon /> Purchase Crystal Top-ups</li>
          </ul>
          <button onClick={() => setIsSubscribed(true)} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 mt-auto">
            Subscribe Now
          </button>
        </div>

        {/* Archon Tier */}
        <div className="bg-white dark:bg-slate-800/50 rounded-xl p-8 border border-slate-200 dark:border-slate-700/50 h-full flex flex-col">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">👑 Archon's Dominion</h2>
          <p className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-6">$20 <span className="text-lg font-medium text-slate-500 dark:text-slate-400">/ month</span></p>
          <ul className="space-y-3 mb-8 text-slate-600 dark:text-slate-300 text-sm flex-grow">
            <li className="flex items-start"><CheckIcon /> <strong>1000 Aether Crystals</strong> / month</li>
            <li className="flex items-start"><CheckIcon /> Everything in Loremaster</li>
            <li className="flex items-start"><CheckIcon /> Priority Access to New Features</li>
            <li className="flex items-start"><CheckIcon /> Cloud Sync & Backups (Coming Soon)</li>
          </ul>
          <button onClick={() => setIsSubscribed(true)} className="w-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold py-3 px-4 rounded-lg transition-colors duration-200 mt-auto">
            Upgrade to Archon
          </button>
        </div>
      </div>

      {/* Credit Packs */}
      <div className={`transition-opacity duration-500 ${isSubscribed ? 'opacity-100' : 'opacity-40'}`}>
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Aether Crystal Top-ups</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400">
                {isSubscribed 
                    ? "Need more credits? Top-up your balance. Crystals never expire." 
                    : "Subscribe to a plan to unlock crystal top-ups."
                }
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pack 1 */}
            <div className="bg-white dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700/50 text-center flex flex-col">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-1">✨ Initiate's Orb</h3>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">$5</p>
            <p className="font-bold text-cyan-600 dark:text-cyan-400 text-lg mb-4">250 Aether Crystals</p>
            <button disabled={!isSubscribed} className="w-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold py-2 px-4 rounded-lg transition-colors duration-200 mt-auto disabled:opacity-50 disabled:cursor-not-allowed">Purchase</button>
            </div>
            {/* Pack 2 */}
            <div className="bg-white dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700/50 text-center flex flex-col">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-1">✒️ Scrivener's Grimoire</h3>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">$10</p>
            <p className="font-bold text-cyan-600 dark:text-cyan-400 text-lg mb-2">600 Aether Crystals</p>
            <p className="text-sm text-emerald-500 font-medium mb-4">20% Bonus!</p>
            <button disabled={!isSubscribed} className="w-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold py-2 px-4 rounded-lg transition-colors duration-200 mt-auto disabled:opacity-50 disabled:cursor-not-allowed">Purchase</button>
            </div>
            {/* Pack 3 */}
            <div className="bg-white dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700/50 text-center flex flex-col">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-1">💎 Archon's Hoard</h3>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">$20</p>
            <p className="font-bold text-cyan-600 dark:text-cyan-400 text-lg mb-2">1500 Aether Crystals</p>
            <p className="text-sm text-emerald-500 font-medium mb-4">50% Bonus!</p>
            <button disabled={!isSubscribed} className="w-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold py-2 px-4 rounded-lg transition-colors duration-200 mt-auto disabled:opacity-50 disabled:cursor-not-allowed">Purchase</button>
            </div>
        </div>
      </div>
    </div>
  );
}
