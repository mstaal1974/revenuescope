"use server";

import { generateFullAudit } from "@/ai/flows/generate-full-audit";
import { type FullAuditOutput, type FullAuditInput } from "@/ai/types";

export type AuditData = FullAuditOutput;

export async function performFullAudit(
  input: FullAuditInput
): Promise<AuditData> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "AI account configuration is missing. Please create a file named `.env` in the root of your project and add the line: `GEMINI_API_KEY=your_api_key_here`"
    );
  }

  if (!input.rtoId) {
    throw new Error("RTO ID is required.");
  }
  if (!input.manualScopeDataset) {
    throw new Error("Scope data is required for the audit.");
  }

  try {
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
