import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({
      // apiVersion: 'v1', // Force stable API
    }),
  ],
  model: 'googleai/gemini-1.5-pro', // Use the 'pro' model
});
