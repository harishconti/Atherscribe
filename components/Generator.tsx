import React, { useState, useMemo, useRef } from 'react';
import type { Template } from '../types';
import Loader from './Loader';
import GeneratedContentDisplay from './GeneratedContent';
import { LOW_CREDIT_WARNING_THRESHOLD, INSUFFICIENT_CREDITS_ERROR_THRESHOLD } from '../constants';
import { useAppContext } from '../contexts/AppContext';
import { ActionButton } from './Buttons';

export default function Generator() {
  const { 
    selectedTemplate, 
    handleGenerate, 
    isLoading, 
    generatedContentCache, 
    handleSaveDocument,
    handleClearGeneratedContent,
    credits, 
    isProAiMode,
    handleShowPricing,
  } = useAppContext();

  const [promptData, setPromptData] = useState<Record<string, string>>({});
  const result = generatedContentCache[selectedTemplate.id] || null;

  const [uploadedFileContent, setUploadedFileContent] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isUploadMode = uploadedFileContent !== null;

  const showLowCreditWarning = useMemo(() => {
    return credits <= LOW_CREDIT_WARNING_THRESHOLD && credits > INSUFFICIENT_CREDITS_ERROR_THRESHOLD;
  }, [credits]);

  const cannotAffordGeneration = useMemo(() => {
      return credits <= INSUFFICIENT_CREDITS_ERROR_THRESHOLD;
  }, [credits]);

  const handleInputChange = (id: string, value: string) => {
    setPromptData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const isValid = file.name.endsWith('.txt') || file.name.endsWith('.md') || file.type === 'text/plain' || file.type === 'text/markdown';
      if (isValid) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          setUploadedFileContent(text);
          setUploadedFileName(file.name);
          setPromptData({ main_prompt: text });
        };
        reader.readAsText(file);
      } else {
        alert('Please upload a valid .txt or .md file.');
      }
    }
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleClearFile = () => {
    setUploadedFileContent(null);
    setUploadedFileName(null);
    setPromptData({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (promptData['main_prompt']?.trim() && !cannotAffordGeneration) {
      handleGenerate(promptData);
      setPromptData({});
      handleClearFile();
    }
  };
  
  const renderField = (field: { id: string, label: string, type: 'text' | 'textarea', placeholder?: string }) => {
    const isDisabled = isLoading || isUploadMode;

    return (
        <div key={field.id} className="relative">
            <label htmlFor={field.id} className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                {field.label}
            </label>
            {field.type === 'textarea' ? (
                <textarea
                    id={field.id}
                    value={isUploadMode && field.id === 'main_prompt' ? 'Using content from uploaded file...' : (promptData[field.id] || '')}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    rows={8}
                    className="w-full p-3 bg-white dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 disabled:bg-slate-100 dark:disabled:bg-slate-800/60 disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={isDisabled}
                />
            ) : (
                <input
                    id={field.id}
                    type="text"
                    value={promptData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full p-3 bg-white dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 disabled:bg-slate-100 dark:disabled:bg-slate-800/60 disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={isDisabled}
                />
            )}
        </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800/50 rounded-xl p-6 mb-8 border border-slate-200 dark:border-slate-700/50">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">{selectedTemplate.name}</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">{selectedTemplate.description}</p>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {selectedTemplate.templateType !== 'visual' && (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".txt,.md"
                  className="hidden"
                />
                {!isUploadMode ? (
                  <button type="button" onClick={triggerFileInput} className="w-full text-center py-4 px-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-500 dark:text-slate-400 hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200">
                    <span className="font-medium">Upload a file as prompt (.txt, .md)</span>
                  </button>
                ) : (
                  <div className="flex items-center justify-between w-full text-left p-3 rounded-lg bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                    <div className="flex items-center truncate">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-slate-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium text-slate-700 dark:text-slate-200 truncate" title={uploadedFileName ?? ''}>{uploadedFileName}</span>
                    </div>
                    <button type="button" onClick={handleClearFile} className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-full transition-opacity flex-shrink-0 ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                )}
                <div className="relative flex items-center justify-center my-6">
                  <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
                  <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">
                    Or fill manually
                  </span>
                  <div className="flex-grow border-t border-slate-300 dark:border-slate-700"></div>
                </div>
              </div>
            )}

            {renderField({ 
                id: 'main_prompt', 
                label: selectedTemplate.mainPromptLabel, 
                type: 'textarea', 
                placeholder: selectedTemplate.mainPromptPlaceholder 
            })}

            {selectedTemplate.promptFields && selectedTemplate.promptFields.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedTemplate.promptFields.map(field => renderField(field))}
              </div>
            )}
          </div>
          <ActionButton
            type="submit"
            disabled={isLoading || !promptData['main_prompt']?.trim() || cannotAffordGeneration}
            className="mt-6 w-full !py-3"
          >
            {isLoading ? (
              <>
                <Loader />
                Generating...
              </>
            ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V2.75A.75.75 0 0110 2zM5.44 5.44a.75.75 0 011.06 0l2.47 2.47a.75.75 0 01-1.06 1.06l-2.47-2.47a.75.75 0 010-1.06zm9.12 0a.75.75 0 010 1.06l-2.47 2.47a.75.75 0 11-1.06-1.06l2.47-2.47a.75.75 0 011.06 0zM10 18a.75.75 0 01-.75-.75v-3.5a.75.75 0 011.5 0v3.5A.75.75 0 0110 18zM4.38 10a.75.75 0 01.75-.75h3.5a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75zm9.84 0a.75.75 0 01.75-.75h3.5a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75zM6.5 14.56a.75.75 0 010-1.06l2.47-2.47a.75.75 0 011.06 1.06l-2.47 2.47a.75.75 0 01-1.06 0zm7-7a.75.75 0 010-1.06l2.47-2.47a.75.75 0 011.06 1.06l-2.47 2.47a.75.75 0 01-1.06 0z" clipRule="evenodd" />
                    </svg>
                    Generate
                </>
            )}
          </ActionButton>
          
          {showLowCreditWarning && !isLoading && (
              <div className="text-center bg-yellow-100/50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700/30 text-yellow-600 dark:text-yellow-400 mt-4 p-4 rounded-lg">
                  <p className="font-semibold">Low Credit Warning</p>
                  <p className="text-sm">You have only {credits} credits remaining. Consider recharging soon.</p>
              </div>
          )}

          {cannotAffordGeneration && !isLoading && (
              <div className="text-center bg-red-100/50 dark:bg-red-900/20 border border-red-300 dark:border-red-700/30 text-red-600 dark:text-red-400 mt-4 p-4 rounded-lg flex flex-col items-center gap-2">
                  <p className="font-semibold">Insufficient Credits</p>
                  <p className="text-sm mb-1">
                      You must have more than {INSUFFICIENT_CREDITS_ERROR_THRESHOLD} credits to generate content.
                  </p>
                  <ActionButton onClick={handleShowPricing}>
                      Recharge Credits
                  </ActionButton>
              </div>
          )}
        </form>
      </div>

      {isLoading && !result && (
        <div className="text-center p-8">
            <div role="status" className="flex flex-col items-center justify-center">
                <svg aria-hidden="true" className="w-10 h-10 text-slate-200 dark:text-slate-600 animate-spin fill-cyan-600 dark:fill-cyan-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                <span className="sr-only">Loading...</span>
                <p className="mt-4 text-slate-500 dark:text-slate-400">Crafting your world... this might take a moment.</p>
            </div>
        </div>
      )}

      {result && (
        <GeneratedContentDisplay 
            content={result} 
            onSave={handleSaveDocument} 
            onClear={handleClearGeneratedContent} 
        />
      )}
    </div>
  );
}