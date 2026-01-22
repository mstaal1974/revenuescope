"use client";

import type { FullAuditOutput } from "@/ai/types";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

type SkillsHeatmapData = FullAuditOutput["skills_heatmap"];

interface SkillsHeatmapProps {
  data: SkillsHeatmapData;
}

const demandColorMap: Record<string, string> = {
  High: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Medium: "bg-amber-100 text-amber-800 border-amber-200",
  Low: "bg-slate-100 text-slate-600 border-slate-200",
};

const demandDotColorMap: Record<string, string> = {
    High: "bg-emerald-500",
    Medium: "bg-amber-500",
    Low: "bg-slate-400",
};

export function SkillsHeatmap({ data }: SkillsHeatmapProps) {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8 md:p-12">
      <div className="mb-8 text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-slate-200">
              <Zap size={12} />
              RTO Skill Demand Heatmap
          </div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">Your Entire Scope, Mapped to Market Demand</h3>
          <p className="text-slate-500 mt-2 max-w-2xl">This heatmap analyzes every skill within your current scope, using the Validated Data Chain to identify which are most in-demand by employers right now.</p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {data.map((skill, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center gap-2.5 rounded-full border px-4 py-2 font-bold text-sm transition-all hover:scale-105",
              demandColorMap[skill.demand_level] || demandColorMap.Low
            )}
            title={`Demand: ${skill.demand_level}`}
          >
            <span className={cn(
                "w-2.5 h-2.5 rounded-full",
                demandDotColorMap[skill.demand_level] || demandDotColorMap.Low
            )}></span>
            {skill.skill_name}
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-6 mt-8 text-xs font-bold text-slate-500">
         <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            High Demand
         </div>
         <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            Medium Demand
         </div>
         <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
            Low Demand
         </div>
      </div>
    </div>
  );
}
