import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { GeneratedContent, GeneratedContentSection } from '../types';
import { exportToMarkdown, exportToPdf } from '../export';
import { useAppContext } from '../contexts/AppContext';
import Loader from './Loader';
import DOMPurify from 'dompurify';

interface GeneratedContentDisplayProps {
  content: GeneratedContent;
  onSave?: () => void;
  onClear?: () => void;
  documentId?: string;
}

const ExportButton = ({ content }: { content: GeneratedContent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = (format: 'md' | 'pdf') => {
    if (content.imageUrl) {
        alert("Cannot export visual content as text.");
        setIsOpen(false);
        return;
    }
    if (format === 'md') {
      exportToMarkdown(content);
    } else {
      exportToPdf(content);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center w-full rounded-md border border-slate-300 dark:border-slate-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-700 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-cyan-500"
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          Export
          <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-slate-700 ring-1 ring-black ring-opacity-5 dark:ring-slate-600 focus:outline-none z-10">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <button onClick={() => handleExport('md')} className="w-full text-left block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600" role="menuitem">
              As Markdown (.md)
            </button>
            <button onClick={() => handleExport('pdf')} className="w-full text-left block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600" role="menuitem">
              As PDF (.pdf)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


export default function GeneratedContentDisplay({ content, onSave, onClear, documentId }: GeneratedContentDisplayProps) {
  const { handleUpdateDocument, documentsForActiveProject, handleSelectDocument, handleAutolinkDocument, addToast } = useAppContext();

  const [visible, setVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState<GeneratedContent | null>(null);
  const [isAutolinking, setIsAutolinking] = useState(false);

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    setIsEditing(false);
    // Deep copy content to avoid mutating the original state
    setEditableContent(JSON.parse(JSON.stringify(content)));
    return () => clearTimeout(timer);
  }, [content, documentId]);

  const backlinks = useMemo(() => {
    if (!documentId || !content) return [];

    const currentTitle = content.title;
    const linkSyntax = `@[${currentTitle}]`;

    return documentsForActiveProject.filter(doc => {
      if (doc.id === documentId) return false;

      let contentToScan = '';
      if (doc.content.sections) {
        contentToScan = doc.content.sections.map(section => section.content).join(' ');
      } else if (doc.content.imageUrl) {
        contentToScan = `${doc.content.prompt || ''} ${doc.content.context || ''}`;
      }

      return contentToScan.includes(linkSyntax);
    });
  }, [documentId, content, documentsForActiveProject]);

  const handleEditChange = (type: 'title' | 'prompt' | 'context' | 'section', value: string, sectionIndex?: number) => {
    setEditableContent((prev): GeneratedContent | null => {
      if (!prev) return null;

      // Type guard for visual content
      if ('imageUrl' in prev && prev.imageUrl) {
        const current = prev as Extract<GeneratedContent, { imageUrl: string }>;
        if (type === 'title') return { ...current, title: value };
        if (type === 'prompt') return { ...current, prompt: value };
        if (type === 'context') return { ...current, context: value };
        return current;
      }

      // Type guard for text-based content
      else if ('sections' in prev && prev.sections) {
        const current = prev as Extract<GeneratedContent, { sections: any[] }>;
        if (type === 'title') return { ...current, title: value };
        if (type === 'section' && sectionIndex !== undefined) {
          const newSections = [...current.sections];
          newSections[sectionIndex] = { ...newSections[sectionIndex], content: value };
          return { ...current, sections: newSections };
        }
        return current;
      }

      return prev;
    });
  };

  const handleSaveChanges = () => {
    if (documentId && handleUpdateDocument && editableContent) {
      handleUpdateDocument(documentId, editableContent);
      setIsEditing(false);
    }
  };

  const handleAutoLink = async () => {
    if (!documentId || !editableContent) return;

    setIsAutolinking(true);
    try {
        const updatedContent = await handleAutolinkDocument(documentId, editableContent);
        if (updatedContent) {
             setEditableContent(JSON.parse(JSON.stringify(updatedContent)));
        }
    } catch (e) {
        // Error is handled globally in context via toast
    } finally {
        setIsAutolinking(false);
    }
  };

  const parseAndRenderHTML = useCallback((htmlContent: string) => {
    const sanitizedHtml = DOMPurify.sanitize(htmlContent);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = sanitizedHtml;
    const allDocTitles = new Set(documentsForActiveProject.map(d => d.content.title));

    // Find all potential links and replace them
    const linkRegex = /@\[([^\]]+)\]/g;
    tempDiv.innerHTML = tempDiv.innerHTML.replace(linkRegex, (match, title) => {
        if (allDocTitles.has(title)) {
            return `<a href="#" data-doc-title="${title}" class="text-cyan-600 dark:text-cyan-400 no-underline hover:underline">${title}</a>`;
        } else {
            return `<span class="text-red-500 dark:text-red-400 no-underline" title="Broken link: document not found">${title}</span>`;
        }
    });

    return (
        <div className="prose dark:prose-invert max-w-none" onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'A' && target.dataset.docTitle) {
                e.preventDefault();
                const doc = documentsForActiveProject.find(d => d.content.title === target.dataset.docTitle);
                if (doc) handleSelectDocument(doc.id);
            }
        }} dangerouslySetInnerHTML={{ __html: tempDiv.innerHTML }}/>
    );
  }, [documentsForActiveProject, handleSelectDocument]);


  const renderContent = () => {
    // --- RENDER VISUAL CONTENT ---
    if (content.imageUrl) {
        const visualContent = isEditing ? editableContent : content;
        if (!visualContent || !('imageUrl' in visualContent)) return null;

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <img src={visualContent.imageUrl} alt={visualContent.title} className="rounded-lg w-full h-auto object-cover shadow-lg" />
                </div>
                <div className="space-y-4">
                    {isEditing ? (
                        <>
                             <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Title</label>
                                <input type="text" value={visualContent.title} onChange={(e) => handleEditChange('title', e.target.value)} className="w-full p-2 bg-slate-50 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-lg"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Original Prompt</label>
                                <textarea value={visualContent.prompt} onChange={(e) => handleEditChange('prompt', e.target.value)} rows={4} className="w-full p-2 bg-slate-50 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-lg"/>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Context / Reference</label>
                                <textarea
                                  value={stripHtml(visualContent.context || '')}
                                  onChange={(e) => handleEditChange('context', `<p>${e.target.value}</p>`)}
                                  rows={6}
                                  className="w-full p-3 bg-white dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-lg"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-sm text-slate-500 dark:text-slate-400 italic"><strong>Prompt:</strong> {visualContent.prompt}</p>
                            {visualContent.context && (
                                <div>
                                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Context / Reference</h4>
                                    {parseAndRenderHTML(visualContent.context)}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    }

    // --- RENDER TEXT CONTENT (EDITING) ---
    if (isEditing && editableContent?.sections) {
      return (
        <div className="space-y-6">
          {editableContent.sections.map((section, index) => (
            <div key={index}>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
                {section.heading}
              </h3>
              <textarea
                value={stripHtml(section.content)}
                onChange={(e) => handleEditChange('section', `<p>${e.target.value}</p>`, index)}
                rows={10}
                className="w-full p-3 bg-white dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-lg"
              />
            </div>
          ))}
        </div>
      );
    }

    // --- RENDER TEXT CONTENT (VIEWING) ---
    return (
      <div className="space-y-6">
        {content.sections?.map((section, index) => (
          <div key={index}>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
              {section.heading}
            </h3>
            {parseAndRenderHTML(section.content)}
          </div>
        ))}
      </div>
    );
  };

  const canEdit = !!(documentId && handleUpdateDocument);

  return (
    <div className={`transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-start justify-between mb-6">
            <div className="flex-grow">
                 {isEditing && editableContent ? (
                    <input
                        type="text"
                        value={editableContent.title}
                        onChange={(e) => handleEditChange('title', e.target.value)}
                        className="text-3xl font-bold text-slate-900 dark:text-slate-100 bg-transparent border-b-2 border-cyan-500/50 focus:border-cyan-500 focus:outline-none w-full"
                    />
                ) : (
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{content.title}</h2>
                )}
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                {onSave && onClear && (
                    <>
                        <button onClick={onSave} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">Save to Project</button>
                        <button onClick={onClear} className="bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">Clear</button>
                    </>
                )}
                {canEdit && !isEditing && (
                    <>
                        <button
                            onClick={handleAutoLink}
                            disabled={isAutolinking || !!content.imageUrl}
                            className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center text-sm disabled:bg-slate-400 disabled:cursor-not-allowed"
                            title={content.imageUrl ? "Auto-linking is not available for visual documents" : "Automatically find and link mentions of other documents"}
                        >
                            {isAutolinking ? <Loader /> : (
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0l-1.5-1.5a.5.5 0 01.707-.707l1.5 1.5a1 1 0 101.414-1.414l3-3zM8.586 12.586a2 2 0 11-2.828-2.828l3-3a2 2 0 012.828 0l1.5 1.5a.5.5 0 01-.707.707l-1.5-1.5a1 1 0 10-1.414 1.414l-3 3z" clipRule="evenodd" /></svg>
                            )}
                            Auto-link
                        </button>
                        <button onClick={() => setIsEditing(true)} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-sm">Edit</button>
                    </>
                )}
                {isEditing && (
                    <>
                        <button onClick={() => setIsEditing(false)} className="bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-sm">Cancel</button>
                        <button onClick={handleSaveChanges} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-sm">Save Changes</button>
                    </>
                )}
                 <ExportButton content={content} />
            </div>
      </div>
      {renderContent()}

      {backlinks.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3">
            Referenced By
          </h4>
          <div className="flex flex-wrap gap-2">
            {backlinks.map(doc => (
              <button
                key={doc.id}
                onClick={() => handleSelectDocument(doc.id)}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium py-1 px-3 rounded-full text-sm transition-colors"
              >
                {doc.content.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}