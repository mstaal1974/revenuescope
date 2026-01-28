import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI(),
  ],
});

/**
 * Defines the model used for all AI generation tasks.
 * Using a stable alias like 'gemini-1.5-flash' is recommended over a specific
 * version (e.g., 'gemini-1.5-flash-001') because it allows Google's backend
 * to route to the latest stable version available in the region, preventing
 * 'Not Found' errors during deployment. This acts as a server-side check
 * for model availability.
 */
export const MODEL_NAME = 'gemini-1.5-flash';
