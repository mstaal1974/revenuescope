import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

/**
 * Robust Genkit initialization.
 * Uses Gemini 2.5 Pro as the standardized model for high-fidelity reasoning.
 */
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;

export const ai = genkit({
  plugins: [
    googleAI({ 
      apiKey: apiKey || 'MISSING_API_KEY', // Prevent crash if key is missing during build/init
    }),
  ],
});

/**
 * The standard model used for all audit and analysis tasks.
 * Standardized to Gemini 2.5 Pro for maximum reasoning capability.
 */
export const auditModel = 'googleai/gemini-2.5-pro';
