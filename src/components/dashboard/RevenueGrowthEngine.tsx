'use client';

import { TrendingUp, ArrowRight, Mail, MessageSquare, CheckCircle, DollarSign, ArrowDown } from 'lucide-react';
import type { RevenueStaircaseOutput } from '@/ai/types';

interface RevenueGrowthEngineProps {
  data: RevenueStaircaseOutput;
}

export default function RevenueGrowthEngine({ data }: RevenueGrowthEngineProps) {
  const pathways = data?.cluster_pathways || [];
  const standardRevenue = 3500; // Example standard diploma price
  
  // Calculate total revenue from all stages if pathways exist
  const clusteredRevenue = pathways.length > 0
    ? pathways.reduce((acc, step) => acc + step.stage_revenue, 0)
    : 0;
    
  const uplift = clusteredRevenue - standardRevenue;

  if (pathways.length === 0) {
    return (
        <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-white font-bold text-2xl">Commercial Growth Engine</h2>
            <p className="text-slate-400 mt-2">Data for the Growth Engine is not available. This can happen with older audit reports. Please try re-running the audit to generate the automated upsell pathway.</p>
        </div>
    );
  }

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-8 shadow-2xl overflow-hidden relative">
      
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl -z-10"></div>

      <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-white font-bold text-2xl flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <TrendingUp className="text-emerald-400" size={24} />
            </div>
            Commercial Growth Engine
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-lg">
            By unbundling this qualification, you unlock hidden revenue at every stage of the student lifecycle.
          </p>
        </div>
        <div className="text-right mt-6 md:mt-0">
          <div className="text-slate-500 text-xs uppercase tracking-wider font-bold">Total Revenue Uplift</div>
          <div className="text-4xl font-mono font-bold text-emerald-400">
            +${uplift > 0 ? uplift.toLocaleString() : '...'}
          </div>
          <div className="text-emerald-500/60 text-xs font-medium mt-1">
            Per Student vs. Standard Diploma
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        <div className="lg:col-span-4 flex flex-col justify-center">
          <h3 className="text-slate-300 font-bold text-sm uppercase tracking-wide mb-6 flex items-center gap-2">
            <DollarSign size={16} /> Yield Architecture
          </h3>
          
          <div className="flex gap-6 items-end justify-center h-[400px]">
            
            <div className="w-24 flex flex-col items-center group">
              <div className="text-slate-500 font-mono text-xs mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                ${standardRevenue.toLocaleString()}
              </div>
              <div className="w-full h-[60%] bg-slate-800 rounded-t-lg border-t border-slate-700 relative group-hover:bg-slate-700 transition-colors">
                 <div className="absolute bottom-4 left-0 w-full text-center text-slate-500 text-xs -rotate-90">
                    Standard
                 </div>
              </div>
              <div className="mt-3 text-center">
                <div className="text-slate-400 font-bold text-sm">Old Way</div>
                <div className="text-slate-600 text-[10px]">Single Transaction</div>
              </div>
            </div>

            <div className="mb-20 text-slate-700">
              <ArrowRight size={24} />
            </div>

            <div className="w-24 flex flex-col items-center relative z-10">
              <div className="text-emerald-400 font-mono text-xs mb-2 font-bold animate-pulse">
                ${clusteredRevenue.toLocaleString()}
              </div>
              
              <div className="w-full h-[75%] flex flex-col-reverse rounded-t-lg overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                {pathways.map((step, i) => (
                  <div key={i} 
                    className={`w-full flex items-center justify-center border-t border-white/10 transition-all hover:brightness-110 cursor-pointer
                      ${i === 0 ? 'bg-white h-[15%] text-slate-900' : ''}
                      ${i === 1 ? 'bg-emerald-500 h-[30%] text-white' : ''}
                      ${i === 2 ? 'bg-blue-600 h-[55%] text-white' : ''}
                    `}
                  >
                    <span className="text-[10px] font-bold">${step.stage_revenue}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 text-center">
                <div className="text-emerald-400 font-bold text-sm">New Way</div>
                <div className="text-slate-500 text-[10px]">3x Transactions</div>
              </div>
            </div>

          </div>
        </div>

        <div className="lg:col-span-8 border-l border-slate-800 pl-0 lg:pl-12">
          <h3 className="text-slate-300 font-bold text-sm uppercase tracking-wide mb-8 flex items-center gap-2">
            <Mail size={16} /> Automated Upsell Loop
          </h3>

          <div className="relative space-y-8">
            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-800/50"></div>

            {pathways.map((step, index) => (
              <div key={index} className="relative group">
                
                <div className="flex gap-4 items-center mb-4 relative z-10">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-4 border-slate-950
                    ${index === 0 ? 'bg-white text-slate-900' : 
                      index === 1 ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 
                      'bg-blue-600 text-white'}
                  `}>
                    {index + 1}
                  </div>
                  <div className="flex-1 bg-slate-900 border border-slate-800 p-4 rounded-xl flex justify-between items-center hover:border-blue-500/30 transition-colors">
                    <div>
                      <h4 className="text-white font-bold text-sm">{step.current_stage}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-slate-500 text-xs">Revenue Event:</span>
                        <span className="text-emerald-400 font-mono text-xs font-bold">${step.stage_revenue.toLocaleString()}</span>
                      </div>
                    </div>
                    {index === 0 && <span className="bg-white/10 text-white text-[10px] px-2 py-1 rounded">Entry Point</span>}
                  </div>
                </div>

                {step.automation_action && (
                  <div className="ml-12 pl-8 pb-8 relative">
                    <div className="absolute -left-[19px] top-6 w-6 h-6 bg-slate-950 border border-slate-700 rounded-full flex items-center justify-center text-slate-500">
                      <ArrowDown size={12} />
                    </div>

                    <div className="bg-slate-800/30 border border-slate-700/50 border-dashed rounded-lg p-4 hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-md text-blue-400 mt-1">
                          <MessageSquare size={16} />
                        </div>
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold text-blue-400 uppercase bg-blue-500/10 px-1.5 py-0.5 rounded">
                                Trigger: {step.automation_action.delay}
                              </span>
                           </div>
                           <p className="text-slate-300 text-xs italic mb-2">
                             "{step.automation_action.message_hook}"
                           </p>
                           <div className="flex items-center gap-2 text-[10px] text-slate-500">
                             <span>Unlocks next stage:</span>
                             <span className="text-white font-bold">{step.automation_action.upsell_product}</span>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            ))}

            <div className="flex gap-4 items-center relative z-10 opacity-60">
               <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-slate-700 border-dashed flex items-center justify-center text-slate-500">
                  <CheckCircle size={20} />
               </div>
               <div className="text-slate-500 text-sm font-medium">
                  Student Lifecycle Complete (Alumni Status)
               </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
