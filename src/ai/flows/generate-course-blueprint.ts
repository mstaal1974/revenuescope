'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating a micro-credential product blueprint.
 * It analyzes an RTO's scope to identify and define profitable short courses.
 *
 * - generateCourseBlueprint - A function that orchestrates the blueprint generation process.
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
  analysis_summary: z.object({
    parent_qualification_used: z.string().describe("The high-potential qualification used as the basis for analysis."),
    market_context: z.string().describe("A summary of why this market is attractive, e.g., 'Managers are in high demand (4.2% growth), driving need for upskilling.'"),
  }),
  suggested_short_courses: z.array(z.object({
    course_title: z.string().describe("A punchy, commercial title for the short course."),
    target_audience: z.string().describe("The ideal student for this course, e.g., 'Newly promoted supervisors'"),
    duration: z.string().describe("The estimated time to complete the course, e.g., '12 Hours'"),
    suggested_price: z.string().describe("The recommended price point, e.g., '$295'"),
    revenue_potential: z.string().describe("An estimated revenue calculation based on market size and capture rate."),
    skill_demand_trend: z.object({
        growth_percentage: z.string().describe("e.g., '+12%'"),
        narrative: z.string().describe("e.g., 'Outpacing general Construction jobs'"),
    }).describe("The year-on-year demand growth for the skills in this course."),
    included_skills: z.array(z.object({
      skill_name: z.string().describe("The specific skill taught, derived from ESCO."),
      esco_uri: z.string().describe("A simulated URI for the skill in the ESCO database."),
      learning_outcome: z.string().describe("What the student will be able to do after learning this skill."),
    })),
    marketing_hook: z.string().describe("A compelling one-sentence sales pitch for the course."),
  })),
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
  prompt: `You are the "Micro-Credential Product Architect," an AI expert in educational product design. Your mission is to analyze an RTO's scope and design highly profitable, non-accredited Short Courses. You do not suggest full qualifications.

**LOGIC CHAIN:**

**1. Scope Analysis (The Anchor):**
*   You will be given an RTO's scope.
*   From the scope, select ONE high-potential Qualification to serve as the "anchor" for your analysis (e.g., "Diploma of Leadership").
*   This anchor qualification is used for authority and context, not for direct sale.

**2. Skill Extraction (The Deconstruction):**
*   Map the anchor qualification to its primary ANZSCO Occupation.
*   Simulate a lookup to the ESCO database for this occupation to extract 10 granular, job-specific "Essential Skills" (e.g., 'Conflict resolution', 'Staff rostering', 'Budget variance analysis').

**3. Product Generation (The Clustering):**
*   Synthesize 3-5 distinct Short Courses by clustering the 10 extracted skills.
*   **Rule:** Each course must be "Job-Ready" and designed to be completed in under 20 hours.
*   **Naming:** Use punchy, commercial titles (e.g., "Mastering Team Conflict," not "Unit BSB...").

**4. Market Validation (Simulated ABS Data):**
*   Use the ANZSCO code to simulate a query to ABS Labour Force data.
*   **Logic:** Assume high demand if the parent occupation has >50k employed persons in Australia. Use this to formulate the 'market_context'.
*   **NEW: Skill Demand Trend:** For each suggested course, simulate a more granular data query. Find a YoY growth percentage for the *specific skills* within it. This should often be higher than the general occupation's growth. Formulate a narrative, e.g., "Outpacing general construction jobs." Populate the \`skill_demand_trend\` object.

**5. Pricing & Revenue Strategy:**
*   Set a price for each course between $150 - $450.
*   **Premium Logic:** Price technical skills (IT, Construction) at the higher end (~$450) and soft skills (Communication, Leadership) at the lower end (~$195-$295).
*   Calculate \`revenue_potential\` = (Total Employment Volume * 1% Market Capture) * Suggested Price. Format this as a string, e.g., "$1.1M Potential".

**INPUT DATA:**
*   RTO ID: {{{rtoId}}}
*   RTO Scope: {{{scope}}}

**OUTPUT INSTRUCTIONS:**
*   Strictly adhere to the JSON output schema.
*   The \`parent_qualification_used\` must come from the provided scope.
*   Ensure all fields are populated with realistic, commercially-focused content.
*   Generate 3 to 5 suggested short courses.

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
