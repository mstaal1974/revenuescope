import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({ 
      apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY,
      apiVersion: 'v1beta',
    }),
  ],
});

// Use googleAI.model() to create a proper model reference
export const auditModel = googleAI.model('gemini-2.5-pro');
