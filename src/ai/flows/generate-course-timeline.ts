'use server';
/**
 * @fileOverview This file defines a flow for generating a visual course timeline.
 */

import { ai, flashModel } from '@/ai/genkit';
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
    outputSchema: CourseTimelineOutputSchema,
  },
  async ({ course_title, learning_outcomes }) => {
    const prompt = getCourseTimelinePrompt(course_title, learning_outcomes);

    const { output } = await ai.generate({
      model: flashModel,
      prompt: prompt,
      output: { schema: CourseTimelineOutputSchema },
    });

    if (!output) {
      throw new Error(
        'AI returned no structured output for Course Timeline generation.'
      );
    }
    
    return output;
  }
);
