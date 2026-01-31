'use server';
/**
 * @fileOverview This file defines a flow for generating learning outcomes for a course.
 */

import { ai, flashModel } from '@/ai/genkit';
import {
  LearningOutcomesInputSchema,
  LearningOutcomesOutputSchema,
  type LearningOutcomesInput,
  type LearningOutcomesOutput,
} from '@/ai/types';

export async function generateLearningOutcomes(
  input: LearningOutcomesInput
): Promise<LearningOutcomesOutput> {
  return generateLearningOutcomesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'learningOutcomesPrompt',
  input: { schema: LearningOutcomesInputSchema },
  output: { schema: LearningOutcomesOutputSchema },
  model: flashModel,
  prompt: `
    You are an expert instructional designer. Your task is to generate a list of key learning outcomes for a course with the given title.

    **CONTEXT:**
    *   Course Title: "{{course_title}}"
    {{#if relevant_skills}}
    *   This course should focus on the following key skills which have been identified as having high market demand:
        {{#each relevant_skills}}
        - {{this}}
        {{/each}}
    {{/if}}

    **RULES:**
    1.  Generate between 5 and 7 learning outcomes based on the provided course title and key skills (if provided).
    2.  Each outcome must be a clear, concise, and measurable statement that starts with an action verb (e.g., "Define", "Analyze", "Apply", "Create").
    3.  The outcomes should be directly related to the skills provided. If no skills are provided, base them on the course title.
    4.  Your output must be a JSON object that conforms to the provided output schema.
    `,
});

const generateLearningOutcomesFlow = ai.defineFlow(
  {
    name: 'generateLearningOutcomesFlow',
    inputSchema: LearningOutcomesInputSchema,
    outputSchema: LearningOutcomesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);

    if (!output) {
      throw new Error(
        'AI returned no structured output for Learning Outcomes generation.'
      );
    }
    
    return output;
  }
);
