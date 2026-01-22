"use client";

import { useState } from "react";
import type { AuditData } from "@/app/actions";
import { LeadCaptureOverlay } from "./lead-capture-overlay";
import { AnalysisSummary } from "./analysis-summary";
import { LearningPathway } from "./learning-pathway";

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
            {data.learning_pathway ? (
                <LearningPathway pathway={data.learning_pathway} />
            ) : (
                <div className="text-center text-muted-foreground">
                    Could not generate a learning pathway.
                </div>
            )}
        </div>

        {!isUnlocked && <LeadCaptureOverlay onUnlock={() => setIsUnlocked(true)} />}
    </div>
  );
}
