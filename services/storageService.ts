// services/storageService.ts
export const PROJECTS_STORAGE_KEY = 'aetherscribe_projects';
export const DOCUMENTS_STORAGE_KEY = 'aetherscribe_documents';
export const CUSTOM_TEMPLATES_STORAGE_KEY = 'aetherscribe_custom_templates';
export const DEFAULT_TEMPLATE_OVERRIDES_STORAGE_KEY = 'aetherscribe_template_overrides';
export const PRO_AI_MODE_STORAGE_KEY = 'aetherscribe_pro_ai_mode';
export const CREDITS_STORAGE_KEY = 'aetherscribe_credits';
export const TOKENS_STORAGE_KEY = 'aetherscribe_tokens_used';
export const THEME_STORAGE_KEY = 'aetherscribe_theme';
export const LAST_ACTIVE_DOC_PER_PROJECT_STORAGE_KEY = 'aetherscribe_last_active_doc_per_project';

export const storageService = {
  load: <T>(key: string, defaultValue: T): T => {
    try {
      const savedValue = localStorage.getItem(key);
      if (savedValue) {
        return JSON.parse(savedValue);
      }
    } catch (e) {
      console.error(`Failed to load or parse data from localStorage for key: ${key}`, e);
    }
    return defaultValue;
  },

  save: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Failed to save data to localStorage for key: ${key}`, e);
    }
  },

  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Failed to remove item from localStorage for key: ${key}`, e);
    }
  }
};
