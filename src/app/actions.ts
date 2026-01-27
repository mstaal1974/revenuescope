"use server";

import { generateFullAudit } from "@/ai/flows/generate-full-audit";
import { type FullAuditOutput, type FullAuditInput } from "@/ai/types";

export type AuditData = FullAuditOutput;

export type AuditActionResult = 
  | { ok: true; result: AuditData }
  | { ok: false; error: string };

export async function runAuditAction(
  input: FullAuditInput
): Promise<AuditActionResult> {
  try {
    if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_GENAI_API_KEY) {
      throw new Error(
        "AI account configuration is missing. Please create a file named `.env` in the root of your project and add your API key."
      );
    }
  
    if (!input.rtoId) {
      throw new Error("RTO ID is required.");
    }
    if (!input.manualScopeDataset) {
      throw new Error("Scope data is required for the audit.");
    }
    
    const result = await generateFullAudit(input);
    return { ok: true, result };

  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("runAuditAction failed:", e);
    return {
      ok: false,
      error: message,
    };
  }
}
