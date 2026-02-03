
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({ 
      apiKey: process.env.GEMINI_API_KEY,
      // Removed explicit apiVersion to allow plugin to use the most compatible endpoint
      // for structured JSON outputs (fixing responseMimeType errors).
    }),
  ],
});

/**
 * The standard model used for all audit and analysis tasks.
 * Using the stable and high-performance Gemini 1.5 Pro.
 */
export const auditModel = 'googleai/gemini-1.5-pro';
