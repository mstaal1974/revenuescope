import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Explicitly pass the API key to the plugin to ensure authentication.
// This resolves the persistent '404 Not Found' errors which were likely
// due to the key not being picked up from the environment automatically.
export const ai = genkit({
  plugins: [
    googleAI({ apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY }),
  ],
});

/**
 * Defines the model used for all AI generation tasks.
 * Using 'gemini-1.5-pro' for broad availability and stability.
 */
export const MODEL_NAME = 'gemini-1.5-pro';
