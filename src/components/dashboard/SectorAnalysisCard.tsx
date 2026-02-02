'use client';

import type { Sector } from "@/ai/types";
import { Info, Users, ShieldCheck, Link as LinkIcon, Sparkles, TrendingDown, Building, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Progress } from "@/components/ui/progress";

interface SectorAnalysisCardProps {
  sector: Sector;
}


export default function SectorAnalysisCard({ sector }: SectorAnalysisCardProps) {

    return (
        <div className="flex flex-col bg-slate-900/50 border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl shadow-black/20 h-full">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
                <h2 className="text-xl font-bold text-white">{sector.sector_name}</h2>
                <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full border border-primary/20">{sector.qualification_count} Quals</span>
            </div>

            <div className="p-6 space-y-8 flex-grow">
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="text-primary text-lg" />
                        <h3 className="text-[10px] uppercase tracking-widest font-bold text-primary">Gemini Business Multipliers</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       {/* Marketing CAC */}
                       <div className="bg-blue-600/5 p-3 rounded-xl border border-blue-500/10">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[9px] uppercase font-bold text-slate-400">Marketing</span>
                                <TrendingDown className="text-emerald-500 text-sm" />
                            </div>
                            <div className="text-sm font-bold text-white">{sector.business_multipliers.marketing_cac_label}</div>
                            <div className="text-[9px] text-slate-500 mt-1 leading-tight">{sector.business_multipliers.marketing_cac_subtext}</div>
                        </div>

                        {/* Retention LTV */}
                        <div className="bg-blue-600/5 p-3 rounded-xl border border-blue-500/10">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[9px] uppercase font-bold text-slate-400">Retention</span>
                            </div>
                            <div className="text-sm font-bold text-white">{sector.business_multipliers.retention_ltv_value}</div>
                            <div className="text-[9px] text-slate-500 mt-1 leading-tight">{sector.business_multipliers.retention_ltv_subtext}</div>
                        </div>

                        {/* Positioning */}
                        <div className="bg-blue-600/5 p-3 rounded-xl border border-blue-500/10">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[9px] uppercase font-bold text-slate-400">Positioning</span>
                                <ShieldCheck className="text-amber-400 text-sm" />
                            </div>
                            <div className="text-sm font-bold text-white">{sector.business_multipliers.strategic_positioning}</div>
                            <div className="text-[9px] text-slate-500 mt-1 leading-tight">{sector.business_multipliers.strategic_positioning_subtext}</div>
                        </div>

                        {/* B2B Scale */}
                         <div className="bg-blue-600/5 p-3 rounded-xl border border-blue-500/10">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[9px] uppercase font-bold text-slate-400">B2B Scale</span>
                                <span className="text-[9px] font-bold text-white">{sector.business_multipliers.b2b_scale_potential}</span>
                            </div>
                             <div className="flex items-center gap-1.5 mt-2.5">
                                <Progress value={sector.business_multipliers.b2b_scale_rating} className="h-1.5 [&>div]:bg-primary" />
                            </div>
                        </div>
                    </div>
                </section>
                
                <section>
                    <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-4">Market Health</h3>
                    <div className="grid grid-cols-3 gap-2 bg-slate-800/20 p-4 rounded-lg">
                        <div className="text-center border-r border-slate-700/50">
                            <div className="text-emerald-500 font-bold text-lg">{sector.market_health_demand_level}</div>
                            <div className="text-[9px] uppercase text-slate-500">Demand</div>
                        </div>
                        <div className="text-center border-r border-slate-700/50">
                            <div className="text-blue-400 font-bold text-lg">{sector.market_health_trend_direction}</div>
                            <div className="text-[9px] uppercase text-slate-500">Growth</div>
                        </div>
                        <div className="text-center">
                            <div className="text-white font-bold text-lg">{sector.market_health_avg_industry_wage}</div>
                            <div className="text-[9px] uppercase text-slate-500">Avg Wage</div>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-4">Realistic Financial Opportunity</h3>
                    <div className="flex items-center justify-around bg-slate-800/20 p-4 rounded-lg border border-primary/10">
                        <div className="flex items-center gap-3">
                            <Wallet className="text-primary text-2xl" />
                            <div>
                                <div className="text-xl font-bold text-white">{sector.financial_opportunity.realistic_annual_revenue}</div>
                                <div className="text-[9px] uppercase text-slate-500">Est. Revenue</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Users className="text-primary text-2xl" />
                            <div>
                                <div className="text-xl font-bold text-white">{sector.financial_opportunity.final_learner_estimate}</div>
                                <div className="text-[9px] uppercase text-slate-500">Est. Learners</div>
                            </div>
                        </div>
                    </div>
                </section>
                
                {sector.financial_opportunity.assumptions && sector.financial_opportunity.assumptions.length > 0 && (
                    <section>
                        <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-3">Model Assumptions</h3>
                        <ul className="space-y-3">
                            {sector.financial_opportunity.assumptions.map((assumption, index) => (
                                <li key={index} className="flex gap-3 text-xs text-slate-300">
                                    <Info className="text-blue-400 text-sm mt-0.5 shrink-0" />
                                    {assumption}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {sector.suggested_ai_courses && sector.suggested_ai_courses.length > 0 && (
                    <section>
                        <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-3">Suggested AI Courses</h3>
                        <div className="space-y-2">
                             {sector.suggested_ai_courses.map((course, index) => (
                                <div key={index} className="p-3 rounded-lg bg-slate-800 flex items-center gap-3 border border-transparent hover:border-primary/30 transition-all cursor-pointer">
                                    <Sparkles className="text-primary" size={16} />
                                    <span className="text-xs font-medium text-white">{course}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
             <div className="p-4 bg-slate-900 mt-auto">
                 <Button asChild className="w-full bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20">
                     <Link href={`/sector-analysis/${encodeURIComponent(sector.sector_name)}`}>
                        <LinkIcon size={16} className="mr-2"/> View Full Campaign Kit
                    </Link>
                </Button>
            </div>
        </div>
    );
}
