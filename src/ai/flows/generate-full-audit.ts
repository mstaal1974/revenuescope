'use server';
/**
 * @fileOverview This file defines the master Genkit flow for generating a full strategic audit for an RTO.
 * It combines a high-level sector analysis with a detailed micro-credential product ecosystem design.
 *
 * - generateFullAudit - The main function that orchestrates the entire audit process.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
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
  prompt: `You are a master "EdTech Strategist" AI. Your task is to perform a two-part analysis for a given RTO. First, you will act as a Strategic Growth Director for a macro analysis. Second, you will act as a Curriculum Strategist for a micro product design.

**RTO ID:** {{{rtoId}}}
**RTO SCOPE:** {{{scope}}}

**PART 1: SECTOR-LEVEL ANALYSIS (Strategic Growth Director)**

1.  **Sector Grouping:** Group the provided RTO scope qualifications by their training package code (e.g., CPC, BSB). Map these to broad industry sectors (e.g., 'CPC' -> "Construction & Infrastructure").
2.  **Market Data Aggregation (Simulated):** For each sector, simulate a query to the Australian Bureau of Statistics (ABS) to determine Market Health (demand, trend, wage) and Financial Opportunity (revenue gap, student volume).
3.  **Executive Summary & Actions:** Synthesize findings into a high-level \`executive_summary\` and provide high-level \`recommended_actions\` for each sector.

**PART 2: PRODUCT ECOSYSTEM DESIGN (Curriculum Strategist)**

1.  **Theme Selection:** Use the \`top_performing_sector\` from Part 1 to choose a single, high-value **"Strategic Theme"** for a product ecosystem.
2.  **3-Tier Product Design:** Design exactly three distinct, stackable short courses representing a "Zero-to-Hero" progression (Foundation, Practitioner, Strategic).
3.  **The Stackable Bundle:** Combine the three tiers into a "Master Micro-Credential." Calculate total value, apply a 15% discount for the \`bundle_price\`, and write a marketing pitch.

**OUTPUT INSTRUCTIONS:**
*   Strictly adhere to the JSON output schema.
*   Ensure all fields are fully populated with realistic, commercially-focused content.
*   The output must be a single JSON object containing both the sector analysis and the product ecosystem.

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
