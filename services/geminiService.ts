import { GoogleGenAI } from "@google/genai";
import { ReferenceImage } from '../types';

// Helper to strip the data:image/...;base64, prefix for the API
const stripBase64Header = (base64String: string): string => {
  return base64String.split(',')[1];
};

const getApiKey = (): string => {
  // 1. Try standard process.env (Node/Webpack/CRA)
  try {
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) { /* ignore */ }

  // 2. Try Vite (import.meta.env)
  // Vite requires variables to start with VITE_ to be exposed to the client
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      if (import.meta.env.VITE_API_KEY) return import.meta.env.VITE_API_KEY;
      // @ts-ignore
      if (import.meta.env.API_KEY) return import.meta.env.API_KEY;
    }
  } catch (e) { /* ignore */ }

  return '';
};

export const generateThumbnail = async (
  prompt: string,
  referenceImages: ReferenceImage[]
): Promise<string> => {
  try {
    const apiKey = getApiKey();

    if (!apiKey) {
      throw new Error("API Key is missing. In Netlify, please add an environment variable named 'VITE_API_KEY' (not just API_KEY) with your Google AI Studio key.");
    }

    // Initialize the client with the validated key
    const ai = new GoogleGenAI({ apiKey: apiKey });
    const model = 'gemini-2.5-flash-image'; // Nano Banana

    // Construct the parts array
    const parts: any[] = [];

    // Add reference images if they exist
    if (referenceImages && referenceImages.length > 0) {
      referenceImages.forEach((img) => {
        parts.push({
          inlineData: {
            mimeType: img.file.type,
            data: stripBase64Header(img.data),
          },
        });
      });
    }

    // Add the text prompt
    parts.push({ text: prompt });

    // Call the API with the robust array structure for contents
    const response = await ai.models.generateContent({
      model: model,
      contents: [
        {
          role: 'user',
          parts: parts,
        }
      ],
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        },
      },
    });

    // Validate candidates existence
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("The model returned no candidates. The request might have been blocked for safety.");
    }

    // Validate content parts
    const contentParts = candidates[0].content?.parts;
    if (!contentParts || contentParts.length === 0) {
       throw new Error("The model returned an empty response.");
    }

    // Iterate through parts to find the image
    for (const part of contentParts) {
      if (part.inlineData && part.inlineData.data) {
        const base64Data = part.inlineData.data;
        // Construct a displayable Base64 string. Defaulting to png if mimeType is missing in response
        const mimeType = part.inlineData.mimeType || 'image/png';
        return `data:${mimeType};base64,${base64Data}`;
      }
    }

    // If no image found, check if it returned text (error explanation)
    const textPart = contentParts.find(p => p.text);
    if (textPart) {
      throw new Error(`Model returned text instead of image: "${textPart.text.substring(0, 100)}..."`);
    }

    throw new Error("No image data found in the response.");
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Re-throw with a clean message
    throw new Error(error.message || "Unknown API Error");
  }
};