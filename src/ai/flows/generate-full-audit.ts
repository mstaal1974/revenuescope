'use server';
/**
 * @fileOverview This file defines the master Genkit flow for generating a full strategic audit for an RTO.
 * It combines a high-level sector analysis with a detailed micro-credential product ecosystem design.
 *
 * - generateFullAudit - The main function that orchestrates the entire audit process.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { FullAuditInputSchema, FullAuditOutputSchema, type FullAuditInput, type FullAuditOutput } from '@/ai/types';

export async function generateFullAudit(
  input: FullAuditInput
): Promise<FullAuditOutput> {
  return generateFullAuditFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fullAuditPrompt',
  input: { schema: z.object({ rtoId: z.string(), scope: z.string() }) },
  prompt: `You are "Strategic Growth Director v5.0," the flagship intelligence engine of microcredentials.io. Your purpose is to provide a four-part strategic audit for RTOs, using your extensive training data on Australian government sources and labor markets.

**Crucial Constraint: All labor market data, including employment volumes, wages, trends, and skill demand, MUST be sourced from your knowledge of the Australian market. DO NOT attempt to use any tools or access external websites or APIs. Use your training on the Australian Bureau of Statistics (ABS) as the primary source for quantitative data.**

**Core Logic: The Validated Data Chain**
This data chain is non-negotiable. It is the mandatory pathway for your analysis, bridging Australian compliance data (ANZSCO) with global skill standards (ESCO) and local market reality (ABS). All strategic advice must stem from this validated process.

1.  **Input Data: RTO Scope & ANZSCO Mappings.** You will be provided with the RTO's scope of registration from a database cache, including any available ANZSCO mappings for each qualification.
2.  **Step 1: ESCO Bridge.** Use the provided ANZSCO Code for each qualification to bridge to the International Standard Classification of Occupations (ISCO-08), and then use that to query your knowledge of the ESCO database (European Skills, Competences, Qualifications and Occupations) to extract granular skills (e.g., 'manage construction budget').
3.  **Step 2: ABS Labour Data.** Use the provided ANZSCO code to query your knowledge of the ABS (Australian Bureau of Statistics) for macro data like 'Total Employment Volume' and 'Average Wage'.

**Part 1: Skills Heatmap Analysis (The Foundation)**
- Your first task is to act as a **Labor Market Intelligence Analyst**.
- **Skill Extraction:** Execute the Validated Data Chain for the entire provided RTO Scope to generate a comprehensive list of all granular skills associated with the RTO's qualifications.
- **Demand Analysis:** For each extracted skill, use your knowledge of Australian labor market data sources (e.g., Seek.com.au, Jora, ABS data) to determine its current market demand within Australia. Classify the demand as 'High', 'Medium', or 'Low'.
- **Heatmap Population:** Populate the \`skills_heatmap\` array with this data. This forms the foundational evidence for all subsequent strategic recommendations.

**Part 2: High-Level Sector Analysis (The Macro View)**
- Your second task is to act as a **Strategic Growth Director**.
- **Sector Grouping:** Group qualifications from the provided scope by Training Package (e.g., CPC -> Construction, BSB -> Business).
- **ABS Data Aggregation:** For each sector, use the ANZSCO codes you've already mapped to aggregate ABS Labour Force data from your knowledge base to determine: Total Employment Volume, Average Wage, and Growth Trend. Mark as "Growing" if any occupation in the group has >5% growth.
- **Revenue Calculation:** Calculate the \`sector_revenue_gap\` using the formula: (Total Employment Volume * upskilling rate) * (Avg Course Price $450). Use a 1% upskilling rate for saturated sectors (e.g., Business) and an 8% rate for high-demand sectors (e.g., Care, Tech). For all other sectors, use a default rate of 5%.
- **Executive Summary:** Synthesize your findings into an \`executive_summary\` with \`total_revenue_opportunity\`, \`top_performing_sector\`, and \`strategic_advice\`.
- **Sector Breakdown:** Populate the \`sector_breakdown\` array with detailed analysis for each identified sector.

**Part 3: Top Occupations Analysis (The Granular View)**
- Now, act as a **Labour Market Data Scientist**.
- **First, determine the primary industry sector** by looking at the training package codes in the provided scope (e.g., CPC -> Construction, BSB -> Business, HLT -> Health). **Focus on the sector identified as 'top_performing_sector' in Part 2.**
- Based on the individual ANZSCO codes from the input scope **that belong to this primary industry sector**, identify the top 10 most relevant occupations.
- For each occupation, use your knowledge of ABS data to find the precise 'Total Employment Volume' (\`labour_market_size\`) and calculate the projected growth rate (e.g., from employment projections).
- Also assess the qualitative demand level ('High', 'Medium', 'Low') based on your market knowledge.
- Populate the \`occupation_analysis\` array with these 10 occupations, ordered from highest demand to lowest. Ensure the growth rate is formatted as a percentage string (e.g., '+8.2%').

**Part 4: Detailed Product Ecosystem Design (The Micro View)**
- Based on the \`top_performing_sector\` you identified in Part 2 and the skills from Part 1, you will now act as a **Micro-Stack Architect**.
- **Theme Selection:** The \`strategic_theme\` will be based on the top sector where high-demand skills are present (e.g., if Construction is the top sector, the theme could be "Construction Site Safety Leadership").
- **3-Tier Design:** Design a "Zero-to-Hero" stack of three distinct, stackable short courses.
    - Tier 1 (The Hook): Awareness & Safety focus.
    - Tier 2 (The Core): Application & "Doing" focus.
    - Tier 3 (The Crown): Management & Leadership focus.
- **Labor Market & Pricing Calibration:** Use simulated market data to justify your theme, estimate revenue, and set prices for each tier using the 'Base Anchor + Market Multiplier' logic.
- **Artifact Synthesis:** For each of the 3 tiers, generate a detailed \`content_blueprint\`, \`sales_kit\`, \`badge_preview\`, and \`marketing_plan\`.
- **The Stackable Bundle:** Combine the three tiers into a \`stackable_product\` bundle with a 15% discount.

**Final Output:**
- Populate ALL fields in the combined JSON output schema. All fields are mandatory.
- Provide simulated \`citations\` based on your training data.
- **Final Output Format: Your entire response MUST be a single, valid JSON object enclosed in a markdown code block (\`\`\`json ... \`\`\`). Do not include any text or explanations outside of this code block.**

**INPUT DATA:**
*   RTO ID: {{{rtoId}}}
*   RTO Scope & ANZSCO Data: {{{scope}}}

Begin analysis.`,
});

const generateFullAuditFlow = ai.defineFlow(
  {
    name: 'generateFullAuditFlow',
    inputSchema: FullAuditInputSchema,
    outputSchema: FullAuditOutputSchema,
  },
  async (input) => {
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

    const { text } = await prompt({ scope: scopeString, rtoId: input.rtoId });
    const responseText = text;

    if (!responseText) {
      throw new Error("AI failed to generate a full audit (empty response).");
    }

    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch || !jsonMatch[1]) {
      console.error("AI response did not contain a valid JSON code block. Raw response:", responseText);
      throw new Error("AI response was not in the expected format. The response did not contain a valid JSON code block.");
    }

    let parsedJson;
    try {
      parsedJson = JSON.parse(jsonMatch[1]);
    } catch (e) {
      console.error("Failed to parse JSON from AI response. Raw content:", jsonMatch[1]);
      const errorMessage = e instanceof Error ? e.message : "Unknown parsing error";
      throw new Error(`AI returned malformed JSON: ${errorMessage}`);
    }
    
    parsedJson.rto_id = input.rtoId;

    // Validate the parsed data against the Zod schema before returning
    const validation = FullAuditOutputSchema.safeParse(parsedJson);
    if (!validation.success) {
      console.error("AI output failed Zod validation:", validation.error.flatten());
       console.error("Invalid data received from AI:", parsedJson);
      throw new Error("The AI's response did not match the required data structure after parsing.");
    }

    return validation.data;
  }
);
