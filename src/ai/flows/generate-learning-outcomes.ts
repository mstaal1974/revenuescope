'use server';
/**
 * @fileOverview This file defines a flow for generating learning outcomes for a course.
 */

import { ai, auditModel } from '@/ai/genkit';
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
  model: auditModel,
  prompt: `
    You are an expert instructional designer. Your task is to generate a list of key learning outcomes for a course with the given title.

    **RULES:**
    1.  Generate between 5 and 7 learning outcomes.
    2.  Each outcome should be a clear, concise, and measurable statement that starts with an action verb (e.g., "Define", "Analyze", "Apply", "Create").
    3.  The outcomes should be appropriate for the implied audience of the course title.
    4.  Your output must be a JSON object that conforms to the provided output schema.

    **INPUT DATA:**
    *   Course Title: "{{course_title}}"
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
