'use server';
/**
 * @fileOverview This file defines a flow for generating a detailed "Campaign Kit" for a specific business sector.
 */

import { ai, auditModel } from '@/ai/genkit';
import {
  SectorCampaignKitInputSchema,
  SectorCampaignKitOutputSchema,
  type SectorCampaignKitInput,
  type SectorCampaignKitOutput,
} from '@/ai/types';

export async function generateSectorCampaignKit(
  input: SectorCampaignKitInput
): Promise<SectorCampaignKitOutput> {
  return generateSectorCampaignKitFlow(input);
}

const prompt = ai.definePrompt({
    name: 'sectorCampaignKitPrompt',
    input: { schema: SectorCampaignKitInputSchema },
    output: { schema: SectorCampaignKitOutputSchema },
    model: auditModel,
    prompt: `
You are "ScopeStack AI v3.0", a Chief Commercial Officer and Workforce Architect for the vocational education sector in Australia.

**Primary Task:** Generate a "Strategic Campaign Kit" for a specific RTO business sector. Your analysis must be sharp, commercially-focused, and based entirely on the provided data context. You will generate a raw JSON object.

**INPUT CONTEXT:**
*   **Sector Name:** {{{sector.sector_name}}}
*   **Qualifications:** {{{sector.qualification_count}}}
*   **Market Health:** Demand is {{{sector.market_health_demand_level}}}, Trend is {{{sector.market_health_trend_direction}}}, Average Wage is {{{sector.market_health_avg_industry_wage}}}
*   **Financial Opportunity:** Realistic Annual Revenue is {{{sector.financial_opportunity.realistic_annual_revenue}}}, with an estimated {{{sector.financial_opportunity.final_learner_estimate}}} learners.
*   **Strategic Position:** {{{sector.business_multipliers.strategic_positioning}}}

**GENERATION LOGIC & RULES:**

1.  **Financial Impact Dashboard:**
    *   **business_revenue_multiplier:** Calculate this. A highly competitive market ('Very High' competition) might have a 1.5x multiplier, while a niche, low-competition market could be 10x-15x. Use the input context to derive a plausible number as a string (e.g., "12.4x").
    *   **estimated_annual_roi:** This should be the same as the \`realistic_annual_revenue\` from the input.
    *   **annual_roi_percentage:** Calculate a plausible YoY growth percentage based on market trend direction. "Growing" should be positive (e.g., "+15%"). "Stable" should be low (e.g., "+2%").
    *   **growth_projection:** Generate an array of 4 objects for a 12-month line graph. Each object must have \`name\` (e.g., "Q1", "Q2") and \`value\` (a number representing projected revenue for that quarter). The trend should be logical (e.g., starting lower and growing).

2.  **KPI Metrics:**
    *   **cac_reduction_value:** Estimate the dollar value saved on Customer Acquisition Cost by using a Tier 1 product strategy. Saturated markets have higher CAC, so the reduction is greater. Provide as a negative dollar string (e.g., "-$420").
    *   **cac_reduction_percentage:** Provide a percentage for the CAC reduction (e.g., "75%").
    *   **ltv_expansion_multiplier:** Estimate how much a student's lifetime value could increase by upselling from a micro-credential to a full qualification. Provide as a multiplier string (e.g., "3.8x").
    *   **authority_index_score:** Rate the RTO's potential to be a market leader in this sector on a scale of 1-100. Niche, specialist positioning gets a higher score.
    *   **monthly_lead_volume:** Estimate potential monthly leads based on the annual learner estimate from the input. Provide as a string (e.g., "1.4k").

3.  **The Strategy:**
    *   **primary_logic:** Write a 1-2 sentence summary of the core commercial strategy.
    *   **market_pivot:** Write a short, sharp statement about the strategic pivot this campaign represents (e.g., "Moving from a generalist provider to a specialist authority.").
    *   **target_audience:** Describe the ideal B2B or B2C customer for this sector.
    *   **key_selling_points:** Provide an array of exactly two short, punchy selling points.

4.  **Skills-to-Product Strategy:**
    *   **Task:** Analyze the qualifications within the sector to identify commercially viable, skills-based short courses.
    *   **suggested_short_courses:** Generate 3-5 short course ideas. Each course must have a marketable title, a brief description, and list the Unit of Competency codes it's derived from. These should address specific industry needs.
    *   **suggested_skill_packages:** Group 2-3 of the short courses you just created into a logical "Skills Package" or "Pathway". Give it a commercial title and a description of its value proposition.

**EXAMPLE JSON OUTPUT (This is the required shape, you must generate real data):**
{
  "financial_impact": {
    "business_revenue_multiplier": "12.4x",
    "estimated_annual_roi": "$4,280,000",
    "annual_roi_percentage": "+22%",
    "growth_projection": [
      { "name": "Q1", "value": 800000 },
      { "name": "Q2", "value": 1200000 },
      { "name": "Q3", "value": 950000 },
      { "name": "Q4", "value": 1330000 }
    ]
  },
  "kpi_metrics": {
    "cac_reduction_value": "-$420",
    "cac_reduction_percentage": "75%",
    "ltv_expansion_multiplier": "3.8x",
    "authority_index_score": 92,
    "monthly_lead_volume": "1.4k"
  },
  "the_strategy": {
    "primary_logic": "The primary commercial logic of this campaign centers on the Value-Authority Loop. By leveraging AI to synthesize market gaps, we are positioning the solution not as a commodity service, but as a strategic infrastructure multiplier.",
    "market_pivot": "The market is currently oversaturated with tactical tools. Our data suggests a 42% pivot towards integrated strategic kits. Positioning as a 'Logic Engine' creates an immediate moat against low-cost competitors.",
    "target_audience": "High-intent decision-makers in the mid-market segment.",
    "key_selling_points": [
      "Zero-friction lead qualification via AI grading.",
      "Automated logic-based objection handling."
    ]
  },
  "skills_to_product_strategy": {
    "suggested_short_courses": [
      {
        "title": "On-Site Safety Induction",
        "description": "A 2-hour non-accredited course covering essential site safety for new construction workers.",
        "derived_from_units": ["CPCCWHS1001"]
      },
      {
        "title": "Basic First Aid & CPR",
        "description": "The essential, accredited skills for responding to common workplace incidents.",
        "derived_from_units": ["HLTAID011", "HLTAID009"]
      }
    ],
    "suggested_skill_packages": [
      {
        "package_title": "Construction Site Ready Package",
        "package_description": "Get new hires job-ready in one day with this package covering safety and first aid essentials.",
        "included_courses": ["On-Site Safety Induction", "Basic First Aid & CPR"]
      }
    ]
  }
}

Now, generate the raw JSON object for the provided input data.
`
});

const generateSectorCampaignKitFlow = ai.defineFlow(
  {
    name: 'generateSectorCampaignKitFlow',
    inputSchema: SectorCampaignKitInputSchema,
    outputSchema: SectorCampaignKitOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error(
        'AI returned no structured output for Sector Campaign Kit generation.'
      );
    }
    return output;
  }
);
