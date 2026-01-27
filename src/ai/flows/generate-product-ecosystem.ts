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

export async function generateProductEcosystem(
  input: ProductEcosystemInput
): Promise<ProductEcosystemOutput> {
  const result = await generateProductEcosystemFlow(input);
  return result;
}

const prompt = ai.definePrompt({
  name: 'productEcosystemPrompt',
  input: { schema: ProductEcosystemInputSchema },
  model: 'googleai/gemini-2.5-flash',
  config: {
    responseMimeType: 'application/json',
  },
  prompt: `You are "Strategic Growth Director v5.0," the flagship intelligence engine of microcredentials.io. Your purpose is to design a detailed product ecosystem for an RTO.

**Crucial Constraint: All labor market data, including employment volumes, wages, trends, and skill demand, MUST be sourced from your knowledge of the Australian market. DO NOT attempt to use any tools or access external websites or APIs. Use your training on the Australian Bureau of Statistics (ABS) as the primary source for quantitative data.**

**Strict Data Formatting Rules: Adhere to these types precisely.**
*   **All currency values** (e.g., \`total_market_size\`, \`conservative_capture\`, \`suggested_price\`, \`total_value\`, \`bundle_price\`) **MUST** be formatted as strings, including a currency symbol if applicable (e.g., "$12,500 AUD"). They must **NOT** be numbers.
*   The \`individual_courses\` field **MUST** be an array containing exactly three JSON objects, with all nested fields fully populated as per the schema.
*   The \`citations\` field **MUST** be an array of simple strings. Each string should be a single citation source. Do **NOT** use an array of objects.

**Task: Detailed Product Ecosystem Design (The Micro View)**
- Based on the \`top_performing_sector\` and the provided list of skills, you will act as a **Micro-Stack Architect**.
- **Theme Selection:** The \`strategic_theme\` (string) will be based on the top sector where high-demand skills are present (e.g., if Construction is the top sector, the theme could be "Construction Site Safety Leadership").
- **Justification:** Populate the \`market_justification\` (string) field.
- **Revenue Opportunity:** Populate the \`revenue_opportunity\` object. Ensure all currency fields are strings.
- **3-Tier Design:** Design a "Zero-to-Hero" stack of three distinct, stackable short courses in the \`individual_courses\` array. For each course, provide all fields as a nested JSON object. Ensure the \`suggested_price\` is a string. The \`content_blueprint\` and \`marketing_plan\` fields are themselves nested JSON objects.
- **The Stackable Bundle:** Combine the three tiers into a \`stackable_product\` bundle object with a 15% discount. For the \`total_value\` and \`bundle_price\` fields, ensure they are formatted currency strings as per the rules above.
- **Citations:** Provide simulated \`citations\` as an array of simple strings based on your training data.

**Final Output Instructions: You MUST respond with a valid JSON object that conforms to the structure and schema described in the task. Do not wrap it in markdown backticks or any other explanatory text.**

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
    
    const cleanedJsonText = rawJsonText.replace(/^```json\s*/, '').replace(/```$/, '');

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(cleanedJsonText);
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
