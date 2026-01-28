export interface TimelineStep {
  id: string;
  title: string;
  description: string;
  icon: string; // e.g., "BookOpen", "ClipboardCheck", "Award"
  contentType: 'lesson' | 'quiz' | 'project' | 'conclusion';
}

export interface CourseTimelineData {
  courseTitle: string;
  timeline: TimelineStep[];
}
