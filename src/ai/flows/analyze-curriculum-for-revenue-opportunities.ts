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
  strategicTheme: z
    .string()
    .describe(
      'A specific, high-growth "Workforce Theme" (e.g., "Sustainable Energy Leadership for Mining Operations") that is currently trending in the Australian labor market, derived from the RTO\'s scope.'
    ),
  marketJustification: z
    .string()
    .describe(
      'An explanation for why this theme was chosen, citing simulated market data (e.g., "ABS data shows a 14% increase in specialized safety roles...").'
    ),
  totalAddressableMarket: z
    .string()
    .describe(
      'A large dollar or headcount figure representing the "Total Addressable Market" in Australia for this specific theme.'
    ),
  acquisitionModelLowEnd: z
    .string()
    .describe(
      'The calculated revenue the RTO could generate by capturing a small percentage (e.g., 2%) of the total addressable market.'
    ),
  acquisitionModelHighEnd: z
    .string()
    .describe(
      'The calculated revenue the RTO could generate by capturing a moderate percentage (e.g., 10%) of the total addressable market.'
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
  prompt: `You are an expert Product Manager for a high-growth consultancy specializing in the Australian VET sector. Your task is to analyze an RTO's curriculum and devise a premium, high-ticket "Strategic Product Theme".

  **INSTRUCTIONS:**
  1.  **Analyze Scope:** Review the provided RTO curriculum scope.
  2.  **Simulate Market Research:** Pretend to perform a search for current, high-demand Australian workforce shortages and growth sectors that align with the RTO's scope.
  3.  **Synthesize Strategic Theme:** Based on your analysis, create a compelling "Strategic Product Theme". This theme should transform a generic qualification into a specialized, in-demand product. For example, if the scope is 'Construction and Safety', and the market trend is 'Renewable Energy Infrastructure', the theme could be "High-Voltage Safety Architecture for Renewable Infrastructure."
  4.  **Justify the Theme:** Write a "Market Justification" explaining why this theme is commercially viable, referencing your simulated market research (e.g., "ABS data indicates...", "The National Skills Commission projects...").
  5.  **Estimate Market Size:** Provide a "Total Addressable Market" (TAM) as a large dollar or headcount figure.
  6.  **Calculate Acquisition Model:** Calculate the potential revenue for capturing a small (2-4%) and moderate (8-10%) share of this market. Present these as strings (e.g., "$2.5M Annually").
  7.  **Standard Analysis:** Also provide the standard analysis of other potential revenue opportunities.

  **RTO Curriculum Scope:**
  {{{curriculumScope}}}
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
