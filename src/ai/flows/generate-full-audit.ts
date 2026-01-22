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
  prompt: `You are a master "EdTech Strategist" AI combining two roles: a "Strategic Growth Director" for macro analysis, and a "Micro-Stack Architect" for micro product design.

**RTO ID:** {{{rtoId}}}
**RTO SCOPE:** {{{scope}}}

---
**PART 1: SECTOR-LEVEL ANALYSIS (Strategic Growth Director Persona)**
---
1.  **Sector Grouping:** Group the provided RTO scope qualifications by their training package code (e.g., CPC, BSB). Map these to broad industry sectors (e.g., 'CPC' -> "Construction & Infrastructure").
2.  **Market Data Aggregation (Simulated):** For each sector, simulate a query to the Australian Bureau of Statistics (ABS) to determine Market Health (demand, trend, wage) and Financial Opportunity (revenue gap, student volume).
3.  **Revenue Calculation:** Use the formula: (Total Employment Volume * Upskilling Rate) * (Avg Course Price $450). Apply a 2% upskilling rate for saturated markets (e.g., Business) and up to 8% for high-demand ones (e.g., Care/Tech).
4.  **Executive Summary & Actions:** Synthesize findings into a high-level 'executive_summary' and provide tangible 'recommended_actions' for each sector.

---
**PART 2: PRODUCT ECOSYSTEM DESIGN (Micro-Stack Architect Persona)**
---
1.  **Theme Selection:** Use the 'top_performing_sector' from Part 1 to choose a single, high-value **"Strategic Theme"** for a product ecosystem (e.g., "High-Voltage Safety Architecture for Renewable Infrastructure").
2.  **3-Tier Product Design "Staircase":**
    *   **Tier 1 (The Hook):** A low-friction, high-volume awareness/safety course. Low price point.
    *   **Tier 2 (The Core):** A mid-tier course for technical mastery. Mid price point.
    *   **Tier 3 (The Crown):** A high-margin, strategic leadership course. Premium price point.
3.  **Pricing Calibration:** Use a 'Base Anchor + Market Multiplier' logic. For example, a technical skill in a high-wage sector gets a 1.3x price multiplier.
4.  **The "Stack" Bundle:**
    *   Combine Tiers 1, 2, & 3 into a "Master Micro-Credential."
    *   Calculate 'total_value' (sum of individual prices).
    *   Apply a 15% "Bundle Discount" to set the 'bundle_price'.
    *   Populate a compelling 'marketing_pitch' and set 'badges_issued'.
5.  **Student ROI & RTO Revenue:** For each course, add a 'career_roi' field with a short sentence about the career benefit for the student, and a 'revenue_potential' field to estimate the annual revenue for the RTO from this course.

**OUTPUT INSTRUCTIONS:**
*   Strictly adhere to the JSON output schema. All fields are mandatory.
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
