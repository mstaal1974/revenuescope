import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI(),
  ],
});

/**
 * Defines the model used for all AI generation tasks.
 * Using a stable, generally available model name is crucial to prevent availability
 * errors (like 404 Not Found) which can occur with highly specific or newly
 * released model versions that may not be rolled out to all regions.
 * We are using 'gemini-1.5-pro' as it is a powerful and widely available model.
 */
export const MODEL_NAME = 'gemini-1.5-pro';
