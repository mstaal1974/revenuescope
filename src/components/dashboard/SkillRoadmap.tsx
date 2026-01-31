'use client';

import React from 'react';
import { CheckCircle, Lock, Hammer, HardHat, Shield, Award, Drill } from 'lucide-react';
import type { FullAuditOutput } from '@/ai/types';

const iconMap: { [key: string]: React.ReactNode } = {
  HardHat: <HardHat size={20} />,
  Drill: <Drill size={20} />,
  Hammer: <Hammer size={20} />,
  Shield: <Shield size={20} />,
  Award: <Award size={20} />
};

export default function SkillRoadmap({ data }: { data: FullAuditOutput }) {
  if (!data || !data.skill_pathway || data.skill_pathway.length === 0) return null;

  return (
    <div className="w-full bg-slate-900/50 rounded-xl p-8 border border-slate-800">
      <h3 className="text-white font-bold text-lg mb-8 flex items-center gap-2">
        <span className="bg-blue-600 w-2 h-6 rounded-full block"></span>
        Career Progression Roadmap
      </h3>

      <div className="relative flex items-center justify-between w-full px-4 mt-8 pt-20">
        
        {/* The Connection Line (Background) */}
        <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-700 -z-0 transform -translate-y-1/2 rounded-full"></div>
        
        {/* The Connection Line (Progress - first 33% filled for effect) */}
        <div className="absolute left-0 top-1/2 w-1/3 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 -z-0 transform -translate-y-1/2 rounded-full"></div>

        {/* The Nodes */}
        {data.skill_pathway.map((node, index) => {
          const isLocked = node.status === 'locked';
          const isFirst = index === 0;

          return (
            <div key={index} className="relative z-10 flex flex-col items-center group cursor-pointer">
              
              {/* The Bubble Node */}
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 shadow-lg
                ${isFirst 
                  ? 'bg-blue-600 border-blue-900 text-white scale-110 shadow-blue-500/50' 
                  : 'bg-slate-800 border-slate-600 text-slate-500 hover:border-blue-400 hover:text-blue-300'
                }
              `}>
                {isLocked ? <Lock size={16} /> : (iconMap[node.icon] || <CheckCircle size={18} />)}
              </div>

              {/* The Labels */}
              <div className="absolute -top-20 w-32 text-center transition-all duration-300">
                <span className={`
                  text-xs font-bold uppercase tracking-wider block mb-1
                  ${isFirst ? 'text-blue-400' : 'text-slate-500'}
                `}>
                  Step {node.step}
                </span>
                <span className={`
                  text-sm font-semibold leading-tight block
                  ${isFirst ? 'text-white' : 'text-slate-400'}
                `}>
                  {node.skill_name}
                </span>
                <span className="text-[10px] text-slate-600 mt-1 block">
                  ({node.unit_code_ref})
                </span>
              </div>

            </div>
          );
        })}

        {/* The Destination (Trophy) */}
        <div className="relative z-10 flex flex-col items-center opacity-50">
          <div className="w-10 h-10 rounded-full bg-yellow-500/10 border-2 border-yellow-500/30 flex items-center justify-center text-yellow-500">
            <Award size={18} />
          </div>
          <div className="absolute -top-14 w-24 text-center">
             <span className="text-xs font-bold text-yellow-600 uppercase">Job Ready</span>
          </div>
        </div>

      </div>
    </div>
  );
}
