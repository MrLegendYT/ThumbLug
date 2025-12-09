import { GoogleGenAI } from "@google/genai";
import { ReferenceImage } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to strip the data:image/...;base64, prefix for the API
const stripBase64Header = (base64String: string): string => {
  return base64String.split(',')[1];
};

export const generateThumbnail = async (
  prompt: string,
  referenceImages: ReferenceImage[]
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash-image'; // Nano Banana mapping

    // Construct the parts array
    const parts: any[] = [];

    // Add reference images if they exist
    referenceImages.forEach((img) => {
      parts.push({
        inlineData: {
          mimeType: img.file.type,
          data: stripBase64Header(img.data),
        },
      });
    });

    // Construct a direct prompt that prioritizes user input.
    // We send the prompt as a text part.
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        },
      },
    });

    // Iterate through parts to find the image
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const contentParts = candidates[0].content.parts;
      for (const part of contentParts) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          // Construct a displayable Base64 string
          return `data:image/png;base64,${base64Data}`;
        }
      }
    }

    throw new Error("No image data found in response. The model might have returned text instead.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};