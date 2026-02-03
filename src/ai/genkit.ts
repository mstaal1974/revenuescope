import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({ 
      apiKey: process.env.GEMINI_API_KEY,
      apiVersion: 'v1',
    }),
  ],
});

/**
 * The standard model used for all audit and analysis tasks.
 * Standardized to Gemini 2.5 Pro as per user instruction.
 */
export const auditModel = 'googleai/gemini-2.5-pro';
