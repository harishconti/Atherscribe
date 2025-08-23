import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, ReactNode, useRef } from 'react';
import { TEMPLATES, DEFAULT_CREDITS, TOKENS_PER_CREDIT, VISUAL_GENERATION_CREDIT_COST, INSUFFICIENT_CREDITS_ERROR_THRESHOLD } from '../constants';
import { generateWorldbuildingContent, autolinkEntities } from '../services/geminiService';
import { storageService, PROJECTS_STORAGE_KEY, DOCUMENTS_STORAGE_KEY, CUSTOM_TEMPLATES_STORAGE_KEY, DEFAULT_TEMPLATE_OVERRIDES_STORAGE_KEY, PRO_AI_MODE_STORAGE_KEY, CREDITS_STORAGE_KEY, TOKENS_STORAGE_KEY, THEME_STORAGE_KEY, LAST_ACTIVE_DOC_PER_PROJECT_STORAGE_KEY } from '../services/storageService';
import type { GeneratedContent, Template, SavedDocument, Project, Toast } from '../types';

type View = 'generator' | 'templateEditor' | 'about' | 'contact' | 'signIn' | 'pricing' | 'graphView';
type Theme = 'light' | 'dark';

interface ConfirmationState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

interface AppContextType {
    // State
    projects: Project[];
    savedDocuments: SavedDocument[];
    allTemplates: Template[];
    activeProjectId: string | null;
    activeProject: Project | undefined;
    activeDocumentId: string | null;
    activeDocument: SavedDocument | undefined;
    documentsForActiveProject: SavedDocument[];
    documentCountByProject: Record<string, number>;
    selectedTemplate: Template;
    generatedContentCache: Record<string, GeneratedContent>;
    isLoading: boolean;
    toasts: Toast[];
    currentView: View;
    isSettingsModalOpen: boolean;
    editingTemplate: Template | null;
    isProAiMode: boolean;
    isProAiToggleDisabled: boolean;
    credits: number;
    totalTokensUsed: number;
    theme: Theme;
    confirmation: ConfirmationState;

    // Handlers
    handleTemplateSelect: (templateId: string) => void;
    handleGenerate: (promptData: Record<string, string>) => Promise<void>;
    handleSaveDocument: () => void;
    handleUpdateDocument: (docId: string, updatedContent: GeneratedContent) => void;
    handleDeleteDocument: (docId: string) => void;
    handleSelectDocument: (docId: string) => void;
    handleCreateProject: (name: string) => void;
    handleDeleteProject: (projectId: string) => void;
    handleSelectProject: (projectId: string) => void;
    handleBackToProjects: () => void;
    handleShowTemplateEditor: () => void;
    handleSaveTemplate: (newTemplateData: Omit<Template, 'id' | 'projectId' | 'isCustom'>) => void;
    handleCancelTemplateEditor: () => void;
    handleOpenTemplateSettings: (templateId: string) => void;
    handleCloseTemplateSettings: () => void;
    handleSaveTemplateSettings: (updatedTemplate: Template) => void;
    handleProAiModeToggle: () => void;
    handleClearGeneratedContent: () => void;
    handleShowAbout: () => void;
    handleShowContact: () => void;
    handleShowSignIn: () => void;
    handleShowPricing: () => void;
    handleBackToMainView: () => void;
    showConfirmation: (title: string, message: string, onConfirm: () => void) => void;
    handleThemeToggle: () => void;
    handleAutolinkDocument: (docId: string, currentContent: GeneratedContent) => Promise<GeneratedContent | null>;
    handleShowGraphView: () => void;
    addToast: (message: string, type?: 'success' | 'error') => void;
    handleDismissToast: (id: string) => void;
}


const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [generatedContentCache, setGeneratedContentCache] = useState<Record<string, GeneratedContent>>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [savedDocuments, setSavedDocuments] = useState<SavedDocument[]>([]);
    const [defaultTemplates, setDefaultTemplates] = useState<Template[]>(TEMPLATES);
    const [customTemplates, setCustomTemplates] = useState<Template[]>([]);
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
    const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
    const [currentView, setView] = useState<View>('generator');
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
    const [isProAiMode, setIsProAiMode] = useState<boolean>(false);
    const [credits, setCredits] = useState<number>(DEFAULT_CREDITS);
    const [totalTokensUsed, setTotalTokensUsed] = useState<number>(0);
    const [theme, setTheme] = useState<Theme>('dark');
    const [confirmation, setConfirmation] = useState<ConfirmationState>({ isOpen: false, title: '', message: '', onConfirm: () => {}, onCancel: () => {}});

    // --- Component Mount Status ---
    const isMounted = useRef(true);
    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    // Toast Handlers
    const addToast = useCallback((message: string, type: 'success' | 'error' = 'error') => {
        const newToast: Toast = { id: `toast_${Date.now()}_${Math.random()}`, message, type };
        setToasts(prev => [...prev, newToast]);
    }, []);

    const handleDismissToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);


    const allTemplates = useMemo(() => {
        const projectTemplates = customTemplates.filter(t => t.projectId === activeProjectId);
        return [...defaultTemplates, ...projectTemplates];
    }, [defaultTemplates, customTemplates, activeProjectId]);

    const [selectedTemplate, setSelectedTemplate] = useState<Template>(allTemplates[0]);

    // Data Loading
    useEffect(() => {
        setProjects(storageService.load(PROJECTS_STORAGE_KEY, []));
        setSavedDocuments(storageService.load(DOCUMENTS_STORAGE_KEY, []));
        setCustomTemplates(storageService.load(CUSTOM_TEMPLATES_STORAGE_KEY, []));

        const overrides = storageService.load<Template[]>(DEFAULT_TEMPLATE_OVERRIDES_STORAGE_KEY, []);
        if (overrides.length > 0) {
            const mergedTemplates = TEMPLATES.map(defaultTpl => {
                const override = overrides.find(o => o.id === defaultTpl.id);
                return override ? { ...defaultTpl, ...override } : defaultTpl;
            });
            setDefaultTemplates(mergedTemplates);
        } else {
            setDefaultTemplates(TEMPLATES);
        }

        setIsProAiMode(storageService.load(PRO_AI_MODE_STORAGE_KEY, false));
        setCredits(storageService.load(CREDITS_STORAGE_KEY, DEFAULT_CREDITS));
        setTotalTokensUsed(storageService.load(TOKENS_STORAGE_KEY, 0));

        const savedTheme = storageService.load<Theme | null>(THEME_STORAGE_KEY, null);
        if (savedTheme) {
            setTheme(savedTheme);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }, []);

    // Data Persistence
    useEffect(() => { storageService.save(PROJECTS_STORAGE_KEY, projects); }, [projects]);
    useEffect(() => { storageService.save(DOCUMENTS_STORAGE_KEY, savedDocuments); }, [savedDocuments]);
    useEffect(() => { storageService.save(CUSTOM_TEMPLATES_STORAGE_KEY, customTemplates); }, [customTemplates]);
    useEffect(() => {
        const overrides = defaultTemplates.filter(dt => {
            const original = TEMPLATES.find(ot => ot.id === dt.id);
            if (!original) return false;
            return dt.systemInstruction !== original.systemInstruction || dt.temperature !== original.temperature;
        }).map(({ id, systemInstruction, temperature }) => ({ id, systemInstruction, temperature }));
        if (overrides.length > 0) {
            storageService.save(DEFAULT_TEMPLATE_OVERRIDES_STORAGE_KEY, overrides);
        } else {
            storageService.removeItem(DEFAULT_TEMPLATE_OVERRIDES_STORAGE_KEY);
        }
    }, [defaultTemplates]);
    useEffect(() => { storageService.save(PRO_AI_MODE_STORAGE_KEY, isProAiMode); }, [isProAiMode]);
    useEffect(() => { storageService.save(CREDITS_STORAGE_KEY, credits); }, [credits]);
    useEffect(() => { storageService.save(TOKENS_STORAGE_KEY, totalTokensUsed); }, [totalTokensUsed]);
    
    // Theme handler
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        storageService.save(THEME_STORAGE_KEY, theme);
    }, [theme]);

    // Derived State
    const activeProject = useMemo(() => projects.find(p => p.id === activeProjectId), [projects, activeProjectId]);
    const documentsForActiveProject = useMemo(() => savedDocuments.filter(doc => doc.projectId === activeProjectId), [savedDocuments, activeProjectId]);
    const activeDocument = useMemo(() => documentsForActiveProject.find(doc => doc.id === activeDocumentId), [documentsForActiveProject, activeDocumentId]);
    const documentCountByProject = useMemo(() => projects.reduce((acc, p) => {
        acc[p.id] = savedDocuments.filter(d => d.projectId === p.id).length;
        return acc;
    }, {} as Record<string, number>), [projects, savedDocuments]);
    const isProAiToggleDisabled = useMemo(() => currentView !== 'generator' || selectedTemplate.templateType === 'visual', [currentView, selectedTemplate]);

    // Handlers
    const handleThemeToggle = useCallback(() => setTheme(prev => prev === 'light' ? 'dark' : 'light'), []);

    const handleTemplateSelect = useCallback((templateId: string) => {
        const newTemplate = allTemplates.find(t => t.id === templateId) || allTemplates[0];
        setSelectedTemplate(newTemplate);
        setActiveDocumentId(null);
        setView('generator');
    }, [allTemplates]);

    const handleGenerate = useCallback(async (promptData: Record<string, string>) => {
        if (credits <= INSUFFICIENT_CREDITS_ERROR_THRESHOLD) {
            if (isMounted.current) addToast(`You have ${credits} credits, which is too low to generate new content. Please recharge your credits.`, 'error');
            return;
        }
        
        setIsLoading(true);
        setActiveDocumentId(null);

        try {
            const { content, tokens } = await generateWorldbuildingContent(selectedTemplate, promptData, isProAiMode, documentsForActiveProject);
            
            const cost = selectedTemplate.templateType === 'visual' ? VISUAL_GENERATION_CREDIT_COST : (Math.ceil(tokens / TOKENS_PER_CREDIT) || (tokens > 0 ? 1 : 0));
            
            if (isMounted.current) {
                if (credits - cost < 0) {
                     addToast(`Generation successful, but you do not have enough credits (${credits}) to cover the cost of ${cost} credits. The result is shown, but please recharge.`, 'error');
                     setGeneratedContentCache(prev => ({ ...prev, [selectedTemplate.id]: content }));
                     setTotalTokensUsed(prev => prev + tokens);
                } else {
                    setGeneratedContentCache(prev => ({ ...prev, [selectedTemplate.id]: content }));
                    setCredits(prev => prev - cost);
                    setTotalTokensUsed(prev => prev + tokens);
                }
            }
        } catch (e) {
            if (isMounted.current) addToast(e instanceof Error ? e.message : 'An unknown error occurred.', 'error');
        } finally {
            if (isMounted.current) setIsLoading(false);
        }
    }, [selectedTemplate, isProAiMode, credits, documentsForActiveProject, addToast]);

    const handleSaveDocument = useCallback(() => {
        const contentToSave = generatedContentCache[selectedTemplate.id];
        if (!contentToSave || !activeProjectId) return;
        const newDocument: SavedDocument = {
            id: `doc_${Date.now()}`,
            projectId: activeProjectId,
            templateId: selectedTemplate.id,
            createdAt: new Date().toISOString(),
            content: contentToSave,
        };
        setSavedDocuments(prev => [newDocument, ...prev]);
        setGeneratedContentCache(prev => {
            const newCache = { ...prev };
            delete newCache[selectedTemplate.id];
            return newCache;
        });
        setActiveDocumentId(newDocument.id);
    }, [generatedContentCache, selectedTemplate.id, activeProjectId]);

    const handleUpdateDocument = useCallback((docId: string, updatedContent: GeneratedContent) => {
        setSavedDocuments(prev => prev.map(doc => doc.id === docId ? { ...doc, content: updatedContent } : doc));
    }, []);

    const handleDeleteDocument = useCallback((docId: string) => {
        setSavedDocuments(prev => prev.filter(doc => doc.id !== docId));
        if (activeDocumentId === docId) {
            setActiveDocumentId(null);
            setSelectedTemplate(allTemplates[0]);

            // Clean up last active doc if it's the one being deleted
            if (activeProjectId) {
                const lastActiveDocs = storageService.load(LAST_ACTIVE_DOC_PER_PROJECT_STORAGE_KEY, {} as Record<string, string>);
                if (lastActiveDocs[activeProjectId] === docId) {
                    delete lastActiveDocs[activeProjectId];
                    storageService.save(LAST_ACTIVE_DOC_PER_PROJECT_STORAGE_KEY, lastActiveDocs);
                }
            }
        }
    }, [activeDocumentId, allTemplates, activeProjectId]);

    const handleSelectDocument = useCallback((docId: string) => {
        const doc = savedDocuments.find(d => d.id === docId);
        if (doc) {
            const template = allTemplates.find(t => t.id === doc.templateId) || allTemplates[0];
            setSelectedTemplate(template);
            setActiveDocumentId(docId);
            setView('generator');
            
            // Save this as the last active document for the project
            if (activeProjectId) {
                 const lastActiveDocs = storageService.load(LAST_ACTIVE_DOC_PER_PROJECT_STORAGE_KEY, {} as Record<string, string>);
                lastActiveDocs[activeProjectId] = docId;
                storageService.save(LAST_ACTIVE_DOC_PER_PROJECT_STORAGE_KEY, lastActiveDocs);
            }
        }
    }, [savedDocuments, allTemplates, activeProjectId]);

    const handleCreateProject = useCallback((name: string) => {
        const newProject: Project = { id: `proj_${Date.now()}`, name, createdAt: new Date().toISOString() };
        setProjects(prev => [newProject, ...prev]);
        setActiveProjectId(newProject.id);
        
        // Check if defaultTemplates is available and not empty before setting the selected template
        if (defaultTemplates && defaultTemplates.length > 0) {
            setSelectedTemplate(defaultTemplates[0]);
        } else {
            // Handle the case where defaultTemplates is not available
            // This might involve setting a fallback or logging an error
            console.error("Default templates are not available.");
        }
    }, [defaultTemplates]);
    
    const handleDeleteProject = useCallback((projectId: string) => {
        setProjects(prev => prev.filter(p => p.id !== projectId));
        setSavedDocuments(prev => prev.filter(d => d.projectId !== projectId));
        setCustomTemplates(prev => prev.filter(t => t.projectId !== projectId));
        if (activeProjectId === projectId) {
            setActiveProjectId(null);
            setActiveDocumentId(null);
        }
        // Clean up storage for deleted project
        const lastActiveDocs = storageService.load(LAST_ACTIVE_DOC_PER_PROJECT_STORAGE_KEY, {} as Record<string, string>);
        delete lastActiveDocs[projectId];
        storageService.save(LAST_ACTIVE_DOC_PER_PROJECT_STORAGE_KEY, lastActiveDocs);
    }, [activeProjectId]);

    const handleSelectProject = useCallback((projectId: string) => {
        setActiveProjectId(projectId);
        
        // Restore last active document or default to first template
        const lastActiveDocs = storageService.load(LAST_ACTIVE_DOC_PER_PROJECT_STORAGE_KEY, {} as Record<string, string>);
        const lastDocId = lastActiveDocs[projectId];
        const lastDoc = savedDocuments.find(d => d.id === lastDocId && d.projectId === projectId);
        
        if (lastDoc) {
            const templateForDoc = allTemplates.find(t => t.id === lastDoc.templateId) || defaultTemplates[0];
            setSelectedTemplate(templateForDoc);
            setActiveDocumentId(lastDoc.id);
        } else {
            setActiveDocumentId(null);
            setSelectedTemplate(defaultTemplates[0]);
        }
        
        setView('generator');
    }, [savedDocuments, allTemplates, defaultTemplates]);

    const handleBackToProjects = useCallback(() => {
        setActiveProjectId(null);
        setActiveDocumentId(null);
        setView('generator');
    }, []);

    const handleShowTemplateEditor = useCallback(() => { setView('templateEditor'); setActiveDocumentId(null); }, []);
    const handleCancelTemplateEditor = useCallback(() => setView('generator'), []);

    const handleSaveTemplate = useCallback((newTemplateData: Omit<Template, 'id' | 'projectId' | 'isCustom'>) => {
        if (!activeProjectId) return;
        const newTemplate: Template = { ...newTemplateData, id: `custom_${Date.now()}`, projectId: activeProjectId, isCustom: true };
        setCustomTemplates(prev => [...prev, newTemplate]);
        handleTemplateSelect(newTemplate.id);
    }, [activeProjectId, handleTemplateSelect]);

    const handleOpenTemplateSettings = useCallback((templateId: string) => {
        const templateToEdit = allTemplates.find(t => t.id === templateId);
        if (templateToEdit) {
            setEditingTemplate(templateToEdit);
            setIsSettingsModalOpen(true);
        }
    }, [allTemplates]);

    const handleCloseTemplateSettings = useCallback(() => setIsSettingsModalOpen(false), []);

    const handleSaveTemplateSettings = useCallback((updatedTemplate: Template) => {
        if (updatedTemplate.isCustom) {
            setCustomTemplates(prev => prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
        } else {
            setDefaultTemplates(prev => prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t));
        }
        if (selectedTemplate?.id === updatedTemplate.id) {
            setSelectedTemplate(updatedTemplate);
        }
        setIsSettingsModalOpen(false);
        setEditingTemplate(null);
    }, [selectedTemplate]);

    const handleProAiModeToggle = useCallback(() => setIsProAiMode(prev => !prev), []);
    const handleClearGeneratedContent = useCallback(() => {
        setGeneratedContentCache(prev => {
            const newCache = { ...prev };
            delete newCache[selectedTemplate.id];
            return newCache;
        });
    }, [selectedTemplate.id]);
    
    const handleAutolinkDocument = useCallback(async (docId: string, currentContent: GeneratedContent): Promise<GeneratedContent | null> => {
        if (credits <= INSUFFICIENT_CREDITS_ERROR_THRESHOLD) {
            if(isMounted.current) addToast(`You have ${credits} credits, which is too low to auto-link. Please recharge.`, 'error');
            throw new Error("Insufficient credits");
        }

        try {
            const allOtherTitles = savedDocuments
                .filter(doc => doc.id !== docId)
                .map(doc => doc.content.title);

            if (allOtherTitles.length === 0) {
                if(isMounted.current) addToast("No other documents exist to link to.", 'error');
                throw new Error("No documents to link");
            }

            const { content: updatedContent, tokens } = await autolinkEntities(currentContent, allOtherTitles);
            
            const cost = Math.ceil(tokens / TOKENS_PER_CREDIT) || (tokens > 0 ? 1 : 0);
            
            if (isMounted.current) {
                if (credits - cost < 0) {
                    addToast(`Auto-linking successful, but you do not have enough credits (${credits}) to cover the cost of ${cost} credits. The result is applied, but please recharge.`, 'error');
                } else {
                    setCredits(prev => prev - cost);
                }
                setTotalTokensUsed(prev => prev + tokens);
                handleUpdateDocument(docId, updatedContent);
            }
            return updatedContent;
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during auto-linking.';
            if(isMounted.current) addToast(errorMessage, 'error');
            throw e; 
        }
    }, [credits, savedDocuments, handleUpdateDocument, addToast]);

    const handleShowAbout = useCallback(() => setView('about'), []);
    const handleShowContact = useCallback(() => setView('contact'), []);
    const handleShowSignIn = useCallback(() => setView('signIn'), []);
    const handleShowPricing = useCallback(() => setView('pricing'), []);
    const handleShowGraphView = useCallback(() => setView('graphView'), []);
    const handleBackToMainView = useCallback(() => setView('generator'), []);

    const showConfirmation = useCallback((title: string, message: string, onConfirm: () => void) => {
        setConfirmation({
            isOpen: true,
            title,
            message,
            onConfirm: () => {
                onConfirm();
                setConfirmation(prev => ({ ...prev, isOpen: false }));
            },
            onCancel: () => {
                setConfirmation(prev => ({ ...prev, isOpen: false }));
            }
        });
    }, []);

    const value = useMemo(() => ({
        projects, savedDocuments, allTemplates, activeProjectId, activeProject,
        activeDocumentId, activeDocument, documentsForActiveProject, documentCountByProject, selectedTemplate,
        generatedContentCache, isLoading, toasts, currentView, isSettingsModalOpen, editingTemplate, isProAiMode,
        isProAiToggleDisabled, credits, totalTokensUsed, theme, confirmation, handleTemplateSelect,
        handleGenerate, handleSaveDocument, handleUpdateDocument, handleDeleteDocument, handleSelectDocument,
        handleCreateProject, handleDeleteProject, handleSelectProject, handleBackToProjects, handleShowTemplateEditor,
        handleSaveTemplate, handleCancelTemplateEditor, handleOpenTemplateSettings, handleCloseTemplateSettings,
        handleSaveTemplateSettings, handleProAiModeToggle, handleClearGeneratedContent, handleAutolinkDocument,
        handleShowAbout, handleShowContact, handleShowSignIn, handleShowPricing, handleBackToMainView, showConfirmation, handleThemeToggle,
        handleShowGraphView, addToast, handleDismissToast
    }), [
        projects, savedDocuments, allTemplates, activeProjectId, activeProject,
        activeDocumentId, activeDocument, documentsForActiveProject, documentCountByProject, selectedTemplate,
        generatedContentCache, isLoading, toasts, currentView, isSettingsModalOpen, editingTemplate, isProAiMode,
        isProAiToggleDisabled, credits, totalTokensUsed, theme, confirmation, handleTemplateSelect,
        handleGenerate, handleSaveDocument, handleUpdateDocument, handleDeleteDocument, handleSelectDocument,
        handleCreateProject, handleDeleteProject, handleSelectProject, handleBackToProjects, handleShowTemplateEditor,
        handleSaveTemplate, handleCancelTemplateEditor, handleOpenTemplateSettings, handleCloseTemplateSettings,
        handleSaveTemplateSettings, handleProAiModeToggle, handleClearGeneratedContent, handleAutolinkDocument,
        handleShowAbout, handleShowContact, handleShowSignIn, handleShowPricing, handleBackToMainView, showConfirmation, handleThemeToggle,
        handleShowGraphView, addToast, handleDismissToast
    ]);

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};