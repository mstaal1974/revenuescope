'use server';

/**
 * @fileOverview Analyzes an RTO's curriculum scope and identifies potential revenue opportunities.
 *
 * - analyzeCurriculumForRevenueOpportunities - A function that analyzes curriculum for revenue opportunities.
 * - AnalyzeCurriculumInput - The input type for the analyzeCurriculumForRevenueOpportunities function.
 * - AnalyzeCurriculumOutput - The return type for the analyzeCurriculumForRevenueOpportunities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCurriculumInputSchema = z.object({
  curriculumScope: z
    .string()
    .describe('The curriculum scope of the RTO to analyze.'),
});
export type AnalyzeCurriculumInput = z.infer<typeof AnalyzeCurriculumInputSchema>;

const AnalyzeCurriculumOutputSchema = z.object({
  revenueOpportunities: z
    .string()
    .describe(
      'A detailed analysis of potential revenue opportunities based on the provided curriculum scope, including market demand and skill gaps.'
    ),
});
export type AnalyzeCurriculumOutput = z.infer<typeof AnalyzeCurriculumOutputSchema>;

export async function analyzeCurriculumForRevenueOpportunities(
  input: AnalyzeCurriculumInput
): Promise<AnalyzeCurriculumOutput> {
  return analyzeCurriculumForRevenueOpportunitiesFlow(input);
}

const analyzeCurriculumPrompt = ai.definePrompt({
  name: 'analyzeCurriculumPrompt',
  input: {schema: AnalyzeCurriculumInputSchema},
  output: {schema: AnalyzeCurriculumOutputSchema},
  prompt: `You are an expert in analyzing RTO curriculum scopes to identify potential revenue opportunities.
  Based on the following curriculum scope, identify and describe potential revenue opportunities, taking into account market demand and skill gaps.

  Curriculum Scope: {{{curriculumScope}}}
  `,
});

const analyzeCurriculumForRevenueOpportunitiesFlow = ai.defineFlow(
  {
    name: 'analyzeCurriculumForRevenueOpportunitiesFlow',
    inputSchema: AnalyzeCurriculumInputSchema,
    outputSchema: AnalyzeCurriculumOutputSchema,
  },
  async input => {
    const {output} = await analyzeCurriculumPrompt(input);
    return output!;
  }
);
