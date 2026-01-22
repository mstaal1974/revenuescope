"use server";

import { searchForRtoScope } from "@/ai/flows/search-for-rto-scope";
import { generateCourseBlueprint } from "@/ai/flows/generate-course-blueprint";
import { z } from "zod";

const CourseBlueprintDataSchema = z.object({
  rto_id: z.string(),
  strategic_theme: z.string(),
  market_justification: z.string(),
  
  individual_courses: z.array(z.object({
      tier: z.string(),
      course_title: z.string(),
      duration: z.string(),
      suggested_price: z.string(),
      target_student: z.string(),
      key_skill: z.string()
  })).length(3),
  
  stackable_product: z.object({
    bundle_title: z.string(),
    total_value: z.string(),
    bundle_price: z.string(),
    discount_applied: z.string(),
    marketing_pitch: z.string(),
    badges_issued: z.number()
  })
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
