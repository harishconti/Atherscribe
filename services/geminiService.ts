
import { GoogleGenAI, Type } from "@google/genai";
import type { Template, GeneratedContent, GeneratedContentSection, ResponseSchema, SavedDocument } from '../types';
import { baseSchema } from '../constants';

const apiKey = process.env.API_KEY;
if (!apiKey) {
  // This error is for the developer running the app, not the end-user.
  console.error("Gemini API key not found. Make sure the API_KEY environment variable is set.");
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Utility function to strip HTML tags from a string
export function stripHtml(html: string): string {
   const doc = new DOMParser().parseFromString(html, 'text/html');
   return doc.body.textContent || "";
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
  if (!ai) throw new Error("API Key is not configured. Please add it to index.html.");

  const mainPrompt = stripHtml(promptData.main_prompt || 'A fantasy landscape.');
  const style = promptData.style ? `, in the style of ${stripHtml(promptData.style)}` : '';
  const mood = promptData.mood ? `, with a ${stripHtml(promptData.mood)} atmosphere` : '';
  const fullPrompt = `${mainPrompt}${style}${mood}.`;

  try {
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: fullPrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
      throw new Error("Image generation failed, no images were returned.");
    }
    
    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;

    return {
      content: {
        title: mainPrompt,
        prompt: fullPrompt,
        imageUrl: imageUrl,
        context: '', // Initialize context field
      },
      tokens: 0, // Image generation is not token-based in the same way.
    };

  } catch (error) {
    console.error("Gemini Image API call failed:", error);
    throw new Error("Failed to generate image. Please try again later.");
  }
}

async function generateTextContent(
  template: Template,
  promptData: Record<string, string>,
  isProAiMode: boolean,
  allDocuments: SavedDocument[]
): Promise<GenerationResult> {
  if (!ai) throw new Error("API Key is not configured. Please add it to index.html.");

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

  const modelName = 'gemini-2.5-flash';

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

  // --- API Call ---
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: fullPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: template.temperature ?? 0.8,
        topP: 0.95,
      },
    });
    
    const totalTokenCount = response.usageMetadata?.totalTokenCount ?? 0;
    const text = response.text.trim();
    if (!text) {
        throw new Error("Received an empty response from the API.");
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
            tokens: totalTokenCount,
        };
    }

    if (!parsedJson.title || !Array.isArray(parsedJson.sections)) {
        throw new Error("Invalid JSON structure received from API. Expected 'title' and 'sections' array.");
    }

    // Wrap generated content in <p> tags for the rich text editor
    const contentWithHtml: GeneratedContent = {
        ...parsedJson,
        sections: parsedJson.sections.map((sec: { heading: string, content: string }) => ({
            ...sec,
            content: `<p>${sec.content}</p>`
        }))
    }

    return {
        content: contentWithHtml,
        tokens: totalTokenCount
    };

  } catch (error) {
    console.error("Gemini API call failed:", error);
    if (error instanceof Error && error.message.includes('JSON')) {
        throw new Error("Failed to parse the response from the AI. The format was unexpected.");
    }
    throw new Error("Failed to generate content. The request may be too complex. Please try simplifying your input.");
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
  if (!ai) throw new Error("API Key is not configured.");
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
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                sections: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            heading: { type: Type.STRING },
                            content: { type: Type.STRING },
                        },
                        required: ["heading", "content"]
                    }
                }
            },
            required: ["sections"]
        },
        temperature: 0.0,
      },
    });

    const tokens = response.usageMetadata?.totalTokenCount ?? 0;
    const text = response.text.trim();
    if (!text) {
        throw new Error("Received an empty response from the API.");
    }
    const parsedJson = JSON.parse(text);

    if (!parsedJson.sections) {
         console.warn("Auto-linking parsing failed. Reverting.");
        return { content: currentContent, tokens };
    }
    
    const newSections = parsedJson.sections.map((sec: GeneratedContentSection) => ({
        ...sec,
        content: `<p>${sec.content}</p>`,
    }));

    return { content: { ...currentContent, sections: newSections }, tokens };

  } catch (error) {
    console.error("Gemini API call for auto-linking failed:", error);
    throw new Error("Failed to auto-link entities.");
  }
}
