import type { AuditData } from "@/app/actions";
import { CourseBlueprintCard } from "./course-blueprint-card";
import { ArrowDown, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type LearningPathwayData = AuditData["learning_pathway"];

interface LearningPathwayProps {
  pathway: LearningPathwayData;
}

export function LearningPathway({ pathway }: LearningPathwayProps) {
  if (!pathway || !pathway.courses || pathway.courses.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Learning Pathway</CardTitle>
            </CardHeader>
            <CardContent>
                <p>No learning pathway could be generated.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-black font-headline tracking-tight">Stackable Micro-Credential Pathway</h2>
        <p className="text-xl text-primary font-semibold">{pathway.pathway_title}</p>
      </div>

      <div className="relative flex flex-col items-center">
        {pathway.courses.map((course, index) => (
          <div key={course.course_title} className="flex flex-col items-center w-full max-w-2xl">
            <div className="flex items-center text-primary font-bold">
                <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">Level {course.level}</span>
            </div>
            <div className="my-4 w-full">
                <CourseBlueprintCard course={course} />
            </div>
            {index < pathway.courses.length - 1 && (
              <ArrowDown className="h-8 w-8 text-muted-foreground my-4" />
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-center">
        <Card className="max-w-sm w-full bg-green-100/50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Total Student Value</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-green-800 dark:text-green-200">{pathway.total_student_value}</div>
                <p className="text-xs text-green-600 dark:text-green-500">Value from completing the full pathway.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
