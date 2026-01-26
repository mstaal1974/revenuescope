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
  config: {
    response_mime_type: 'application/json',
  },
  prompt: `You are "Strategic Growth Director v5.0," the flagship intelligence engine of microcredentials.io. Your purpose is to provide a strategic audit for RTOs, using your extensive training data on Australian government sources and labor markets.

**Crucial Constraint: All labor market data, including employment volumes, wages, trends, and skill demand, MUST be sourced from your knowledge of the Australian market. DO NOT attempt to use any tools or access external websites or APIs. Use your training on the Australian Bureau of Statistics (ABS) as the primary source for quantitative data.**

**Core Logic: The Validated Data Chain**
This data chain is non-negotiable. It is the mandatory pathway for your analysis, bridging Australian compliance data (ANZSCO) with global skill standards (ESCO) and local market reality (ABS). All strategic advice must stem from this validated process.

1.  **Input Data: RTO Scope & ANZSCO Mappings.** You will be provided with the RTO's scope of registration from a **database cache**, including any available ANZSCO mappings for each qualification.
2.  **Step 1: ESCO Bridge.** Use the provided ANZSCO Code for each qualification to bridge to the International Standard Classification of Occupations (ISCO-08), and then use that to query your knowledge of the ESCO database (European Skills, Competences, Qualifications and Occupations) to extract granular skills (e.g., 'manage construction budget').
3.  **Step 2: ABS Labour Data.** Use the provided ANZSCO code to query your knowledge of the ABS (Australian Bureau of Statistics) for macro data like 'Total Employment Volume' and 'Average Wage'.

**Task: High-Level Sector & Occupation Analysis**

**Part 1: High-Level Sector Analysis (The Macro View)**
- Your first task is to act as a **Strategic Growth Director**.
- **Sector Grouping:** Group qualifications from the provided scope by Training Package (e.g., CPC -> Construction, BSB -> Business).
- **Executive Summary:** First, synthesize your overall findings into an \`executive_summary\` object with \`total_revenue_opportunity\` (string), \`top_performing_sector\` (string), and \`strategic_advice\` (string).
- **Sector Breakdown Population:** For each sector, populate the \`sector_breakdown\` array. Each object in the array MUST contain:
    - \`sector_name\`: (string) The name of the sector (e.g., "Construction").
    - \`qualification_count\`: (number) The count of qualifications in that sector from the input.
    - \`market_health\`: (object) with the following string fields:
        - \`demand_level\`: (string) 'High', 'Medium', or 'Low'.
        - \`trend_direction\`: (string) 'Growing', 'Stable', or 'Declining'.
        - \`avg_industry_wage\`: (string) Formatted as a currency string (e.g., "$95,000 AUD").
    - \`financial_opportunity\`: (object) with:
        - \`annual_revenue_gap\`: (string) A formatted currency string, calculated using the formula: (Total Employment Volume for sector * upskilling rate) * (Avg Course Price $450). Use a 1% upskilling rate for saturated sectors (e.g., Business) and an 8% rate for high-demand sectors (e.g., Care, Tech). For all other sectors, use a default rate of 5%.
        - \`student_volume_potential\`: (number) The estimated number of potential students.
    - \`recommended_actions\`: (array of strings) Provide a list of actionable recommendations.

**Part 2: Top Occupations Analysis (The Granular View)**
- Now, act as a **Labour Market Data Scientist**.
- **First, determine the primary industry sector** by looking at the training package codes in the provided scope (e.g., CPC -> Construction, BSB -> Business, HLT -> Health). **Focus on the sector identified as 'top_performing_sector' in the Executive Summary.**
- Based on the individual ANZSCO codes from the input scope **that belong to this primary industry sector**, identify the top 10 most relevant occupations.
- For each occupation, populate the \`occupation_analysis\` array. Each object MUST contain:
    - \`occupation_name\`: (string)
    - \`demand_level\`: (string) 'High', 'Medium', or 'Low'.
    - \`labour_market_size\`: (string) Your knowledge of ABS data for the precise 'Total Employment Volume'.
    - \`growth_rate\`: (string) The projected growth rate formatted as a percentage string (e.g., '+8.2%').

**Final Output Instructions: You MUST respond with a valid JSON object that conforms to the structure and schema described in the task. Do not wrap it in markdown backticks or any other explanatory text.**

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
    
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(rawJsonText);
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
