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
  total_revenue_opportunity: z.string().describe("Sum of all sectors, e.g., '$2.4M'"),
  top_performing_sector: z.string().describe("e.g., 'Construction'"),
  strategic_advice: z.string().describe("1 sentence summary, e.g., 'Pivot resources to Construction due to 12% labour shortage.'")
});

const SectorBreakdownSchema = z.object({
  sector_name: z.string().describe("e.g., 'Construction & Infrastructure'"),
  qualification_count: z.number(),
  market_health: z.object({
    demand_level: z.string().describe("High/Med/Low"),
    trend_direction: z.string().describe("Growing/Stable/Declining"),
    avg_industry_wage: z.string().describe("e.g., '$1,850/wk'")
  }),
  financial_opportunity: z.object({
    annual_revenue_gap: z.string().describe("e.g., '$1,200,000'"),
    student_volume_potential: z.number()
  }),
  recommended_actions: z.array(z.string()).describe("e.g., ['Launch Micro-credential in Site Safety']")
});

const SkillHeatmapItemSchema = z.object({
  skill_name: z.string().describe("A specific granular skill, e.g., 'manage construction budget'"),
  demand_level: z.string().describe("High/Medium/Low"),
});

const OccupationAnalysisItemSchema = z.object({
  occupation_name: z.string().describe("The name of the occupation, e.g., 'Construction Manager'"),
  demand_level: z.string().describe("High/Medium/Low"),
  labour_market_size: z.string().describe("Total employment volume for this occupation, e.g., '95,400'"),
  growth_rate: z.string().describe("The projected growth or decline rate, e.g., '+8.2%' or '-1.5%'"),
});


export const FullAuditOutputSchema = z.object({
  rto_id: z.string(),

  // From Strategic Growth Director
  executive_summary: ExecutiveSummarySchema,
  sector_breakdown: z.array(SectorBreakdownSchema),
  
  // New Occupation Analysis
  occupation_analysis: z.array(OccupationAnalysisItemSchema).max(10).describe("A list of up to 10 key occupations related to the RTO's scope, ordered by demand."),

  // New Skills Heatmap
  skills_heatmap: z.array(SkillHeatmapItemSchema).describe("A heatmap of all identified skills from the RTO's scope, with demand levels."),
  
  // From Micro-Stack Architect
  strategic_theme: z.string().describe("e.g., 'Site Safety Leadership'"),
  market_justification: z.string().describe("e.g., 'Safety roles are growing at 8% YoY'"),
  
  revenue_opportunity: z.object({
    total_market_size: z.string().describe("e.g., '120,500 Professionals'"),
    conservative_capture: z.string().describe("e.g., '$245,000 p.a.'"),
    ambitious_capture: z.string().describe("e.g., '$1,225,000 p.a.'"),
    acquisition_rationale: z.string().describe("Brief rationale for the revenue capture figures."),
  }),

  individual_courses: z.array(z.object({
      tier: z.string().describe("e.g. 'Tier 1 (The Hook)'"),
      course_title: z.string(),
      duration: z.string().describe("e.g. '4 Hours'"),
      suggested_price: z.string().describe("e.g. '$195'"),
      pricing_tier: z.string().describe("e.g., 'TIER_1'"),
      target_student: z.string().describe("e.g. 'Entry-level staff'"),
      
      content_blueprint: z.object({
        learning_outcomes: z.array(z.string()).describe("A list of what the student will be able to do after the course."),
        modules: z.array(z.object({
          title: z.string().describe("e.g., 'Core Safety Principles'"),
          topic: z.string().describe("e.g., 'Identifying and Reporting Hazards'"),
          activity: z.string().describe("e.g., 'Simulated Hazard Inspection'"),
        })),
      }),
      
      sales_kit: z.object({
        ideal_buyer_persona: z.string().describe("Specific job title of the ideal B2B buyer."),
        b2b_pitch_script: z.string().describe("A script for selling this course to a business manager."),
      }),

      badge_preview: z.object({
        badge_name: z.string().describe("The official title for the digital badge."),
        visual_style: z.string().describe("e.g., 'Bronze/Orange'"),
        rich_skill_descriptors: z.array(z.string()).describe("A list of specific, verifiable skills for the badge."),
        retention_trigger: z.string().describe("A hook to encourage enrollment in the next tier."),
      }),

      marketing_plan: z.object({
        ad_creatives: z.object({
          headline: z.string().describe("Punchy ad headline."),
          body_copy: z.string().describe("Brief ad body text."),
          cta_button: z.string().describe("Call to action text for the ad button."),
        }),
      }),
  })).length(3),
  
  stackable_product: z.object({
    bundle_title: z.string().describe("e.g. 'Executive Certificate in Site Safety'"),
    total_value: z.string().describe("The sum of individual course prices, e.g., '$1095'"),
    bundle_price: z.string().describe("The discounted price, e.g., '$930'"),
    discount_applied: z.string().describe("The percentage discount, e.g., '15%'"),
    marketing_pitch: z.string().describe("A compelling pitch for the bundle, e.g., 'Save 15% and go from novice to leader.'"),
    badges_issued: z.number().describe("The number of badges issued for completing the full stack (3 courses + 1 master).")
  }),
  citations: z.array(z.string()).describe("List of data sources used for the analysis."),
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
