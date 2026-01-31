
import type { FullAuditOutput } from "@/ai/types";
import { Briefcase, DollarSign, TrendingUp, Info, CheckCircle, BrainCircuit, Stethoscope, Wallet, Users, BarChart2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type Sector = FullAuditOutput["sector_breakdown"][0];

interface SectorCardProps {
  sector: Sector;
}

const SectorIcon = ({ sectorName }: { sectorName: string }) => {
    const lowerCaseName = sectorName.toLowerCase();
    if (lowerCaseName.includes('business')) {
        return <Briefcase className="h-6 w-6" />;
    }
    if (lowerCaseName.includes('health') || lowerCaseName.includes('care')) {
        return <Stethoscope className="h-6 w-6" />;
    }
    return <Briefcase className="h-6 w-6" />;
};

const DemandIndicator = ({ demand }: { demand: string }) => {
    const lowerCaseDemand = demand.toLowerCase();
    if (lowerCaseDemand === 'high demand' || lowerCaseDemand === 'high') {
        return <TrendingUp className="h-4 w-4 text-emerald-400" />;
    }
    if (lowerCaseDemand === 'critical demand' || lowerCaseDemand === 'critical') {
        return <Zap className="h-4 w-4 text-emerald-400" />;
    }
    return <TrendingUp className="h-4 w-4 text-slate-400" />;
};

const GrowthChart = ({ sectorName }: {sectorName: string}) => {
    const isBusiness = sectorName.toLowerCase().includes('business');
    const color = isBusiness ? 'primary' : 'rose-500';

    const heights = isBusiness 
        ? ['30%', '45%', '40%', '60%', '55%', '80%', '100%'] 
        : ['40%', '50%', '70%', '85%', '90%', '95%', '100%'];
    
    const bgColors = isBusiness
        ? ['bg-primary/20', 'bg-primary/30', 'bg-primary/40', 'bg-primary/60', 'bg-primary/70', 'bg-primary/80', 'bg-primary']
        : ['bg-rose-500/20', 'bg-rose-500/30', 'bg-rose-500/40', 'bg-rose-500/60', 'bg-rose-500/70', 'bg-rose-500/80', 'bg-rose-500'];

    return (
        <div className="h-16 w-full flex items-end gap-1">
            {heights.map((h, i) => (
                <div key={i} className={cn(bgColors[i], "w-full rounded-t-sm")} style={{ height: h }}></div>
            ))}
        </div>
    );
};


export function SectorCard({ sector }: SectorCardProps) {
    const isBusiness = sector.sector_name.toLowerCase().includes('business');
    const accentText = isBusiness ? 'text-primary' : 'text-rose-400';
    const accentBg = isBusiness ? 'bg-primary/10' : 'bg-rose-500/10';

    const revenueCardBg = isBusiness 
        ? 'bg-gradient-to-br from-primary to-indigo-600'
        : 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700';

    return (
        <section className="bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-lg shadow-black/20">
            <div className="p-8 border-b border-slate-700/50 flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                
                {/* Left Side: Title & Stats */}
                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-4">
                        <div className={cn("p-3 rounded-xl", accentBg, accentText)}>
                            <SectorIcon sectorName={sector.sector_name} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{sector.sector_name}</h2>
                            <span className={cn("text-xs font-medium px-2 py-0.5 rounded", accentBg, accentText)}>
                                {sector.qualification_count} Active Qualifications
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/40 p-3 rounded-xl">
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block mb-1">Market Health</span>
                            <div className="flex items-center gap-2">
                                <span className="text-emerald-400 font-bold">{sector.market_health_demand_level}</span>
                                <DemandIndicator demand={sector.market_health_demand_level} />
                            </div>
                        </div>
                        <div className="bg-slate-800/40 p-3 rounded-xl">
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block mb-1">Avg. Annual Wage</span>
                            <div className="text-white font-bold">{sector.market_health_avg_industry_wage}</div>
                        </div>
                    </div>
                </div>

                {/* Middle: Growth Chart */}
                <div className="w-full lg:w-48">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block mb-2">5-Year Growth Trend</span>
                    <GrowthChart sectorName={sector.sector_name} />
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                        <span>2019</span>
                        <span>2024</span>
                    </div>
                </div>
                
                {/* Right Side: Revenue */}
                <div className={cn("w-full lg:w-72 p-6 rounded-2xl shadow-lg relative overflow-hidden group", revenueCardBg)}>
                    <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <DollarSign className="w-24 h-24" />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-blue-100 tracking-widest block mb-1">Realistic Annual Revenue</span>
                    <div className="text-3xl font-black text-white">{sector.financial_opportunity.realistic_annual_revenue} <span className="text-sm font-normal text-blue-100">AUD</span></div>
                    <div className="mt-4 flex items-center justify-between text-blue-50 text-xs">
                        <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{sector.financial_opportunity.final_learner_estimate.toLocaleString()} Est. Learners</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Wallet className="h-4 w-4" />
                            <span>{sector.financial_opportunity.assumptions.find(a => a.includes("yield"))?.match(/\\$([0-9,]+)/)?.[0]}/unit` || '$150/unit'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Assumptions */}
                <div className="p-8 md:border-r border-slate-700/50">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart2 className="h-4 w-4 text-slate-400" />
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Model Assumptions</h3>
                    </div>
                    <ul className="space-y-4">
                        {sector.financial_opportunity.assumptions.map((assumption, index) => (
                            <li key={index} className="flex gap-3 text-sm leading-relaxed text-slate-300">
                                <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                <span dangerouslySetInnerHTML={{ __html: assumption.replace(/([0-9,.]+%?)/g, '<strong>$1</strong>') }}></span>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Recommended Actions */}
                <div className="p-8 bg-slate-900/40">
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Recommended Actions</h3>
                    </div>
                    <ul className="space-y-4">
                        {sector.recommended_actions.map((action, index) => (
                            <li key={index} className="flex gap-3 text-sm leading-relaxed text-slate-300">
                                <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                                <span>{action}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            
            {/* AI Micro-Courses */}
            <div className="px-8 py-6 bg-slate-900/60 border-t border-slate-700/50 flex flex-col md:flex-row items-start md:items-center gap-6">
                 <div className="flex items-center gap-2 shrink-0">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">AI-Suggested Micro-Courses</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {sector.suggested_ai_courses.map((course, index) => (
                        <span key={index} className="px-3 py-1 bg-slate-800 rounded-lg text-xs font-medium text-slate-300 border border-slate-700 hover:border-primary transition-colors cursor-pointer">
                            {course}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
