"use server";

import { generateSectorAnalysis } from "@/ai/flows/generate-sector-analysis";
import { searchForRtoScope } from "@/ai/flows/search-for-rto-scope";
import { z } from "zod";

const SectorAnalysisDataSchema = z.object({
  rto_id: z.string(),
  executive_summary: z.object({
    total_revenue_opportunity: z.string(),
    top_performing_sector: z.string(),
    strategic_advice: z.string(),
  }),
  sector_breakdown: z.array(
    z.object({
      sector_name: z.string(),
      qualification_count: z.number(),
      market_health: z.object({
        demand_level: z.string(),
        trend_direction: z.string(),
        avg_industry_wage: z.string(),
      }),
      financial_opportunity: z.object({
        annual_revenue_gap: z.string(),
        student_volume_potential: z.number(),
      }),
      key_skills_in_demand: z.array(z.string()),
      recommended_actions: z.array(z.string()),
    })
  ),
});

export type AuditData = z.infer<typeof SectorAnalysisDataSchema>;

export async function runFullAudit(
  rtoId: string
): Promise<{ data?: AuditData; error?: string }> {
  if (!rtoId) {
    return { error: "RTO ID is required." };
  }

  try {
    // Step 1: Fetch RTO Scope
    const scopeResult = await searchForRtoScope({ rtoId });
    if (!scopeResult || !scopeResult.scope) {
      return { error: "Could not retrieve RTO scope." };
    }

    // Step 2: Generate Sector Analysis
    const analysisResult = await generateSectorAnalysis({
      scope: scopeResult.scope,
    });

    if (!analysisResult) {
      return { error: "Could not generate sector analysis." };
    }

    const auditData = {
      rto_id: rtoId,
      ...analysisResult,
    };

    const parsedData = SectorAnalysisDataSchema.safeParse(auditData);
    if (!parsedData.success) {
      console.error("Data validation failed:", parsedData.error);
      return { error: "Failed to process audit data." };
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
