export const getCourseTimelinePrompt = (courseTitle: string, learningOutcomes: string[]): string => {
  return `
    You are an expert instructional designer AI. Your task is to create a visual and engaging course outline for a micro-credential based on a given title and learning outcomes. The output MUST be a valid JSON object.

    The structure should be a "metro-line" or vertical timeline. Each step in the timeline represents a learning activity.

    **RULES:**
    1.  **JSON Output Only:** Your entire response must be a single, valid JSON object. Do not include any text before or after the JSON.
    2.  **Timeline Structure:** The JSON must have a \`courseTitle\` (string) and a \`timeline\` (array of objects).
    3.  **Timeline Step Object:** Each object in the \`timeline\` array must have the following keys:
        *   \`id\`: A unique string identifier (e.g., "step-1").
        *   \`title\`: A short, engaging title for the step (string).
        *   \`description\`: A one-sentence summary of the activity (string).
        *   \`icon\`: A valid icon name from the Lucide React library. Choose an icon that semantically matches the content type (string). Examples: "BookOpen" for a lesson, "ClipboardCheck" for a quiz, "FileCode" for a project, "Award" for a conclusion.
        *   \`contentType\`: The type of activity. Must be one of 'lesson', 'quiz', 'project', or 'conclusion' (string).
    4.  **Content Logic:**
        *   Start with introductory lessons.
        *   Include at least one 'quiz' to check for understanding.
        *   Include one practical 'project' where the learner applies their skills.
        *   End with a 'conclusion' step that summarizes the key takeaways and the badge earned.
    5.  **Be Creative:** The titles and descriptions should be action-oriented and appealing to a modern learner.

    **INPUT DATA:**
    *   Course Title: "${courseTitle}"
    *   Learning Outcomes: ${JSON.stringify(learningOutcomes)}

    **EXAMPLE JSON OUTPUT:**
    {
      "courseTitle": "Intro to Responsive Web Design",
      "timeline": [
        {
          "id": "step-1",
          "title": "Module 1: The Core Principles",
          "description": "Understand what 'responsive' means and why it's critical for modern web development.",
          "icon": "BookOpen",
          "contentType": "lesson"
        },
        {
          "id": "step-2",
          "title": "Knowledge Check: Terminology",
          "description": "A quick quiz to test your grasp of key concepts like media queries and breakpoints.",
          "icon": "ClipboardCheck",
          "contentType": "quiz"
        },
        {
          "id": "step-3",
          "title": "Project: Build a Responsive Grid",
          "description": "Apply your new skills to create a flexible, responsive layout using Flexbox or CSS Grid.",
          "icon": "FileCode",
          "contentType": "project"
        },
        {
          "id": "step-4",
          "title": "Conclusion & Your New Badge",
          "description": "Congratulations! You've mastered the fundamentals of responsive design and earned your skill badge.",
          "icon": "Award",
          "contentType": "conclusion"
        }
      ]
    }

    Now, generate the JSON for the provided course title and learning outcomes.
  `;
};
