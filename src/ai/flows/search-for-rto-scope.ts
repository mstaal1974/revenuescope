"use server";
/**
 * @fileOverview A flow that searches for an RTO scope by its ID. It attempts to fetch the scope from the TGA registry directly.
 * If that fails, it uses Gemini Search as a fallback.
 *
 * - searchForRtoScope - A function that handles the RTO scope search process.
 * - SearchForRtoScopeInput - The input type for the searchForRtoScope function.
 * - SearchForRtoScopeOutput - The return type for the searchForRtoScope function.
 */

import { ai } from "@/ai/genkit";
import { z } from "zod";
import axios from "axios";
import { parseStringPromise } from "xml2js";

const SearchForRtoScopeInputSchema = z.object({
  rtoId: z.string().describe("The ID of the RTO to search for."),
});
export type SearchForRtoScopeInput = z.infer<
  typeof SearchForRtoScopeInputSchema
>;

const SearchForRtoScopeOutputSchema = z.object({
  scope: z.string().describe("The RTO scope information."),
  name: z.string().describe("The name of the RTO."),
});
export type SearchForRtoScopeOutput = z.infer<
  typeof SearchForRtoScopeOutputSchema
>;

export async function searchForRtoScope(
  input: SearchForRtoScopeInput
): Promise<SearchForRtoScopeOutput> {
  return searchForRtoScopeFlow(input);
}

const rtoScopePrompt = ai.definePrompt({
  name: "rtoScopePrompt",
  input: { schema: SearchForRtoScopeInputSchema },
  output: { schema: SearchForRtoScopeOutputSchema },
  prompt: `You are an AI assistant specialized in retrieving RTO scope information.

  The user will provide the ID of the RTO, and you should respond with the RTO's name and scope.

  RTO ID: {{{rtoId}}}
  `,
});

const searchForRtoScopeFlow = ai.defineFlow(
  {
    name: "searchForRtoScopeFlow",
    inputSchema: SearchForRtoScopeInputSchema,
    outputSchema: SearchForRtoScopeOutputSchema,
  },
  async (input) => {
    try {
      // Attempt to fetch RTO scope from the TGA registry directly
      const { scope, name } = await fetchRtoScopeFromRegistry(input.rtoId);
      return { scope, name };
    } catch (error) {
      // If direct registry fetch fails, use Gemini Search as a fallback
      console.error("Failed to fetch RTO scope from registry:", error);
      console.log("Using Gemini Search as a fallback.");
      const { output } = await rtoScopePrompt(input);
      if (!output) {
        throw new Error("AI fallback failed to produce an output.");
      }
      return { scope: output.scope, name: output.name };
    }
  }
);

async function fetchRtoScopeFromRegistry(
  rtoId: string
): Promise<{ scope: string; name: string }> {
  const soapRequest = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://training.gov.au/services/">
      <soapenv:Header>
        <wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
          <wsse:UsernameToken>
            <wsse:Username>${process.env.TGA_USER}</wsse:Username>
            <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">${process.env.TGA_PASS}</wsse:Password>
          </wsse:UsernameToken>
        </wsse:Security>
      </soapenv:Header>
      <soapenv:Body>
        <ser:Details>
            <ser:request>
              <ser:Code>${rtoId}</ser:Code>
              <ser:IncludeScope>true</ser:IncludeScope>
            </ser:request>
        </ser:Details>
      </soapenv:Body>
    </soapenv:Envelope>
  `;

  try {
    const { data: xmlData } = await axios.post(
      process.env.TGA_ENDPOINT!,
      soapRequest,
      {
        headers: {
          "Content-Type": "text/xml;charset=UTF-8",
          SOAPAction: "http://training.gov.au/services/IOrganisationService/Details",
        },
      }
    );

    const result = await parseStringPromise(xmlData, {
      explicitArray: false,
      tagNameProcessors: [(name) => name.split(":").pop()!],
      ignoreAttrs: true,
    });

    const orgDetails = result.Envelope.Body.DetailsResponse.DetailsResult;

    if (!orgDetails || !orgDetails.OrganisationName) {
      throw new Error(`No matching RTO found in registry for ID ${rtoId}.`);
    }
    
    const orgName = orgDetails.OrganisationName;

    if (!orgDetails.Scope || !orgDetails.Scope.ScopeItem) {
      return { name: orgName, scope: `RTO '${orgName}' found, but scope is not available.`};
    }

    const items = Array.isArray(orgDetails.Scope.ScopeItem)
      ? orgDetails.Scope.ScopeItem
      : [orgDetails.Scope.ScopeItem];

    const scopeList = items.map(
      (item: any) => `${item.Code || item.Identifier} - ${item.Name}`
    );
    const scope = `Current scope for ${orgName}:\n- ${scopeList.join(
      "\n- "
    )}`;
    
    return { name: orgName, scope };

  } catch (error) {
    console.error(`Error fetching or parsing RTO scope for ${rtoId}:`, error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("Axios error details:", error.response.data);
    }
    // Re-throwing the error will cause the flow to fall back to the AI prompt.
    throw new Error(`Failed to fetch RTO scope from registry for ${rtoId}.`);
  }
}
