"use server";
/**
 * @fileOverview A flow that searches for an RTO scope by its ID. It fetches the scope from a database
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
export async function fetchTrainingComponentDetails(
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
        timeout: 15000,
      }
    );
    const result = await parseStringPromise(xmlData, {
      explicitArray: false,
      tagNameProcessors: [(name) => name.split(":").pop()!],
      ignoreAttrs: true,
    });
    
    if (result?.Envelope?.Body?.Fault) {
      const faultString = result.Envelope.Body.Fault.faultstring || "Unknown SOAP fault";
      console.warn(`SOAP Fault from TGA TrainingComponentService for ${trainingComponentCode}: ${faultString}`);
      return { anzsco: null, title: null };
    }

    const details = result?.Envelope?.Body?.GetDetailsResponse?.GetDetailsResult;
    
    if (!details || !details.Classifications) {
      return { anzsco: null, title: details?.Title || null };
    }

    const classifications = Array.isArray(details.Classifications.Classification) ? details.Classifications.Classification : [details.Classifications.Classification];
    const anzscoClassification = classifications.find((c: any) => c?.Scheme?.includes('ANZSCO'));
    
    return {
        title: details.Title,
        anzsco: anzscoClassification ? anzscoClassification.Code : null
    };

  } catch (error) {
    console.error(`Error fetching training component details for ${trainingComponentCode}:`, error);
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        console.warn(`TGA TrainingComponentService request timed out for ${trainingComponentCode}.`);
      } else if (error.response) {
        console.error("Axios error details:", error.response.data);
        if (error.response.status === 500) {
          // A 500 error from this service can indicate the training component code was not found.
          console.warn(`Could not find training component ${trainingComponentCode} in TGA registry. It may be an invalid code.`);
        }
      }
    }
    // For other errors, we also return nulls and let the main flow continue if possible.
    return { anzsco: null, title: null };
  }
}


/**
 * Fetches the list of qualifications for a given RTO ID from a Firebase database.
 */
async function fetchRtoScopeFromRegistry(
  rtoId: string
): Promise<{ scope: {Code: string, Name: string}[]; name: string }> {
  const url = `https://rto-scope-check-default-rtdb.asia-southeast1.firebasedatabase.app/scopes/${rtoId}.json`;

  try {
    const { data } = await axios.get(url, { timeout: 15000 });

    // Firebase RTDB returns null for a path that doesn't exist. Axios will treat this as a successful request (200 OK) with `data` being null.
    if (!data || !data.name) {
        throw new Error(`RTO ID "${rtoId}" is invalid or not found in the scope database.`);
    }
    
    const orgName = data.name;

    // Assuming `data.scope` is an array of objects like `{ Code: string, Name: string }`.
    const scopeItems = data.scope || [];
    
    return { name: orgName, scope: scopeItems };

  } catch (error) {
    // If it's the error I threw myself, just rethrow it.
    if (error instanceof Error && error.message.includes("is invalid or not found")) {
        throw error;
    }

    console.error(`Error fetching or parsing RTO scope for ${rtoId} from Firebase:`, error);
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error(`Connection to the scope database timed out. The service may be overloaded. Please try again.`);
      }
    }
    // Generic fallback error
    throw new Error(`Failed to connect to the scope database for RTO ${rtoId}. The service may be down or there might be a network issue.`);
  }
}

const searchForRtoScopeFlow = ai.defineFlow(
  {
    name: "searchForRtoScopeFlow",
    inputSchema: SearchForRtoScopeInputSchema,
    outputSchema: SearchForRtoScopeOutputSchema,
  },
  async (input) => {
    // 1. Fetch RTO scope from the Firebase database.
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
