"use server";

import { generateFullAudit } from "@/ai/flows/generate-full-audit";
import { FullAuditOutputSchema, type FullAuditOutput } from "@/ai/types";

export type AuditData = FullAuditOutput;

export async function runFullAudit(
  rtoId: string
): Promise<{ data?: AuditData; error?: string }> {
  if (!rtoId) {
    return { error: "RTO ID is required." };
  }

  try {
    const result = await generateFullAudit({ rtoId });

    const parsedData = FullAuditOutputSchema.safeParse(result);

    if (!parsedData.success) {
      console.error("Data validation failed:", parsedData.error);
      return { error: "Failed to process blueprint data." };
    }

    return { data: parsedData.data };
  } catch (e) {
    console.error("Full audit failed:", e);
    return {
      error:
        e instanceof Error
          ? e.message
          : "An unexpected error occurred during the audit.",
    };
  }
}
