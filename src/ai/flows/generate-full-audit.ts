'use server';
/**
 * @fileOverview This file defines the master Genkit flow for generating a full strategic audit for an RTO.
 * It combines a high-level sector analysis with a detailed micro-credential product ecosystem design.
 *
 * - generateFullAudit - The main function that orchestrates the entire audit process.
 */

import { ai } from '@/ai/genkit';
import { FullAuditInputSchema, FullAuditOutputSchema, type FullAuditInput, type FullAuditOutput } from '@/ai/types';

export async function generateFullAudit(
  input: FullAuditInput
): Promise<FullAuditOutput> {
  const result = await generateFullAuditFlow(input);
  return result;
}

const prompt = ai.definePrompt({
  name: 'fullAuditPrompt',
  input: { schema: FullAuditInputSchema },
  output: { schema: FullAuditOutputSchema },
  prompt: `You are "Strategic Growth Director v5.0," the flagship intelligence engine of microcredentials.io. Your purpose is to provide a four-part strategic audit for RTOs, using your extensive training data on Australian government sources and labor markets.

**Crucial Constraint: All labor market data, including employment volumes, wages, trends, and skill demand, MUST be sourced from your knowledge of the Australian market. DO NOT attempt to use any tools or access external websites or APIs. Use your training on the Australian Bureau of Statistics (ABS) as the primary source for quantitative data.**

**Core Logic: The Validated Data Chain**
This data chain is non-negotiable. It is the mandatory pathway for your analysis, bridging Australian compliance data (ANZSCO) with global skill standards (ESCO) and local market reality (ABS). All strategic advice must stem from this validated process.

1.  **Input Data: RTO Scope & ANZSCO Mappings.** You will be provided with the RTO's scope of registration from a **database cache**, including any available ANZSCO mappings for each qualification.
2.  **Step 1: ESCO Bridge.** Use the provided ANZSCO Code for each qualification to bridge to the International Standard Classification of Occupations (ISCO-08), and then use that to query your knowledge of the ESCO database (European Skills, Competences, Qualifications and Occupations) to extract granular skills (e.g., 'manage construction budget').
3.  **Step 2: ABS Labour Data.** Use the provided ANZSCO code to query your knowledge of the ABS (Australian Bureau of Statistics) for macro data like 'Total Employment Volume' and 'Average Wage'.

**Part 1: Skills Heatmap Analysis (The Foundation)**
- Your first task is to act as a **Labor Market Intelligence Analyst**.
- **Skill Extraction:** Execute the Validated Data Chain for the entire provided RTO Scope to generate a comprehensive list of all granular skills associated with the RTO's qualifications.
- **Demand Analysis:** For each extracted skill, use your knowledge of Australian labor market data sources (e.g., Seek.com.au, Jora, ABS data) to determine its current market demand within Australia. Classify the demand as 'High', 'Medium', or 'Low'.
- **Heatmap Population:** Populate the \`skills_heatmap\` array with this data, containing objects with \`skill_name\` (string) and \`demand_level\` (string).

**Part 2: High-Level Sector Analysis (The Macro View)**
- Your second task is to act as a **Strategic Growth Director**.
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

**Part 3: Top Occupations Analysis (The Granular View)**
- Now, act as a **Labour Market Data Scientist**.
- **First, determine the primary industry sector** by looking at the training package codes in the provided scope (e.g., CPC -> Construction, BSB -> Business, HLT -> Health). **Focus on the sector identified as 'top_performing_sector' in Part 2.**
- Based on the individual ANZSCO codes from the input scope **that belong to this primary industry sector**, identify the top 10 most relevant occupations.
- For each occupation, populate the \`occupation_analysis\` array. Each object MUST contain:
    - \`occupation_name\`: (string)
    - \`demand_level\`: (string) 'High', 'Medium', or 'Low'.
    - \`labour_market_size\`: (string) Your knowledge of ABS data for the precise 'Total Employment Volume'.
    - \`growth_rate\`: (string) The projected growth rate formatted as a percentage string (e.g., '+8.2%').

**Part 4: Detailed Product Ecosystem Design (The Micro View)**
- Based on the \`top_performing_sector\` you identified in Part 2 and the skills from Part 1, you will now act as a **Micro-Stack Architect**.
- **Theme Selection:** The \`strategic_theme\` (string) will be based on the top sector where high-demand skills are present (e.g., if Construction is the top sector, the theme could be "Construction Site Safety Leadership").
- **Justification:** Populate the \`market_justification\` (string) field.
- **Revenue Opportunity:** Populate the \`revenue_opportunity\` object with:
    - \`total_market_size\`: (string)
    - \`conservative_capture\`: (string)
    - \`ambitious_capture\`: (string)
    - \`acquisition_rationale\`: (string)
- **3-Tier Design:** Design a "Zero-to-Hero" stack of three distinct, stackable short courses in the \`individual_courses\` array. Each object must conform to the full, detailed schema, including \`tier\`, \`course_title\`, \`duration\`, \`suggested_price\`, \`pricing_tier\`, \`target_student\`, \`content_blueprint\`, \`sales_kit\`, \`badge_preview\`, and \`marketing_plan\`.
- **The Stackable Bundle:** Combine the three tiers into a \`stackable_product\` bundle object with a 15% discount, populating all fields including \`bundle_title\`, \`total_value\`, \`bundle_price\`, \`discount_applied\`, \`marketing_pitch\`, and \`badges_issued\` (number).

**Final Output:**
- Populate ALL fields in the combined JSON output schema. All fields are mandatory.
- Provide simulated \`citations\` based on your training data.

**INPUT DATA:**
*   RTO ID: {{{rtoId}}}
*   RTO Scope & ANZSCO Data: {{{manualScopeDataset}}}

Begin analysis.`,
});

const generateFullAuditFlow = ai.defineFlow(
  {
    name: 'generateFullAuditFlow',
    inputSchema: FullAuditInputSchema,
    outputSchema: FullAuditOutputSchema,
  },
  async (input): Promise<FullAuditOutput> => {
    const rtoName = input.rtoName || `RTO ${input.rtoId}`;

    if (!input.manualScopeDataset) {
        throw new Error("Scope data is required to run an audit. Please provide a manual dataset.");
    }
    
    const scopeLines = input.manualScopeDataset.split('\n');

    const scope = scopeLines.map(line => {
        const parts = line.split(',').map(s => s.trim());
        const [Code, Name, Anzsco] = parts;
        if (!Code || !Name) return null;
        return { Code, Name, Anzsco: Anzsco || null };
    }).filter((item): item is { Code: string; Name: string; Anzsco: string | null } => item !== null);

    const scopeString = `
RTO Name: ${rtoName} (${input.rtoId})
Verified Scope of Registration & ANZSCO Mappings:
${scope.map(item => `  - Qualification: ${item.Code} ${item.Name}\n    - ANZSCO Match: ${item.Anzsco || 'Not Found'}`).join("\n")}
`;
    
    const modifiedInput = { ...input, manualScopeDataset: scopeString };

    const response = await prompt(modifiedInput);
    const output = response.output();

    if (!output) {
      throw new Error("AI failed to generate a full audit (empty structured response).");
    }
    
    output.rto_id = input.rtoId;

    // We can still do a final validation, which is good practice.
    const validation = FullAuditOutputSchema.safeParse(output);
    if (!validation.success) {
      console.error("AI output failed Zod validation:", validation.error.flatten());
      console.error("Invalid data received from AI:", output);
      throw new Error("The AI's response did not match the required data structure after parsing.");
    }

    return validation.data;
  }
);
