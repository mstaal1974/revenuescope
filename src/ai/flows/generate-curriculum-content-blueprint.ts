'use server';
/**
 * @fileOverview Generates a curriculum content blueprint including modules, sales kits, and badge previews.
 *
 * - generateCurriculumContentBlueprint - A function that generates the curriculum content blueprint.
 * - CurriculumContentBlueprintInput - The input type for the generateCurriculumContentBlueprint function.
 * - CurriculumContentBlueprintOutput - The return type for the generateCurriculumContentBlueprint function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CurriculumContentBlueprintInputSchema = z.object({
  courseTitle: z.string().describe('The title of the course.'),
  courseDescription: z.string().describe('A detailed description of the course content and objectives.'),
});
export type CurriculumContentBlueprintInput = z.infer<typeof CurriculumContentBlueprintInputSchema>;

const CurriculumContentBlueprintOutputSchema = z.object({
  modules: z.array(z.string()).describe('A list of modules to include in the course.'),
  salesKit: z.string().describe('A sales kit to use for selling the course.'),
  badgePreview: z.string().describe('A preview of the badge that students will earn upon completion of the course.'),
});
export type CurriculumContentBlueprintOutput = z.infer<typeof CurriculumContentBlueprintOutputSchema>;

export async function generateCurriculumContentBlueprint(
  input: CurriculumContentBlueprintInput
): Promise<CurriculumContentBlueprintOutput> {
  return generateCurriculumContentBlueprintFlow(input);
}

const prompt = ai.definePrompt({
  name: 'curriculumContentBlueprintPrompt',
  input: {schema: CurriculumContentBlueprintInputSchema},
  output: {schema: CurriculumContentBlueprintOutputSchema},
  prompt: `You are an expert curriculum designer. Please generate a content blueprint for the following course, including modules, a sales kit, and a badge preview.

Course Title: {{{courseTitle}}}
Course Description: {{{courseDescription}}}

Modules: A list of modules to include in the course.
Sales Kit: A sales kit to use for selling the course.
Badge Preview: A preview of the badge that students will earn upon completion of the course.`,
});

const generateCurriculumContentBlueprintFlow = ai.defineFlow(
  {
    name: 'generateCurriculumContentBlueprintFlow',
    inputSchema: CurriculumContentBlueprintInputSchema,
    outputSchema: CurriculumContentBlueprintOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
