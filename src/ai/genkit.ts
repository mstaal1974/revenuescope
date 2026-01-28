import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI(),
  ],
});

/**
 * Defines the model used for all AI generation tasks.
 * Using 'gemini-pro' for broad availability and stability to resolve "Not Found" errors.
 */
export const MODEL_NAME = 'gemini-pro';
