'use client';

import React from 'react';
import { Flame, ArrowRight, Activity, ShieldCheck } from 'lucide-react';
import type { FullAuditOutput } from '@/ai/types';
import { cn } from '@/lib/utils';

/**
 * SkillsHeatmap displays the commercial validation of the RTO's scope.
 * It highlights High and Medium demand clusters based on live market data.
 */
export function SkillsHeatmap({ data }: { data: FullAuditOutput }) {
  if (!data || !data.tiers || data.tiers.length === 0) {
    return null;
  }

  // Sort by Heat Score (Hottest first)
  const tiers = [...data.tiers].sort((a, b) => b.match_percentage - a.match_percentage);

  const handleLinkToTier = (tierLevel: number) => {
    const tierId = `tier-${tierLevel}`;
    const element = document.getElementById(tierId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    <div className="w-full bg-slate-900 rounded-[2.5rem] p-8 md:p-12 border border-slate-800 overflow-hidden relative shadow-2xl">
      
      {/* Visual Indicator of Live Processing */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-600 via-orange-500 to-blue-600"></div>

      <div className="flex flex-col gap-10">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase tracking-widest mb-4 border border-orange-500/20">
                <Flame size={12} className="fill-orange-500" />
                Live Market Validation
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-4">
              Scope Demand Heatmap
            </h3>
            <p className="text-xl text-slate-300 leading-relaxed font-medium">
              We have mapped every Unit of Competency in your current scope against live job market data. 
              <span className="text-white font-bold"> This validates that your IP is currently in high commercial demand.</span>
            </p>
          </div>
          <div className="text-right hidden lg:block shrink-0">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Peak Demand Cluster</div>
            <div className="text-orange-400 font-black text-2xl tracking-tight">{highestDemandCluster.title}</div>
            <div className="flex items-center justify-end gap-2 mt-1">
                <span className="text-xs font-bold text-slate-400">{highestDemandCluster.match_percentage}% Demand Match</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {tiers.map((tier) => {
            const isHighDemand = 
              tier.demand_level.toLowerCase().includes('high') || 
              tier.demand_level.toLowerCase().includes('critical') || 
              tier.demand_level.toLowerCase().includes('peak');
            
            const borderColor = isHighDemand ? 'border-orange-500/40' : 'border-blue-500/20';
            const shadow = isHighDemand ? 'shadow-[0_0_50px_rgba(249,115,22,0.1)]' : 'shadow-xl';
            const accentColor = isHighDemand ? 'text-orange-400' : 'text-blue-400';
            const bgColor = isHighDemand ? 'bg-orange-500/5' : 'bg-blue-500/5';

            // Clean up redundancy like "HIGH DEMAND Demand"
            const displayDemand = tier.demand_level.toUpperCase().replace('DEMAND', '').trim();
            
            return (
              <div key={tier.tier_level} className={cn(`
                relative rounded-3xl border ${borderColor} ${shadow} ${bgColor}
                p-8 hover:bg-slate-800/50 transition-all duration-500 group flex flex-col min-h-[450px] overflow-hidden
              `)}>
                
                <div className="flex justify-between items-center mb-6">
                  <div className={cn(`
                    px-3 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1.5`,
                    isHighDemand ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  )}>
                    <Activity size={12} />
                    {displayDemand} Demand
                  </div>
                  <span className="text-slate-500 font-mono text-[10px] font-bold tracking-widest">{tier.match_percentage}% MATCH</span>
                </div>

                <h4 className="text-2xl font-black text-white mb-3 group-hover:text-blue-300 transition-colors tracking-tight leading-tight">
                  {tier.title}
                </h4>
                <p className="text-sm text-slate-400 mb-8 leading-relaxed font-medium">
                  {tier.marketing_hook}
                </p>

                <div className="space-y-4 relative mb-8 flex-grow">
                  <div className="absolute left-[11px] top-3 bottom-6 w-0.5 bg-slate-800 group-hover:bg-slate-700 transition-colors"></div>

                  {tier.included_units.map((unit, idx) => (
                    <div key={idx} className="relative z-10 flex items-start gap-4">
                      <div className={cn(`
                        w-6 h-6 mt-1 rounded-full border-2 flex items-center justify-center bg-slate-950 shrink-0 transition-colors`,
                        idx === 0 ? 'border-emerald-500 text-emerald-500' : 'border-slate-700 text-slate-500'
                      )}>
                        <span className="text-[10px] font-black">{idx + 1}</span>
                      </div>

                      <div className="flex-1 p-3 rounded-xl bg-slate-900/80 border border-slate-800 group-hover:border-slate-700 transition-all overflow-hidden">
                        <div className="flex flex-col gap-2">
                          <span className="text-slate-200 text-xs font-bold leading-tight line-clamp-2">
                            {unit.name}
                          </span>
                          <div className="flex justify-end">
                            <span className="text-[8px] font-black text-slate-500 uppercase border border-slate-800 px-1.5 py-0.5 rounded tracking-tighter bg-black/40">
                              {unit.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-6 border-t border-slate-800 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Est. Market Value</span>
                    <span className="text-lg font-black text-white">${tier.price}+</span>
                  </div>
                  <button 
                    onClick={() => handleLinkToTier(tier.tier_level)}
                    className="bg-white/5 hover:bg-white/10 text-white p-3 rounded-xl transition-all group/btn"
                  >
                    <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800/50 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                <Activity size={20} />
            </div>
            <p className="text-sm text-slate-400 font-medium">
                <span className="text-blue-400 font-bold">Model Note:</span> This heatmap uses the <b className="text-slate-200">Validated Data Chain</b> to ensure every projection is backed by official ANZSCO/ESCO bridge definitions and live Australian Bureau of Statistics market trend reports via Gemini 2.5 Pro.
            </p>
        </div>

      </div>
    </div>
  );
}
