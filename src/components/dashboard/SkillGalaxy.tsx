'use client';

import React from 'react';
import { Flame, ArrowRight, Activity } from 'lucide-react';
import type { FullAuditOutput } from '@/ai/types';
import { cn } from '@/lib/utils';

export function SkillGalaxy({ data }: { data: FullAuditOutput }) {
  if (!data || !data.heat_map_galaxy) {
    // Fallback for old data structure, prompts user to re-run audit
    if ((data as any).skill_clusters && (data as any).skill_clusters.length > 0) {
      return (
        <div className="text-white p-4 bg-slate-800 rounded-lg border border-slate-700">
          Legacy 'Skill Cluster' data found. Please re-run the audit to see the new 'Heat Map &amp; Pathways' visualization.
        </div>
      );
    }
    return null;
  }

  // Sort by Heat Score (Hottest first) - create a copy to avoid mutation
  const clusters = [...data.heat_map_galaxy].sort((a, b) => b.heat_score - a.heat_score);

  if (clusters.length === 0) return null;

  const handleLinkToTier = (index: number) => {
    // Only link the first 3 clusters to the 3 tiers
    if (index > 2) return; 
    
    const tierId = `tier-${index + 1}`;
    const element = document.getElementById(tierId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add a temporary highlight effect
        element.style.transition = 'box-shadow 0.3s ease-in-out';
        element.style.boxShadow = '0 0 0 4px hsl(var(--primary))';
        setTimeout(() => {
            element.style.boxShadow = '';
        }, 1500);
    }
  };


  return (
    <div className="w-full bg-slate-950 rounded-2xl p-8 border border-slate-800 overflow-hidden relative">
      
      {/* Dynamic Background Gradient based on Top Heat Score */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-400 to-blue-500"></div>

      <div className="flex flex-col gap-8">
        
        {/* HEADER: Market Context */}
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-white font-bold text-xl flex items-center gap-2">
              <Flame className="text-orange-500 fill-orange-500" />
              Skills Heat Map &amp; Pathways
            </h3>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              We analyzed current job vacancies to cluster your units into 
              <span className="text-orange-400 font-bold"> High-Demand Micro-Pathways</span>.
            </p>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-xs font-mono text-slate-500 uppercase">Highest Demand Cluster</div>
            <div className="text-orange-400 font-bold text-lg">{clusters[0].cluster_name} ({clusters[0].heat_score}%)</div>
          </div>
        </div>

        {/* THE GALAXY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {clusters.map((cluster, i) => {
            // Dynamic Styles based on Heat Score
            const isHot = cluster.heat_score > 85;
            
            const borderColor = isHot ? 'border-orange-500/50' : 'border-blue-500/30';
            const shadow = isHot ? 'shadow-[0_0_30px_rgba(249,115,22,0.15)]' : '';
            
            return (
              <div key={i} className={cn(`
                relative bg-slate-900/50 rounded-xl border ${borderColor} ${shadow} 
                p-6 hover:bg-slate-900 transition-all group
              `)}>
                
                {/* Heat Badge */}
                <div className="flex justify-between items-start mb-4">
                  <div className={cn(`
                    px-2 py-1 rounded text-xs font-bold uppercase flex items-center gap-1`,
                    isHot ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'
                  )}>
                    <Activity size={12} />
                    {isHot ? 'High Demand' : 'Steady Demand'}
                  </div>
                  <span className="text-slate-500 font-mono text-xs">{cluster.heat_score}% Match</span>
                </div>

                {/* Cluster Title */}
                <h4 className="text-white font-bold text-lg mb-2 group-hover:text-blue-200 transition-colors">
                  {cluster.cluster_name}
                </h4>
                <p className="text-slate-400 text-xs mb-6 leading-relaxed">
                  {cluster.rationale}
                </p>

                {/* The Micro-Pathway (Visual Steps) */}
                <div className="space-y-3 relative">
                  {/* Vertical Line Connector */}
                  <div className="absolute left-3 top-2 bottom-4 w-0.5 bg-slate-800 group-hover:bg-slate-700 transition-colors"></div>

                  {cluster.pathway_steps.map((step, idx) => (
                    <div key={idx} className="relative z-10 flex items-center gap-3">
                      
                      {/* Step Node */}
                      <div className={cn(`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center bg-slate-950`,
                        idx === 0 ? 'border-green-500 text-green-500' : 'border-slate-600 text-slate-500'
                      )}>
                        <span className="text-[10px] font-bold">{idx + 1}</span>
                      </div>

                      {/* Step Detail */}
                      <div className="flex-1 p-2 rounded bg-slate-800/50 border border-slate-700/50">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-200 text-xs font-medium">{step.skill}</span>
                          <span className="text-[9px] text-slate-500 uppercase border border-slate-700 px-1 rounded">
                            {step.type}
                          </span>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

                {/* Action Footer */}
                <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center opacity-60 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-slate-500">Suggested Price: $495+</span>
                  <button 
                    onClick={() => handleLinkToTier(i)}
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
