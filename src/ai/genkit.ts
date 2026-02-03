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
 * Set to Gemini 2.5 Pro for maximum reasoning capability and accuracy.
 */
export const auditModel = 'googleai/gemini-2.5-pro';
