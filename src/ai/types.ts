import { z } from 'zod';

// From generate-full-audit.ts
export const FullAuditInputSchema = z.object({
  rtoId: z.string().describe("The ID of the RTO to analyze."),
  absApiKey: z.string().optional().describe("An optional API key for the Australian Bureau of Statistics."),
  targetSector: z.string().optional().describe("An optional target sector to focus the analysis on."),
});
export type FullAuditInput = z.infer<typeof FullAuditInputSchema>;

export const FullAuditOutputSchema = z.object({
  rto_id: z.string(),
  executive_summary: z.object({
    total_revenue_opportunity: z.string().describe("Sum of all sectors, e.g., '$2.4M'"),
    top_performing_sector: z.string().describe("e.g., 'Construction'"),
    strategic_advice: z.string().describe("1 sentence summary, e.g., 'Pivot resources to Construction due to 12% labour shortage.'"),
  }),
  sector_breakdown: z.array(z.object({
    sector_name: z.string().describe("e.g., 'Construction & Infrastructure'"),
    qualification_count: z.number(),
    market_health: z.object({
      demand_level: z.string().describe("High/Med/Low"),
      trend_direction: z.string().describe("Growing/Stable/Declining"),
      avg_industry_wage: z.string().describe("e.g., '$1,850/wk'"),
    }),
    financial_opportunity: z.object({
      annual_revenue_gap: z.string().describe("e.g., '$1,200,000'"),
      student_volume_potential: z.number(),
    }),
    recommended_actions: z.array(z.string()).describe("e.g., ['Launch Micro-credential in Site Safety']"),
  })),
  product_ecosystem: z.object({
    strategic_theme: z.string().describe("A single, high-value theme, e.g., 'Site Safety Leadership'"),
    market_justification: z.string().describe("A brief summary of why this theme is valuable, e.g., 'Safety roles are growing at 8% YoY'"),
    individual_courses: z.array(z.object({
        tier: z.string().describe("e.g. 'Tier 1 (The Hook)'"),
        course_title: z.string(),
        duration: z.string().describe("e.g. '4 Hours'"),
        suggested_price: z.string().describe("e.g. '$195'"),
        target_student: z.string().describe("e.g. 'Entry-level staff'"),
        key_skill: z.string().describe("The primary ESCO skill taught"),
        career_roi: z.string().optional().describe("A short sentence about the career benefit for the student."),
        revenue_potential: z.string().optional().describe("The calculated revenue potential for the RTO."),
    })).length(3),
    stackable_product: z.object({
      bundle_title: z.string().describe("e.g. 'Executive Certificate in Site Safety'"),
      total_value: z.string().describe("The sum of individual course prices, e.g., '$1095'"),
      bundle_price: z.string().describe("The discounted price, e.g., '$930'"),
      discount_applied: z.string().describe("The percentage discount, e.g., '15%'"),
      marketing_pitch: z.string().describe("A compelling pitch for the bundle, e.g., 'Save 15% and go from novice to leader.'"),
      badges_issued: z.number().describe("The number of badges issued for completing the full stack (3 courses + 1 master).")
    })
  })
});
export type FullAuditOutput = z.infer<typeof FullAuditOutputSchema>;


// From generate-course-blueprint.ts
export const CourseBlueprintInputSchema = z.object({
  rtoId: z.string().describe("The ID of the RTO to analyze."),
  scope: z.string().describe("The RTO's full scope, e.g., [CPC50220, CPC40120, BSB50420]."),
  absApiKey: z.string().optional().describe("An optional API key for the Australian Bureau of Statistics."),
  targetSector: z.string().optional().describe("An optional target sector to focus the analysis on."),
});
export type CourseBlueprintInput = z.infer<typeof CourseBlueprintInputSchema>;

export const CourseBlueprintOutputSchema = z.object({
  rto_id: z.string(),
  strategic_theme: z.string().describe("A single, high-value theme, e.g., 'Site Safety Leadership'"),
  market_justification: z.string().describe("A brief summary of why this theme is valuable, e.g., 'Safety roles are growing at 8% YoY'"),
  
  individual_courses: z.array(z.object({
      tier: z.string().describe("e.g. 'Tier 1 (The Hook)'"),
      course_title: z.string(),
      duration: z.string().describe("e.g. '4 Hours'"),
      suggested_price: z.string().describe("e.g. '$195'"),
      target_student: z.string().describe("e.g. 'Entry-level staff'"),
      key_skill: z.string().describe("The primary ESCO skill taught"),
      career_roi: z.string().optional().describe("A short sentence about the career benefit for the student."),
      revenue_potential: z.string().optional().describe("The calculated revenue potential for the RTO."),
  })).length(3),
  
  stackable_product: z.object({
    bundle_title: z.string().describe("e.g. 'Executive Certificate in Site Safety'"),
    total_value: z.string().describe("The sum of individual course prices, e.g., '$1095'"),
    bundle_price: z.string().describe("The discounted price, e.g., '$930'"),
    discount_applied: z.string().describe("The percentage discount, e.g., '15%'"),
    marketing_pitch: z.string().describe("A compelling pitch for the bundle, e.g., 'Save 15% and go from novice to leader.'"),
    badges_issued: z.number().describe("The number of badges issued for completing the full stack (3 courses + 1 master).")
  })
});
export type CourseBlueprintOutput = z.infer<typeof CourseBlueprintOutputSchema>;


// From search-for-rto-scope.ts
export const SearchForRtoScopeInputSchema = z.object({
  rtoId: z.string().describe("The ID of the RTO to search for."),
});
export type SearchForRtoScopeInput = z.infer<
  typeof SearchForRtoScopeInputSchema
>;

export const SearchForRtoScopeOutputSchema = z.object({
  scope: z.string().describe("The RTO scope information."),
  name: z.string().describe("The name of the RTO."),
});
export type SearchForRtoScopeOutput = z.infer<
  typeof SearchForRtoScopeOutputSchema
>;
