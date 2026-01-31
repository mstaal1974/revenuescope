

"use client";

import { useState } from "react";
import type { AuditData } from "@/app/actions";
import { LeadCaptureOverlay } from "./lead-capture-overlay";
import { OccupationAnalysis } from "./occupation-analysis";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RevenueCalculator } from "./RevenueCalculator";
import { useToast } from "@/hooks/use-toast";
import { Rocket, Sparkles } from "lucide-react";
import { SavedCurriculum } from "./SavedCurriculum";
import { SectorCard } from "./sector-card";
import { SkillGalaxy } from "./SkillGalaxy";
import { SkillsHeatmap } from "./skills-heatmap";


export function DashboardClient({ data }: { data: AuditData }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [monitoring, setMonitoring] = useState(false);
  const { toast } = useToast();

  const formatValue = (val: string | undefined) => (val === '[REAL_DATA_REQUIRED]' || !val) ? 'DATA UNAVAILABLE' : val;

  return (
    <div className="max-w-7xl mx-auto overflow-hidden animate-in fade-in zoom-in-95 duration-1000">
      {/* 1. THE AUDIT HEADER (Summary Data) */}
      <div className="p-8 md:p-16 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[180px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
             <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">Market Intelligence Dashboard</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 shadow-xl">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                    <Sparkles className="text-white h-3 w-3" />
                </div>
                <span className="text-[11px] font-bold text-slate-300 tracking-wide">Powered by Gemini 1.5 Flash</span>
            </div>
          </div>
          
          <h3 className="text-slate-500 text-sm font-black uppercase tracking-[0.2em] mb-4 font-mono">Strategy Summary</h3>
            <div className="text-2xl lg:text-4xl font-black mb-10 tracking-tight text-white leading-tight italic">
              "{formatValue(data?.strategy_summary)}"
            </div>
          
          <OccupationAnalysis data={data.occupation_analysis} />

          <div className="mt-12">
            <SkillGalaxy data={data} />
          </div>

        </div>
      </div>

      <div className="p-8 md:px-16 relative">
        {!isUnlocked && <LeadCaptureOverlay onUnlock={() => setIsUnlocked(true)} data={data} />}

        <div className={`transition-all duration-1000 ${!isUnlocked ? 'filter blur-3xl pointer-events-none' : ''}`}>
          
          {isUnlocked && (
            <div className="mb-12 animate-in fade-in duration-500">
                <div className="flex flex-col sm:flex-row gap-4 p-6 bg-emerald-900/50 border border-emerald-500/30 rounded-3xl justify-center items-center">
                    <p className="font-bold text-emerald-300 text-center sm:text-left">✓ Report Unlocked. You can now book a discovery meeting.</p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Button asChild className="w-full sm:w-auto bg-white hover:bg-slate-200 text-blue-600 font-bold py-6 px-8 rounded-2xl text-base animate-pulse-grow shadow-lg shadow-white/10">
                        <Link href="https://outlook.office.com/bookwithme/user/a656a2e7353645d98cae126f07ebc593@blocksure.com.au/meetingtype/OAyzW_rOmEGxuBmLJElpTw2?anonymous&ismsaljsauthenabled&ep=mlink" target="_blank">Book Discovery Meeting</Link>
                        </Button>
                    </div>
                </div>
            </div>
          )}

          <div className="mb-16">
            <SkillsHeatmap data={data.skills_heatmap} />
          </div>
          
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
                Sector-by-Sector <span className="text-primary">Analysis</span>
              </h2>
              <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                A breakdown of each training package on your scope, with AI-suggested opportunities for micro-credentials and targeted upskilling.
              </p>
            </div>
            <div className="space-y-8">
              {data.sector_breakdown.map((sector) => (
                <SectorCard key={sector.sector_name} sector={sector} />
              ))}
            </div>
          </div>

          {data.tiers && <RevenueCalculator tiers={data.tiers} />}

          <SavedCurriculum />
        </div>
      </div>

      <div className="bg-transparent px-8 md:px-16 py-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex flex-col items-start gap-4 text-left">
          <div className="flex items-center gap-4 text-emerald-500 font-black text-[10px] uppercase tracking-[0.2em] font-mono">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Pricing Calibration Active (Base Anchor + Market Multiplier)
          </div>
          {data.citations && data.citations.length > 0 && (
            <div className="text-[9px] text-slate-400 font-bold max-w-xl leading-relaxed">
              <span className="text-slate-500 font-mono uppercase">Citations:</span> {data.citations.join(' | ')}
            </div>
          )}
        </div>
        <div className="flex gap-12">
          <div className="flex flex-col text-left">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 font-mono">Modeling Basis</span>
             <span className="text-xs font-black text-slate-300">ABS Labor Market Stats 2024</span>
          </div>
          <div className="flex flex-col text-left">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 font-mono">Forecast Range</span>
             <span className="text-xs font-black text-blue-400 italic">1% — 8% Target Capture</span>
          </div>
        </div>
      </div>
    </div>
  );
}
