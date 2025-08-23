import React, { useMemo, useState, useEffect } from 'react';
import type { Template, SavedDocument, Project } from '../types';
import { ICONS } from '../constants';
import { useAppContext } from '../contexts/AppContext';
import { useDebounce } from '../hooks';
import { stripHtml } from '../services/geminiService';
import { DeleteButton } from './Buttons';


interface TemplateButtonProps {
  template: Template;
  isSelected: boolean;
}

const TemplateButton = ({ template, isSelected }: TemplateButtonProps) => {
  const { handleTemplateSelect, handleOpenTemplateSettings } = useAppContext();
  const IconComponent = ICONS[template.iconId];
  const baseClasses = "flex group items-center justify-between w-full text-left px-4 py-3 rounded-lg transition-colors duration-200";
  const selectedClasses = "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400";
  const unselectedClasses = "text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-slate-200";

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleOpenTemplateSettings(template.id);
  };

  return (
      <div
        onClick={() => handleTemplateSelect(template.id)}
        className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
        role="button"
        tabIndex={0}
      >
        <div className="flex items-center flex-1 truncate">
            {IconComponent && <IconComponent className="h-5 w-5 mr-3 flex-shrink-0" />}
            <span className="font-medium truncate">{template.name}</span>
        </div>
        <button onClick={handleEditClick} className="p-1 opacity-0 group-hover:opacity-100 text-slate-400 dark:text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 rounded-md transition-all focus:opacity-100" aria-label={`Settings for ${template.name}`}>
          <SettingsIcon className="h-4 w-4" />
        </button>
      </div>
  );
};

interface DocumentButtonProps {
  doc: SavedDocument;
  isSelected: boolean;
}

const DocumentButton = ({ doc, isSelected }: DocumentButtonProps) => {
  const { handleSelectDocument, handleDeleteDocument, showConfirmation } = useAppContext();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    showConfirmation(
      `Delete "${doc.content.title}"?`,
      "This action cannot be undone. The document will be permanently deleted.",
      () => handleDeleteDocument(doc.id)
    );
  };

  const handleSelect = () => {
    handleSelectDocument(doc.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect();
    }
  };

  const baseClasses = "flex group items-center justify-between w-full text-left pl-4 pr-2 py-2 rounded-lg transition-colors duration-200 text-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500";
  const selectedClasses = "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400";
  const unselectedClasses = "text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-slate-200";

  return (
    <div
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
      title={doc.content.title}
    >
      <span className="font-normal truncate pr-2">{doc.content.title}</span>
      <DeleteButton onClick={handleDelete} aria-label={`Delete ${doc.content.title}`} />
    </div>
  );
};


const ProjectWorkspaceView = () => {
  const {
    allTemplates,
    selectedTemplate,
    activeDocumentId,
    documentsForActiveProject,
    handleShowTemplateEditor,
    handleBackToProjects,
    handleShowGraphView,
    currentView,
  } = useAppContext();

  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const isSearching = searchQuery !== debouncedSearchQuery;

  const toggleFolder = (templateId: string) => {
    setOpenFolders(prev => ({ ...prev, [templateId]: !prev[templateId] }));
  };
  
  const filteredDocuments = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return documentsForActiveProject;
    }
    const lowercasedQuery = debouncedSearchQuery.toLowerCase();
    
    return documentsForActiveProject.filter(doc => {
      // Check title for all document types
      if (doc.content.title.toLowerCase().includes(lowercasedQuery)) {
        return true;
      }

      // Check sections for text-based documents
      if (doc.content.sections && doc.content.sections.some(section =>
          section.heading.toLowerCase().includes(lowercasedQuery) ||
          stripHtml(section.content).toLowerCase().includes(lowercasedQuery)
      )) {
        return true;
      }

      // Check prompt for visual documents
      if (doc.content.prompt && doc.content.prompt.toLowerCase().includes(lowercasedQuery)) {
        return true;
      }

      return false;
    });
  }, [documentsForActiveProject, debouncedSearchQuery]);

  const groupedDocuments = useMemo(() => {
    return filteredDocuments.reduce((acc, doc) => {
      (acc[doc.templateId] = acc[doc.templateId] || []).push(doc);
      return acc;
    }, {} as Record<string, SavedDocument[]>);
  }, [filteredDocuments]);

  const sortedGroupKeys = useMemo(() => {
    return Object.keys(groupedDocuments).sort((a, b) => {
        const templateA = allTemplates.find(t => t.id === a);
        const templateB = allTemplates.find(t => t.id === b);
        return (templateA?.name || '').localeCompare(templateB?.name || '');
    });
}, [groupedDocuments, allTemplates]);

  const { defaultTemplates, customTemplates } = useMemo(() => ({
    defaultTemplates: allTemplates.filter(t => !t.isCustom),
    customTemplates: allTemplates.filter(t => t.isCustom),
  }), [allTemplates]);

  return (
    <>
      <div className="flex-shrink-0 mb-4">
        <button onClick={handleBackToProjects} className="flex items-center text-sm text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors w-full text-left">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
           Back to Projects
        </button>
      </div>

      <div className="flex-1 space-y-1">
        <h2 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Templates</h2>
        {defaultTemplates.map(template => (
          <TemplateButton key={template.id} template={template} isSelected={!activeDocumentId && currentView === 'generator' && template.id === selectedTemplate.id} />
        ))}

        {customTemplates.length > 0 && (
          <div className="pt-2">
            <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Custom</h3>
            {customTemplates.map(template => (
              <TemplateButton key={template.id} template={template} isSelected={!activeDocumentId && currentView === 'generator' && template.id === selectedTemplate.id} />
            ))}
          </div>
        )}

        <button 
          onClick={handleShowTemplateEditor} 
          className={`flex items-center w-full text-left px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/50 dark:hover:text-slate-200 transition-colors duration-200 mt-1 ${currentView === 'templateEditor' ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400' : ''}`}
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="font-medium">New Template</span>
        </button>
      </div>
      
      <div className="flex-grow flex flex-col space-y-2 mt-6 border-t border-slate-200 dark:border-slate-700/50 pt-4 overflow-y-auto min-h-0">
        <h2 className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Documents</h2>
          <div className="px-2 mb-2">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
              </span>
              <input
                type="search"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 text-sm"
              />
              {isSearching && <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 text-xs">...</div>}
            </div>
            <button
              onClick={handleShowGraphView}
              className="mt-2 w-full flex items-center justify-center text-sm py-2 px-4 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                View Graph
            </button>
          </div>

        {documentsForActiveProject.length === 0 ? (
           <div className="px-4 py-2 text-sm text-slate-500 text-center">No documents yet.</div>
        ) : sortedGroupKeys.length > 0 ? sortedGroupKeys.map(templateId => {
          const folderTemplate = allTemplates.find(t => t.id === templateId);
          if (!folderTemplate) return null;

          const IconComponent = ICONS[folderTemplate.iconId];
          const isOpen = openFolders[templateId] ?? true; // Default to open
          const documentsInFolder = groupedDocuments[templateId];

          return (
            <div key={templateId}>
              <button onClick={() => toggleFolder(templateId)} className="flex items-center w-full text-left px-2 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700/50 dark:hover:text-slate-200 transition-colors duration-200">
                <ChevronIcon isOpen={isOpen} />
                {IconComponent && <IconComponent className="h-5 w-5 mr-2" />}
                <span className="font-medium flex-1">{folderTemplate.name}</span>
                <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full px-2 py-0.5">{documentsInFolder.length}</span>
              </button>
              {isOpen && (
                <div className="pl-5 mt-1 space-y-1">
                  {documentsInFolder.map(doc => (
                      <DocumentButton key={doc.id} doc={doc} isSelected={doc.id === activeDocumentId} />
                  ))}
                </div>
              )}
            </div>
          )
        }) : (
            <div className="px-4 py-2 text-sm text-slate-500 text-center">No documents match your search.</div>
        )}
      </div>
    </>
  );
}

const ProjectListView = () => {
    const { projects, handleSelectProject, handleDeleteProject, documentCountByProject, showConfirmation } = useAppContext();

    const handleDelete = (e: React.MouseEvent, project: Project) => {
        e.stopPropagation();
        showConfirmation(
            `Delete Project "${project.name}"?`,
            "This will permanently delete the project, all of its documents, and all associated custom templates. This action cannot be undone.",
            () => handleDeleteProject(project.id)
        );
    }
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, projectId: string) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSelectProject(projectId);
        }
    };


  return (
    <div className="flex flex-col h-full">
      <h2 className="px-2 mb-4 text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Projects</h2>
      
      <div className="flex-1 space-y-2 overflow-y-auto">
        {projects.map(project => (
          <div 
            key={project.id} 
            onClick={() => handleSelectProject(project.id)} 
            onKeyDown={(e) => handleKeyDown(e, project.id)}
            role="button"
            tabIndex={0}
            className="group flex items-center justify-between w-full text-left p-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/50 dark:hover:text-slate-100 transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
          >
            <div className="flex-1 truncate">
              <span className="font-medium">{project.name}</span>
              <p className="text-xs text-slate-500">{documentCountByProject[project.id] || 0} documents</p>
            </div>
            <DeleteButton onClick={(e) => handleDelete(e, project)} aria-label={`Delete ${project.name}`} />
          </div>
        ))}
         {projects.length === 0 && <p className="text-center text-slate-500 text-sm p-4">Create your first project to get started!</p>}
      </div>
    </div>
  );
};


export default function Sidebar() {
  const { activeProjectId, handleShowAbout, handleShowContact, handleShowPricing } = useAppContext();
  return (
    <aside className="w-72 flex-shrink-0 bg-slate-100 dark:bg-slate-800 p-4 border-r border-slate-200 dark:border-slate-700/50 flex flex-col">
      <div className="flex-grow flex flex-col min-h-0">
        {activeProjectId ? <ProjectWorkspaceView /> : <ProjectListView />}
      </div>
      <div className="flex-shrink-0 mt-auto pt-4 border-t border-slate-200 dark:border-slate-700/50">
        <div className="flex justify-center items-center space-x-4 mb-2 text-xs text-slate-500">
          <button onClick={handleShowAbout} className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">About</button>
          <span>&bull;</span>
          <button onClick={handleShowPricing} className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Pricing</button>
          <span>&bull;</span>
          <button onClick={handleShowContact} className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Contact</button>
        </div>
        <p className="text-center text-xs text-slate-500">Powered by Gemini</p>
      </div>
    </aside>
  );
}

// Helper components - these don't need context and can stay here
const SettingsIcon = ({ className="h-5 w-5" }: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transform transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
  </svg>
);