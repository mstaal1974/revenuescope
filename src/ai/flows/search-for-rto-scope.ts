'use server';
/**
 * @fileOverview A flow that searches for an RTO scope. It first attempts to fetch the scope from the TGA registry directly.
 * If that fails, it uses Gemini Search as a fallback.
 *
 * - searchForRtoScope - A function that handles the RTO scope search process.
 * - SearchForRtoScopeInput - The input type for the searchForRtoScope function.
 * - SearchForRtoScopeOutput - The return type for the searchForRtoScope function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SearchForRtoScopeInputSchema = z.object({
  rtoName: z.string().describe('The name of the RTO to search for.'),
});
export type SearchForRtoScopeInput = z.infer<typeof SearchForRtoScopeInputSchema>;

const SearchForRtoScopeOutputSchema = z.object({
  scope: z.string().describe('The RTO scope information.'),
});
export type SearchForRtoScopeOutput = z.infer<typeof SearchForRtoScopeOutputSchema>;

export async function searchForRtoScope(input: SearchForRtoScopeInput): Promise<SearchForRtoScopeOutput> {
  return searchForRtoScopeFlow(input);
}

const rtoScopePrompt = ai.definePrompt({
  name: 'rtoScopePrompt',
  input: {schema: SearchForRtoScopeInputSchema},
  output: {schema: SearchForRtoScopeOutputSchema},
  prompt: `You are an AI assistant specialized in retrieving RTO scope information.

  The user will provide the name of the RTO, and you should respond with the RTO's scope.

  RTO Name: {{{rtoName}}}
  `,
});

const searchForRtoScopeFlow = ai.defineFlow(
  {
    name: 'searchForRtoScopeFlow',
    inputSchema: SearchForRtoScopeInputSchema,
    outputSchema: SearchForRtoScopeOutputSchema,
  },
  async input => {
    try {
      // Attempt to fetch RTO scope from the TGA registry directly
      // Assume there is a function fetchRtoScopeFromRegistry that does this.
      // If it fails, an error will be thrown and caught.
      const scope = await fetchRtoScopeFromRegistry(input.rtoName);
      return {scope};
    } catch (error) {
      // If direct registry fetch fails, use Gemini Search as a fallback
      console.error('Failed to fetch RTO scope from registry:', error);
      console.log('Using Gemini Search as a fallback.');
      const {output} = await rtoScopePrompt(input);
      return {scope: output!.scope};
    }
  }
);

async function fetchRtoScopeFromRegistry(rtoName: string): Promise<string> {
  // TODO: Implement the actual fetching logic from the TGA registry.
  // This is a placeholder implementation that always throws an error.
  // Replace this with the actual implementation.
  return new Promise((resolve, reject) => {
    reject(new Error('Failed to fetch RTO scope from registry: Not implemented.'));
  });
}
