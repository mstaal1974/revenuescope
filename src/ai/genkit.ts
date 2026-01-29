import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({ apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY }),
  ],
});

// Use googleAI.model() to create a proper model reference
export const flashModel = googleAI.model('gemini-2.5-flash');
