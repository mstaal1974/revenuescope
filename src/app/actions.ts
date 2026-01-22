"use server";

import { generateFullAudit } from "@/ai/flows/generate-full-audit";
import { FullAuditOutputSchema, type FullAuditOutput, type FullAuditInput } from "@/ai/types";

export type AuditData = FullAuditOutput;

export async function performFullAudit(
  input: FullAuditInput
): Promise<AuditData> {
  if (!input.rtoId) {
    throw new Error("RTO ID is required.");
  }
  if (!input.manualScopeDataset) {
    throw new Error("Scope data is required for the audit.");
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
