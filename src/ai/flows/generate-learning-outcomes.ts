'use server';
/**
 * @fileOverview This file defines a flow for generating learning outcomes for a course.
 */

import { ai } from '@/ai/genkit';
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
  output: { format: 'json' },
  model: 'googleai/gemini-2.5-flash',
  prompt: `
    You are an expert instructional designer. Your task is to generate a list of key learning outcomes for a course with the given title.

    **RULES:**
    1.  Generate between 5 and 7 learning outcomes.
    2.  Each outcome should be a clear, concise, and measurable statement that starts with an action verb (e.g., "Define", "Analyze", "Apply", "Create").
    3.  The outcomes should be appropriate for the implied audience of the course title.
    4.  Return a single JSON object with a single key, "learning_outcomes", which is an array of strings.

    **INPUT DATA:**
    *   Course Title: "{{course_title}}"

    **EXAMPLE JSON OUTPUT:**
    {
      "learning_outcomes": [
        "Define the core principles of strategic leadership.",
        "Differentiate between leadership and management in a corporate context.",
        "Analyze case studies of successful and unsuccessful strategic decisions.",
        "Apply a framework for developing a strategic vision.",
        "Create a personal leadership development plan."
      ]
    }

    Now, generate the JSON for the provided input data.
    `,
});

const generateLearningOutcomesFlow = ai.defineFlow(
  {
    name: 'generateLearningOutcomesFlow',
    inputSchema: LearningOutcomesInputSchema,
    // outputSchema: LearningOutcomesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error(
        'AI returned no valid output for Learning Outcomes generation.'
      );
    }
    
    const validationResult = LearningOutcomesOutputSchema.safeParse(output);
    if (validationResult.success) {
      return validationResult.data;
    }

    console.error("AI output for Learning Outcomes failed validation.", validationResult.error);
    throw new Error(`AI output for Learning Outcomes failed validation: ${validationResult.error.message}`);
  }
);
