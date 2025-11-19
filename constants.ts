import { Schema, Type } from "@google/genai";

export const TRANSCRIPTION_PROMPT = `
# OBJECTIVE:
Transcribe the provided audio call recording into a clean, accurate, timestamped transcript with automatic speaker name detection and correct diarization.

# INSTRUCTIONS:

1. **Identify Speakers Automatically**
   - Use context, tone, and phrasing to determine who is the **Agent** and who is the **Customer**.
   - The **Agent** is the company representative.
   - The **Customer** speaks more casually, asks questions, or mentions their own business.
   - Extract their **first name** or **company name** if mentioned.
   - If a name cannot be confidently extracted, use placeholders: "Unknown".

2. **Diarization & Formatting**
   - Each timestamp should increase sequentially.
   - No overlapping speech.
   - Do not merge or skip any dialogue.
   - Remove filler words ("uh", "um") unless meaningful.

3. **Prevent Looping or Restarts**
   - The transcript must proceed linearly from beginning to end.
   - Do not hallucinate or fill in missing dialogue.

Your output MUST be a valid JSON object matching the provided schema.
`;

export const TRANSCRIPTION_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    agentName: {
      type: Type.STRING,
      description: "The detected name of the agent, or 'Unknown'",
    },
    customerName: {
      type: Type.STRING,
      description: "The detected name of the customer, or 'Unknown'",
    },
    totalDuration: {
      type: Type.STRING,
      description: "The total duration of the call in HH:MM:SS format",
    },
    segments: {
      type: Type.ARRAY,
      description: "The linear list of spoken segments",
      items: {
        type: Type.OBJECT,
        properties: {
          timestamp: {
            type: Type.STRING,
            description: "Timestamp in [HH:MM:SS] format",
          },
          speakerName: {
            type: Type.STRING,
            description: "The name of the speaker for this segment",
          },
          speakerType: {
            type: Type.STRING,
            description: "One of: 'Agent', 'Customer', 'Unknown'",
            enum: ["Agent", "Customer", "Unknown"],
          },
          text: {
            type: Type.STRING,
            description: "The transcribed text",
          },
        },
        required: ["timestamp", "speakerName", "speakerType", "text"],
      },
    },
  },
  required: ["agentName", "customerName", "totalDuration", "segments"],
};
