
import { GoogleGenAI, Type } from "@google/genai";
import { Language } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const schema = {
  type: Type.OBJECT,
  properties: {
    originalText: {
      type: Type.STRING,
      description: 'The full text extracted from the image in its original language (Nepali or Sinhalese). If no text is found, return an empty string.',
    },
    translatedText: {
      type: Type.STRING,
      description: 'The English translation of the extracted text. If no text was extracted, return an empty string.',
    },
  },
  required: ['originalText', 'translatedText'],
};

export const extractAndTranslateText = async (
    base64ImageData: string,
    mimeType: string,
    sourceLanguage: Language
): Promise<{ originalText: string, translatedText: string }> => {
    
    const imagePart = {
        inlineData: {
            data: base64ImageData,
            mimeType,
        },
    };

    const textPart = {
        text: `Your task is to perform Optical Character Recognition (OCR) on the provided image to extract all text written in ${sourceLanguage}. After extracting the text, translate it accurately into English. Respond ONLY with a JSON object that adheres to the provided schema.`,
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        
        const responseText = response.text.trim();
        const parsedJson = JSON.parse(responseText);

        if (parsedJson && typeof parsedJson.originalText === 'string' && typeof parsedJson.translatedText === 'string') {
            return parsedJson;
        } else {
            throw new Error('Invalid JSON structure in API response.');
        }

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to process the image with the AI model. Please try again.");
    }
};
