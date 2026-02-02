'use client';

import type { Sector } from "@/ai/types";
import { Briefcase, DollarSign, TrendingUp, Info, Zap, Users, ShieldCheck, Scale, Library, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

interface SectorAnalysisCardProps {
  sector: Sector;
}

const SectorIcon = ({ sectorName }: { sectorName: string }) => {
    const lowerCaseName = sectorName.toLowerCase();
    if (lowerCaseName.includes('business')) return <Briefcase className="h-6 w-6" />;
    if (lowerCaseName.includes('health') || lowerCaseName.includes('care')) return <Zap className="h-6 w-6" />;
    return <Library className="h-6 w-6" />;
};

const MultiplierInfo = ({ icon, title, value }: { icon: React.ReactNode, title: string, value?: string }) => (
    <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
        <div className="flex items-center gap-2 mb-1">
            {icon}
            <h4 className="text-xs font-bold text-slate-400">{title}</h4>
        </div>
        <p className="text-sm text-slate-200 font-medium">{value || 'N/A'}</p>
    </div>
);

export default function SectorAnalysisCard({ sector }: SectorAnalysisCardProps) {
    const isBusiness = sector.sector_name.toLowerCase().includes('business');
    const accentText = isBusiness ? 'text-primary' : 'text-rose-400';
    const accentBg = isBusiness ? 'bg-primary/10' : 'bg-rose-500/10';

    return (
        <Card className="bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-lg shadow-black/20">
            <CardHeader className="p-6 flex flex-col md:flex-row gap-4 items-start justify-between border-b border-slate-800">
                <div className="flex items-center gap-4">
                    <div className={cn("p-3 rounded-xl", accentBg, accentText)}>
                        <SectorIcon sectorName={sector.sector_name} />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-bold text-white">{sector.sector_name}</CardTitle>
                        <CardDescription className={cn("text-xs font-medium px-2 py-0.5 rounded-full inline-block mt-1", accentBg, accentText)}>
                            {sector.qualification_count} Active Qualifications
                        </CardDescription>
                    </div>
                </div>
                <Button asChild className="bg-white text-blue-600 hover:bg-slate-200 font-bold shadow-md w-full md:w-auto">
                    <Link href={`/sector-analysis/${encodeURIComponent(sector.sector_name)}`}>
                        <LinkIcon size={16} className="mr-2"/> View Campaign Kit
                    </Link>
                </Button>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1: Business Multipliers */}
                <div className="space-y-3">
                    <h3 className="font-bold text-slate-300 text-sm mb-2">Business Multipliers</h3>
                    {sector.business_multipliers && (
                        <>
                            <MultiplierInfo icon={<DollarSign size={14} className="text-green-400"/>} title="Marketing CAC" value={sector.business_multipliers.marketing_cac_label} />
                            <MultiplierInfo icon={<TrendingUp size={14} className="text-blue-400"/>} title="Retention / LTV" value={sector.business_multipliers.retention_ltv_potential} />
                            <MultiplierInfo icon={<ShieldCheck size={14} className="text-purple-400"/>} title="Positioning" value={sector.business_multipliers.strategic_positioning} />
                            <MultiplierInfo icon={<Scale size={14} className="text-orange-400"/>} title="B2B Scale Potential" value={sector.business_multipliers.b2b_scale_potential} />
                        </>
                    )}
                </div>

                {/* Column 2: Market & Financials */}
                <div className="space-y-3">
                    <h3 className="font-bold text-slate-300 text-sm mb-2">Market &amp; Financials</h3>
                    <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 grid grid-cols-3 gap-2 text-center">
                        <div>
                            <p className="text-xs text-slate-400 font-bold">DEMAND</p>
                            <p className="text-sm font-bold text-emerald-400">{sector.market_health_demand_level}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold">GROWTH</p>
                            <p className="text-sm font-bold text-white">{sector.market_health_trend_direction}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold">AVG WAGE</p>
                            <p className="text-sm font-bold text-white">{sector.market_health_avg_industry_wage}</p>
                        </div>
                    </div>
                     <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                        <p className="text-xs text-slate-400 font-bold mb-1">Realistic Financial Opportunity</p>
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-black text-green-400">{sector.financial_opportunity.realistic_annual_revenue}</span>
                            <span className="text-sm text-slate-300 font-medium flex items-center gap-1"><Users size={14}/> {sector.financial_opportunity.final_learner_estimate} learners</span>
                        </div>
                     </div>
                </div>

                {/* Column 3: AI Opportunities */}
                <div className="space-y-3">
                    <h3 className="font-bold text-slate-300 text-sm mb-2">Suggested AI Courses</h3>
                    <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 space-y-2 h-full">
                        {sector.suggested_ai_courses.map((course, index) => (
                             <div key={index} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                                <p className="text-sm text-slate-300">{course}</p>
                             </div>
                        ))}
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}
