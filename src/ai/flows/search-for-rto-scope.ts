"use server";
/**
 * @fileOverview A flow that searches for an RTO scope by its ID. It fetches the scope from the TGA registry directly
 * and then enriches each qualification with its corresponding ANZSCO code from the Training Component service.
 *
 * - searchForRtoScope - A function that handles the RTO scope search and enrichment process.
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

/**
 * Fetches details for a specific training component (like a qualification) to get its ANZSCO code.
 */
async function fetchTrainingComponentDetails(
  trainingComponentCode: string
): Promise<{ anzsco: string | null; title: string | null }> {
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
      <ser:GetDetails>
          <ser:request>
            <ser:Code>${trainingComponentCode}</ser:Code>
          </ser:request>
      </ser:GetDetails>
    </soapenv:Body>
  </soapenv:Envelope>
  `;

  try {
    const { data: xmlData } = await axios.post(
      process.env.TGA_TRAINING_COMPONENT_ENDPOINT!,
      soapRequest,
      {
        headers: {
          "Content-Type": "text/xml;charset=UTF-8",
          SOAPAction: "http://training.gov.au/services/ITrainingComponentService/GetDetails",
        },
      }
    );
    const result = await parseStringPromise(xmlData, {
      explicitArray: false,
      tagNameProcessors: [(name) => name.split(":").pop()!],
      ignoreAttrs: true,
    });
    
    const details = result.Envelope.Body.GetDetailsResponse.GetDetailsResult;
    
    if (!details || !details.Classifications) {
      return { anzsco: null, title: details?.Title || null };
    }

    const classifications = Array.isArray(details.Classifications.Classification) ? details.Classifications.Classification : [details.Classifications.Classification];
    const anzscoClassification = classifications.find((c: any) => c.Scheme && c.Scheme.includes('ANZSCO'));
    
    return {
        title: details.Title,
        anzsco: anzscoClassification ? anzscoClassification.Code : null
    };

  } catch (error) {
    console.error(`Error fetching training component details for ${trainingComponentCode}:`, error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("Axios error details:", error.response.data);
      if (error.response.status === 500) {
        // A 500 error from this service can indicate the training component code was not found.
        console.warn(`Could not find training component ${trainingComponentCode} in TGA registry. It may be an invalid code.`);
        return { anzsco: null, title: null };
      }
    }
    // For other errors, we also return nulls and let the main flow continue if possible.
    return { anzsco: null, title: null };
  }
}


/**
 * Fetches the list of qualifications for a given RTO ID.
 */
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

    const scopeItems = items
      .map((item: any) => {
        if (!item) return null;
        if (item.Identifier) {
          return {
            Code: item.Identifier.Code,
            Name: item.Identifier.Name,
          };
        }
        if (item.TrainingComponent) {
          return {
            Code: item.TrainingComponent.Code,
            Name: item.TrainingComponent.Name,
          };
        }
        if (item.Code && item.Name) {
          return { Code: item.Code, Name: item.Name };
        }
        return null;
      })
      .filter((item): item is { Code: string; Name: string } => item !== null && !!item.Code);
    
    return { name: orgName, scope: scopeItems };

  } catch (error) {
    console.error(`Error fetching or parsing RTO scope for ${rtoId}:`, error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("Axios error details:", error.response.data);
       if (error.response.status === 500) {
        // A 500 error from this service often indicates the RTO ID was not found.
        throw new Error(`RTO ID "${rtoId}" is invalid or not found in the TGA registry. Please use a valid ID (e.g., a known sandbox ID like 90003).`);
      }
    }
    // Re-throwing the error will cause the main audit flow to fail, which is the desired behavior.
    throw new Error(`Failed to connect to TGA registry for RTO ${rtoId}. The service may be down, or credentials may be incorrect.`);
  }
}

const searchForRtoScopeFlow = ai.defineFlow(
  {
    name: "searchForRtoScopeFlow",
    inputSchema: SearchForRtoScopeInputSchema,
    outputSchema: SearchForRtoScopeOutputSchema,
  },
  async (input) => {
    // 1. Fetch RTO scope from the TGA registry directly.
    const { scope: initialScope, name } = await fetchRtoScopeFromRegistry(input.rtoId);

    // 2. For each scope item, fetch its training component details to get the ANZSCO code.
    const enrichedScopePromises = initialScope.map(async (item) => {
      const details = await fetchTrainingComponentDetails(item.Code);
      return {
        Code: item.Code,
        Name: details?.title || item.Name, // Prefer the title from component details
        Anzsco: details?.anzsco || null,
      };
    });

    const enrichedScope = await Promise.all(enrichedScopePromises);

    // The main prompt can decide what to do with items that have no ANZSCO code.
    return { scope: enrichedScope, name };
  }
);
