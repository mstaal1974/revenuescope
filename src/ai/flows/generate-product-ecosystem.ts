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
  output: { schema: ProductEcosystemOutputSchema },
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are "Strategic Growth Director v5.0," an AI designed to generate a detailed product ecosystem for an RTO. You MUST output a single, valid JSON object and nothing else.

**THE LOGIC (THE REVENUE STAIRCASE):**
1.  **TIER 1 (The Hook):** Price: $19 - $99. Goal: Break-even acquisition. Product: Short, low-risk, online-only (e.g., Awareness, Theory).
2.  **TIER 2 (The Core):** Price: $99 - $250. Goal: Profit. Product: The standard license or skill set (e.g., Forklift, Excel Skills).
3.  **TIER 3 (The Authority):** Price: $250+ Goal: Margin & Prestige. Product: The full qualification or advanced boot camp.

**TASK: Detailed Product Ecosystem Design**
-   **Theme & Justification:** Generate a \`strategic_theme\` and \`market_justification\` (strings).
-   **Revenue Opportunity:** Populate the \`revenue_opportunity\` object.
-   **Course Stack:** Design at least one, and preferably three, stackable courses in the \`individual_courses\` array, following **THE REVENUE STAIRCASE** logic. The \`tier\` and \`suggested_price\` for each course must align with this model.
-   **Bundle:** Create the \`stackable_product\` bundle.
-   **Citations:** Provide \`citations\` as an array of URL strings.

**INPUT DATA:**
*   RTO ID: {{{rtoId}}}
*   RTO Scope & ANZSCO Data: {{{manualScopeDataset}}}
*   Top Performing Sector: {{{top_performing_sector}}}
*   Identified Skills: 
    {{#each skills_heatmap}}
    - Skill: {{this.skill_name}}, Demand: {{this.demand_level}}
    {{/each}}

**OUTPUT RULES:**
- Return ONLY valid JSON.
- Do not wrap in \`\`\` fences.
- Output must start with { and end with }.
- \`individual_courses\` MUST be an array of objects (not strings).
- \`module_outline_markdown\` MUST be a string.
- \`badges_issued\` MUST be a number.
- All monetary values (\`total_market_size\`, \`conservative_capture\`, \`suggested_price\`, \`total_value\`, \`bundle_price\`) **MUST** be formatted as **strings** with a currency symbol (e.g., "$12,500 AUD").
- \`citations\` MUST be an array of URL strings.

**EXAMPLE SHAPE (abbreviated):**
{
  "strategic_theme":"...",
  "market_justification":"...",
  "revenue_opportunity":{
    "total_market_size":"...",
    "conservative_capture":"...",
    "ambitious_capture":"...",
    "acquisition_rationale":"..."
  },
  "individual_courses":[
    {
      "tier":"Foundation",
      "course_title":"...",
      "duration":"...",
      "suggested_price":"...",
      "pricing_tier":"...",
      "target_student":"...",
      "learning_outcomes":["..."],
      "module_outline_markdown":"## Module 1\\n- Topic A\\n",
      "b2b_pitch_script":"...",
      "badge_name":"...",
      "badge_skills":["..."],
      "ad_headline":"...",
      "ad_body_copy":"...",
      "ad_cta_button":"..."
    }
  ],
  "stackable_product":{
    "bundle_title":"...",
    "total_value":"...",
    "bundle_price":"...",
    "discount_applied":"...",
    "marketing_pitch":"...",
    "badges_issued":5
  },
  "citations":["https://..."]
}

Begin analysis.`,
});

const generateProductEcosystemFlow = ai.defineFlow(
  {
    name: 'generateProductEcosystemFlow',
    inputSchema: ProductEcosystemInputSchema,
    outputSchema: ProductEcosystemOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('AI returned no valid output for Product Ecosystem.');
    }
    return output;
  }
);
