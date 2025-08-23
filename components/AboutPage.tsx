import React from 'react';
import { BackButton } from './Buttons';

interface AboutPageProps {
  onBack: () => void;
}

export default function AboutPage({ onBack }: AboutPageProps) {
  return (
    <div className="max-w-4xl mx-auto text-slate-700 dark:text-slate-300">
      <BackButton onClick={onBack} className="mb-8">
        Back to App
      </BackButton>
      
      <div className="bg-white dark:bg-slate-800/50 rounded-xl p-8 border border-slate-200 dark:border-slate-700/50">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">About AetherScribe</h1>
        <p className="text-sm leading-relaxed mb-4">
          AetherScribe is an intelligent, AI-powered worldbuilding assistant designed for writers, game masters, and creators of all kinds. It transforms simple ideas into richly detailed lore, helping you build immersive worlds with unparalleled speed and creativity.
        </p>
        <p className="text-sm leading-relaxed mb-6">
          Whether you're designing characters for a novel, locations for a TTRPG campaign, or magic systems for a video game, AetherScribe is your dedicated creative partner.
        </p>
        
        <h2 className="text-2xl font-semibold text-cyan-600 dark:text-cyan-400 mb-3">Key Features</h2>
        <ul className="list-disc list-inside space-y-2 mb-6 text-slate-600 dark:text-slate-300 text-sm">
          <li><strong>Dual-Mode AI Generation:</strong> Both Standard and PRO modes use the powerful \`gemini-2.5-flash\` model. PRO mode uses advanced prompting to generate more detailed and structured results.</li>
          <li><strong>AI Image Generation:</strong> Bring concepts to life with the powerful \`imagen-3.0-generate-002\` model.</li>
          <li><strong>Manual Content Editing:</strong> The AI's output is just the beginning. Refine and rewrite any text document.</li>
          <li><strong>Project-Based Organization:</strong> Keep your different worlds and stories neatly separated.</li>
          <li><strong>Robust Template System:</strong> Use pre-built templates or create your own with custom fields and AI instructions.</li>
          <li><strong>Fine-Grained AI Control:</strong> Customize system instructions and creativity (temperature) for each template.</li>
          <li><strong>Privacy-Focused:</strong> All your data is saved directly in your browser's local storage.</li>
        </ul>
        
        <h2 className="text-2xl font-semibold text-cyan-600 dark:text-cyan-400 mb-3">Technology</h2>
        <p className="text-sm leading-relaxed">
          AetherScribe is built with a modern, no-build-step frontend stack, including React, TypeScript, and Tailwind CSS. It leverages the advanced capabilities of the Google Gemini API for content generation.
        </p>
      </div>
    </div>
  );
}
