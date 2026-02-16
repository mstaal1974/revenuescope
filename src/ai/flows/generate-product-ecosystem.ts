'use server';
/**
 * @fileOverview This file defines the third stage of the audit, designing a detailed product ecosystem using a 3-Tier Revenue Staircase model.
 * Standardized to Gemini 2.5 Pro.
 */

import { ai, auditModel } from '@/ai/genkit';
import { 
    RevenueStaircaseInputSchema,
    RevenueStaircaseSchema,
    type RevenueStaircaseInput, 
    type RevenueStaircaseOutput 
} from '@/ai/types';

export async function generateProductEcosystem(
  input: RevenueStaircaseInput
): Promise<RevenueStaircaseOutput> {
  return generateProductEcosystemFlow(input);
}

const prompt = ai.definePrompt({
    name: 'revenueStaircasePrompt',
    input: { schema: RevenueStaircaseInputSchema },
    output: { schema: RevenueStaircaseSchema },
    model: auditModel,
    prompt: `
      You are the Chief Commercial Officer for a top-tier RTO and a Workforce Architect.
      
      TASK:
      Analyze the provided skills heatmap and RTO scope to design a full product ecosystem. 
      You will create a 3-Tier Revenue Staircase of concrete products AND a 'Commercial Growth Engine' 
      that details the financial yield and automation pathway.
      
      TIER 1 (Acquisition): Non-Accredited, Tool-Based ($47-$97).
      TIER 2 (Cash Flow): Accredited Skill Set/Unit ($450-$850).
      TIER 3 (LTV): Full Qualification Pathway ($1,500-$4,500).
      
      INPUT DATA:
      - RTO ID: {{rtoId}}
      - Scope: {{manualScopeDataset}}
      - Top Sector: {{top_performing_sector}}
      - Skills Heatmap: {{#each skills_heatmap}}{{skill_name}} ({{demand_level}}), {{/each}}
      
      REQUIRED OUTPUT LOGIC:
      1. strategy_summary: A 1-sentence hook for the strategy.
      2. tiers: Generate exactly 3 tiers following the price rules.
      3. cluster_pathways: Exactly 3 steps showing the upsell flow.
      
      Ensure accuracy regarding Australian VET standards.
    `,
});

const generateProductEcosystemFlow = ai.defineFlow(
  {
    name: 'generateRevenueStaircaseFlow',
    inputSchema: RevenueStaircaseInputSchema,
    outputSchema: RevenueStaircaseSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("AI returned no structured output for Revenue Staircase generation.");
    }
    return output;
  }
);
