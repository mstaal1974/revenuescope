'use server';
/**
 * @fileOverview This file defines the second stage of the audit, generating a skills heatmap.
 * It uses the "Validated Data Chain" logic to bridge qualifications to live demand.
 */

import { ai, auditModel } from '@/ai/genkit';
import { FullAuditInputSchema, SkillsHeatmapOutputSchema, type FullAuditInput, type SkillsHeatmapOutput } from '@/ai/types';

export async function generateSkillsHeatmap(
  input: FullAuditInput
): Promise<SkillsHeatmapOutput> {
  const result = await generateSkillsHeatmapFlow(input);
  return result;
}

const prompt = ai.definePrompt({
  name: 'skillsHeatmapPrompt',
  input: { schema: FullAuditInputSchema },
  output: { schema: SkillsHeatmapOutputSchema },
  model: auditModel,
  prompt: `You are "Strategic Growth Director v5.0," powered by Gemini 2.5 Pro. Your purpose is to provide a high-fidelity Scope Demand Heatmap for Australian RTOs.

**CRITICAL: VALIDATED DATA CHAIN LOGIC**
1.  **Input:** Use the provided RTO Scope & ANZSCO Mappings.
2.  **ESCO Bridge:** Map the ANZSCO Code for each qualification to the International Standard Classification of Occupations (ISCO-08), then extract granular skills from your knowledge of the ESCO database.
3.  **Demand Validation:** Validate these skills against current Australian labor market data (ABS, Seek, Jora).
4.  **Categorization:** Classify every unit into "High Demand" or "Medium Demand" based on live job vacancy volume.

**Task:**
Generate a comprehensive list of granular skills associated with the RTO's qualifications. For each skill, determine its current market demand within Australia.

**EXAMPLE JSON OUTPUT:**
{
  "skills_heatmap": [
    {
      "skill_name": "Project Scope Management",
      "demand_level": "High"
    },
    {
      "skill_name": "Clinical Laboratory Procedures",
      "demand_level": "High"
    },
    {
      "skill_name": "WHS Compliance Audit",
      "demand_level": "Medium"
    }
  ]
}

**Final Output Instructions:** Respond with a single raw JSON object. Do not include markdown backticks.

**INPUT DATA:**
*   RTO ID: {{{rtoId}}}
*   RTO Scope & ANZSCO Data: {{{manualScopeDataset}}}

Begin analysis using Gemini 2.5 Pro architecture.`,
});

const generateSkillsHeatmapFlow = ai.defineFlow(
  {
    name: 'generateSkillsHeatmapFlow',
    inputSchema: FullAuditInputSchema,
    outputSchema: SkillsHeatmapOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error(
        'AI returned no structured output for Skills Heatmap generation.'
      );
    }
    return output;
  }
);
