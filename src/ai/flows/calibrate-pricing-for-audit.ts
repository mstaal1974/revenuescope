'use server';
/**
 * @fileOverview This file defines a Genkit flow for calibrating the pricing of an audit service based on intensity tags and market multipliers.
 *
 * - calibratePricingForAudit - A function that orchestrates the pricing calibration process.
 * - CalibratePricingInput - The input type for the calibratePricingForAudit function.
 * - CalibratePricingOutput - The return type for the calibratePricingForAudit function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalibratePricingInputSchema = z.object({
  intensityTags: z
    .string()
    .describe(
      'A comma-separated list of intensity tags that describe the curriculum scope.'
    ),
  marketMultipliers: z
    .string()
    .describe(
      'A comma-separated list of market multipliers to adjust the base price.'
    ),
  basePrice: z.number().describe('The base price of the audit service.'),
});
export type CalibratePricingInput = z.infer<typeof CalibratePricingInputSchema>;

const CalibratePricingOutputSchema = z.object({
  calibratedPrice: z
    .number()
    .describe('The final calibrated price for the audit service.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the calibrated price calculation.'),
});
export type CalibratePricingOutput = z.infer<typeof CalibratePricingOutputSchema>;

export async function calibratePricingForAudit(
  input: CalibratePricingInput
): Promise<CalibratePricingOutput> {
  return calibratePricingForAuditFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calibratePricingPrompt',
  input: {schema: CalibratePricingInputSchema},
  output: {schema: CalibratePricingOutputSchema},
  prompt: `You are an expert pricing consultant specializing in audit services.

You will receive intensity tags, market multipliers, and a base price. Use a 3-step pricing calibration model to determine the final price.

1.  **Intensity Tag Adjustment:** Analyze the intensity tags and adjust the base price accordingly. More intense tags should increase the price.
2.  **Market Multiplier Application:** Apply the market multipliers to further refine the price based on market conditions.
3.  **Final Price Calculation:** Calculate the final calibrated price.

Intensity Tags: {{{intensityTags}}}
Market Multipliers: {{{marketMultipliers}}}
Base Price: {{{basePrice}}}

Return the final calibrated price and the reasoning behind the calculation.`,
});

const calibratePricingForAuditFlow = ai.defineFlow(
  {
    name: 'calibratePricingForAuditFlow',
    inputSchema: CalibratePricingInputSchema,
    outputSchema: CalibratePricingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
