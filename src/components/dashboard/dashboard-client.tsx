"use client";

import { useState } from "react";
import type { AuditData } from "@/app/actions";
import { LeadCaptureOverlay } from "./lead-capture-overlay";
import { AnalysisSummary } from "./analysis-summary";
import { IndividualCourseCard } from "./individual-course-card";
import { MasterStackCard } from "./master-stack-card";
import { ExecutiveSummary } from "./executive-summary";
import { SectorCard } from "./sector-card";
import { Separator } from "../ui/separator";
import { ArrowRight, Microscope, PackageCheck } from "lucide-react";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

interface DashboardClientProps {
  data: AuditData;
}

export function DashboardClient({ data }: DashboardClientProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [view, setView] = useState<'rto' | 'student'>('rto');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto py-8 px-4 relative">

      {!isUnlocked && <LeadCaptureOverlay onUnlock={() => setIsUnlocked(true)} />}

      <div
        className={`transition-all duration-500 ${
          !isUnlocked ? "blur-lg pointer-events-none" : ""
        }`}
      >
        <div className="flex justify-end items-center gap-2 mb-8">
            <Label htmlFor="view-toggle" className={view === 'rto' ? 'font-bold text-primary' : 'text-muted-foreground'}>RTO View</Label>
            <Switch id="view-toggle" checked={view === 'student'} onCheckedChange={(checked) => setView(checked ? 'student' : 'rto')} />
            <Label htmlFor="view-toggle" className={view === 'student' ? 'font-bold text-primary' : 'text-muted-foreground'}>Student View</Label>
        </div>

        {/* Part 1: Strategic Growth Director Analysis */}
        <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
                <Microscope className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-black font-headline tracking-tight">Macro Sector Analysis</h2>
            </div>
            <p className="text-lg text-muted-foreground mb-6">A high-level view of your biggest revenue opportunities by industry group.</p>
            
            {data.executive_summary && <ExecutiveSummary summary={data.executive_summary} />}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
              {(data.sector_breakdown || []).map((sector) => (
                <SectorCard key={sector.sector_name} sector={sector} view={view}/>
              ))}
            </div>
        </div>

        <Separator className="my-12" />

        {/* Part 2: Stackable Product Ecosystem */}
        {data.product_ecosystem && (
            <div>
                 <div className="flex items-center gap-3 mb-4">
                    <PackageCheck className="h-8 w-8 text-primary" />
                    <h2 className="text-3xl font-black font-headline tracking-tight">Recommended Product Ecosystem</h2>
                </div>
                <p className="text-lg text-muted-foreground mb-6">A detailed product blueprint for your top-performing sector.</p>

                <AnalysisSummary
                    theme={data.product_ecosystem.strategic_theme}
                    justification={data.product_ecosystem.market_justification}
                />

                <div className="text-center my-12">
                    <h3 className="text-2xl font-black font-headline tracking-tight">Your Stackable Learning Pathway</h3>
                    <p className="text-lg text-muted-foreground">Guide students from Foundation to Strategic Mastery.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    {(data.product_ecosystem.individual_courses || []).map((course, index) => (
                      <IndividualCourseCard 
                        key={index}
                        course={course} 
                        view={view}
                        isExpanded={expandedIndex === index}
                        onExpand={() => handleExpand(index)}
                      />
                    ))}
                    {expandedIndex === null && (
                      <MasterStackCard 
                        stack={data.product_ecosystem.stackable_product} 
                        view={view} 
                        className="lg:col-span-3"
                      />
                    )}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
