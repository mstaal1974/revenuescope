import { z } from 'zod';

// From generate-full-audit.ts
export const FullAuditInputSchema = z.object({
  rtoId: z.string().describe("The ID of the RTO to analyze."),
  rtoName: z.string().optional().describe("The name of the RTO, if known."),
  manualScope: z.array(z.string()).optional().describe("A list of course codes to use if TGA lookup fails."),
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

const SkillHeatmapItemSchema = z.object({
  skill_name: z.string(),
  demand_level: z.string(),
});

const OccupationAnalysisItemSchema = z.object({
  occupation_name: z.string(),
  demand_level: z.string(),
  labour_market_size: z.string(),
  growth_rate: z.string(),
});


export const FullAuditOutputSchema = z.object({
  rto_id: z.string(),

  // From Strategic Growth Director
  executive_summary: ExecutiveSummarySchema,
  sector_breakdown: z.array(SectorBreakdownSchema),
  
  // New Occupation Analysis
  occupation_analysis: z.array(OccupationAnalysisItemSchema).max(10),

  // New Skills Heatmap
  skills_heatmap: z.array(SkillHeatmapItemSchema),
  
  // From Micro-Stack Architect
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
      
      content_blueprint: z.object({
        learning_outcomes: z.array(z.string()),
        modules: z.array(z.object({
          title: z.string(),
          topic: z.string(),
          activity: z.string(),
        })),
      }),
      
      sales_kit: z.object({
        ideal_buyer_persona: z.string(),
        b2b_pitch_script: z.string(),
      }),

      badge_preview: z.object({
        badge_name: z.string(),
        visual_style: z.string(),
        rich_skill_descriptors: z.array(z.string()),
        retention_trigger: z.string(),
      }),

      marketing_plan: z.object({
        ad_creatives: z.object({
          headline: z.string(),
          body_copy: z.string(),
          cta_button: z.string(),
        }),
      }),
  })).length(3),
  
  stackable_product: z.object({
    bundle_title: z.string(),
    total_value: z.string(),
    bundle_price: z.string(),
    discount_applied: z.string(),
    marketing_pitch: z.string(),
    badges_issued: z.number()
  }),
  citations: z.array(z.string()),
});
export type FullAuditOutput = z.infer<typeof FullAuditOutputSchema>;


// From search-for-rto-scope.ts
export const SearchForRtoScopeInputSchema = z.object({
  rtoId: z.string().describe("The ID of the RTO to search for."),
});
export type SearchForRtoScopeInput = z.infer<
  typeof SearchForRtoScopeInputSchema
>;

const TgaScopeItemSchema = z.object({
  Code: z.string(),
  Name: z.string(),
  Anzsco: z.string().nullable(),
});

export const SearchForRtoScopeOutputSchema = z.object({
  scope: z.array(TgaScopeItemSchema).describe("The RTO scope information as a list of qualifications, including ANZSCO codes."),
  name: z.string().describe("The name of the RTO."),
});
export type SearchForRtoScopeOutput = z.infer<
  typeof SearchForRtoScopeOutputSchema
>;
