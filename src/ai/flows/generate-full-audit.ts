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
  output: { schema: FullAuditOutputSchema },
  prompt: `You are "Strategic Growth Director v5.0," the flagship intelligence engine of microcredentials.io. Your purpose is to provide a two-part strategic audit for RTOs.

**Part 1: High-Level Sector Analysis (The Macro View)**
- Your first task is to act as a **Strategic Growth Director**.
- **Scope Extraction:** Analyze the provided RTO Scope.
- **Sector Grouping:** Group qualifications by Training Package (e.g., CPC -> Construction, BSB -> Business).
- **ABS Data Aggregation:** For each sector, simulate a query to ABS Labour Force data to determine: Total Employment Volume, Average Wage, and Growth Trend. Mark as "Growing" if any occupation in the group has >5% growth.
- **Revenue Calculation:** Calculate the \`sector_revenue_gap\` using the formula: (Total Employment Volume * 0.05 upskilling rate) * (Avg Course Price $450). Use a 2% rate for saturated sectors (Business) and 8% for high-demand sectors (Care/Tech).
- **Executive Summary:** Synthesize your findings into an \`executive_summary\` with \`total_revenue_opportunity\`, \`top_performing_sector\`, and \`strategic_advice\`.
- **Sector Breakdown:** Populate the \`sector_breakdown\` array with detailed analysis for each identified sector.

**Part 2: Detailed Product Ecosystem Design (The Micro View)**
- Based on the \`top_performing_sector\` you identified in Part 1, you will now act as a **Micro-Stack Architect**.
- **Theme Selection:** The \`strategic_theme\` will be based on the top sector (e.g., if Construction is the top sector, the theme could be "Construction Site Safety Leadership").
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

const searchForRtoScopeFlow = ai.defineFlow(
    {
      name: "searchForRtoScopeFlow",
      inputSchema: z.object({ rtoId: z.string() }),
      outputSchema: z.object({ scope: z.string(), name: z.string() }),
    },
    async ({ rtoId }) => {
      // In a real scenario, this would fetch from TGA. For now, we simulate.
      // This simulation provides a diverse scope to allow for a rich analysis.
      const simulatedScopes: Record<string, {name: string, scope: string[]}> = {
          "90003": { name: "Builder's College Australia", scope: ["CPC50220", "CPC40120", "BSB50420", "BSB30120", "ICT50220", "CHC33015"] },
          "default": { name: "General Training Institute", scope: ["BSB50420", "BSB30120", "ICT50220", "HLT54115", "SIT50416"] }
      };
      const rtoData = simulatedScopes[rtoId] || simulatedScopes["default"];
      return {
          name: rtoData.name,
          scope: `Current scope for ${rtoData.name}:\n- ${rtoData.scope.join("\n- ")}`
      };
    }
);


const generateFullAuditFlow = ai.defineFlow(
  {
    name: 'generateFullAuditFlow',
    inputSchema: FullAuditInputSchema,
    outputSchema: FullAuditOutputSchema,
  },
  async (input) => {
    // First, get the RTO's scope.
    const { scope } = await searchForRtoScopeFlow({ rtoId: input.rtoId });

    // Then, run the main audit prompt.
    const { output } = await prompt({ scope, rtoId: input.rtoId });
    if (!output) {
      throw new Error("AI failed to generate a full audit.");
    }
    
    // Ensure the RTO ID is correctly passed through.
    output.rto_id = input.rtoId;
    return output;
  }
);
