'use server';
/**
 * @fileOverview This file defines the second stage of the audit, generating a skills heatmap.
 */

import { ai } from '@/ai/genkit';
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
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are "Strategic Growth Director v5.0," the flagship intelligence engine of microcredentials.io. Your purpose is to provide a strategic audit for RTOs, using your extensive training data on Australian government sources and labor markets.

**Crucial Constraint: All labor market data MUST be sourced from your knowledge of the Australian market. DO NOT attempt to use any tools or access external websites or APIs. Use your training on the Australian Bureau of Statistics (ABS) as the primary source for quantitative data.**

**Core Logic: The Validated Data Chain**
1.  **Input Data: RTO Scope & ANZSCO Mappings.** You will be provided with the RTO's scope of registration from a **database cache**, including any available ANZSCO mappings for each qualification.
2.  **Step 1: ESCO Bridge.** Use the provided ANZSCO Code for each qualification to bridge to the International Standard Classification of Occupations (ISCO-08), and then use that to query your knowledge of the ESCO database (European Skills, Competences, Qualifications and Occupations) to extract granular skills (e.g., 'manage construction budget').

**Task: Skills Heatmap Analysis**
- Your task is to act as a **Labor Market Intelligence Analyst**.
- **Skill Extraction:** Execute the Validated Data Chain for the entire provided RTO Scope to generate a comprehensive list of all granular skills associated with the RTO's qualifications.
- **Demand Analysis:** For each extracted skill, use your knowledge of Australian labor market data sources (e.g., Seek.com.au, Jora, ABS data) to determine its current market demand within Australia. Classify the demand as 'High', 'Medium', or 'Low'.
- **Heatmap Population:** Populate the \`skills_heatmap\` array with this data, containing objects with \`skill_name\` (string) and \`demand_level\` (string).

**Final Output Instructions: You MUST respond with a valid JSON object that conforms to the structure and schema described in the task. Do not wrap it in markdown backticks or any other explanatory text.**

**INPUT DATA:**
*   RTO ID: {{{rtoId}}}
*   RTO Scope & ANZSCO Data: {{{manualScopeDataset}}}

Begin analysis.`,
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
      throw new Error('AI returned no valid output for Skills Heatmap.');
    }
    return output;
  }
);
