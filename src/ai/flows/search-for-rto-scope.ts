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
import axios from 'axios';
import { parseStringPromise } from 'xml2js';

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
    // This is a placeholder for the actual TGA registry API.
  // We'll use a mock XML response for demonstration.
  const organisationCode = rtoName.replace(/\s/g, '+');
  const mockApiUrl = `https://training.gov.au/api/Details/Rto/${organisationCode}`;
  
  try {
    // In a real scenario, you would make a network request like this:
    // const response = await axios.get(mockApiUrl);
    // const xmlData = response.data;
    
    // For this demo, we'll use a mock XML string to avoid real network calls.
    console.log(`Mocking API call to: ${mockApiUrl}`);
    const mockXmlResponse = `
      <RtoScopeDetails>
        <Rto>
          <Name>${rtoName}</Name>
        </Rto>
        <ScopeItems>
          <ScopeItem>
            <Type>Qualification</Type>
            <Identifier>BSB50420</Identifier>
            <Name>Diploma of Leadership and Management</Name>
          </ScopeItem>
          <ScopeItem>
            <Type>Qualification</Type>
            <Identifier>TAE40116</Identifier>
            <Name>Certificate IV in Training and Assessment</Name>
          </ScopeItem>
          <ScopeItem>
            <Type>Unit of Competency</Type>
            <Identifier>CPCCWHS1001</Identifier>
            <Name>Prepare to work safely in the construction industry</Name>
          </ScopeItem>
        </ScopeItems>
      </RtoScopeDetails>
    `;

    const result = await parseStringPromise(mockXmlResponse, { explicitArray: false });

    if (result.RtoScopeDetails && result.RtoScopeDetails.ScopeItems && result.RtoScopeDetails.ScopeItems.ScopeItem) {
      const items = Array.isArray(result.RtoScopeDetails.ScopeItems.ScopeItem) 
        ? result.RtoScopeDetails.ScopeItems.ScopeItem 
        : [result.RtoScopeDetails.ScopeItems.ScopeItem];
        
      const scopeList = items.map((item: any) => `${item.Identifier} - ${item.Name}`);
      return `Current scope for ${rtoName}:\n- ${scopeList.join('\n- ')}`;
    }

    throw new Error('Could not parse RTO scope from registry response.');
  } catch (error) {
    console.error(`Error fetching or parsing RTO scope for ${rtoName}:`, error);
    // Re-throwing the error will cause the flow to fall back to the AI prompt.
    throw new Error(`Failed to fetch RTO scope from registry for ${rtoName}.`);
  }
}
