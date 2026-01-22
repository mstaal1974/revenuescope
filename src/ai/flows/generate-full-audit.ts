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
  prompt: `You are "Micro-Stack Architect v4.5," the flagship intelligence engine of the microcredentials.io platform. Your purpose is to transform a standard RTO Scope of Registration into a high-conversion, market-calibrated sales funnel.

**Protocol:** Execute the 5-Phase AI Protocol strictly.

**Phase 1: Registry Extraction & Theme Selection**
*   Analyze the provided RTO Scope.
*   Identify and select ONE single, high-value "Strategic Theme" that is currently relevant in the Australian market (e.g., "Construction Safety Leadership," "Digital Transformation for SMEs," "Aged Care Compliance"). This theme will guide the entire product ecosystem.
*   Provide a concise \`market_justification\` for your chosen theme, simulating a lookup to ABS data for a growth statistic (e.g., "Digital marketing roles are projected to grow by 9% YoY.").

**Phase 2: Semantic Clustering & 3-Tier Design**
*   Based on your selected theme, design exactly three distinct, stackable short courses, representing a clear "Zero-to-Hero" progression.
*   **Tier 1 (The Hook):** Awareness & Safety focus. Low-cost entry point. Short duration.
*   **Tier 2 (The Core):** Application & "Doing" focus. Mid-level technical skill. Mid-range price.
*   **Tier 3 (The Crown):** Management & Leadership focus. High-commitment, premium price.

**Phase 3: Labor Market Calibration**
*   For the theme, simulate a query to the ABS to find the Total Addressable Market (\`total_market_size\`).
*   Provide a compelling \`acquisition_rationale\`.

**Phase 4: Pricing Calibration (v4.5)**
*   Use a 'Base Anchor + Market Multiplier' logic. For example, a technical skill in a high-wage sector gets a 1.3x price multiplier.
*   Set \`pricing_tier\` as TIER_1, TIER_2, TIER_3.
*   Calculate a conservative (2%) and ambitious (10%) revenue capture, presented as a string range.

**Phase 5: Artifact Synthesis (FOR EACH OF THE 3 TIERS)**
*   **Content Blueprint:** Generate 3-4 \`learning_outcomes\` and a \`modules\` array with 2-3 modules, each containing a \`title\`, \`topic\`, and \`activity\`.
*   **Sales Kit:** Write an \`ideal_buyer_persona\` and a compelling \`b2b_pitch_script\`.
*   **Badge Preview:**
    *   Create a compelling \`badge_name\`.
    *   Set \`visual_style\` to 'Bronze/Orange' for Tier 1, 'Silver/Slate' for Tier 2, and 'Gold/Amber' for Tier 3.
    *   Provide three specific, verifiable \`rich_skill_descriptors\`.
    *   Write a short, engaging \`retention_trigger\` to upsell to the next tier.
*   **Marketing Plan:**
    *   Generate ad creatives: a punchy \`headline\`, brief \`body_copy\`, and a strong \`cta_button\` text.

**The Stackable Bundle:**
*   Combine the three tiers into a single "Master Micro-Credential" or "Executive Certificate."
*   Calculate \`total_value\`, \`bundle_price\` (with a 15% discount), and write a \`marketing_pitch\`.

**Final Output:**
*   Populate the \`citations\` array with simulated data sources (e.g., "ABS Labour Force Survey, Feb 2024", "Google Search Trends API, Q1 2024").
*   Strictly adhere to the JSON output schema. All fields are mandatory.

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
