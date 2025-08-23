
import React from 'react';
import Sidebar from './components/Sidebar';
import Generator from './components/Generator';
import Header from './components/Header';
import GeneratedContentDisplay from './components/GeneratedContent';
import ProjectView from './components/ProjectView';
import TemplateEditor from './components/TemplateEditor';
import SettingsModal from './components/SettingsModal';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import SignInPage from './components/SignInPage';
import ConfirmModal from './components/ConfirmModal';
import PricingPage from './components/PricingPage';
import GraphView from './components/GraphView';
import { useAppContext } from './contexts/AppContext';
import { ToastContainer } from './components/Toast';


export default function App() {
  const {
    // State
    currentView,
    activeProjectId,
    activeDocument,
    isSettingsModalOpen,
    editingTemplate,
    confirmation,
    toasts,
    
    // Handlers
    handleBackToMainView,
    handleDismissToast
  } = useAppContext();

  const renderMainContent = () => {
    switch (currentView) {
      case 'signIn':
        return <SignInPage onBack={handleBackToMainView} />;
      case 'about':
        return <AboutPage onBack={handleBackToMainView} />;
      case 'contact':
        return <ContactPage onBack={handleBackToMainView} />;
      case 'pricing':
        return <PricingPage onBack={handleBackToMainView} />;
      case 'graphView':
        return <GraphView />;
      case 'templateEditor':
        return <TemplateEditor />;
      case 'generator':
      default:
        if (!activeProjectId) {
          return <ProjectView />;
        }
        if (activeDocument) {
          return <GeneratedContentDisplay 
            content={activeDocument.content} 
            documentId={activeDocument.id}
          />;
        }
        return <Generator />;
    }
  };

  return (
    <div className="flex h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50 dark:bg-slate-900">
          {renderMainContent()}
        </div>
      </main>

      {isSettingsModalOpen && editingTemplate && (
        <SettingsModal
          isOpen={isSettingsModalOpen}
          template={editingTemplate}
        />
      )}

      {confirmation.isOpen && (
        <ConfirmModal
          isOpen={confirmation.isOpen}
          title={confirmation.title}
          message={confirmation.message}
          onConfirm={confirmation.onConfirm}
          onCancel={confirmation.onCancel}
        />
      )}

      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
