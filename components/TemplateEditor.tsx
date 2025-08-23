import React, { useState } from 'react';
import { ICONS, TEMPLATES, baseSchema } from '../constants';
import type { IconProps } from '../constants';
import type { Template, PromptField } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { ActionButton, SecondaryButton } from './Buttons';

export default function TemplateEditor() {
  const { handleSaveTemplate, handleCancelTemplateEditor } = useAppContext();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [iconId, setIconId] = useState(Object.keys(ICONS)[0]);
  const [systemInstruction, setSystemInstruction] = useState(TEMPLATES[0].systemInstruction);
  
  // State for main prompt
  const [mainPromptLabel, setMainPromptLabel] = useState('Core Concept');
  const [mainPromptPlaceholder, setMainPromptPlaceholder] = useState('e.g., A brief summary of your idea.');

  // State for prompt fields (variables)
  const [promptFields, setPromptFields] = useState<PromptField[]>([]);
  const [newPromptField, setNewPromptField] = useState({ id: '', label: '', placeholder: '', type: 'text' as 'text' | 'textarea' });

  // State for output fields
  const [fields, setFields] = useState<string[]>(['Appearance', 'Personality', 'Backstory']);
  const [newField, setNewField] = useState('');


  const handleAddPromptField = () => {
      if (newPromptField.label.trim()) {
          const newId = newPromptField.label.trim().toLowerCase().replace(/\s+/g, '_');
          if (promptFields.find(f => f.id === newId)) {
              alert('A prompt variable with this name already exists.');
              return;
          }
          setPromptFields([...promptFields, { ...newPromptField, id: newId }]);
          setNewPromptField({ id: '', label: '', placeholder: '', type: 'text' });
      }
  };

  const handleRemovePromptField = (fieldId: string) => {
    setPromptFields(promptFields.filter(f => f.id !== fieldId));
  };


  const handleAddField = () => {
    if (newField.trim() && !fields.includes(newField.trim())) {
      setFields([...fields, newField.trim()]);
      setNewField('');
    }
  };

  const handleRemoveField = (fieldToRemove: string) => {
    setFields(fields.filter(field => field !== fieldToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || fields.length === 0) {
      alert('Template name and at least one output field are required.');
      return;
    }

    handleSaveTemplate({
      name,
      description,
      iconId,
      templateType: 'worldbuilding', // All custom templates are for worldbuilding
      mainPromptLabel,
      mainPromptPlaceholder,
      promptFields,
      systemInstruction,
      fields,
      schema: baseSchema, // Custom templates use the flexible base schema
      temperature: 0.8, // Default temperature for custom templates
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Create New Template</h1>
          <p className="text-slate-500 dark:text-slate-400">Design a custom template to fit the unique needs of your world.</p>
        </div>

        {/* Core Details */}
        <div className="bg-white dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700/50 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Core Details</h2>
          <div>
            <label htmlFor="template-name" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Template Name</label>
            <input id="template-name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Sentient Species" required className="w-full p-2 bg-slate-50 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
          </div>
          <div>
            <label htmlFor="template-desc" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Description</label>
            <input id="template-desc" type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="A template for creating new lifeforms." className="w-full p-2 bg-slate-50 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Icon</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(ICONS).map(([id, IconComponent]: [string, (props: IconProps) => JSX.Element]) => (
                <button key={id} type="button" onClick={() => setIconId(id)} className={`p-3 rounded-lg border-2 transition-colors ${iconId === id ? 'bg-cyan-100/50 dark:bg-cyan-500/20 border-cyan-500' : 'bg-slate-100 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'}`}>
                  <IconComponent className="h-6 w-6 text-slate-700 dark:text-slate-200" />
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Prompt Variables */}
        <div className="bg-white dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700/50 space-y-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Prompt Variables</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Define the input fields users will fill out. These will be sent to the AI.</p>
             {/* Main Prompt Inputs */}
            <div className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
                 <h3 className="font-semibold text-slate-700 dark:text-slate-300">Main Prompt (Required)</h3>
                <div>
                    <label htmlFor="main-prompt-label" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Label</label>
                    <input id="main-prompt-label" type="text" value={mainPromptLabel} onChange={e => setMainPromptLabel(e.target.value)} className="w-full p-2 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm" />
                </div>
                <div>
                    <label htmlFor="main-prompt-placeholder" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Placeholder</label>
                    <input id="main-prompt-placeholder" type="text" value={mainPromptPlaceholder} onChange={e => setMainPromptPlaceholder(e.target.value)} className="w-full p-2 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm" />
                </div>
            </div>
            {/* Existing Prompt Fields */}
            <div className="space-y-2">
              {promptFields.map(field => (
                <div key={field.id} className="flex items-center justify-between bg-slate-100 dark:bg-slate-700/50 p-2 rounded-lg">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{field.label}</span>
                  <button type="button" onClick={() => handleRemovePromptField(field.id)} className="text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
            </div>
             {/* Add New Prompt Field */}
            <div className="flex flex-col md:flex-row gap-2 border-t border-slate-200 dark:border-slate-700 pt-4">
                <input type="text" value={newPromptField.label} onChange={e => setNewPromptField({...newPromptField, label: e.target.value})} placeholder="New Variable Label (e.g., Age)" className="flex-grow p-2 bg-slate-50 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                <input type="text" value={newPromptField.placeholder} onChange={e => setNewPromptField({...newPromptField, placeholder: e.target.value})} placeholder="Placeholder text" className="flex-grow p-2 bg-slate-50 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                <button type="button" onClick={handleAddPromptField} className="bg-slate-500 hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">Add Variable</button>
            </div>
        </div>

        {/* Custom Output Fields */}
        <div className="bg-white dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700/50 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Output Fields</h2>
           <p className="text-sm text-slate-500 dark:text-slate-400">Define the section headings the AI will use to structure its response. At least one field is required.</p>
          <div className="flex gap-2">
            <input type="text" value={newField} onChange={e => setNewField(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddField())} placeholder="e.g., Biology" className="flex-grow p-2 bg-slate-50 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
            <button type="button" onClick={handleAddField} className="bg-slate-500 hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">Add Field</button>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {fields.map(field => (
              <div key={field} className="flex items-center bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 rounded-full px-3 py-1 text-sm font-medium">
                <span>{field}</span>
                <button type="button" onClick={() => handleRemoveField(field)} className="ml-2 text-cyan-600 dark:text-cyan-200 hover:text-cyan-800 dark:hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* AI Instructions */}
        <div className="bg-white dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700/50 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">AI Instructions</h2>
          <div>
            <label htmlFor="system-instruction" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">System Instruction</label>
            <textarea id="system-instruction" value={systemInstruction} onChange={e => setSystemInstruction(e.target.value)} rows={4} className="w-full p-2 bg-slate-50 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex justify-end gap-4">
          <SecondaryButton onClick={handleCancelTemplateEditor}>Cancel</SecondaryButton>
          <ActionButton type="submit" className="bg-emerald-600 hover:bg-emerald-500">Save Template</ActionButton>
        </div>
      </form>
    </div>
  );
}
