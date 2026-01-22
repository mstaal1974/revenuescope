"use server";

import { searchForRtoScope } from "@/ai/flows/search-for-rto-scope";
import { generateCourseBlueprint } from "@/ai/flows/generate-course-blueprint";
import { z } from "zod";

const CourseBlueprintDataSchema = z.object({
  rto_id: z.string(),
  analysis_summary: z.object({
    parent_qualification_used: z.string(),
    market_context: z.string(),
  }),
  learning_pathway: z.object({
    pathway_title: z.string(),
    total_student_value: z.string(),
    courses: z.array(z.object({
        level: z.number(),
        course_title: z.string(),
        target_audience: z.string(),
        duration: z.string(),
        suggested_price: z.string(),
        revenue_potential: z.string(),
        skill_demand_trend: z.object({
            growth_percentage: z.string(),
            narrative: z.string(),
        }),
        included_skills: z.array(z.object({
          skill_name: z.string(),
          esco_uri: z.string(),
          learning_outcome: z.string(),
        })),
        marketing_hook: z.string(),
      })),
  }),
});


export type AuditData = z.infer<typeof CourseBlueprintDataSchema>;

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

    // Step 2: Generate Short Course Blueprint
    const blueprintResult = await generateCourseBlueprint({
      rtoId: rtoId,
      scope: scopeResult.scope,
    });

    if (!blueprintResult) {
      return { error: "Could not generate course blueprint." };
    }
    
    const parsedData = CourseBlueprintDataSchema.safeParse(blueprintResult);

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
