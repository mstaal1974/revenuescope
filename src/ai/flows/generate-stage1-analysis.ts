'use server';
/**
 * @fileOverview This file defines the first stage of the audit, generating high-level sector and occupation analysis.
 */

import { ai, flashModel } from '@/ai/genkit';
import { FullAuditInputSchema, Stage1OutputSchema, type FullAuditInput, type Stage1Output } from '@/ai/types';

export async function generateStage1Analysis(
  input: FullAuditInput
): Promise<Stage1Output> {
  const result = await generateStage1AnalysisFlow(input);
  return result;
}

const prompt = ai.definePrompt({
  name: 'stage1AnalysisPrompt',
  input: { schema: FullAuditInputSchema },
  model: flashModel,
  prompt: `You are "Strategic Growth Director v5.0," an expert in Australian vocational education economics, RTO strategy, and workforce market modelling. Your purpose is to provide a strategic audit for RTOs, using your extensive training data on Australian government sources and labor markets.

**Crucial Constraint: All labor market data MUST be sourced from your knowledge of the Australian market. DO NOT attempt to use any tools or access external websites or APIs. Use your training on the Australian Bureau ofStatistics (ABS) as the primary source for quantitative data.**


**MANDATORY REVENUE LOGIC MODULE: SME REALISTIC CAPTURE MODEL**
You are a Revenue Logic Module for a small-to-medium Australian Registered Training Organisation (RTO). Your role is to calculate realistic, defensible annual revenue opportunity estimates. You must assume the provider is small-scale, operates in competitive markets, and all outputs must be board-ready, conservative, and defensible.

❌ **PROHIBITED ACTIONS:**
- Do NOT use total workforce size as a direct revenue base.
- Do NOT assume high market share in generalist or saturated sectors.
- Do NOT inflate revenue for large sectors just because employment is high.
- Do NOT exceed plausible delivery capacity for an SME RTO.

✅ **MANDATORY 4-STEP REVENUE MODEL:**
For every sector, you MUST apply the following model to calculate \`financial_opportunity\`:

**STEP 1 — Calculate Serviceable Obtainable Learners (SOL):**
Estimate the SOL, not the total workforce.
\`SOL = Total Workforce × Relevance to formal VET upskilling (%) × Provider reach (%)\`
- Guidance: Generalist sectors (e.g. Business) have low relevance/reach. Specialist sectors (e.g. Laboratories, Pathology) have higher relevance/reach.

**STEP 2 — Apply Competition Intensity Modifier:**
Assign a Competition Intensity Index (CI) for each sector.
- \`Very High\` (e.g., Business, WHS): CI = 0.1
- \`High\`: CI = 0.2
- \`Medium\` (Skills-specific): CI = 0.4
- \`Low\` (Niche): CI = 0.6
- \`Very Low\` (Rare): CI = 0.8
Apply the modifier: \`Effective Learners = SOL × Competition Index\`.
This MUST result in large, generalist sectors producing small, realistic yields, and niche sectors producing higher proportional yields.

**STEP 3 — Apply Provider Capacity Cap:**
Cap learner volumes based on realistic SME delivery constraints (staffing, assessment load).
\`Final Learners = MIN(Effective Learners, Provider Capacity Cap)\`

**STEP 4 — Calculate Realistic Annual Revenue:**
\`Realistic Annual Revenue = Final Learners × Average Course Yield\` (Assume an average yield of $150 AUD per course if not otherwise specified).


**Task: High-Level Sector & Occupation Analysis**

Your overall task is to act as a **Strategic Growth Director** and **Labour Market Data Scientist** to generate a single raw JSON object containing three top-level keys: \`executive_summary\`, \`sector_breakdown\`, and \`occupation_analysis\`.

1.  **\`executive_summary\` (Object):** Synthesize your overall findings into this object.
    *   \`total_revenue_opportunity\`: A string summarizing the total potential range.
    *   \`top_performing_sector\`: A string identifying the best sector.
    *   \`strategic_advice\`: A string with your main recommendation.

2.  **\`sector_breakdown\` (Array of Objects):** Group qualifications from the provided scope by Training Package (e.g., BSB -> Business). For each sector, create an object in the array and populate it. You MUST use the **MANDATORY 4-STEP REVENUE MODEL** to calculate the \`financial_opportunity\` for each sector. The properties for market health and competition intensity must be flattened. For each sector, also generate a list of 2-3 innovative, AI-related micro-credential course titles that could be developed. These should be stored in a \`suggested_ai_courses\` array.

3.  **\`occupation_analysis\` (Array of Objects):** Focus on the sector you identified as 'top_performing_sector'. Identify the top 10 most relevant occupations from the ANZSCO codes provided. For each occupation, create an object in this array with name, demand, market size, and growth rate. **This field MUST be an array, not an object.**

**OUTPUT RULES:**
- Return ONLY valid, raw JSON.
- Do not wrap in \`\`\` fences or other markdown.
- Output must start with { and end with }.
- The \`sector_breakdown\` key MUST contain an array of objects. Each object in the array MUST have a \`sector_name\` property.
- The \`occupation_analysis\` key MUST contain an array of objects.

**EXAMPLE SHAPE (abbreviated):**
{
  "executive_summary": {
    "total_revenue_opportunity": "$1.5M - $12M AUD",
    "top_performing_sector": "Laboratory Operations",
    "strategic_advice": "Focus on the high-growth, low-competition lab sector."
  },
  "sector_breakdown": [
    {
      "sector_name": "Business",
      "qualification_count": 5,
      "market_health_demand_level": "High",
      "market_health_trend_direction": "Growing",
      "market_health_avg_industry_wage": "$95,000 AUD",
      "financial_opportunity": {
        "serviceable_learners_estimate": 25000,
        "competition_intensity_label": "Very High",
        "competition_intensity_index": 0.1,
        "provider_capacity_cap": 2000,
        "final_learner_estimate": 2000,
        "realistic_annual_revenue": "$900,000 AUD",
        "assumptions": ["Low reach due to market saturation.", "Assumes $150 average course yield."]
      },
      "recommended_actions": ["Develop niche micro-credentials for specific software skills."],
      "suggested_ai_courses": ["AI for Business Process Automation", "Generative AI for Marketing Content"]
    }
  ],
  "occupation_analysis": [
    {
      "occupation_name": "Medical Laboratory Technicians",
      "demand_level": "High",
      "labour_market_size": "25,000",
      "growth_rate": "+12.5%"
    }
  ]
}


**INPUT DATA:**
*   RTO ID: {{{rtoId}}}
*   RTO Scope & ANZSCO Data: {{{manualScopeDataset}}}

Begin analysis.`,
});


const generateStage1AnalysisFlow = ai.defineFlow(
  {
    name: 'generateStage1AnalysisFlow',
    inputSchema: FullAuditInputSchema,
    // outputSchema: Stage1OutputSchema,
  },
  async (input) => {
    const response = await prompt(input);
    const rawText = response.text;

    if (!rawText) {
      throw new Error("AI generation for Stage 1 returned no text output.");
    }
    
    const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    let parsedJson: any;

    try {
        parsedJson = JSON.parse(cleanJson);
    } catch (e) {
        console.error("Failed to parse JSON from AI for Stage 1:", e, "\nRaw text:", rawText);
        throw new Error("AI returned malformed JSON for Stage 1 analysis.");
    }
    
    const validationResult = Stage1OutputSchema.safeParse(parsedJson);
    if (validationResult.success) {
      return validationResult.data;
    }

    console.error("AI output for Stage 1 failed validation.", validationResult.error);
    throw new Error(`AI output for Stage 1 failed validation: ${validationResult.error.message}`);
  }
);
