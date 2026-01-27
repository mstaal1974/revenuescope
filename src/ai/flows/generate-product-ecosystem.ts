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

**CRITICAL INSTRUCTIONS: Adhere to the specified data types and structures with extreme precision. Failure to do so will result in system failure.**

1.  **FLATTENED COURSE STRUCTURE:** For each course in the \`individual_courses\` array, you MUST provide the following fields directly. **DO NOT** create nested objects like \`content_blueprint\` or \`marketing_plan\`.
    *   \`learning_outcomes\`: An array of strings.
    *   \`module_outline_markdown\`: A single markdown string detailing the course modules.
    *   \`b2b_pitch_script\`: A string.
    *   \`badge_name\`: A string.
    *   \`badge_skills\`: An array of strings (previously called rich_skill_descriptors).
    *   \`ad_headline\`: A string.
    *   \`ad_body_copy\`: A string.
    *   \`ad_cta_button\`: A string.

2.  **CURRENCY FORMAT:** All monetary values (\`total_market_size\`, \`conservative_capture\`, \`suggested_price\`, \`total_value\`, \`bundle_price\`) **MUST** be formatted as **strings** with a currency symbol (e.g., "$12,500 AUD"). They **MUST NOT** be numbers. The \`badges_issued\` field in the bundle, however, should be a number.

3.  **CITATIONS FORMAT:** The \`citations\` field **MUST** be an array of simple **strings**. Example: \`["ABS Labour Force Survey", "Seek.com.au Market Insights"]\`.

**TASK: Detailed Product Ecosystem Design**
-   **Theme & Justification:** Generate a \`strategic_theme\` and \`market_justification\` (strings).
-   **Revenue Opportunity:** Populate the \`revenue_opportunity\` object, following the currency string format.
-   **Course Stack:** Design at least one, and preferably three, stackable courses in the \`individual_courses\` array. For each course, you MUST provide every field specified in the flattened schema (Rule #1).
-   **Bundle:** Create the \`stackable_product\` bundle, ensuring prices are currency strings and \`badges_issued\` is a number.
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
