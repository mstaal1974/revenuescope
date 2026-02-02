'use server';
/**
 * @fileOverview This file defines the third stage of the audit, designing a detailed product ecosystem using a 3-Tier Revenue Staircase model.
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
  const result = await generateProductEcosystemFlow(input);
  return result;
}

const prompt = ai.definePrompt({
    name: 'revenueStaircasePrompt',
    input: { schema: RevenueStaircaseInputSchema },
    // The 'output' schema is removed to prevent the nesting depth error.
    // We will parse the JSON from the text response manually.
    model: auditModel,
    prompt: `{
    "SYSTEM_INSTRUCTION": {
      "ROLE": "You are the Chief Commercial Officer for a top-tier RTO and a Workforce Architect. You are an expert in 'Value-Based Pricing', 'Stackable Microcredentials', and 'Revenue Velocity'.",
      "TASK": "Analyze the provided skills heatmap and RTO scope to design a full product ecosystem. You will create a 3-Tier Revenue Staircase of concrete products AND a 'Commercial Growth Engine' that details the financial yield and automation pathway.",
      "TIER_RULES": {
        "TIER_1": {
          "Goal": "Acquisition (Lead Magnet)",
          "Price_Range": "$47 - $97",
          "Product_Type": "Non-Accredited / Theory / Awareness / Tool-Based",
          "Constraint": "Must be online, automated, and solve an immediate 'Monday Morning' pain point based on high-demand skills from the heatmap."
        },
        "TIER_2": {
          "Goal": "Cash Flow (The Core)",
          "Price_Range": "$450 - $850",
          "Product_Type": "Accredited Skill Set / License / High-Demand Unit",
          "Constraint": "Must be the specific technical skill employers are hiring for right now, derived from a 'Hero' skill cluster."
        },
        "TIER_3": {
          "Goal": "Lifetime Value (The Upsell)",
          "Price_Range": "$1,500 - $4,500",
          "Product_Type": "Full Qualification / Career Pathway",
          "Constraint": "Positioned as the 'Expert' outcome for graduates of Tier 2, combining multiple skill clusters."
        }
      },
      "MARKETING_GENERATION_RULES": {
        "Tier 1 (Impulse)": "Channel must be Social Media. Headline must be 'Pattern Interrupt' (e.g., 'Stop scrolling...')",
        "Tier 2 (Intent)": "Channel must be Search/Job Sites. Headline must be 'Outcome Driven' (e.g., 'Get the Job...')",
        "Tier 3 (Trust)": "Channel must be Email/SMS. Headline must be 'Career Growth'."
      },
      "YIELD_STACKING_&_AUTOMATION_PATHWAY_RULES": {
        "TASK": "You must design the 'cluster_pathways' array. This represents the automated student journey, showing both the financial yield at each step ('Yield Stacking') and the marketing automation that moves them to the next step ('Automation Pathway').",
        "RULES": {
          "MAPPING": "The 'cluster_pathways' array must have exactly 3 steps, one for each Tier you have designed.",
          "STEP_1": {
            "current_stage": "Use the 'title' from the generated Tier 1 product.",
            "stage_revenue": "Use the 'price' from the generated Tier 1 product.",
            "automation_action": "Create an action to upsell to Tier 2. Set delay to 'On Completion'. 'message_hook' should be an enticing email subject line. 'upsell_product' must be the title of the Tier 2 product."
          },
          "STEP_2": {
            "current_stage": "Use the 'title' from the generated Tier 2 product.",
            "stage_revenue": "Use the 'price' from the generated Tier 2 product.",
            "automation_action": "Create an action to upsell to Tier 3. Set delay to '7 Days Post-Completion'. 'message_hook' should focus on career mastery. 'upsell_product' must be the title of the Tier 3 product."
          },
          "STEP_3": {
            "current_stage": "Use the 'title' from the generated Tier 3 product.",
            "stage_revenue": "Use the 'price' from the generated Tier 3 product.",
            "automation_action": "This is the final stage. Set this to null."
          }
        }
      },
      "OUTPUT_FORMAT": "Strict Raw JSON Only. No preamble or markdown.",
      "JSON_STRUCTURE": {
        "strategy_summary": "A 1-sentence hook for the entire strategy.",
        "tiers": [
          {
            "tier_level": 1,
            "title": "string - The marketable title of the Tier 1 product.",
            "format": "string - e.g., 'Online, Self-paced'",
            "price": "number - e.g., 97",
            "commercial_leverage": {
              "cac_offset": "string - e.g., 'Pays for 100% of Ads'",
              "volume_potential": "string - e.g., '50x wider audience than Diploma'",
              "trust_velocity": "string - e.g., 'Impulse Buy (<5 mins)'"
            },
            "marketing_hook": "string - A short marketing hook, e.g., 'The 1-hour workshop to...'",
            "marketing_playbook": {
              "target_audience": "string - e.g., 'Frustrated Retail Workers looking for stable hours'",
              "pain_point": "string - e.g., 'Tired of weekend shifts?'",
              "channel": "string - e.g., 'Facebook/Instagram Ads'",
              "ad_creative_visual": "string - e.g., 'Close up of hands holding a pipette, clean blue lighting, high trust'",
              "ad_headline": "string - A punchy 5-word hook for the ad",
              "ad_body_copy": "string - 2 sentences of ad copy expanding on the hook",
              "hashtags": "string - e.g., '#CareerChange #Pathology'",
              "email_subject": "string - The subject line to sell this product"
            }
          },
          { "tier_level": 2, "...": "Follow the same structure as Tier 1, but for a Tier 2 product." },
          { "tier_level": 3, "...": "Follow the same structure as Tier 1, but for a Tier 3 product." }
        ],
        "cluster_pathways": [
          {
            "current_stage": "Tier 1 Product Title",
            "stage_revenue": 97,
            "automation_action": {
              "delay": "On Completion",
              "message_hook": "Your next step to a $100k career...",
              "upsell_product": "Tier 2 Product Title"
            }
          },
          {
            "current_stage": "Tier 2 Product Title",
            "stage_revenue": 850,
            "automation_action": {
              "delay": "7 Days Post-Completion",
              "message_hook": "Become a team leader with our Diploma...",
              "upsell_product": "Tier 3 Product Title"
            }
          },
          {
            "current_stage": "Tier 3 Product Title",
            "stage_revenue": 4500,
            "automation_action": null
          }
        ]
      }
    }
  }

Given the RTO's full scope data and the AI-generated skills heatmap, generate the 3-Tier Revenue Staircase and the Commercial Growth Engine pathway.

**INPUT DATA:**
*   RTO ID: {{{rtoId}}}
*   RTO Scope & ANZSCO Data: {{{manualScopeDataset}}}
*   Top Performing Sector: {{{top_performing_sector}}}
*   Skills Heatmap: {{{skills_heatmap}}}
`
});


const generateProductEcosystemFlow = ai.defineFlow(
  {
    name: 'generateRevenueStaircaseFlow',
    inputSchema: RevenueStaircaseInputSchema,
    outputSchema: RevenueStaircaseSchema,
  },
  async (input) => {
    // Call the prompt and get the raw text response
    const response = await prompt(input);
    const textOutput = response.text;

    if (!textOutput) {
      throw new Error("AI returned no text output for Revenue Staircase generation.");
    }
    
    try {
        // Clean the response to ensure it's valid JSON before parsing
        const startIndex = textOutput.indexOf('{');
        const endIndex = textOutput.lastIndexOf('}') + 1;
        const jsonString = textOutput.substring(startIndex, endIndex);

        const parsedJson = JSON.parse(jsonString);
        // Validate the parsed JSON against our Zod schema
        return RevenueStaircaseSchema.parse(parsedJson);
    } catch (e) {
        console.error("Failed to parse JSON from AI response:", textOutput);
        const errorMessage = e instanceof Error ? e.message : JSON.stringify(e, null, 2);
        throw new Error(`AI returned malformed JSON for Revenue Staircase generation: ${errorMessage}`);
    }
  }
);
