"use client";

import { useState } from "react";
import type { AuditData } from "@/app/actions";
import { LeadCaptureOverlay } from "./lead-capture-overlay";
import { Separator } from "../ui/separator";
import { AnalysisSummary } from "./analysis-summary";
import { CourseBlueprintCard } from "./course-blueprint-card";

interface DashboardClientProps {
  data: AuditData;
}

export function DashboardClient({ data }: DashboardClientProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);

  return (
    <div className="container mx-auto py-8 px-4 relative">
        <AnalysisSummary summary={data.analysis_summary} />
        
        <div className={`relative transition-all duration-500 mt-8 ${
            !isUnlocked ? "blur-lg pointer-events-none" : ""
        }`}>
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-4">
                    Suggested Short Course Blueprints
                    </h2>
                    <Separator className="mb-6" />
                    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                        {(data.suggested_short_courses || []).map((course) => (
                            <CourseBlueprintCard key={course.course_title} course={course} />
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {!isUnlocked && <LeadCaptureOverlay onUnlock={() => setIsUnlocked(true)} />}
    </div>
  );
}
