"use client";

import type { FullAuditOutput } from "@/ai/types";
import { ArrowDown, ArrowUp, Minus, Briefcase, Users, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

type OccupationAnalysisData = FullAuditOutput["occupation_analysis"];

interface OccupationAnalysisProps {
  data: OccupationAnalysisData;
}

const DemandIndicator = ({ demand }: { demand: string }) => {
    const demandClasses: Record<string, string> = {
        High: "bg-emerald-100 text-emerald-700",
        Medium: "bg-amber-100 text-amber-700",
        Low: "bg-slate-100 text-slate-500",
    };
    return (
        <span className={cn("px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full", demandClasses[demand] || demandClasses.Low)}>
            {demand} Demand
        </span>
    );
};

const GrowthIndicator = ({ rate }: { rate: string }) => {
    const isPositive = rate.startsWith('+');
    const isNegative = rate.startsWith('-');
    const Icon = isPositive ? ArrowUp : isNegative ? ArrowDown : Minus;
    const colorClass = isPositive ? 'text-emerald-500' : isNegative ? 'text-rose-500' : 'text-slate-500';

    return (
        <div className={cn("flex items-center gap-1 font-bold", colorClass)}>
            <Icon className="h-4 w-4" />
            <span>{rate}</span>
        </div>
    );
};


export function OccupationAnalysis({ data }: OccupationAnalysisProps) {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/5 border border-white/10 p-6 md:p-10 rounded-[2.5rem] backdrop-blur-sm">
        <div className="mb-8 text-left">
            <div className="flex items-center gap-3 mb-4">
                <Briefcase className="h-6 w-6 text-blue-400"/>
                <h3 className="text-xl font-black text-white tracking-tight">Top 10 In-Demand Occupations</h3>
            </div>
            <p className="text-slate-400 text-sm">
                These are the most relevant occupations based on your scope, ranked by current employer demand.
            </p>
        </div>

      <div className="space-y-4">
        {data.map((occupation, index) => (
          <div
            key={index}
            className="bg-slate-900/50 p-4 rounded-2xl border border-white/10 grid grid-cols-2 md:grid-cols-4 items-center gap-4 text-left"
          >
            <div className="col-span-2 md:col-span-1">
                <p className="font-bold text-white text-sm truncate">{occupation.occupation_name}</p>
            </div>
            <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-slate-400" />
                <div>
                    <p className="text-white font-bold text-sm">{occupation.labour_market_size}</p>
                    <p className="text-slate-500 text-[10px] font-bold uppercase">Workforce</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                 <Activity className="h-5 w-5 text-slate-400" />
                 <div>
                    <GrowthIndicator rate={occupation.growth_rate} />
                    <p className="text-slate-500 text-[10px] font-bold uppercase">Growth</p>
                </div>
            </div>
            <div className="flex justify-end">
                <DemandIndicator demand={occupation.demand_level} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
