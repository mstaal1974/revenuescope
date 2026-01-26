"use server";

import { generateFullAudit } from "@/ai/flows/generate-full-audit";
import { type FullAuditOutput, type FullAuditInput } from "@/ai/types";

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
    // Validation is now handled inside the Genkit flow
    const result = await generateFullAudit(input);
    return result;
  } catch (e) {
    console.error("Full audit failed:", e);
    const message =
      e instanceof Error
        ? e.message
        : "An unexpected error occurred during the audit.";
    throw new Error(message);
  }
}
