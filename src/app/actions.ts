"use server";

import { generateFullAudit } from "@/ai/flows/generate-full-audit";
import { FullAuditOutputSchema, type FullAuditOutput, type SearchForRtoScopeOutput, type FullAuditInput } from "@/ai/types";
import { searchForRtoScope as searchRtoScopeFlow } from "@/ai/flows/search-for-rto-scope";

export type AuditData = FullAuditOutput;

export type TgaScopeItem = {
  Code: string;
  Name: string;
};

export async function performFullAudit(
  input: FullAuditInput
): Promise<AuditData> {
  if (!input.rtoId) {
    throw new Error("RTO ID is required.");
  }

  try {
    const result = await generateFullAudit(input);

    const parsedData = FullAuditOutputSchema.safeParse(result);

    if (!parsedData.success) {
      console.error("Data validation failed:", parsedData.error);
      throw new Error("Failed to process blueprint data.");
    }

    return parsedData.data;
  } catch (e) {
    console.error("Full audit failed:", e);
    const message =
      e instanceof Error
        ? e.message
        : "An unexpected error occurred during the audit.";
    throw new Error(message);
  }
}

export async function searchRtoScope(rtoId: string): Promise<{ rtoName: string; scope: SearchForRtoScopeOutput['scope'] }> {
    if (!rtoId) {
        throw new Error("RTO ID is required.");
    }
    try {
        const result = await searchRtoScopeFlow({ rtoId });
        return { rtoName: result.name, scope: result.scope };
    } catch(e) {
        console.error("TGA scope search failed:", e);
        const message = e instanceof Error
          ? e.message
          : "An unexpected error occurred during TGA lookup.";
        throw new Error(message);
    }
}
