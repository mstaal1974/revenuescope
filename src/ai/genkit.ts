import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Explicitly pass the API key and set the API version to 'v1'.
// This ensures correct authentication and access to stable models,
// resolving the persistent '404 Not Found' errors.
export const ai = genkit({
  plugins: [
    googleAI({ 
        apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY,
        apiVersion: 'v1',
    }),
  ],
});

/**
 * Defines the model used for all AI generation tasks.
 * Using 'gemini-pro', a stable model alias, to ensure availability and prevent 'Not Found' errors.
 */
export const MODEL_NAME = 'gemini-pro';
