import type { FullAuditOutput } from "@/ai/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Users, CheckCircle, ArrowUp, ArrowDown, Minus, Info } from "lucide-react";

type Sector = FullAuditOutput["sector_breakdown"][0];

interface SectorCardProps {
  sector: Sector;
  isLocked?: boolean;
  relativeOpportunity?: number;
}

const TrendIcon = ({ trend }: { trend: string }) => {
    switch (trend.toLowerCase()) {
        case 'growing':
            return <ArrowUp className="h-4 w-4 text-emerald-500" />;
        case 'declining':
            return <ArrowDown className="h-4 w-4 text-rose-500" />;
        default:
            return <Minus className="h-4 w-4 text-slate-500" />;
    }
};

export function SectorCard({ sector, isLocked, relativeOpportunity }: SectorCardProps) {
  return (
    <Card className="rounded-[1.5rem] shadow-sm bg-white border border-slate-200 flex flex-col transition-all hover:shadow-xl hover:border-blue-200">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-lg font-black text-slate-900">{sector.sector_name}</CardTitle>
            <Badge variant="secondary" className="whitespace-nowrap bg-slate-100 text-slate-600 font-bold border-slate-200">{sector.qualification_count} Quals</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow flex flex-col">
        
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Market Health</h4>
            <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                    <p className="font-black text-slate-900">{sector.market_health.demand_level}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Demand</p>
                </div>
                <div className="flex items-center justify-center gap-1">
                    <TrendIcon trend={sector.market_health.trend_direction} />
                    <p className="font-black text-slate-900">{sector.market_health.trend_direction}</p>
                </div>
                <div>
                    <p className="font-black text-slate-900">{sector.market_health.avg_industry_wage}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Avg. Wage</p>
                </div>
            </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
             <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Realistic Financial Opportunity</h4>
             {isLocked ? (
                <div className="space-y-2 py-3">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider text-center">Relative Opportunity</p>
                    <div className="w-full bg-slate-200 rounded-full h-4 border border-slate-300/50 shadow-inner">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: `${relativeOpportunity}%` }}></div>
                    </div>
                </div>
             ) : (
                <div className="flex justify-around text-center">
                    <div className="flex items-center gap-3">
                        <DollarSign className="h-6 w-6 text-blue-500" />
                        <div>
                            <p className="font-black text-lg text-slate-900">{sector.financial_opportunity.realistic_annual_revenue}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Realistic Revenue</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Users className="h-6 w-6 text-blue-500" />
                        <div>
                            <p className="font-black text-lg text-slate-900">{sector.financial_opportunity.final_learner_estimate.toLocaleString()}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Est. Learners</p>
                        </div>
                    </div>
                </div>
             )}
        </div>

        <div className="space-y-3 mt-auto pt-4">
             <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Model Assumptions</h4>
             <ul className="space-y-2">
                {(sector.financial_opportunity.assumptions || []).map((action, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-700 font-medium">
                        <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                        <span className="italic">{action}</span>
                    </li>
                ))}
             </ul>
        </div>

      </CardContent>
    </Card>
  );
}
