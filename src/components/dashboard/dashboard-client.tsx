"use client";

import { useState } from "react";
import type { AuditData } from "@/app/actions";
import { LeadCaptureOverlay } from "./lead-capture-overlay";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ExecutiveSummary } from "./executive-summary";
import { SectorCard } from "./sector-card";
import { Separator } from "../ui/separator";

interface DashboardClientProps {
  data: AuditData;
}

export function DashboardClient({ data }: DashboardClientProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);

  return (
    <div className="container mx-auto py-8 px-4 relative">
      <Card className="mb-8 bg-card/50 backdrop-blur-sm border-primary/20 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-black font-headline">
            High-Level Sector Analysis for RTO: {data.rto_id}
          </CardTitle>
          <CardDescription className="text-lg">
            Your biggest revenue opportunities by industry group.
          </CardDescription>
        </CardHeader>
      </Card>
      <div
        className={`relative transition-all duration-500 ${
          !isUnlocked ? "blur-lg pointer-events-none" : ""
        }`}
      >
        <div className="space-y-8">
          <ExecutiveSummary summary={data.executive_summary} />

          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              Sector Breakdown
            </h2>
            <Separator className="mb-6" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {(data.sector_breakdown || []).map((sector) => (
                <SectorCard key={sector.sector_name} sector={sector} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {!isUnlocked && <LeadCaptureOverlay onUnlock={() => setIsUnlocked(true)} />}
    </div>
  );
}
