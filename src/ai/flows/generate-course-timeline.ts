'use server';
/**
 * @fileOverview This file defines a flow for generating a visual course timeline.
 */

import { ai } from '@/ai/genkit';
import { getCourseTimelinePrompt } from '@/lib/ai-prompts';
import {
  CourseTimelineInputSchema,
  CourseTimelineOutputSchema,
  type CourseTimelineInput,
  type CourseTimelineOutput,
} from '@/ai/types';

export async function generateCourseTimeline(
  input: CourseTimelineInput
): Promise<CourseTimelineOutput> {
  return generateCourseTimelineFlow(input);
}

const generateCourseTimelineFlow = ai.defineFlow(
  {
    name: 'generateCourseTimelineFlow',
    inputSchema: CourseTimelineInputSchema,
    // outputSchema: CourseTimelineOutputSchema,
  },
  async ({ course_title, learning_outcomes }) => {
    const prompt = getCourseTimelinePrompt(course_title, learning_outcomes);

    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: prompt,
      output: {
        format: 'json',
      },
    });

    if (!output) {
      throw new Error(
        'AI returned no valid output for Course Timeline generation.'
      );
    }

    const validationResult = CourseTimelineOutputSchema.safeParse(output);
    if (validationResult.success) {
      return validationResult.data;
    }
    
    console.error("AI output for Course Timeline failed validation.", validationResult.error);
    throw new Error(`AI output for Course Timeline failed validation: ${validationResult.error.message}`);
  }
);
