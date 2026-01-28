import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI(),
  ],
});

/**
 * Defines the model used for all AI generation tasks.
 * Using a stable, generally available model alias like 'gemini-1.5-flash' is crucial.
 * This instructs the platform to use the latest stable 'flash' version,
 * preventing 'Not Found' errors from specific versioning and reducing timeouts
 * due to its high performance. This aligns with Firebase's best practices for production AI.
 */
export const MODEL_NAME = 'gemini-1.5-flash';
