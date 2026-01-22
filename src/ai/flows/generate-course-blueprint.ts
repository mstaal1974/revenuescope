'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating a micro-credential product ecosystem.
 * It functions as a "Curriculum Strategist" to design structured learning pathways from an RTO's scope.
 *
 * - generateCourseBlueprint - A function that orchestrates the product ecosystem generation.
 * - CourseBlueprintInput - The input type for the generateCourseBlueprint function.
 * - CourseBlueprintOutput - The return type for the generateCourseBlueprint function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CourseBlueprintInputSchema = z.object({
  rtoId: z.string().describe("The ID of the RTO to analyze."),
  scope: z.string().describe("The RTO's full scope, e.g., [CPC50220, CPC40120, BSB50420]."),
  absApiKey: z.string().optional().describe("An optional API key for the Australian Bureau of Statistics."),
  targetSector: z.string().optional().describe("An optional target sector to focus the analysis on."),
});
export type CourseBlueprintInput = z.infer<typeof CourseBlueprintInputSchema>;

const CourseBlueprintOutputSchema = z.object({
  rto_id: z.string(),
  strategic_theme: z.string().describe("A single, high-value theme, e.g., 'Site Safety Leadership'"),
  market_justification: z.string().describe("A brief summary of why this theme is valuable, e.g., 'Safety roles are growing at 8% YoY'"),
  
  individual_courses: z.array(z.object({
      tier: z.string().describe("e.g. 'Level 1: Foundation'"),
      course_title: z.string(),
      duration: z.string().describe("e.g. '4 Hours'"),
      suggested_price: z.string().describe("e.g. '$195'"),
      target_student: z.string().describe("e.g. 'Entry-level staff'"),
      key_skill: z.string().describe("The primary ESCO skill taught")
  })).length(3),
  
  stackable_product: z.object({
    bundle_title: z.string().describe("e.g. 'Executive Certificate in Site Safety'"),
    total_value: z.string().describe("The sum of individual course prices, e.g., '$1095'"),
    bundle_price: z.string().describe("The discounted price, e.g., '$930'"),
    discount_applied: z.string().describe("The percentage discount, e.g., '15%'"),
    marketing_pitch: z.string().describe("A compelling pitch for the bundle, e.g., 'Save 15% and go from novice to leader.'"),
    badges_issued: z.number().describe("The number of badges issued for completing the full stack (3 courses + 1 master).")
  })
});
export type CourseBlueprintOutput = z.infer<typeof CourseBlueprintOutputSchema>;

export async function generateCourseBlueprint(
  input: CourseBlueprintInput
): Promise<CourseBlueprintOutput> {
  return generateCourseBlueprintFlow(input);
}

const prompt = ai.definePrompt({
  name: 'courseBlueprintPrompt',
  input: { schema: z.object({ scope: z.string(), rtoId: z.string() }) },
  output: { schema: CourseBlueprintOutputSchema },
  prompt: `You are the "Curriculum Strategist," an AI expert in designing profitable, non-accredited training products. Your task is to analyze an RTO's scope and build a structured "Zero-to-Hero" product stack. You do not suggest full qualifications.

**LOGIC FLOW:**

**1. Theme Selection:**
*   You will be given an RTO's scope. From this, identify and select ONE single, high-value "Strategic Theme" that is currently relevant in the Australian market (e.g., "Construction Safety Leadership," "Digital Transformation for SMEs," "Aged Care Compliance"). This theme will guide the entire product ecosystem.
*   Provide a concise \`market_justification\` for your chosen theme, simulating a lookup to ABS data for a growth statistic (e.g., "Digital marketing roles are projected to grow by 9% YoY.").

**2. 3-Tier Product Design:**
*   Based on your selected theme, design exactly three distinct, stackable short courses, representing a clear progression from foundational knowledge to strategic mastery.
*   **Tier 1 (Foundation):**
    *   **Focus:** Awareness.
    *   **Title:** A welcoming, low-friction title.
    *   **Duration:** Short (e.g., '4 Hours').
    *   **Price:** Low-cost entry point (e.g., '$195').
    *   **Target:** Entry-level staff or newcomers.
    *   **Skill:** A single, fundamental ESCO skill.
*   **Tier 2 (Practitioner):**
    *   **Focus:** Application & "Doing."
    *   **Title:** A more technical, action-oriented title.
    *   **Duration:** Mid-level (e.g., '12 Hours' or '1 Day').
    *   **Price:** Mid-range (e.g., '$350').
    *   **Target:** Team leads, supervisors, or experienced practitioners.
    *   **Skill:** A specific, in-demand technical ESCO skill.
*   **Tier 3 (Strategic):**
    *   **Focus:** Management & Leadership.
    *   **Title:** An executive-level title.
    *   **Duration:** High-commitment (e.g., '2 Days').
    *   **Price:** Premium (e.g., '$550').
    *   **Target:** Managers, directors, or business owners.
    *   **Skill:** A strategic or management-focused ESCO skill.

**3. The Stackable Bundle:**
*   Combine the three tiers into a single "Master Micro-Credential" or "Executive Certificate."
*   Give this bundle a prestigious title (e.g., "Executive Certificate in Construction Safety Management").
*   **Pricing Calculation (CRITICAL):**
    *   Calculate \`total_value\` by summing the prices of the three individual courses.
    *   Calculate the \`bundle_price\` by applying a 15% discount to the \`total_value\`.
    *   Set \`discount_applied\` to "15%".
*   Set \`badges_issued\` to 4 (one for each individual course, plus one for the final master bundle).
*   Write a compelling \`marketing_pitch\` for the bundle.

**INPUT DATA:**
*   RTO ID: {{{rtoId}}}
*   RTO Scope: {{{scope}}}

**OUTPUT INSTRUCTIONS:**
*   Strictly adhere to the JSON output schema.
*   The \`individual_courses\` array must contain exactly three objects, one for each tier.
*   Ensure all fields, especially for the \`stackable_product\`, are fully populated with realistic, commercially-focused content.

Begin analysis.`,
});

const generateCourseBlueprintFlow = ai.defineFlow(
  {
    name: 'generateCourseBlueprintFlow',
    inputSchema: CourseBlueprintInputSchema,
    outputSchema: CourseBlueprintOutputSchema,
  },
  async (input) => {
    const { output } = await prompt({ scope: input.scope, rtoId: input.rtoId });
    if (!output) {
      throw new Error("AI failed to generate a course blueprint.");
    }
    // The prompt is asked to populate the rto_id, but we'll ensure it's correct here.
    output.rto_id = input.rtoId;
    return output;
  }
);
