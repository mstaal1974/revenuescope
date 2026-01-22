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
import { searchForRtoScope } from './search-for-rto-scope';

export async function generateFullAudit(
  input: FullAuditInput
): Promise<FullAuditOutput> {
  return generateFullAuditFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fullAuditPrompt',
  input: { schema: z.object({ rtoId: z.string(), scope: z.string() }) },
  output: { schema: FullAuditOutputSchema },
  prompt: `You are "Strategic Growth Director v5.0," the flagship intelligence engine of microcredentials.io. Your purpose is to provide a three-part strategic audit for RTOs.

**Core Logic: The Validated Data Chain**
You MUST follow this precise data validation chain to ensure the strategic advice is grounded in verifiable data sources:
1.  **Qualification (from TGA RTO Scope)** -> **ANZSCO Occupation Code** (Australian and New Zealand Standard Classification of Occupations)
2.  **ANZSCO Code** -> **ISCO-08 Bridge** (International Standard Classification of Occupations) -> **ESCO Occupation & Skills API** (European Skills, Competences, Qualifications and Occupations) for granular skills (e.g., 'manage construction budget').
3.  **ANZSCO Code** -> **ABS SDMX Query** (Australian Bureau of Statistics) for macro data like 'Total Employment Volume' and 'Average Wage'.

This data chain is non-negotiable. It bridges Australian compliance (TGA/ANZSCO) with global skill standards (ESCO) and local market reality (ABS). All analysis must stem from this validated pathway.

**Part 1: Skills Heatmap Analysis (The Foundation)**
- Your first task is to act as a **Labor Market Intelligence Analyst**.
- **Skill Extraction:** Using the provided RTO Scope, follow the Validated Data Chain to generate a comprehensive list of all granular skills associated with the RTO's qualifications.
- **Demand Analysis:** For each extracted skill, simulate a query to labor market data (e.g., online job postings, ABS data) to determine its current market demand. Classify the demand as 'High', 'Medium', or 'Low'.
- **Heatmap Population:** Populate the \`skills_heatmap\` array with this data. This forms the foundational evidence for all subsequent strategic recommendations.

**Part 2: High-Level Sector Analysis (The Macro View)**
- Your second task is to act as a **Strategic Growth Director**.
- **Scope Extraction:** Analyze the provided RTO Scope.
- **Sector Grouping:** Group qualifications by Training Package (e.g., CPC -> Construction, BSB -> Business).
- **ABS Data Aggregation:** For each sector, simulate a query to ABS Labour Force data to determine: Total Employment Volume, Average Wage, and Growth Trend. Mark as "Growing" if any occupation in the group has >5% growth.
- **Revenue Calculation:** Calculate the \`sector_revenue_gap\` using the formula: (Total Employment Volume * 0.05 upskilling rate) * (Avg Course Price $450). Use a 2% rate for saturated sectors (Business) and 8% for high-demand sectors (Care/Tech).
- **Executive Summary:** Synthesize your findings into an \`executive_summary\` with \`total_revenue_opportunity\`, \`top_performing_sector\`, and \`strategic_advice\`.
- **Sector Breakdown:** Populate the \`sector_breakdown\` array with detailed analysis for each identified sector.

**Part 3: Detailed Product Ecosystem Design (The Micro View)**
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
- Provide simulated \`citations\`.

**INPUT DATA:**
*   RTO ID: {{{rtoId}}}
*   RTO Scope: {{{scope}}}

Begin analysis.`,
});

const generateFullAuditFlow = ai.defineFlow(
  {
    name: 'generateFullAuditFlow',
    inputSchema: FullAuditInputSchema,
    outputSchema: FullAuditOutputSchema,
  },
  async (input) => {
    // First, get the RTO's scope using the real flow.
    const { scope, name } = await searchForRtoScope({ rtoId: input.rtoId });
    const scopeString = `Current scope for ${name}:\n- ${scope.map(item => `${item.Code} ${item.Name}`).join("\n- ")}`;

    // Then, run the main audit prompt.
    const { output } = await prompt({ scope: scopeString, rtoId: input.rtoId });
    if (!output) {
      throw new Error("AI failed to generate a full audit.");
    }
    
    // Ensure the RTO ID is correctly passed through.
    output.rto_id = input.rtoId;
    return output;
  }
);
