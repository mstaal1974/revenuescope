'use server';
/**
 * @fileOverview Generates a high-level sector analysis for an RTO.
 *
 * - generateSectorAnalysis - A function that orchestrates the analysis process.
 * - SectorAnalysisInput - The input type for the generateSectorAnalysis function.
 * - SectorAnalysisOutput - The return type for the generateSectorAnalysis function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SectorAnalysisInputSchema = z.object({
  scope: z.string().describe("The RTO's full scope, e.g., [CPC50220, CPC40120, BSB50420]."),
});
export type SectorAnalysisInput = z.infer<typeof SectorAnalysisInputSchema>;

const SectorAnalysisOutputSchema = z.object({
  executive_summary: z.object({
    total_revenue_opportunity: z.string().describe("Sum of all sectors, e.g., '$2.4M'"),
    top_performing_sector: z.string().describe("e.g., 'Construction'"),
    strategic_advice: z.string().describe("1 sentence summary, e.g., 'Pivot resources to Construction due to 12% labour shortage.'"),
  }),
  sector_breakdown: z.array(z.object({
    sector_name: z.string().describe("e.g., 'Construction & Infrastructure'"),
    qualification_count: z.number().int(),
    market_health: z.object({
      demand_level: z.string().describe("High/Med/Low"),
      trend_direction: z.string().describe("Growing/Stable/Declining"),
      avg_industry_wage: z.string().describe("e.g., '$1,850/wk'"),
    }),
    financial_opportunity: z.object({
      annual_revenue_gap: z.string().describe("e.g., '$1,200,000'"),
      student_volume_potential: z.number().int(),
    }),
    key_skills_in_demand: z.array(z.string()).describe("A list of specific, in-demand skills derived from ESCO, e.g., ['monitor construction progress', 'manage construction budget']"),
    recommended_actions: z.array(z.string()).describe("A list of commercially viable short courses or micro-credentials to develop, e.g., ['Short Course: Construction Budgeting Essentials', 'Micro-credential: Site Safety Supervision']"),
  })),
});
export type SectorAnalysisOutput = z.infer<typeof SectorAnalysisOutputSchema>;

export async function generateSectorAnalysis(input: SectorAnalysisInput): Promise<SectorAnalysisOutput> {
  return generateSectorAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sectorAnalysisPrompt',
  input: { schema: SectorAnalysisInputSchema },
  output: { schema: SectorAnalysisOutputSchema },
  prompt: `You are the "Strategic Growth Director" for a leading EdTech platform. Your role is to analyze an RTO's scope and produce a High-Level Sector Analysis that highlights their biggest revenue opportunities by industry group, backed by a validated data chain.

**VALIDATED DATA CHAIN (LOGIC):**
Qualification -> TGA -> ANZSCO -> ISCO-08 -> ESCO -> Detailed Skills -> ABS (SDMX)

**LOGIC PROCESS (AGGREGATION ENGINE):**

1.  **Input Scope:** You will receive the RTO's full scope. Example: [CPC50220, CPC40120, BSB50420].

2.  **Sector Grouping (The Grouper):**
    *   Group qualifications by their Training Package Code (the first 3 letters).
    *   Use this mapping:
        *   \`CPC\` -> "Construction & Infrastructure"
        *   \`BSB\` -> "Business & Leadership"
        *   \`ICT\` -> "Digital & Technology"
        *   \`HLT\`/\`CHC\` -> "Health & Community Services"
        *   Any others, use a reasonable industry name.

3.  **Skill & Market Analysis (Per Sector):**
    For each sector, perform the following simulation:
    a.  **Qualification to ANZSCO:** Identify the primary ANZSCO occupation codes linked to the qualifications in this sector. (e.g., CPC50220 Diploma of Building and Construction -> 133111 Construction Project Manager).
    b.  **ANZSCO to ISCO-08 (The Bridge):** Map the Australian ANZSCO code to the global ISCO-08 standard. (e.g., ANZSCO 133111 -> ISCO-08 1323 'Construction managers').
    c.  **ISCO-08 to ESCO Skills:** Simulate a query to the ESCO API using the ISCO code to get a list of granular, job-specific skills. (e.g., From 'Construction managers', extract skills like "monitor construction progress", "manage construction budget"). Aggregate the top 3-5 most relevant skills for the sector and place them in the \`key_skills_in_demand\` array.
    d.  **ABS Data Aggregation (using ANZSCO):**
        *   Simulate using the ANZSCO codes as keys to query ABS data.
        *   **Total Employment Volume:** Estimate the sum of all employed persons in these linked occupations in Australia.
        *   **Average Wage:** Estimate the average weekly earnings for these occupations.
        *   **Growth Trend:** If *any* occupation in the group has >5% projected growth, mark the whole sector as "Growing". Otherwise, mark as "Stable" or "Declining".
        *   **Demand Level**: Based on the growth and employment volume, classify demand as High, Med, or Low.

4.  **Revenue Calculation (The Opportunity):**
    *   Define a base "Avg Course Price" of $450.
    *   Define a base "Upskilling Rate" of 5% (0.05).
    *   **Constraint:** Adjust the "Upskilling Rate" based on the sector. Cap it at 2% for saturated sectors (like Business) and use up to 8% for high-demand sectors (like Health/Care or Tech).
    *   Calculate \`annual_revenue_gap\` = (Total Employment Volume * adjusted upskilling rate) * (Avg Course Price $450).
    *   Calculate \`student_volume_potential\` = (Total Employment Volume * adjusted upskilling rate).

5.  **Synthesize Output:**
    *   Compile all sector breakdowns, including the \`key_skills_in_demand\`.
    *   Based on the \`key_skills_in_demand\`, generate a list of commercially viable, non-accredited short courses or micro-credentials for the \`recommended_actions\` array. These should be practical, skill-focused training products that the RTO can develop and sell quickly.
    *   Create the executive summary by summing total revenue, identifying the top sector, and providing a concise, actionable strategic recommendation.

**RTO Scope to Analyze:**
{{{scope}}}

Produce the full JSON output based on this logic.
`,
});

const generateSectorAnalysisFlow = ai.defineFlow(
  {
    name: 'generateSectorAnalysisFlow',
    inputSchema: SectorAnalysisInputSchema,
    outputSchema: SectorAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
