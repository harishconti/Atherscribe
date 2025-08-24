import type { Template, GeneratedContent, GeneratedContentSection, ResponseSchema, SavedDocument } from '../types';
import { baseSchema } from '../constants';

// Utility function to strip HTML tags from a string
export function stripHtml(html: string): string {
   const doc = new DOMParser().parseFromString(html, 'text/html');
   return doc.body.textContent || "";
}

// Converts simple HTML to a textarea-friendly format
export function htmlToTextarea(html: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html; // Let browser parse HTML
    let textContent = '';
    tempDiv.childNodes.forEach(node => {
        if (node.nodeName === 'P') {
            textContent += (node.textContent || '') + '\n\n';
        } else if (node.nodeName === 'UL') {
            node.childNodes.forEach(li => {
                if (li.nodeName === 'LI') {
                    textContent += `- ${li.textContent || ''}\n`;
                }
            });
            textContent += '\n';
        } else if (node.nodeType === Node.TEXT_NODE) {
            textContent += node.textContent;
        }
    });
    return textContent.trim();
}

// Converts textarea format back to simple HTML
export function textareaToHtml(text: string): string {
    const lines = text.split('\n');
    let html = '';
    let inList = false;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('- ')) {
            if (!inList) {
                html += '<ul>';
                inList = true;
            }
            html += `<li>${line.substring(2).trim()}</li>`;
        } else {
            if (inList) {
                html += '</ul>';
                inList = false;
            }
            if (line) {
                html += `<p>${line}</p>`;
            }
        }
    }
    if (inList) {
        html += '</ul>';
    }
    return html;
}

interface GenerationResult {
  content: GeneratedContent;
  tokens: number;
}

interface AutolinkResult {
  content: GeneratedContent;
  tokens: number;
}

async function generateImage(
  template: Template,
  promptData: Record<string, string>
): Promise<GenerationResult> {
  const mainPrompt = stripHtml(promptData.main_prompt || 'A fantasy landscape.');
  const style = promptData.style ? `, in the style of ${stripHtml(promptData.style)}` : '';
  const mood = promptData.mood ? `, with a ${stripHtml(promptData.mood)} atmosphere` : '';
  const fullPrompt = `${mainPrompt}${style}${mood}.`;

  try {
    const apiResponse = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt })
    });

    if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || 'Failed to generate image from backend.');
    }

    const { imageBytes } = await apiResponse.json();
    const imageUrl = `data:image/jpeg;base64,${imageBytes}`;

    return {
      content: {
        title: mainPrompt,
        prompt: fullPrompt,
        imageUrl: imageUrl,
        context: '',
      },
      tokens: 0, // Image generation cost is handled separately
    };

  } catch (error) {
    console.error("Backend image generation call failed:", error);
    throw new Error(`Failed to generate image. ${error instanceof Error ? error.message : ''}`);
  }
}

async function generateTextContent(
  template: Template,
  promptData: Record<string, string>,
  isProAiMode: boolean,
  allDocuments: SavedDocument[]
): Promise<GenerationResult> {
  // --- Process linked documents for context ---
  let linkedContext = '';
  const cleanedPromptData: Record<string, string> = {};

  for (const key in promptData) {
      const rawValue = promptData[key];
      if (typeof rawValue === 'string') {
          const plainTextValue = stripHtml(rawValue);
          cleanedPromptData[key] = plainTextValue.replace(/@\[([^\]]+)\]/g, '$1');

          const linkRegex = /@\[([^\]]+)\]/g;
          let match;
          while ((match = linkRegex.exec(plainTextValue)) !== null) {
              const docTitle = match[1];
              const linkedDoc = allDocuments.find(doc => doc.content.title === docTitle);
              if (linkedDoc) {
                  linkedContext += `\n\n---\nCONTEXT FROM LINKED DOCUMENT: "${linkedDoc.content.title}"\n`;
                  if (linkedDoc.content.sections) {
                      linkedDoc.content.sections.forEach(section => {
                          linkedContext += `\n## ${section.heading}\n${stripHtml(section.content)}`;
                      });
                  } else if (linkedDoc.content.prompt) {
                      linkedContext += `\n## Prompt\n${stripHtml(linkedDoc.content.prompt)}`;
                  }
                   if (linkedDoc.content.context) {
                      linkedContext += `\n## Context\n${stripHtml(linkedDoc.content.context)}`;
                  }
                  linkedContext += '\n---';
              }
          }
      }
  }

  // --- Prompt Construction ---
  let structuredDetails = `Core Concept: "${cleanedPromptData.main_prompt || 'Not specified'}"\n`;
  if (template.promptFields && template.promptFields.length > 0) {
    const additionalDetails = template.promptFields
      .map(field => cleanedPromptData[field.id] ? `- ${field.label}: ${cleanedPromptData[field.id]}` : null)
      .filter(Boolean)
      .join('\n');
    if (additionalDetails) {
      structuredDetails += `\nAdditional Details:\n${additionalDetails}`;
    }
  }

  let basePrompt = `Generate a new worldbuilding entry based on the following details:\n---\n${structuredDetails}\n---`;
  if (template.fewShotExamples && template.fewShotExamples.length > 0 && !template.isCustom) {
      const examples = template.fewShotExamples.map(ex => `- ${ex}`).join('\n');
      basePrompt = `STYLE GUIDE EXAMPLES:\n${examples}\n\n---\n\nBased on the style above, generate a new entry using these details:\n${structuredDetails}\n---`;
  }
  
  const fullPrompt = linkedContext
    ? `Here is some crucial context from existing documents. Use this information to inform your response:${linkedContext}\n\nBased on that context, please proceed with the following request.\n\n${basePrompt}`
    : basePrompt;


  // --- System Instruction & Schema Configuration ---
  let systemInstruction = template.systemInstruction;
  let schema = JSON.parse(JSON.stringify(template.schema)) as ResponseSchema;

  if (template.isCustom && template.fields && template.fields.length > 0) {
    const fieldsString = template.fields.join(', ');
    systemInstruction += ` Your response MUST include these section headings: ${fieldsString}.`;
    schema = baseSchema;
  }

  if (isProAiMode) {
      systemInstruction += "\n\nYou are in PRO mode. Your output must be exceptionally detailed and comprehensive, suitable for a professional sourcebook. Each section should be richly detailed.";
      if (schema && schema.properties && template.proSchemaAdditions) {
          schema.properties = { ...schema.properties, ...template.proSchemaAdditions };
      }
  }

  // --- API Call to Backend Proxy ---
  try {
    const apiResponse = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            prompt: fullPrompt,
            generationConfig: {
                response_mime_type: "application/json",
                response_schema: schema,
                temperature: template.temperature ?? 0.8,
                top_p: 0.95,
            },
            systemInstruction: systemInstruction,
        })
    });
    
    if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || 'The backend failed to generate content.');
    }

    const { text, tokenCount } = await apiResponse.json();
    if (!text) {
        throw new Error("Received an empty response from the backend.");
    }

    const cleanedText = text.replace(/^```json\s*|```\s*$/g, '');
    const parsedJson = JSON.parse(cleanedText);

    // --- Content Transformation ---
    if (template.displayOrder) {
        const allPossibleKeys = [...template.displayOrder, ...Object.keys(template.proSchemaAdditions || {})];
        const keysToRender = allPossibleKeys.filter(key => parsedJson[key] !== undefined && parsedJson[key] !== null);
        const transformedContent: GeneratedContent = {
            title: parsedJson.title || parsedJson.name || "Untitled",
            sections: keysToRender.map(key => {
                    const heading = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                    const value = parsedJson[key];
                    const content = Array.isArray(value)
                        ? `<ul>${value.map(item => `<li>${item}</li>`).join('')}</ul>`
                        : `<p>${String(value || 'N/A')}</p>`;
                    return { heading, content };
                })
        };
        return {
            content: transformedContent,
            tokens: tokenCount,
        };
    }

    if (!parsedJson.title || !Array.isArray(parsedJson.sections)) {
        throw new Error("Invalid JSON structure received from API. Expected 'title' and 'sections' array.");
    }

    const contentWithHtml: GeneratedContent = {
        ...parsedJson,
        sections: parsedJson.sections.map((sec: { heading: string, content: string }) => ({
            ...sec,
            content: `<p>${sec.content}</p>`
        }))
    }

    return {
        content: contentWithHtml,
        tokens: tokenCount
    };

  } catch (error) {
    console.error("Backend text generation call failed:", error);
    if (error instanceof Error && error.message.includes('JSON')) {
        throw new Error("Failed to parse the response from the AI. The format was unexpected.");
    }
    throw new Error(`Failed to generate content. ${error instanceof Error ? error.message : 'An unknown error occurred.'}`);
  }
}

export async function generateWorldbuildingContent(
  template: Template,
  promptData: Record<string, string>,
  isProAiMode: boolean,
  allDocuments: SavedDocument[]
): Promise<GenerationResult> {
  if (template.templateType === 'visual') {
    return generateImage(template, promptData);
  }
  return generateTextContent(template, promptData, isProAiMode, allDocuments);
}

export async function autolinkEntities(
  currentContent: GeneratedContent,
  allDocTitles: string[]
): Promise<AutolinkResult> {
  if (allDocTitles.length === 0 || !currentContent.sections) return { content: currentContent, tokens: 0 };

  const textToProcess = currentContent.sections.map(sec => `## ${sec.heading}\n${stripHtml(sec.content)}`).join('\n\n');

  const prompt = `You are a wiki editor. Your task is to find mentions of existing document titles within a given text and automatically convert them into wiki-links using the format @[Document Title].

Here is the list of all available document titles (entities) to link to:
- ${allDocTitles.join('\n- ')}

Return a JSON object with a single key "sections" which is an array of objects, each with a "heading" and "content" property. Do not change any of the text, only add the @[] syntax around any exact matches you find from the list of entities. Maintain the original document structure, including the ## headings.

TEXT TO PROCESS:
---
${textToProcess}
---
`;

  try {
    const apiResponse = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            prompt: prompt,
            generationConfig: {
                response_mime_type: "application/json",
                response_schema: {
                    type: "OBJECT",
                    properties: {
                        sections: {
                            type: "ARRAY",
                            items: {
                                type: "OBJECT",
                                properties: {
                                    heading: { type: "STRING" },
                                    content: { type: "STRING" },
                                },
                                required: ["heading", "content"]
                            }
                        }
                    },
                    required: ["sections"]
                },
                temperature: 0.0,
            },
            systemInstruction: "You are a helpful wiki-linking AI.",
        })
    });

    if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || 'The backend failed to generate content for autolinking.');
    }

    const { text, tokenCount } = await apiResponse.json();
    if (!text) {
        throw new Error("Received an empty response from the backend for autolinking.");
    }
    const parsedJson = JSON.parse(text);

    if (!parsedJson.sections) {
         console.warn("Auto-linking parsing failed. Reverting.");
        return { content: currentContent, tokens: tokenCount };
    }
    
    const newSections = parsedJson.sections.map((sec: GeneratedContentSection) => ({
        ...sec,
        content: `<p>${sec.content}</p>`,
    }));

    return { content: { ...currentContent, sections: newSections }, tokens: tokenCount };

  } catch (error) {
    console.error("Backend autolink call failed:", error);
    throw new Error("Failed to auto-link entities.");
  }
}
