import { z } from 'zod';

// From generate-full-audit.ts
export const FullAuditInputSchema = z.object({
  rtoId: z.string().describe("The ID of the RTO to analyze."),
  rtoName: z.string().optional().describe("The name of the RTO, if known."),
  manualScope: z.array(z.string()).optional().describe("A list of course codes to use if TGA lookup fails."),
  manualScopeDataset: z.string().optional().describe("A CSV-like string of scope items (Code,Name,Anzsco) to bypass TGA lookup."),
  absApiKey: z.string().optional().describe("An optional API key for the Australian Bureau of Statistics."),
  targetSector: z.string().optional().describe("An optional target sector to focus the analysis on."),
});
export type FullAuditInput = z.infer<typeof FullAuditInputSchema>;

const ExecutiveSummarySchema = z.object({
  total_revenue_opportunity: z.string(),
  top_performing_sector: z.string(),
  strategic_advice: z.string()
});

const SectorBreakdownSchema = z.object({
  sector_name: z.string(),
  qualification_count: z.number(),
  market_health: z.object({
    demand_level: z.string(),
    trend_direction: z.string(),
    avg_industry_wage: z.string()
  }),
  financial_opportunity: z.object({
    annual_revenue_gap: z.string(),
    student_volume_potential: z.number()
  }),
  recommended_actions: z.array(z.string())
});

const OccupationAnalysisItemSchema = z.object({
  occupation_name: z.string(),
  demand_level: z.string(),
  labour_market_size: z.string(),
  growth_rate: z.string(),
});

const SkillHeatmapItemSchema = z.object({
  skill_name: z.string(),
  demand_level: z.string(),
});


// STAGE 1: Sector & Occupation Analysis
export const Stage1OutputSchema = z.object({
  executive_summary: ExecutiveSummarySchema,
  sector_breakdown: z.array(SectorBreakdownSchema),
  occupation_analysis: z.array(OccupationAnalysisItemSchema),
});
export type Stage1Output = z.infer<typeof Stage1OutputSchema>;


// STAGE 2: Skills Heatmap
export const SkillsHeatmapOutputSchema = z.object({
  skills_heatmap: z.array(SkillHeatmapItemSchema),
});
export type SkillsHeatmapOutput = z.infer<typeof SkillsHeatmapOutputSchema>;


// STAGE 3: Product Ecosystem
// Input for Stage 3 needs outputs from Stage 1 & 2
export const ProductEcosystemInputSchema = FullAuditInputSchema.extend({
    top_performing_sector: z.string(),
    skills_heatmap: z.array(SkillHeatmapItemSchema),
});
export type ProductEcosystemInput = z.infer<typeof ProductEcosystemInputSchema>;


// Final parsed schema for Stage 3
export const ProductEcosystemOutputSchema = z.object({
  strategic_theme: z.string(),
  market_justification: z.string(),

  revenue_opportunity: z.object({
    total_market_size: z.string(),
    conservative_capture: z.string(),
    ambitious_capture: z.string(),
    acquisition_rationale: z.string(),
  }),

  individual_courses: z.array(z.object({
    tier: z.string(),
    course_title: z.string(),
    duration: z.string(),
    suggested_price: z.string(),
    pricing_tier: z.string(),
    target_student: z.string(),

    // flattened outputs (easy for model to match)
    learning_outcomes: z.array(z.string()).default([]),
    module_outline_markdown: z.string().default(""),

    b2b_pitch_script: z.string().default(""),

    badge_name: z.string().default(""),
    badge_skills: z.array(z.string()).default([]),

    ad_headline: z.string().default(""),
    ad_body_copy: z.string().default(""),
    ad_cta_button: z.string().default(""),
  })).min(1),

  stackable_product: z.object({
    bundle_title: z.string(),
    total_value: z.string(),
    bundle_price: z.string(),
    discount_applied: z.string(),
    marketing_pitch: z.string(),
    badges_issued: z.coerce.number(),
  }),

  citations: z.array(z.string()).default([]),
});
export type ProductEcosystemOutput = z.infer<typeof ProductEcosystemOutputSchema>;


// This is the final, fully-parsed schema that the application uses internally.
// It's a merge of all the stage outputs.
export const FullAuditOutputSchema = Stage1OutputSchema.merge(SkillsHeatmapOutputSchema).merge(ProductEcosystemOutputSchema).extend({
    rto_id: z.string()
});
export type FullAuditOutput = z.infer<typeof FullAuditOutputSchema>;
