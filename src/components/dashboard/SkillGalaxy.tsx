'use client';

import React from 'react';
import { Target, Shield, Hammer, Briefcase, Zap } from 'lucide-react';
import type { FullAuditOutput } from '@/ai/types';

export function SkillGalaxy({ data }: { data: FullAuditOutput }) {
  if (!data || !data.skill_clusters || data.skill_clusters.length === 0) {
    return null;
  }

  const clusters = data.skill_clusters;
  // The 'Hero' cluster should be the one with the highest demand.
  const heroCluster = clusters.find(c => c.market_demand.toLowerCase().includes('high')) || clusters[0];

  return (
    <div className="w-full bg-slate-950 rounded-2xl p-8 border border-slate-800 relative overflow-hidden">
      
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        
        {/* LEFT: The Commercial Logic */}
        <div className="w-full md:w-1/3 space-y-4">
          <h3 className="text-white font-bold text-xl flex items-center gap-2">
            <Target className="text-blue-500" />
            Market Clusters
          </h3>
          <p className="text-slate-400 text-sm">
            Based on your skills heatmap, we've identified {clusters.length} core commercial skill clusters. 
            <span className="text-green-400 font-bold"> The '{heroCluster.cluster_name}'</span> is your highest volume opportunity.
          </p>
          
          <div className="space-y-2 mt-4">
            {clusters.map((cluster, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${cluster.cluster_name === heroCluster.cluster_name ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-slate-600'}`}></div>
                  <span className="text-slate-200 font-medium text-sm">{cluster.cluster_name}</span>
                </div>
                <span className="text-xs text-slate-500 font-mono">{cluster.units_count} Units</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: The Galaxy Visualization */}
        <div className="w-full md:w-2/3 h-[300px] relative flex items-center justify-center">
          
          {/* ORBIT RINGS */}
          <div className="absolute w-64 h-64 border border-slate-800 rounded-full opacity-30"></div>
          <div className="absolute w-48 h-48 border border-slate-800 rounded-full opacity-30"></div>

          {/* CENTRAL HUB (The Qual) */}
          <div className="absolute bg-slate-900 w-24 h-24 rounded-full border-4 border-slate-800 flex items-center justify-center z-20 shadow-2xl">
            <div className="text-center">
               <Briefcase size={20} className="mx-auto text-slate-400 mb-1" />
               <span className="text-[10px] font-bold text-slate-500 uppercase">The Full</span>
               <span className="block text-xs font-bold text-white">Qual</span>
            </div>
          </div>

          {/* SATELLITE 1: The HERO Product (Top Right) */}
          <div className="absolute top-4 right-12 animate-pulse">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-700 rounded-full flex flex-col items-center justify-center shadow-lg shadow-green-900/50 z-30 border-2 border-green-400">
                <Zap size={20} className="text-white mb-1" />
                <span className="text-[9px] font-bold text-white uppercase tracking-wider">Top Seller</span>
              </div>
              {/* Connector Line */}
              <div className="absolute top-10 right-10 w-20 h-[2px] bg-green-500/30 origin-right rotate-45 -z-10"></div>
            </div>
          </div>

          {/* SATELLITE 2: Technical (Bottom) */}
          <div className="absolute bottom-2">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex flex-col items-center justify-center border border-slate-600 hover:bg-slate-700 transition-colors z-30">
              <Hammer size={18} className="text-blue-400 mb-1" />
              <span className="text-[9px] font-bold text-slate-300">Skills</span>
            </div>
          </div>

          {/* SATELLITE 3: Management (Top Left) */}
          <div className="absolute top-10 left-12">
            <div className="w-14 h-14 bg-slate-800 rounded-full flex flex-col items-center justify-center border border-slate-600 hover:bg-slate-700 transition-colors z-30">
              <Shield size={16} className="text-purple-400 mb-1" />
              <span className="text-[8px] font-bold text-slate-300">Admin</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
