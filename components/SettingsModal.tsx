import React, { useState, useEffect } from 'react';
import type { Template } from '../types';
import { TEMPLATES } from '../constants';
import { useAppContext } from '../contexts/AppContext';
import { Modal } from './Modal';
import { ActionButton, SecondaryButton } from './Buttons';


interface SettingsModalProps {
  isOpen: boolean;
  template: Template;
}

export default function SettingsModal({ isOpen, template }: SettingsModalProps) {
  const { handleCloseTemplateSettings, handleSaveTemplateSettings } = useAppContext();

  const [instruction, setInstruction] = useState(template.systemInstruction);
  const [temperature, setTemperature] = useState(template.temperature ?? 0.8);

  useEffect(() => {
    setInstruction(template.systemInstruction);
    setTemperature(template.temperature ?? 0.8);
  }, [template]);

  const handleSave = () => {
    handleSaveTemplateSettings({
      ...template,
      systemInstruction: instruction,
      temperature: temperature,
    });
  };

  const handleReset = () => {
    if (template.isCustom) return;
    const originalTemplate = TEMPLATES.find(t => t.id === template.id);
    if (originalTemplate) {
      setInstruction(originalTemplate.systemInstruction);
      setTemperature(originalTemplate.temperature ?? 0.8);
    }
  };

  if (!isOpen) {
    return null;
  }
  
  const footerContent = (
    <>
      {!template.isCustom && (
          <SecondaryButton onClick={handleReset} className="mr-auto">
            Reset to Default
          </SecondaryButton>
      )}
      <SecondaryButton onClick={handleCloseTemplateSettings} className="bg-slate-500 hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-500 text-white">Cancel</SecondaryButton>
      <ActionButton onClick={handleSave}>Save</ActionButton>
    </>
  );

  return (
    <Modal
        isOpen={isOpen}
        onClose={handleCloseTemplateSettings}
        title={`${template.name} Settings`}
        footer={footerContent}
    >
        <div className="space-y-6">
          <p className="text-sm text-slate-500 dark:text-slate-400 -mt-4">Fine-tune the AI's behavior for this template.</p>
          <div>
            <label htmlFor="system-instruction" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              System Instruction
            </label>
            <textarea
              id="system-instruction"
              value={instruction}
              onChange={e => setInstruction(e.target.value)}
              rows={8}
              className="w-full p-3 bg-slate-100 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 text-sm"
              placeholder="Tell the AI how to behave..."
            />
             <p className="text-xs text-slate-500 mt-2">This is the core prompt that guides the AI's personality and response format. Be descriptive!</p>
          </div>
          
          <div>
            <label htmlFor="temperature" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Creativity (Temperature)
            </label>
            <div className="flex items-center gap-4">
                <input
                    id="temperature"
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={temperature}
                    onChange={e => setTemperature(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-600 dark:accent-cyan-500"
                />
                <span className="font-mono text-cyan-700 dark:text-cyan-400 bg-slate-200 dark:bg-slate-700/50 rounded-md px-3 py-1 text-sm w-20 text-center">
                    {temperature.toFixed(2)}
                </span>
            </div>
             <p className="text-xs text-slate-500 mt-2">Controls randomness. Lower values are more focused and deterministic, while higher values generate more novel and unexpected results.</p>
          </div>
        </div>
    </Modal>
  );
}
