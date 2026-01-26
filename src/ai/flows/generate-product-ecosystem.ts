'use server';
/**
 * @fileOverview This file defines the third stage of the audit, designing a detailed product ecosystem.
 */

import { ai } from '@/ai/genkit';
import { 
    ProductEcosystemInputSchema,
    ProductEcosystemOutputSchema,
    ProductEcosystemForAISchema,
    type ProductEcosystemInput, 
    type ProductEcosystemOutput 
} from '@/ai/types';

export async function generateProductEcosystem(
  input: ProductEcosystemInput
): Promise<ProductEcosystemOutput> {
  const result = await generateProductEcosystemFlow(input);
  return result;
}

const prompt = ai.definePrompt({
  name: 'productEcosystemPrompt',
  input: { schema: ProductEcosystemInputSchema },
  output: { schema: ProductEcosystemForAISchema },
  prompt: `You are "Strategic Growth Director v5.0," the flagship intelligence engine of microcredentials.io. Your purpose is to design a detailed product ecosystem for an RTO.

**Crucial Constraint: All labor market data, including employment volumes, wages, trends, and skill demand, MUST be sourced from your knowledge of the Australian market. DO NOT attempt to use any tools or access external websites or APIs. Use your training on the Australian Bureau of Statistics (ABS) as the primary source for quantitative data.**

**Task: Detailed Product Ecosystem Design (The Micro View)**
- Based on the \`top_performing_sector\` and the provided list of skills, you will act as a **Micro-Stack Architect**.
- **Theme Selection:** The \`strategic_theme\` (string) will be based on the top sector where high-demand skills are present (e.g., if Construction is the top sector, the theme could be "Construction Site Safety Leadership").
- **Justification:** Populate the \`market_justification\` (string) field.
- **Revenue Opportunity:** Populate the \`revenue_opportunity\` object with:
    - \`total_market_size\`: (string)
    - \`conservative_capture\`: (string)
    - \`ambitious_capture\`: (string)
    - \`acquisition_rationale\`: (string)
- **3-Tier Design:** Design a "Zero-to-Hero" stack of three distinct, stackable short courses in the \`individual_courses\` array. For each course, provide all fields. For the \`content_blueprint\` and \`marketing_plan\` fields, you MUST provide a valid, minified JSON string.
- **The Stackable Bundle:** Combine the three tiers into a \`stackable_product\` bundle object with a 15% discount, populating all fields including \`bundle_title\`, \`total_value\`, \`bundle_price\`, \`discount_applied\`, \`marketing_pitch\`, and \`badges_issued\` (number).

**Final Output:**
- Populate ALL fields in the combined JSON output schema. All fields are mandatory.
- Provide simulated \`citations\` based on your training data.

**INPUT DATA:**
*   RTO ID: {{{rtoId}}}
*   RTO Scope & ANZSCO Data: {{{manualScopeDataset}}}
*   Top Performing Sector: {{{top_performing_sector}}}
*   Identified Skills: 
    {{#each skills_heatmap}}
    - Skill: {{this.skill_name}}, Demand: {{this.demand_level}}
    {{/each}}


Begin analysis.`,
});

const generateProductEcosystemFlow = ai.defineFlow(
  {
    name: 'generateProductEcosystemFlow',
    inputSchema: ProductEcosystemInputSchema,
    outputSchema: ProductEcosystemOutputSchema,
  },
  async (input): Promise<ProductEcosystemOutput> => {
    const { output } = await prompt(input);

    if (!output) {
      throw new Error("AI failed to generate a product ecosystem (empty structured response).");
    }
    
    // Parse the stringified JSON fields
    try {
        for (const course of output.individual_courses) {
            if (typeof course.content_blueprint === 'string') {
                (course as any).content_blueprint = JSON.parse(course.content_blueprint);
            }
            if (typeof course.marketing_plan === 'string') {
                (course as any).marketing_plan = JSON.parse(course.marketing_plan);
            }
        }
    } catch (e) {
        console.error("Failed to parse JSON string from AI output in product ecosystem:", e);
        throw new Error("AI returned malformed JSON for a nested field in product ecosystem.");
    }
    
    const validation = ProductEcosystemOutputSchema.safeParse(output);
    if (!validation.success) {
      console.error("Product ecosystem output failed Zod validation after parsing:", validation.error.flatten());
      console.error("Invalid data received from AI after parsing:", output);
      throw new Error("The AI's product ecosystem response did not match the required data structure after parsing.");
    }

    return validation.data;
  }
);
