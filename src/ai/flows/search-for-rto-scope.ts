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
    const soapRequest = `
    <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tga="http://tga.gov.au/services" xmlns:dat="http://schemas.datacontract.org/2004/07/Deewr.Tga.WebServices.DataContracts">
      <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
        <wsse:Security soap:mustUnderstand="true" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
          <wsse:UsernameToken wsu:Id="UsernameToken-1">
            <wsse:Username>${process.env.TGA_USER}</wsse:Username>
            <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">${process.env.TGA_PASS}</wsse:Password>
          </wsse:UsernameToken>
        </wsse:Security>
        <wsa:Action>http://tga.gov.au/services/IOrganisationService/SearchByName</wsa:Action>
        <wsa:To>${process.env.TGA_ENDPOINT}</wsa:To>
      </soap:Header>
      <soap:Body>
        <tga:SearchByName>
          <tga:request>
            <dat:Name>${rtoName}</dat:Name>
            <dat:IncludeRtoScope>true</dat:IncludeRtoScope>
          </tga:request>
        </tga:SearchByName>
      </soap:Body>
    </soap:Envelope>
  `;

  try {
    const { data: xmlData } = await axios.post(process.env.TGA_ENDPOINT!, soapRequest, {
      headers: {
        'Content-Type': 'application/soap+xml; charset=utf-8',
        'Action': 'http://tga.gov.au/services/IOrganisationService/SearchByName'
      }
    });

    const result = await parseStringPromise(xmlData, {
      explicitArray: false,
      tagNameProcessors: [name => name.split(':').pop()!],
      ignoreAttrs: true,
    });

    const searchResult = result.Envelope.Body.SearchByNameResponse.SearchByNameResult;

    if (!searchResult || !searchResult.Organisation) {
      throw new Error('No matching RTO found in registry.');
    }

    // Assuming the first result is the most relevant one.
    const org = Array.isArray(searchResult.Organisation) ? searchResult.Organisation[0] : searchResult.Organisation;
    
    if (!org.Scope || !org.Scope.ScopeItem) {
        throw new Error('RTO found, but scope is not available.');
    }
    
    const items = Array.isArray(org.Scope.ScopeItem)
      ? org.Scope.ScopeItem
      : [org.Scope.ScopeItem];

    const scopeList = items.map((item: any) => `${item.Code || item.Identifier} - ${item.Name}`);
    return `Current scope for ${org.Name}:\n- ${scopeList.join('\n- ')}`;

  } catch (error) {
    console.error(`Error fetching or parsing RTO scope for ${rtoName}:`, error);
    if (axios.isAxiosError(error) && error.response) {
        console.error("Axios error details:", error.response.data);
    }
    // Re-throwing the error will cause the flow to fall back to the AI prompt.
    throw new Error(`Failed to fetch RTO scope from registry for ${rtoName}.`);
  }
}
