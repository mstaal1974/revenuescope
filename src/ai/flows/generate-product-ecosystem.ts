'use server';
/**
 * @fileOverview This file defines the third stage of the audit, designing a detailed product ecosystem.
 */

import { ai } from '@/ai/genkit';
import { 
    ProductEcosystemInputSchema,
    ProductEcosystemOutputSchema,
    type ProductEcosystemInput, 
    type ProductEcosystemOutput 
} from '@/ai/types';
import { extractJson } from '../utils/json';

export async function generateProductEcosystem(
  input: ProductEcosystemInput
): Promise<ProductEcosystemOutput> {
  const result = await generateProductEcosystemFlow(input);
  return result;
}

const prompt = ai.definePrompt({
  name: 'productEcosystemPrompt',
  input: { schema: ProductEcosystemInputSchema },
  model: 'googleai/gemini-1.5-flash-latest',
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
- **3-Tier Design:** Design a "Zero-to-Hero" stack of three distinct, stackable short courses in the \`individual_courses\` array. For each course, provide all fields as a nested JSON object. **The \`content_blueprint\` and \`marketing_plan\` fields MUST be valid JSON objects, NOT strings.**
- **The Stackable Bundle:** Combine the three tiers into a \`stackable_product\` bundle object with a 15% discount, populating all fields including \`bundle_title\`, \`total_value\`, \`bundle_price\`, \`discount_applied\`, \`marketing_pitch\`, and \`badges_issued\` (number).
- **Citations:** Provide simulated \`citations\` based on your training data.

**Final Output Instructions: You MUST respond with ONLY the raw, fully-nested JSON object as a text string. Do not wrap it in markdown backticks or any other explanatory text.**

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
  },
  async (input): Promise<ProductEcosystemOutput> => {
    const response = await prompt(input);
    const rawJsonText = response.text;

    if (!rawJsonText || typeof rawJsonText !== 'string') {
      throw new Error(
        `generate-product-ecosystem: AI returned no text content. Full response: ${JSON.stringify(response)}`
      );
    }

    let parsedJson: unknown;
    try {
      parsedJson = extractJson(rawJsonText);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      console.error(`generate-product-ecosystem: Failed to parse JSON from AI response. Error: ${errorMessage}. Raw text: "${rawJsonText}"`);
      throw new Error(`AI returned malformed JSON for Product Ecosystem. Raw text: "${rawJsonText}"`);
    }
    
    const validation = ProductEcosystemOutputSchema.safeParse(parsedJson);

    if (!validation.success) {
      const validationErrors = JSON.stringify(validation.error.flatten());
      console.error("generate-product-ecosystem: AI response failed Zod validation:", validationErrors);
      throw new Error(`The AI's response for the Product Ecosystem did not match the required data structure. Validation issues: ${validationErrors}`);
    }

    return validation.data;
  }
);
