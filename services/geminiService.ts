import { GoogleGenAI, Type } from "@google/genai";
import { TranscriptionResult } from "../types";
import { TRANSCRIPTION_PROMPT, TRANSCRIPTION_SCHEMA } from "../constants";

// Helper to convert File to Base64
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      // Remove the data URL prefix (e.g., "data:audio/mp3;base64,")
      const base64Content = base64Data.split(',')[1];
      resolve({
        inlineData: {
          data: base64Content,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const transcribeAudio = async (file: File): Promise<TranscriptionResult> => {
  try {
    if (!process.env.API_KEY) {
      throw new Error("API Key is missing. Please check your environment configuration.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Prepare audio part
    const audioPart = await fileToGenerativePart(file);

    // We use gemini-2.5-flash as recommended for basic tasks and multimodal input
    // It is fast and cost-effective for transcription
    const modelId = 'gemini-2.5-flash';

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
            audioPart,
            { text: TRANSCRIPTION_PROMPT }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: TRANSCRIPTION_SCHEMA,
        temperature: 0.2, // Low temperature for accurate transcription
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response received from Gemini.");
    }

    const result = JSON.parse(responseText) as TranscriptionResult;
    return result;

  } catch (error: any) {
    console.error("Transcription error:", error);
    throw new Error(error.message || "Failed to transcribe audio.");
  }
};
