import { z } from 'zod';

// BASE INPUTS
export const FullAuditInputSchema = z.object({
  rtoId: z.string().describe("The ID of the RTO to analyze."),
  rtoName: z.string().optional().describe("The name of the RTO, if known."),
  manualScope: z.array(z.string()).optional().describe("A list of course codes to use if TGA lookup fails."),
  manualScopeDataset: z.string().optional().describe("A CSV-like string of scope items (Code,Name,Anzsco) to bypass TGA lookup."),
  absApiKey: z.string().optional().describe("An optional API key for the Australian Bureau of Statistics."),
  targetSector: z.string().optional().describe("An optional target sector to focus the analysis on."),
});
export type FullAuditInput = z.infer<typeof FullAuditInputSchema>;

// STAGE 1: SECTOR & OCCUPATION ANALYSIS
const ExecutiveSummarySchema = z.object({
  total_revenue_opportunity: z.string(),
  top_performing_sector: z.string(),
  strategic_advice: z.string()
});

const FinancialOpportunitySchema = z.object({
  serviceable_learners_estimate: z.number().default(0),
  competition_intensity_label: z.string().default("N/A"),
  competition_intensity_index: z.number().default(0.1),
  provider_capacity_cap: z.number().default(2000),
  final_learner_estimate: z.number().default(0),
  average_course_yield: z.number().default(150),
  realistic_annual_revenue: z.string().default("$0 AUD"),
  assumptions: z.array(z.string()).default(["Default assumptions used."]),
});

const BusinessMultipliersSchema = z.object({
  marketing_cac_label: z.string(),
  marketing_cac_subtext: z.string(),
  retention_ltv_value: z.string(),
  retention_ltv_subtext: z.string(),
  strategic_positioning: z.string(),
  strategic_positioning_subtext: z.string(),
  b2b_scale_potential: z.string(),
  b2b_scale_rating: z.number().min(0).max(100),
});

const SectorBreakdownSchema = z.object({
  sector_name: z.string(),
  qualification_count: z.number(),
  market_health_demand_level: z.string(),
  market_health_trend_direction: z.string(),
  market_health_avg_industry_wide_wage: z.string().optional(),
  market_health_avg_industry_wage: z.string(),
  financial_opportunity: FinancialOpportunitySchema,
  business_multipliers: BusinessMultipliersSchema.optional(),
  recommended_actions: z.array(z.string()),
  suggested_ai_courses: z.array(z.string()).default([]),
});
export type Sector = z.infer<typeof SectorBreakdownSchema>;

const OccupationAnalysisItemSchema = z.object({
  occupation_name: z.string(),
  demand_level: z.string(),
  labour_market_size: z.string(),
  growth_rate: z.string(),
});

export const Stage1OutputSchema = z.object({
  executive_summary: ExecutiveSummarySchema,
  sector_breakdown: z.array(SectorBreakdownSchema),
  occupation_analysis: z.array(OccupationAnalysisItemSchema),
});
export type Stage1Output = z.infer<typeof Stage1OutputSchema>;

// STAGE 2: SKILLS HEATMAP
const SkillHeatmapItemSchema = z.object({
  skill_name: z.string(),
  demand_level: z.string(),
});

export const SkillsHeatmapOutputSchema = z.object({
  skills_heatmap: z.array(SkillHeatmapItemSchema),
});
export type SkillsHeatmapOutput = z.infer<typeof SkillsHeatmapOutputSchema>;

// STAGE 3: REVENUE STAIRCASE (Optimized for shallow nesting)
export const RevenueStaircaseInputSchema = FullAuditInputSchema.extend({
    top_performing_sector: z.string(),
    skills_heatmap: z.array(SkillHeatmapItemSchema),
});
export type RevenueStaircaseInput = z.infer<typeof RevenueStaircaseInputSchema>;

const IncludedUnitSchema = z.object({
  name: z.string(),
  type: z.string(),
});

export const TierSchema = z.object({
    tier_level: z.number().min(1).max(3),
    title: z.string(),
    format: z.string(),
    price: z.number(),
    demand_level: z.string(),
    match_percentage: z.number(),
    included_units: z.array(IncludedUnitSchema),
    marketing_hook: z.string(),
    cac_offset: z.string().optional(),
    volume_potential: z.string().optional(),
    trust_velocity: z.string().optional(),
    speed_to_revenue: z.string().optional(),
    employer_urgency: z.string().optional(),
    margin_health: z.string().optional(),
    conversion_probability: z.string().optional(),
    marketing_cost: z.string().optional(),
    ltv_impact: z.string().optional(),
    target_audience: z.string(),
    pain_point: z.string(),
    channel: z.string(),
    ad_creative_visual: z.string(),
    ad_headline: z.string(),
    ad_body_copy: z.string(),
    hashtags: z.string(),
    email_subject: z.string(),
});
export type Tier = z.infer<typeof TierSchema>;

const ClusterPathwaySchema = z.object({
  current_stage: z.string(),
  stage_revenue: z.number(),
  automation_delay: z.string().optional(),
  automation_message_hook: z.string().optional(),
  automation_upsell_product: z.string().optional(),
  automation_conversion_rate: z.number().optional(),
});

export const RevenueStaircaseSchema = z.object({
  strategy_summary: z.string(),
  highest_demand_cluster: z.object({
    name: z.string(),
    match_percentage: z.number(),
  }),
  tiers: z.array(TierSchema).length(3),
  cluster_pathways: z.array(ClusterPathwaySchema),
});
export type RevenueStaircaseOutput = z.infer<typeof RevenueStaircaseSchema>;

// COMPLIANCE ANALYSIS
export const ComplianceAnalysisOutputSchema = z.object({
  self_assurance_score: z.number().min(0).max(100),
  validation_gaps: z.array(z.object({
    unit_code: z.string(),
    tga_mapping_score: z.number(),
    industry_alignment_score: z.number(),
    rto_evidence_score: z.number(),
    risk_level: z.enum(['Low', 'Medium', 'High']),
    analysis: z.string()
  })),
  assessor_variance: z.array(z.object({
    trainer_name: z.string(),
    pass_rate: z.number(),
    compliance_score: z.number(),
    risk_flag: z.boolean()
  })),
  monitoring_trend: z.array(z.object({
    month: z.string(),
    adherence: z.number(),
    quality: z.number()
  })),
  live_alerts: z.array(z.string())
});
export type ComplianceAnalysisOutput = z.infer<typeof ComplianceAnalysisOutputSchema>;

// MERGED FINAL OUTPUT
export const FullAuditOutputSchema = Stage1OutputSchema.merge(SkillsHeatmapOutputSchema).merge(RevenueStaircaseSchema).extend({
    rto_id: z.string(),
    rto_name: z.string().optional(),
    manualScopeDataset: z.string().optional(),
});
export type FullAuditOutput = z.infer<typeof FullAuditOutputSchema>;
export type AuditData = FullAuditOutput;

// ACTION RESULT TYPES
export type Stage1ActionResult = 
  | { ok: true; result: Stage1Output }
  | { ok: false; error: string };

export type Stage2ActionResult = 
  | { ok: true; result: SkillsHeatmapOutput }
  | { ok: false; error: string };

export type Stage3ActionResult = 
  | { ok: true; result: RevenueStaircaseOutput }
  | { ok: false; error: string };

export type MicrocredentialActionResult =
  | { ok: true; result: MicrocredentialOutput }
  | { ok: false; error: string };

export type LearningOutcomesActionResult =
  | { ok: true; result: LearningOutcomesOutput }
  | { ok: false; error: string };

export type CourseTimelineActionResult =
  | { ok: true; result: CourseTimelineOutput }
  | { ok: false; error: string };

export type SectorCampaignKitActionResult =
  | { ok: true; result: SectorCampaignKitOutput }
  | { ok: false; error: string };

export type ScopeFallbackActionResult = 
  | { ok: true; result: ScopeFallbackOutput }
  | { ok: false; error: string };

export type ComplianceActionResult = 
  | { ok: true; result: ComplianceAnalysisOutput }
  | { ok: false; error: string };

// OTHERS
export const MicrocredentialInputSchema = z.object({
  qualification_code: z.string(),
  qualification_title: z.string(),
  unit_code: z.string(),
  unit_title: z.string(),
});
export type MicrocredentialInput = z.infer<typeof MicrocredentialInputSchema>;

export const MicrocredentialOutputSchema = z.object({
  microcredential_product: z.object({
    market_title: z.string(),
    target_occupation: z.string(),
    skill_focus: z.string(),
    format: z.string(),
    duration: z.string(),
    pathway_mapping: z.object({
      leads_to_unit: z.string(),
      leads_to_qual: z.string(),
      value_prop: z.string(),
    }),
  }),
  ai_opportunity: z.object({
    product_title: z.string(),
    target_tool: z.string(),
    pain_point_solved: z.string(),
    marketing_hook: z.string(),
  }),
});
export type MicrocredentialOutput = z.infer<typeof MicrocredentialOutputSchema>;

export const LearningOutcomesInputSchema = z.object({
  course_title: z.string(),
  relevant_skills: z.array(z.string()).optional().describe("A list of relevant skills from a skills heatmap to help guide outcome generation."),
});
export type LearningOutcomesInput = z.infer<typeof LearningOutcomesInputSchema>;

export const LearningOutcomesOutputSchema = z.object({
  learning_outcomes: z.array(z.string()),
});
export type LearningOutcomesOutput = z.infer<typeof LearningOutcomesOutputSchema>;

export const CourseTimelineInputSchema = z.object({
  course_title: z.string(),
  learning_outcomes: z.array(z.string()),
});
export type CourseTimelineInput = z.infer<typeof CourseTimelineInputSchema>;

const CourseModuleItemSchema = z.object({
  id: z.number(),
  type: z.enum(['video', 'resource', 'award', 'quiz']),
  title: z.string(),
  duration: z.string(),
  description: z.string(),
  learning_objective: z.string().optional(),
  activity_breakdown: z.string().optional(),
  suggested_assessment: z.string().optional(),
  observable_criteria: z.array(z.string()).optional(),
});

const CourseModuleSchema = z.object({
  title: z.string(),
  total_duration: z.string(),
  items: z.array(CourseModuleItemSchema),
});

export const CourseTimelineOutputSchema = z.object({
  courseTitle: z.string(),
  modules: z.array(CourseModuleSchema),
});
export type CourseTimelineOutput = z.infer<typeof CourseTimelineOutputSchema>;
<<<<<<< HEAD

export const SectorCampaignKitInputSchema = z.object({
    sector: SectorBreakdownSchema,
});
export type SectorCampaignKitInput = z.infer<typeof SectorCampaignKitInputSchema>;

export const SectorCampaignKitOutputSchema = z.object({
    financial_impact: z.object({
        business_revenue_multiplier: z.string(),
        estimated_annual_roi: z.string(),
        annual_roi_percentage: z.string(),
        growth_projection: z.array(z.object({ name: z.string(), value: z.number() })),
        five_year_growth_projection: z.array(z.object({ name: z.string(), value: z.number() })).optional(),
    }),
    kpi_metrics: z.object({
        cac_reduction_value: z.string(),
        cac_reduction_percentage: z.string(),
        ltv_expansion_multiplier: z.string(),
        authority_index_score: z.number(),
        monthly_lead_volume: z.string(),
    }),
    the_strategy: z.object({
        primary_logic: z.string(),
        market_pivot: z.string(),
        target_audience: z.string(),
        key_selling_points: z.array(z.string()),
    }),
    skills_to_product_strategy: z.object({
      suggested_short_courses: z.array(z.object({
        title: z.string(),
        description: z.string(),
        derived_from_units: z.array(z.string()),
      })),
      suggested_skill_packages: z.array(z.object({
        package_title: z.string(),
        package_description: z.string(),
        included_courses: z.array(z.string()),
      })),
    }),
});
export type SectorCampaignKitOutput = z.infer<typeof SectorCampaignKitOutputSchema>;

export const ScopeFallbackInputSchema = z.object({
  code: z.string(),
  isRtoAudit: z.boolean(),
});
export type ScopeFallbackInput = z.infer<typeof ScopeFallbackInputSchema>;

export const ScopeFallbackOutputSchema = z.object({
  manualScopeDataset: z.string(),
  rtoName: z.string(),
  rtoCode: z.string(),
  count: z.number(),
});
export type ScopeFallbackOutput = z.infer<typeof ScopeFallbackOutputSchema>;
=======
>>>>>>> d1d6ffd04eae5f02077cf85cb9cdcdf3c09cba09
