'use server';
/**
 * @fileOverview This file defines a fallback flow for fetching RTO scope using Gemini AI if the direct database query fails.
 */

import { ai, auditModel } from '@/ai/genkit';
import { 
  ScopeFallbackInputSchema, 
  ScopeFallbackOutputSchema, 
  type ScopeFallbackInput, 
  type ScopeFallbackOutput 
} from '@/ai/types';

export async function fetchScopeFallback(
  input: ScopeFallbackInput
): Promise<ScopeFallbackOutput> {
  return fetchScopeFallbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scopeFallbackPrompt',
  input: { schema: ScopeFallbackInputSchema },
  output: { schema: ScopeFallbackOutputSchema },
  model: auditModel,
  prompt: `
    You are an expert on the Australian National Register of VET (training.gov.au).
    
    FACTUAL OVERRIDE:
    - RTO Code 5800 is EXACTLY "Alan Bartlett Consulting Pty Ltd". It is NOT TAFE NSW.
    
    TASK:
    {{#if isRtoAudit}}
    Find the official current scope of registration for RTO Code: "{{code}}". 
    1. Identify the EXACT Legal Name of the RTO from the national register.
    2. List the primary current qualifications (Code, Title, and typical ANZSCO code).
    {{else}}
    Find the details for Qualification Code: "{{code}}".
    Provide its Title, typical ANZSCO code, and identify one major RTO that delivers it (provide that RTO's Name and Code).
    {{/if}}
    
    OUTPUT REQUIREMENTS:
    1. manualScopeDataset: A CSV-formatted string. Each line is "Code,Title,Anzsco". 
    2. rtoName: The EXACT legal name of the RTO from official records.
    3. rtoCode: The RTO code.
    4. count: The number of qualifications found.
    
    CRITICAL: Accuracy is paramount. Use the official training.gov.au data.
    Ensure the output is strictly valid JSON.
  `,
});

const fetchScopeFallbackFlow = ai.defineFlow(
  {
    name: 'fetchScopeFallbackFlow',
    inputSchema: ScopeFallbackInputSchema,
    outputSchema: ScopeFallbackOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("AI could not retrieve scope fallback data.");
    }
    return output;
  }
);
