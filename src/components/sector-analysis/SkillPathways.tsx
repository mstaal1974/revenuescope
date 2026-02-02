'use client';

import type { RevenueStaircaseOutput } from '@/ai/types';
import { Button } from '@/components/ui/button';
import { Zap, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface SkillPathwaysProps {
  data: RevenueStaircaseOutput;
}

const DemandBadge = ({ level }: { level: string }) => {
  const isHigh = level.toLowerCase().includes('high');
  return (
    <div className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${isHigh ? 'bg-amber-400/10 text-amber-400' : 'bg-sky-400/10 text-sky-400'}`}>
      <TrendingUp size={12} />
      {level.toUpperCase()}
    </div>
  );
};

const UnitTypeBadge = ({ type }: { type: string }) => {
  let colorClass = 'bg-slate-700 text-slate-300';
  if (type.toLowerCase() === 'skill set') {
    colorClass = 'bg-sky-700 text-sky-200';
  } else if (type.toLowerCase().includes('qualification')) {
    colorClass = 'bg-purple-700 text-purple-200';
  }
  return (
    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded ${colorClass}`}>{type.toUpperCase()}</span>
  );
};

export default function SkillPathways({ data }: SkillPathwaysProps) {
  if (!data || !data.tiers || data.tiers.length === 0) {
    return (
        <div className="text-center p-10 text-slate-500">
            <p>Skills pathways data is not available.</p>
        </div>
    );
  }
  const { tiers, highest_demand_cluster } = data;

  return (
    <section>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
                <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                    <Zap className="text-amber-400" />
                    Skills Heat Map & Pathways
                </h2>
                <p className="text-slate-400 mt-2 max-w-2xl">
                    We analyzed current job vacancies to cluster your units into High-Demand Micro-Pathways.
                </p>
            </div>
            {highest_demand_cluster && (
                 <div className="text-right mt-4 md:mt-0 shrink-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Highest Demand Cluster</p>
                    <p className="text-lg font-bold text-amber-300">{highest_demand_cluster.name} ({highest_demand_cluster.match_percentage}%)</p>
                </div>
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
                <div key={tier.tier_level} className="bg-slate-900/50 border border-slate-700/50 rounded-2xl flex flex-col p-6 transition-all duration-300 hover:border-amber-400/50 hover:shadow-2xl hover:shadow-amber-500/5">
                    <div className="flex justify-between items-center mb-4">
                        <DemandBadge level={tier.demand_level} />
                        <span className="text-sm font-bold text-slate-400">{tier.match_percentage}% Match</span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">{tier.title}</h3>
                    <p className="text-slate-400 text-sm flex-grow mb-6">{tier.marketing_playbook.pain_point}</p>

                    <div className="space-y-2 mb-6">
                        {tier.included_units.map((unit, index) => (
                            <div key={index} className="relative pl-8">
                                <div className="absolute left-0 top-1.5 w-5 h-5 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-slate-300">{index + 1}</div>
                                {index < tier.included_units.length - 1 && (
                                    <div className="absolute left-[9px] top-7 bottom-0 w-0.5 bg-slate-700"></div>
                                )}
                                <div className="bg-slate-800/60 border border-slate-700/80 rounded-md p-3 flex justify-between items-center">
                                    <span className="font-medium text-sm text-slate-200">{unit.name}</span>
                                    <UnitTypeBadge type={unit.type} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-800 flex justify-between items-center">
                        <p className="text-sm text-slate-500">Suggested Price: <span className="font-bold text-slate-300">${tier.price}+</span></p>
                        <Link href="#" className="font-bold text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1">
                            View Strategy <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    </section>
  );
}
