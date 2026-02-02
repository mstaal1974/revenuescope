'use client';

import React from 'react';
import { Flame, ArrowRight, Activity } from 'lucide-react';
import type { FullAuditOutput } from '@/ai/types';
import { cn } from '@/lib/utils';

export function SkillsHeatmap({ data }: { data: FullAuditOutput }) {
  if (!data || !data.tiers || data.tiers.length === 0) {
    return null;
  }

  // Sort by Heat Score (Hottest first) - create a copy to avoid mutation
  const tiers = [...data.tiers].sort((a, b) => b.match_percentage - a.match_percentage);

  if (tiers.length === 0) return null;

  const handleLinkToTier = (tierLevel: 1 | 2 | 3) => {
    const tierId = `tier-${tierLevel}`;
    const element = document.getElementById(tierId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add a temporary highlight effect
        element.style.transition = 'box-shadow 0.3s ease-in-out, border-color 0.3s ease-in-out';
        const originalBorder = element.style.borderColor;
        element.style.boxShadow = '0 0 0 4px hsl(var(--primary))';
        element.style.borderColor = 'hsl(var(--primary))';
        setTimeout(() => {
            element.style.boxShadow = '';
            element.style.borderColor = originalBorder;
        }, 1500);
    }
  };

  const highestDemandCluster = tiers[0];

  return (
    <div className="w-full bg-slate-900 rounded-2xl p-8 border border-slate-800 overflow-hidden relative">
      
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-400 to-blue-500"></div>

      <div className="flex flex-col gap-8">
        
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-white font-bold text-xl flex items-center gap-2">
              <Flame className="text-orange-500 fill-orange-500" />
              Skills Heat Map & Pathways
            </h3>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              We analyzed current job vacancies to cluster your units into 
              <span className="text-orange-400 font-bold"> High-Demand Micro-Pathways</span>.
            </p>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-xs font-mono text-slate-500 uppercase">Highest Demand Cluster</div>
            <div className="text-orange-400 font-bold text-lg">{highestDemandCluster.title} ({highestDemandCluster.match_percentage}%)</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {tiers.map((tier) => {
            const isHot = tier.demand_level.toLowerCase().includes('high');
            
            const borderColor = isHot ? 'border-orange-500/50' : 'border-blue-500/30';
            const shadow = isHot ? 'shadow-[0_0_30px_rgba(249,115,22,0.15)]' : '';
            
            return (
              <div key={tier.tier_level} className={cn(`
                relative bg-slate-900/50 rounded-xl border ${borderColor} ${shadow} 
                p-6 hover:bg-slate-900 transition-all group flex flex-col
              `)}>
                
                <div className="flex justify-between items-start mb-4">
                  <div className={cn(`
                    px-2 py-1 rounded text-xs font-bold uppercase flex items-center gap-1`,
                    isHot ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'
                  )}>
                    <Activity size={12} />
                    {tier.demand_level}
                  </div>
                  <span className="text-slate-500 font-mono text-xs">{tier.match_percentage}% Match</span>
                </div>

                <h4 className="text-white font-bold text-lg mb-2 group-hover:text-blue-200 transition-colors">
                  {tier.title}
                </h4>
                <p className="text-slate-400 text-xs mb-6 leading-relaxed flex-grow">
                  {tier.marketing_hook}
                </p>

                <div className="space-y-3 relative">
                  <div className="absolute left-3 top-2 bottom-4 w-0.5 bg-slate-800 group-hover:bg-slate-700 transition-colors"></div>

                  {tier.included_units.map((unit, idx) => (
                    <div key={idx} className="relative z-10 flex items-center gap-3">
                      
                      <div className={cn(`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center bg-slate-950 shrink-0`,
                        idx === 0 ? 'border-green-500 text-green-500' : 'border-slate-600 text-slate-500'
                      )}>
                        <span className="text-[10px] font-bold">{idx + 1}</span>
                      </div>

                      <div className="flex-1 p-2 rounded bg-slate-800/50 border border-slate-700/50">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-slate-200 text-xs font-medium">{unit.name}</span>
                          <span className="text-[9px] text-slate-500 uppercase border border-slate-700 px-1 rounded shrink-0">
                            {unit.type}
                          </span>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-6 border-t border-slate-800 flex justify-between items-center opacity-60 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-slate-500">Suggested Price: ${tier.price}+</span>
                  <button 
                    onClick={() => handleLinkToTier(tier.tier_level)}
                    className="text-xs text-white flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    View Strategy <ArrowRight size={12} />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
