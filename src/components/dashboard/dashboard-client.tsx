"use client";

import { useState } from "react";
import type { AuditData } from "@/app/actions";
import { LeadCaptureOverlay } from "./lead-capture-overlay";
import { ExecutiveSummary } from "./executive-summary";
import { SectorCard } from "./sector-card";
import { Separator } from "../ui/separator";
import { Microscope, PackageCheck, TrendingUp } from "lucide-react";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { ProductTierCard } from "./individual-course-card";

interface DashboardClientProps {
  data: AuditData;
}

export function DashboardClient({ data }: DashboardClientProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [view, setView] = useState<'rto' | 'student'>('rto');

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

        <Separator className="my-24" />

        {/* Part 2: Stackable Product Ecosystem - The Revenue Staircase */}
        {data.product_ecosystem && (
            <div id="revenue-staircase">
                 <div className="text-center mb-24 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/50 rounded-full text-blue-600 dark:text-blue-300 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-blue-100 dark:border-blue-800">
                        <TrendingUp size={12} />
                        The Revenue Staircase
                    </div>
                    <h2 className="text-5xl lg:text-7xl font-black text-slate-950 dark:text-slate-50 tracking-tighter leading-none mb-10">
                        Don't Just Sell a Course. <br />
                        <span className="text-blue-600 dark:text-blue-400 italic">Sell a Career.</span>
                    </h2>
                    <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        Turn one-off enrollments into high-value lifetime subscribers. Our AI automatically slices your qualifications into stackable revenue tiers that drive recurring student growth.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {(data.product_ecosystem.individual_courses || []).map((course, index) => (
                      <ProductTierCard 
                        key={index}
                        course={course} 
                        stack={data.product_ecosystem.stackable_product}
                        isHighlighted={index === 2}
                        tierNumber={index + 1}
                      />
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
