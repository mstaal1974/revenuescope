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
  prompt: `You are "Strategic Growth Director v5.0," an AI designed to generate a detailed product ecosystem for an RTO. You MUST output a single, valid JSON object and nothing else.

**CRITICAL INSTRUCTION: Adhere to the specified data types and structures with extreme precision. Failure to do so will result in system failure.**

1.  **CURRENCY FORMAT:** All fields that represent a monetary value (e.g., \`total_market_size\`, \`conservative_capture\`, \`suggested_price\`, \`total_value\`, \`bundle_price\`) **MUST** be formatted as **strings**, including a currency symbol (e.g., "$12,500 AUD"). They **MUST NOT** be numbers.

2.  **NESTED OBJECTS:** The \`individual_courses\` array MUST contain exactly three objects. Within each course object, the following fields are themselves **nested JSON objects** and must be fully populated:
    *   \`content_blueprint\`: Must be a JSON object with \`learning_outcomes\` (array of strings) and \`modules\` (array of objects).
    *   \`sales_kit\`: Must be a JSON object with \`ideal_buyer_persona\` and \`b2b_pitch_script\` (both strings).
    *   \`badge_preview\`: Must be a JSON object with all its string and array-of-string fields.
    *   \`marketing_plan\`: Must be a JSON object containing the \`ad_creatives\` nested object.

3.  **CITATIONS FORMAT:** The \`citations\` field **MUST** be an array of simple **strings**. Example: \`["ABS Labour Force Survey", "Seek.com.au Market Insights"]\`. It **MUST NOT** be an array of objects.

**TASK: Detailed Product Ecosystem Design**
-   **Theme:** Generate a \`strategic_theme\` (string) based on the \`top_performing_sector\`.
-   **Justification:** Populate \`market_justification\` (string).
-   **Revenue Opportunity:** Populate the \`revenue_opportunity\` object, strictly following the currency string format rule.
-   **Course Stack:** Design three stackable courses in the \`individual_courses\` array. For each course, you MUST provide every field specified in the schema, paying meticulous attention to the nested object rule (Rule #2).
-   **Bundle:** Create the \`stackable_product\` bundle, ensuring \`total_value\` and \`bundle_price\` are currency strings.
-   **Citations:** Provide \`citations\` as an array of strings (Rule #3).

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
