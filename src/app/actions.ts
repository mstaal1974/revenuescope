"use server";

import { analyzeCurriculumForRevenueOpportunities } from "@/ai/flows/analyze-curriculum-for-revenue-opportunities";
import { searchForRtoScope } from "@/ai/flows/search-for-rto-scope";
import { z } from "zod";

const AuditDataSchema = z.object({
  rtoName: z.string(),
  scope: z.string(),
  analysis: z.object({
    revenueOpportunities: z.string(),
    strategicTheme: z.string(),
    marketJustification: z.string(),
    totalAddressableMarket: z.string(),
    acquisitionModelLowEnd: z.string(),
    acquisitionModelHighEnd: z.string(),
  }),
});

export type AuditData = z.infer<typeof AuditDataSchema>;

export async function runFullAudit(rtoId: string): Promise<{ data?: AuditData; error?: string }> {
  if (!rtoId) {
    return { error: "RTO ID is required." };
  }

  try {
    // Step 1: Fetch RTO Scope
    const scopeResult = await searchForRtoScope({ rtoId });
    if (!scopeResult || !scopeResult.scope) {
      return { error: "Could not retrieve RTO scope." };
    }

    // Step 2: Analyze for revenue opportunities
    const analysisResult = await analyzeCurriculumForRevenueOpportunities({
      curriculumScope: scopeResult.scope,
    });

    if (!analysisResult || !analysisResult.revenueOpportunities || !analysisResult.strategicTheme) {
        return { error: "Could not analyze curriculum for revenue opportunities." };
    }

    const auditData = {
      rtoName: scopeResult.name,
      scope: scopeResult.scope,
      analysis: {
        revenueOpportunities: analysisResult.revenueOpportunities,
        strategicTheme: analysisResult.strategicTheme,
        marketJustification: analysisResult.marketJustification,
        totalAddressableMarket: analysisResult.totalAddressableMarket,
        acquisitionModelLowEnd: analysisResult.acquisitionModelLowEnd,
        acquisitionModelHighEnd: analysisResult.acquisitionModelHighEnd,
      },
    };
    
    const parsedData = AuditDataSchema.safeParse(auditData);
    if (!parsedData.success) {
      console.error("Data validation failed:", parsedData.error);
      return { error: "Failed to process audit data." };
    }

    return { data: parsedData.data };

  } catch (e) {
    console.error("Full audit failed:", e);
    return { error: e instanceof Error ? e.message : "An unexpected error occurred during the audit." };
  }
}
