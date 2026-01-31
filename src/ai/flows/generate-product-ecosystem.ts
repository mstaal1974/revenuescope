'use server';
/**
 * @fileOverview This file defines the third stage of the audit, designing a detailed product ecosystem using a 3-Tier Revenue Staircase model.
 */

import { ai, flashModel } from '@/ai/genkit';
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
    model: flashModel,
    prompt: `{
    "SYSTEM_INSTRUCTION": {
      "ROLE": "You are the Chief Commercial Officer for a top-tier RTO. You are an expert in 'Value-Based Pricing', 'Stackable Microcredentials', and 'Revenue Velocity'.",
      "TASK": "Unbundle the user's input Qualification into a 3-Tier Revenue Staircase AND a 'Skill Cluster' map. You must invent specific products and calculate their financial leverage.",
      "TIER_RULES": {
        "TIER_1": {
          "Goal": "Acquisition (Lead Magnet)",
          "Price_Range": "$47 - $97",
          "Product_Type": "Non-Accredited / Theory / Awareness / Tool-Based",
          "Constraint": "Must be online, automated, and solve an immediate 'Monday Morning' pain point."
        },
        "TIER_2": {
          "Goal": "Cash Flow (The Core)",
          "Price_Range": "$450 - $850",
          "Product_Type": "Accredited Skill Set / License / High-Demand Unit",
          "Constraint": "Must be the specific technical skill employers are hiring for right now."
        },
        "TIER_3": {
          "Goal": "Lifetime Value (The Upsell)",
          "Price_Range": "$1,500 - $4,500",
          "Product_Type": "Full Qualification / Career Pathway",
          "Constraint": "Positioned as the 'Expert' outcome for graduates of Tier 2."
        }
      },
      "MARKETING_GENERATION_RULES": {
        "Tier 1 (Impulse)": "Channel must be Social Media. Headline must be 'Pattern Interrupt' (e.g., 'Stop scrolling...').",
        "Tier 2 (Intent)": "Channel must be Search/Job Sites. Headline must be 'Outcome Driven' (e.g., 'Get the Job...').",
        "Tier 3 (Trust)": "Channel must be Email/SMS. Headline must be 'Career Growth'."
      },
      "SKILL_CLUSTER_RULES": {
        "TASK": "Analyze the units in this qualification and group them into 3 distinct 'Commercial Skill Clusters'. The 'Hero' Cluster should contain the highest-demand skills. The 'Technical' Cluster should contain core hands-on trade skills. The 'Management' Cluster should contain supervision/admin skills.",
        "LOGIC": "For each cluster, identify the marketable skill, not just the unit titles."
      },
      "OUTPUT_FORMAT": "Strict Raw JSON Only. No preamble or markdown.",
      "JSON_STRUCTURE": {
        "strategy_summary": "String (1 sentence hook)",
        "tiers": [
          {
            "tier_level": 1,
            "title": "String (The Marketing Name)",
            "format": "String (e.g. '2-Hour Video Masterclass')",
            "price": "Number",
            "commercial_leverage": {
              "cac_offset": "String (e.g. 'Pays for 100% of Ads')",
              "volume_potential": "String (e.g. '50x wider audience than Diploma')",
              "trust_velocity": "String (e.g. 'Impulse Buy (<5 mins)')"
            },
            "marketing_hook": "String (The ad headline)",
            "marketing_playbook": {
                "target_audience": "String (e.g. 'Frustrated Retail Workers looking for stable hours')",
                "pain_point": "String (e.g. 'Tired of weekend shifts?')",
                "channel": "String (e.g. 'Facebook/Instagram Ads' for Tier 1, 'LinkedIn/Seek' for Tier 2)",
                "ad_creative_visual": "String (e.g. 'Close up of hands holding a pipette, clean blue lighting, high trust')",
                "ad_headline": "String (e.g. 'Stop selling clothes. Start saving lives.')",
                "ad_body_copy": "String (2 sentences of ad copy expanding on the hook)",
                "hashtags": "String (e.g. '#CareerChange #Pathology')",
                "email_subject": "String (The subject line to sell this product)"
            }
          },
          {
            "tier_level": 2,
            "title": "String (The Skill Set Name)",
            "format": "String (e.g. '1-Day Intensive Workshop')",
            "price": "Number",
            "commercial_leverage": {
              "speed_to_revenue": "String (e.g. '7 Days vs 12 Months')",
              "employer_urgency": "String (e.g. 'Mandatory for Site Entry')",
              "margin_health": "String (e.g. 'High - Low Assessment Overhead')"
            },
            "marketing_hook": "String",
            "marketing_playbook": {
                "target_audience": "String (e.g. 'Frustrated Retail Workers looking for stable hours')",
                "pain_point": "String (e.g. 'Tired of weekend shifts?')",
                "channel": "String (e.g. 'Facebook/Instagram Ads' for Tier 1, 'LinkedIn/Seek' for Tier 2)",
                "ad_creative_visual": "String (e.g. 'Close up of hands holding a pipette, clean blue lighting, high trust')",
                "ad_headline": "String (e.g. 'Stop selling clothes. Start saving lives.')",
                "ad_body_copy": "String (2 sentences of ad copy expanding on the hook)",
                "hashtags": "String (e.g. '#CareerChange #Pathology')",
                "email_subject": "String (The subject line to sell this product)"
            }
          },
          {
            "tier_level": 3,
            "title": "String (The Full Qual Name)",
            "format": "String (e.g. 'Fast-Track Diploma')",
            "price": "Number",
            "commercial_leverage": {
              "conversion_probability": "String (e.g. 'High (Warm Leads from Tier 2)')",
              "marketing_cost": "String (e.g. '$0 - Internal Upsell')",
              "ltv_impact": "String (e.g. 'Doubles Customer Value')"
            },
            "marketing_hook": "String",
            "marketing_playbook": {
                "target_audience": "String (e.g. 'Frustrated Retail Workers looking for stable hours')",
                "pain_point": "String (e.g. 'Tired of weekend shifts?')",
                "channel": "String (e.g. 'Facebook/Instagram Ads' for Tier 1, 'LinkedIn/Seek' for Tier 2)",
                "ad_creative_visual": "String (e.g. 'Close up of hands holding a pipette, clean blue lighting, high trust')",
                "ad_headline": "String (e.g. 'Stop selling clothes. Start saving lives.')",
                "ad_body_copy": "String (2 sentences of ad copy expanding on the hook)",
                "hashtags": "String (e.g. '#CareerChange #Pathology')",
                "email_subject": "String (The subject line to sell this product)"
            }
          }
        ],
        "skill_clusters": [
          {
            "cluster_name": "Site Entry & Safety Ticket",
            "market_demand": "High (Top Seller)",
            "units_count": 3,
            "primary_skills": ["White Card", "PPE", "Hazard Mgmt"],
            "commercial_value": "Acquisition Tool (Low friction, high volume)"
          }
        ]
      }
    }
  }

Given the following RTO data, generate the 3-Tier Revenue Staircase and the Skill Pathway. Pick the most representative qualification from the RTO's scope in the top performing sector to unbundle and create the 3 tiers and pathway from.

**INPUT DATA:**
*   RTO ID: {{{rtoId}}}
*   RTO Scope & ANZSCO Data: {{{manualScopeDataset}}}
*   Top Performing Sector: {{{top_performing_sector}}}
`
});


const generateProductEcosystemFlow = ai.defineFlow(
  {
    name: 'generateRevenueStaircaseFlow',
    inputSchema: RevenueStaircaseInputSchema,
    // outputSchema: RevenueStaircaseSchema,
  },
  async (input) => {
    const response = await prompt(input);
    const rawText = response.text;

    if (!rawText) {
      throw new Error('AI returned no text output for Revenue Staircase generation.');
    }
    
    const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    let parsedJson: any;

    try {
        parsedJson = JSON.parse(cleanJson);
    } catch (e) {
        console.error("Failed to parse JSON from AI for Revenue Staircase:", e, "\nRaw text:", rawText);
        throw new Error("AI returned malformed JSON for Revenue Staircase generation.");
    }
    
    const validationResult = RevenueStaircaseSchema.safeParse(parsedJson);
    if (validationResult.success) {
      return validationResult.data;
    }
    
    console.error("AI output for Revenue Staircase failed validation.", validationResult.error);
    throw new Error(`AI output for Revenue Staircase failed validation: ${validationResult.error.message}`);
  }
);
