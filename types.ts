
import type { ReactNode } from 'react';
import type { Type } from "@google/genai";

export interface PromptField {
  id: string;
  label: string;
  type: 'text' | 'textarea';
  placeholder?: string;
}

export interface ResponseSchema {
  type: Type;
  properties?: {
    [key: string]: ResponseSchema;
  };
  items?: ResponseSchema;
  required?: string[];
  description?: string;
}

export interface Template {
  id:string;
  name: string;
  description: string;
  iconId: string;
  templateType: 'worldbuilding' | 'visual';
  mainPromptLabel: string;
  mainPromptPlaceholder: string;
  promptFields?: PromptField[];
  systemInstruction: string;
  schema?: ResponseSchema & { type: Type.OBJECT }; // Schema is optional for visual templates
  proSchemaAdditions?: {
    [key: string]: ResponseSchema;
  };
  temperature?: number;
  displayOrder?: string[];
  fewShotExamples?: string[];
  // Optional fields for custom templates
  isCustom?: boolean;
  projectId?: string;
  fields?: string[];
}

export interface GeneratedContentSection {
  heading: string;
  content: string;
}

// GeneratedContent can be for worldbuilding (text) or visual (image)
export type GeneratedContent = {
  title: string;
  sections: GeneratedContentSection[];
  imageUrl?: null;
  prompt?: null;
  context?: null;
} | {
  title: string;
  imageUrl: string;
  prompt: string;
  context?: string; // Added context field for notes and linking
  sections?: null;
};


export interface Project {
  id: string;
  name: string;
  createdAt: string; // ISO date string
}

export interface SavedDocument {
  id: string;
  projectId: string;
  templateId: string;
  createdAt: string; // ISO date string
  content: GeneratedContent;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}
