import { GoogleGenAI } from "@google/genai";
import { ReferenceImage } from '../types';

// Helper to strip the data:image/...;base64, prefix for the API
const stripBase64Header = (base64String: string): string => {
  return base64String.split(',')[1];
};

export const generateThumbnail = async (
  prompt: string,
  referenceImages: ReferenceImage[]
): Promise<string> => {
  try {
    // Initialize the client. 
    // We assume process.env.API_KEY is available as per instructions.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-2.5-flash-image'; // Nano Banana mapping

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
    // Re-throw with a clean message if possible
    throw new Error(error.message || "Unknown API Error");
  }
};