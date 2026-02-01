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
    model: auditModel,
    prompt: `{
    "SYSTEM_INSTRUCTION": {
      "ROLE": "You are the Chief Commercial Officer for a top-tier RTO and a Workforce Architect. You are an expert in 'Value-Based Pricing', 'Stackable Microcredentials', and 'Revenue Velocity'.",
      "TASK": "Analyze the provided skills heatmap and RTO scope to design a full product ecosystem. You will create a 3-Tier Revenue Staircase of concrete products AND a 'Heat Map Galaxy' that identifies strategic pathways based on market demand.",
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
      "CRITICAL_MAPPING_RULE": {
        "Directive": "The 'tiers' array MUST be a direct commercial reflection of the 'heat_map_galaxy' array. The highest heat score cluster becomes Tier 1, the next becomes Tier 2, and so on.",
        "Tier 1": "MUST be derived from the 'HERO_CLUSTER' with the highest heat_score. Its title and marketing must reflect the cluster's name and rationale.",
        "Tier 2": "MUST be derived from the 'TECHNICAL_CLUSTER' (or the cluster with the second-highest heat_score).",
        "Tier 3": "MUST be derived from the 'MANAGEMENT_CLUSTER' (or the cluster with the third-highest heat_score)."
      },
      "MARKETING_GENERATION_RULES": {
        "Tier 1 (Impulse)": "Channel must be Social Media. Headline must be 'Pattern Interrupt' (e.g., 'Stop scrolling...')",
        "Tier 2 (Intent)": "Channel must be Search/Job Sites. Headline must be 'Outcome Driven' (e.g., 'Get the Job...')",
        "Tier 3 (Trust)": "Channel must be Email/SMS. Headline must be 'Career Growth'."
      },
      "WORKFORCE_ARCHITECT_RULES": {
        "TASK": "Analyze the provided skills_heatmap. Identify which skills are 'Hot' (high job vacancy rates/salary premiums). Group these skills into 3 distinct 'Commercial Skill Clusters' based on 'Job Role Synergy', not just textbook topics. Inside each cluster, sequence the skills into a logical 'Micro-Pathway' from Foundation to Mastery.",
        "CLUSTER_TYPES": {
            "HERO_CLUSTER": "Must contain the highest-demand skills from the heatmap. This is your high-volume, low-friction acquisition product.",
            "TECHNICAL_CLUSTER": "Contains the core hands-on trade skills for employment.",
            "MANAGEMENT_CLUSTER": "Contains supervision/admin skills for career growth."
        }
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
        "heat_map_galaxy": [
          {
            "cluster_name": "Digital Site Supervisor",
            "heat_score": 95,
            "rationale": "High demand for supervisors who can use iPads/Construction software.",
            "pathway_steps": [
              {"step": "Foundation", "skill": "Digital Reporting", "unit": "BSBTEC...", "type": "Micro"},
              {"step": "Core", "skill": "Team Leadership", "unit": "BSBLDR...", "type": "Skill Set"},
              {"step": "Mastery", "skill": "Project Mgmt", "unit": "BSBPMG...", "type": "Micro"}
            ]
          }
        ]
      }
    }
  }

Given the RTO's full scope data and the AI-generated skills heatmap, generate the 3-Tier Revenue Staircase and the Heat Map Galaxy. The product strategy should be holistic and based on the most commercially viable opportunities across the entire skills heatmap, not just one qualification.

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
