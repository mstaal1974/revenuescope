"use client";

import { useState, useEffect } from 'react';
import type { AuditData } from "@/app/actions";
import { SkillsHeatmap } from "./skills-heatmap";
import SectorAnalysis from "./SectorAnalysis";
import { Sparkles, FileText, Loader2 } from "lucide-react";
import RevenueGrowthEngine from "./RevenueGrowthEngine";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LeadCaptureOverlay } from "./lead-capture-overlay";
import { cn } from "@/lib/utils";

/**
 * DashboardClient is the main container for the audit results.
 * It manages the 'unlocked' state and shows a Lead Capture Overlay if required.
 * Blur intensity adjusted to 'blur-md' for better teaser visibility.
 */
export function DashboardClient({ data }: { data: AuditData }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isMounting, setIsMounting] = useState(true);

  useEffect(() => {
    console.log('DashboardClient: Mounted, checking for leadId in localStorage...');
    const leadId = localStorage.getItem('leadId');
    console.log('DashboardClient: Found leadId:', leadId);
    
    if (leadId) {
      setIsUnlocked(true);
      console.log('DashboardClient: Dashboard unlocked automatically.');
    } else {
      console.log('DashboardClient: No leadId found, showing capture overlay.');
    }
    setIsMounting(false);
  }, []);

  if (isMounting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
        <p className="mt-4 text-slate-400 font-bold tracking-widest uppercase text-xs">Syncing Intelligence Engine...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-x-hidden">
      {/* 
        Initial State: The Blurred Report 
        If isUnlocked is false, display the LeadCaptureOverlay and blur the content.
      */}
      {!isUnlocked && (
        <LeadCaptureOverlay 
          rtoCode={data.rto_id} 
          onUnlock={() => setIsUnlocked(true)} 
        />
      )}

      {/* Main dashboard content - visually obscured if locked */}
      <div className={cn(
        "max-w-7xl mx-auto animate-in fade-in duration-1000 transition-all pb-24",
        !isUnlocked && "filter blur-md pointer-events-none select-none opacity-40 grayscale"
      )}>
        
        {/* 1. THE AUDIT HEADER */}
        <div className="p-8 md:p-16 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[180px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
               <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700">
                  <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                  <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">Market Intelligence Report</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 shadow-xl">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                        <Sparkles className="text-white h-3 w-3" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-300 tracking-wide uppercase">Powered by Gemini 2.5 Pro</span>
                </div>
                 <Button asChild className="bg-white text-slate-900 hover:bg-slate-50 font-bold px-6 py-2 shadow-xl border border-slate-200">
                    <Link href="/audit/report/print">
                        <FileText className="mr-2 h-4 w-4" />
                        Export Board Briefing
                    </Link>
                </Button>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">
                Strategy Breakdown: <span className="text-blue-500">{data.rto_name || data.rto_id}</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl font-medium leading-relaxed">
                We've unbundled your scope into a high-velocity revenue engine using live labor market demand signals.
            </p>
          </div>
        </div>

        <div className="p-8 md:px-16 space-y-24">
          <SkillsHeatmap data={data} />

          <div>
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
                  Sector Analysis & <span className="text-primary">Business Multipliers</span>
                </h2>
                <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
                  Deep-dive analysis of your training packages with AI-calculated multipliers for CAC Offset and Student LTV.
                </p>
              </div>
              <SectorAnalysis sectors={data.sector_breakdown} />
          </div>

          <RevenueGrowthEngine data={data} />
        </div>

      </div>
    </div>
  );
}
