import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI(),
  ],
});

// Export model reference
export const defaultModel = googleAI.model('gemini-2.5-flash');