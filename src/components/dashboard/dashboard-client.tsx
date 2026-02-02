"use client";

import type { AuditData } from "@/app/actions";
import { SkillGalaxy } from "./SkillGalaxy";
import { SkillsHeatmap } from "./skills-heatmap";
import SectorAnalysis from "./SectorAnalysis";
import { Sparkles } from "lucide-react";


export function DashboardClient({ data }: { data: AuditData }) {

  return (
    <div className="max-w-7xl mx-auto overflow-hidden animate-in fade-in zoom-in-95 duration-1000">
      
      {/* 1. THE AUDIT HEADER */}
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
                <span className="text-[11px] font-bold text-slate-300 tracking-wide">Powered by Gemini 2.5 Pro</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 md:px-16 space-y-16">
        <SkillsHeatmap data={data.skills_heatmap} />
        <SectorAnalysis sectors={data.sector_breakdown} />
        <SkillGalaxy data={data} />
      </div>

    </div>
  );
}
