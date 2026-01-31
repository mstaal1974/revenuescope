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

const FinancialOpportunitySchema = z.object({
  serviceable_learners_estimate: z.number(),
  competition_intensity_label: z.string(),
  competition_intensity_index: z.number(),
  provider_capacity_cap: z.number(),
  final_learner_estimate: z.number(),
  realistic_annual_revenue: z.string(),
  assumptions: z.array(z.string()),
});

const SectorBreakdownSchema = z.object({
  sector_name: z.string(),
  qualification_count: z.number(),
  market_health_demand_level: z.string(),
  market_health_trend_direction: z.string(),
  market_health_avg_industry_wage: z.string(),
  financial_opportunity: FinancialOpportunitySchema,
  recommended_actions: z.array(z.string()),
  suggested_ai_courses: z.array(z.string()).default([]),
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


// STAGE 3: 3-Tier Revenue Staircase
export const RevenueStaircaseInputSchema = FullAuditInputSchema.extend({
    top_performing_sector: z.string(),
    skills_heatmap: z.array(SkillHeatmapItemSchema),
});
export type RevenueStaircaseInput = z.infer<typeof RevenueStaircaseInputSchema>;

// Tier 1 Commercial Leverage
const CommercialLeverageTier1Schema = z.object({
  cac_offset: z.string().describe("e.g. 'Pays for 100% of Ads'"),
  volume_potential: z.string().describe("e.g. '50x wider audience than Diploma'"),
  trust_velocity: z.string().describe("e.g. 'Impulse Buy (<5 mins)'"),
});

// Tier 2 Commercial Leverage
const CommercialLeverageTier2Schema = z.object({
  speed_to_revenue: z.string().describe("e.g. '7 Days vs 12 Months'"),
  employer_urgency: z.string().describe("e.g. 'Mandatory for Site Entry'"),
  margin_health: z.string().describe("e.g. 'High - Low Assessment Overhead'"),
});

// Tier 3 Commercial Leverage
const CommercialLeverageTier3Schema = z.object({
  conversion_probability: z.string().describe("e.g. 'High (Warm Leads from Tier 2)'"),
  marketing_cost: z.string().describe("e.g. '$0 - Internal Upsell'"),
  ltv_impact: z.string().describe("e.g. 'Doubles Customer Value'"),
});

const MarketingPlaybookSchema = z.object({
    target_audience: z.string().describe("e.g. 'Frustrated Retail Workers looking for stable hours'"),
    pain_point: z.string().describe("e.g. 'Tired of weekend shifts?'"),
    channel: z.string().describe("e.g. 'Facebook/Instagram Ads' for Tier 1, 'LinkedIn/Seek' for Tier 2"),
    ad_creative_visual: z.string().describe("e.g. 'Close up of hands holding a pipette, clean blue lighting, high trust'"),
    ad_headline: z.string().describe("A punchy 5-word hook for the ad"),
    ad_body_copy: z.string().describe("2 sentences of ad copy expanding on the hook"),
    hashtags: z.string().describe("e.g. '#CareerChange #Pathology'"),
    email_subject: z.string().describe("The subject line to sell this product"),
});

// Discriminated union for Tiers
export const TierSchema = z.discriminatedUnion('tier_level', [
    z.object({
        tier_level: z.literal(1),
        title: z.string(),
        format: z.string(),
        price: z.number(),
        commercial_leverage: CommercialLeverageTier1Schema,
        marketing_hook: z.string(),
        marketing_playbook: MarketingPlaybookSchema,
    }),
    z.object({
        tier_level: z.literal(2),
        title: z.string(),
        format: z.string(),
        price: z.number(),
        commercial_leverage: CommercialLeverageTier2Schema,
        marketing_hook: z.string(),
        marketing_playbook: MarketingPlaybookSchema,
    }),
    z.object({
        tier_level: z.literal(3),
        title: z.string(),
        format: z.string(),
        price: z.number(),
        commercial_leverage: CommercialLeverageTier3Schema,
        marketing_hook: z.string(),
        marketing_playbook: MarketingPlaybookSchema,
    }),
]);
export type Tier = z.infer<typeof TierSchema>;

const SkillClusterSchema = z.object({
  cluster_name: z.string(),
  market_demand: z.string(),
  units_count: z.number(),
  primary_skills: z.array(z.string()),
  commercial_value: z.string()
});

// Main output schema for Stage 3
export const RevenueStaircaseSchema = z.object({
  strategy_summary: z.string(),
  tiers: z.array(TierSchema).length(3),
  skill_clusters: z.array(SkillClusterSchema),
});
export type RevenueStaircaseOutput = z.infer<typeof RevenueStaircaseSchema>;


// This is the final, fully-parsed schema that the application uses internally.
// It's a merge of all the stage outputs.
export const FullAuditOutputSchema = Stage1OutputSchema.merge(SkillsHeatmapOutputSchema).merge(RevenueStaircaseSchema).extend({
    rto_id: z.string()
});
export type FullAuditOutput = z.infer<typeof FullAuditOutputSchema>;

// From generate-microcredential.ts
export const MicrocredentialInputSchema = z.object({
  qualification_code: z.string(),
  qualification_title: z.string(),
  unit_code: z.string(),
  unit_title: z.string(),
});
export type MicrocredentialInput = z.infer<typeof MicrocredentialInputSchema>;

const AIOpportunitySchema = z.object({
  product_title: z.string(),
  target_tool: z.string(),
  pain_point_solved: z.string(),
  marketing_hook: z.string(),
});

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
  ai_opportunity: AIOpportunitySchema,
});
export type MicrocredentialOutput = z.infer<typeof MicrocredentialOutputSchema>;

// From generate-learning-outcomes.ts
export const LearningOutcomesInputSchema = z.object({
  course_title: z.string(),
});
export type LearningOutcomesInput = z.infer<typeof LearningOutcomesInputSchema>;

export const LearningOutcomesOutputSchema = z.object({
  learning_outcomes: z.array(z.string()),
});
export type LearningOutcomesOutput = z.infer<
  typeof LearningOutcomesOutputSchema
>;


// From generate-course-timeline.ts
export const CourseTimelineInputSchema = z.object({
  course_title: z.string(),
  learning_outcomes: z.array(z.string()),
});
export type CourseTimelineInput = z.infer<typeof CourseTimelineInputSchema>;

const CourseModuleItemSchema = z.object({
  id: z.number(),
  type: z.enum(['video', 'resource', 'award', 'quiz']).describe("The type of lesson item. 'video' for a lecture, 'resource' for a downloadable file, 'award' for a badge/certificate, 'quiz' for an assessment."),
  title: z.string().describe("The catchy, commercial-style title for the lecture or activity."),
  duration: z.string().describe("The estimated time to complete the item, formatted as 'MM:SS'."),
  description: z.string().describe("A brief, engaging description of the lesson item."),
  
  // Unlocked Content (Flattened)
  learning_objective: z.string().optional().describe("A clear, single-sentence learning objective for this specific item. THIS IS PART OF THE UNLOCKED CONTENT."),
  activity_breakdown: z.string().optional().describe("A brief description of the activities or tasks the student will perform. THIS IS PART OF THE UNLOCKED CONTENT."),
  suggested_assessment: z.string().optional().describe("A suggested method for assessing the student's understanding of this item. THIS IS PART OF THE UNLOCKED CONTENT."),
  observable_criteria: z.array(z.string()).optional().describe("Exactly three specific, observable criteria to verify skill acquisition. THIS IS PART OF THE UNLOCKED CONTENT."),
});

const CourseModuleSchema = z.object({
  title: z.string().describe("The title of the course module, e.g., 'Module 1: Foundations'."),
  total_duration: z.string().describe("The total estimated duration for the entire module."),
  items: z.array(CourseModuleItemSchema),
});

export const CourseTimelineOutputSchema = z.object({
  courseTitle: z.string(),
  modules: z.array(CourseModuleSchema),
});
export type CourseTimelineOutput = z.infer<typeof CourseTimelineOutputSchema>;
