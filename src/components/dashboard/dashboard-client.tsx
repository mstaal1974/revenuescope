"use client";

import { useState } from "react";
import type { AuditData } from "@/app/actions";
import { LeadCaptureOverlay } from "./lead-capture-overlay";
import { AnalysisSummary } from "./analysis-summary";
import { IndividualCourseCard } from "./individual-course-card";
import { MasterStackCard } from "./master-stack-card";
import { ArrowRight } from "lucide-react";

interface DashboardClientProps {
  data: AuditData;
}

export function DashboardClient({ data }: DashboardClientProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);

  return (
    <div className="container mx-auto py-8 px-4 relative">
      <AnalysisSummary
        theme={data.strategic_theme}
        justification={data.market_justification}
      />

      {!isUnlocked && <LeadCaptureOverlay onUnlock={() => setIsUnlocked(true)} />}

      <div
        className={`relative transition-all duration-500 mt-12 ${
          !isUnlocked ? "blur-lg pointer-events-none" : ""
        }`}
      >
        <div className="text-center mb-8">
            <h2 className="text-3xl font-black font-headline tracking-tight">Your Stackable Product Ecosystem</h2>
            <p className="text-lg text-muted-foreground">Go from Foundation to Strategic Mastery.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left Column: Individual Courses Staircase */}
          <div className="space-y-6 relative">
            <h3 className="font-bold text-xl text-center lg:text-left">Individual Courses</h3>
            {(data.individual_courses || []).map((course, index) => (
              <div key={index} className="relative">
                <IndividualCourseCard course={course} />
                {index < (data.individual_courses || []).length - 1 && (
                  <div className="hidden lg:block absolute top-full left-1/2 -translate-x-1/2 w-px h-6 bg-border" />
                )}
              </div>
            ))}
          </div>

          {/* Right Column: Master Stack */}
          <div className="relative">
             <div className="hidden lg:flex absolute top-1/2 -left-8 -translate-y-1/2 items-center justify-center bg-background p-2 rounded-full">
                <ArrowRight className="h-6 w-6 text-primary" />
             </div>
            <MasterStackCard stack={data.stackable_product} />
          </div>
        </div>
      </div>
    </div>
  );
}
