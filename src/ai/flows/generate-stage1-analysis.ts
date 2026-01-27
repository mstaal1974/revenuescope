'use server';
/**
 * @fileOverview This file defines the first stage of the audit, generating high-level sector and occupation analysis.
 */

import { ai } from '@/ai/genkit';
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
  model: 'googleai/gemini-2.5-flash',
  config: {
    responseMimeType: 'application/json',
  },
  prompt: `You are "Strategic Growth Director v5.0," an expert in Australian vocational education economics, RTO strategy, and workforce market modelling. Your purpose is to provide a strategic audit for RTOs, using your extensive training data on Australian government sources and labor markets.

**Crucial Constraint: All labor market data MUST be sourced from your knowledge of the Australian market. DO NOT attempt to use any tools or access external websites or APIs. Use your training on the Australian Bureau of Statistics (ABS) as the primary source for quantitative data.**


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
\`Realistic Annual Revenue = Final Learners × Average Course Yield\` (Assume an average yield of $450 AUD per course if not otherwise specified).


**Task: High-Level Sector & Occupation Analysis**

**Part 1: High-Level Sector Analysis (The Macro View)**
- Your first task is to act as a **Strategic Growth Director**.
- **Sector Grouping:** Group qualifications from the provided scope by Training Package (e.g., CPC -> Construction, BSB -> Business).
- **Executive Summary:** First, synthesize your overall findings into an \`executive_summary\` object.
- **Sector Breakdown Population:** For each sector, populate the \`sector_breakdown\` array. Each object in the array MUST contain:
    - \`sector_name\`: (string) The name of the sector (e.g., "Construction").
    - \`qualification_count\`: (number) The count of qualifications in that sector from the input.
    - \`market_health\`: (object) with demand, trend, and average wage.
    - **\`financial_opportunity\`**: You MUST populate this object by executing the **MANDATORY 4-STEP REVENUE MODEL**. Your output for this field MUST strictly conform to the following JSON structure:
        \`\`\`json
        {
          "serviceable_learners_estimate": 1000,
          "competition_intensity": {
            "label": "High",
            "index": 0.2
          },
          "provider_capacity_cap": 250,
          "final_learner_estimate": 200,
          "realistic_annual_revenue": "$90,000 AUD",
          "assumptions": [
            "Assumes a 5% VET relevance and 10% provider reach due to sector generalisation.",
            "Provider capacity capped at 250 learners annually based on typical SME staffing.",
            "Very High competition in the Business sector drastically reduces achievable market capture."
          ]
        }
        \`\`\`
    - \`recommended_actions\`: (array of strings) Provide a list of actionable recommendations.

**Part 2: Top Occupations Analysis (The Granular View)**
- Now, act as a **Labour Market Data Scientist**.
- Focus on the sector identified as 'top_performing_sector' in the Executive Summary.
- Identify the top 10 most relevant occupations from the ANZSCO codes provided in the input.
- For each occupation, populate the \`occupation_analysis\` array with name, demand, market size, and growth rate.

**Final Output Instructions: You MUST respond with a valid JSON object. Do not wrap it in markdown backticks or any other explanatory text.**

**INPUT DATA:**
*   RTO ID: {{{rtoId}}}
*   RTO Scope & ANZSCO Data: {{{manualScopeDataset}}}

Begin analysis.`,
});

const generateStage1AnalysisFlow = ai.defineFlow(
  {
    name: 'generateStage1AnalysisFlow',
    inputSchema: FullAuditInputSchema,
  },
  async (input): Promise<Stage1Output> => {
    const response = await prompt(input);
    const rawJsonText = response.text;

    if (!rawJsonText || typeof rawJsonText !== 'string') {
      throw new Error(
        `generate-stage1-analysis: AI returned no text content. Full response: ${JSON.stringify(response)}`
      );
    }

    const jsonMatch = rawJsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error(`AI returned no valid JSON for Stage 1 analysis. Raw text: "${rawJsonText}"`);
    }
    const cleanedJsonText = jsonMatch[0];
    
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(cleanedJsonText);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      console.error(`generate-stage1-analysis: Failed to parse JSON from AI response. Error: ${errorMessage}. Raw text: "${rawJsonText}"`);
      throw new Error(`AI returned malformed JSON for Stage 1 analysis. Raw text: "${rawJsonText}"`);
    }
    
    const validation = Stage1OutputSchema.safeParse(parsedJson);

    if (!validation.success) {
      const validationErrors = JSON.stringify(validation.error.flatten());
      console.error("generate-stage1-analysis: AI response failed Zod validation:", validationErrors);
      throw new Error(`The AI's response for Stage 1 analysis did not match the required data structure. Validation issues: ${validationErrors}`);
    }

    return validation.data;
  }
);
