"use server";
/**
 * @fileOverview A flow that searches for an RTO scope by its ID. It fetches the scope from the TGA registry directly.
 *
 * - searchForRtoScope - A function that handles the RTO scope search process.
 */

import { ai } from "@/ai/genkit";
import { z } from "zod";
import axios from "axios";
import { parseStringPromise } from "xml2js";
import { SearchForRtoScopeInputSchema, SearchForRtoScopeOutputSchema, type SearchForRtoScopeInput, type SearchForRtoScopeOutput } from "@/ai/types";

export async function searchForRtoScope(
  input: SearchForRtoScopeInput
): Promise<SearchForRtoScopeOutput> {
  return searchForRtoScopeFlow(input);
}

const searchForRtoScopeFlow = ai.defineFlow(
  {
    name: "searchForRtoScopeFlow",
    inputSchema: SearchForRtoScopeInputSchema,
    outputSchema: SearchForRtoScopeOutputSchema,
  },
  async (input) => {
    // Fetch RTO scope from the TGA registry directly.
    // If this fails, the entire flow will fail, ensuring we only use the official TGA source.
    const { scope, name } = await fetchRtoScopeFromRegistry(input.rtoId);
    return { scope, name };
  }
);

async function fetchRtoScopeFromRegistry(
  rtoId: string
): Promise<{ scope: {Code: string, Name: string}[]; name: string }> {
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
      return { name: orgName, scope: []};
    }

    const items = Array.isArray(orgDetails.Scope.ScopeItem)
      ? orgDetails.Scope.ScopeItem
      : [orgDetails.Scope.ScopeItem];

    const scopeItems = items.map(
      (item: any) => ({ Code: item.Code || item.Identifier, Name: item.Name })
    );
    
    return { name: orgName, scope: scopeItems };

  } catch (error) {
    console.error(`Error fetching or parsing RTO scope for ${rtoId}:`, error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("Axios error details:", error.response.data);
    }
    // Re-throwing the error will cause the main audit flow to fail, which is the desired behavior.
    throw new Error(`Failed to fetch RTO scope from TGA registry for ${rtoId}. The service may be down or the RTO ID is invalid.`);
  }
}
