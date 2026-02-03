
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({ 
      apiKey: process.env.GEMINI_API_KEY,
      apiVersion: 'v1beta',
    }),
  ],
});

// Use a direct model reference to ensure clarity and consistency.
// This ensures we are always using the specified Gemini 2.5 Pro model.
export const auditModel = 'googleai/gemini-2.5-pro';
