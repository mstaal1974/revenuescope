'use client';

import {
  TrendingUp,
  ArrowRight,
  MessageSquare,
  CheckCircle,
  Wallet,
  ArrowDown,
  RefreshCw,
  Clock,
  BarChart2
} from 'lucide-react';
import type { RevenueStaircaseOutput } from '@/ai/types';
import { Progress } from '@/components/ui/progress';

interface RevenueGrowthEngineProps {
  data: RevenueStaircaseOutput;
}

export default function RevenueGrowthEngine({ data }: RevenueGrowthEngineProps) {
  const pathways = data?.cluster_pathways || [];
  const standardRevenue = 1495;

  if (pathways.length === 0) {
    return (
      <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center">
        <h2 className="text-white font-bold text-2xl">Commercial Growth Engine</h2>
        <p className="text-slate-400 mt-2">Data for the Growth Engine is not available. Please re-run the audit to generate the automated upsell pathway.</p>
      </div>
    );
  }

  const clusteredRevenue = pathways.reduce((acc, step) => acc + step.stage_revenue, 0);
  const totalRevenueUplift = clusteredRevenue - standardRevenue;
  const ltvMultiplier = standardRevenue > 0 ? (clusteredRevenue / standardRevenue).toFixed(1) : 0;

  const tierColors = {
    1: 'bg-emerald-500',
    2: 'bg-blue-500',
    3: 'bg-violet-500'
  };
  const tierBgColors = {
    1: 'bg-emerald-500/20',
    2: 'bg-blue-500/20',
    3: 'bg-violet-500/20'
  };
  const tierTextColors = {
    1: 'text-emerald-400',
    2: 'text-blue-400',
    3: 'text-violet-400'
  };
   const tierBorderColors = {
    1: 'border-emerald-500/30 group-hover:border-emerald-500/60',
    2: 'border-blue-500/30 group-hover:border-blue-500/60',
    3: 'border-violet-500/30 group-hover:border-violet-500/60'
  };

  return (
    <div className="w-full bg-slate-900/50 border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden">
      <header className="p-8 border-b border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <TrendingUp />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">ScopeStack Growth Engine</h1>
          </div>
          <p className="text-slate-400 max-w-lg">
            Unbundling qualifications to unlock hidden revenue at every stage of the student lifecycle through automated intelligence.
          </p>
        </div>
        <div className="flex gap-8">
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Lifetime Value Multiplier</p>
            <div className="flex items-baseline justify-end gap-2">
              <span className="text-4xl font-extrabold text-primary">{ltvMultiplier}x</span>
              <span className="text-xs text-primary/80 font-medium">vs Traditional</span>
            </div>
          </div>
          <div className="text-right border-l border-slate-800 pl-8">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Total Revenue Uplift</p>
            <div className="text-4xl font-extrabold text-white flex items-center justify-end">
              <span className="text-primary mr-1">+</span>${totalRevenueUplift.toLocaleString()}
            </div>
          </div>
        </div>
      </header>
      <main className="grid grid-cols-1 lg:grid-cols-12">
        <aside className="lg:col-span-4 p-8 border-r border-slate-800 bg-black/20">
          <div className="flex items-center gap-2 mb-12">
            <Wallet className="text-sm text-slate-400" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Yield Architecture</h2>
          </div>
          <div className="relative h-80 flex items-end gap-1 mt-20 px-4">
            <div className="flex-1 flex flex-col items-center group">
              <div className="w-full bg-slate-800 h-12 rounded-t-lg relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-bold">${standardRevenue.toLocaleString()}</div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-[10px] font-bold uppercase text-slate-400">Old Way</p>
                <p className="text-[10px] text-slate-500">Single Transaction</p>
              </div>
            </div>
            <div className="flex-[0.5] flex items-center justify-center pb-20">
              <ArrowRight className="text-slate-700" />
            </div>
            <div className="flex-[2] flex items-end gap-1">
              <div className="flex-1 flex flex-col items-center group">
                <div className="w-full bg-emerald-500 h-8 rounded-t-md staircase-step cursor-help relative">
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold">${pathways[0]?.stage_revenue}</div>
                </div>
                <div className="mt-4 w-full h-1 bg-emerald-500/20 rounded-full"></div>
              </div>
              <div className="flex-1 flex flex-col items-center group">
                <div className="w-full bg-blue-500 h-24 rounded-t-md staircase-step cursor-help relative">
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold">${pathways[1]?.stage_revenue}</div>
                </div>
                <div className="mt-4 w-full h-1 bg-blue-500/20 rounded-full"></div>
              </div>
              <div className="flex-1 flex flex-col items-center group">
                <div className="w-full bg-violet-500 h-56 rounded-t-md staircase-step cursor-help relative">
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold">${pathways[2]?.stage_revenue}</div>
                </div>
                <div className="mt-4 w-full h-1 bg-violet-500/20 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="mt-12 p-4 bg-primary/5 border border-primary/20 rounded-2xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-primary">New Total Yield</span>
              <span className="text-xl font-bold text-white">${clusteredRevenue.toLocaleString()}</span>
            </div>
            <Progress value={(clusteredRevenue / (pathways[2]?.stage_revenue + standardRevenue)) * 100} className="h-1.5 [&>div]:bg-primary" />
            <p className="text-[10px] text-slate-400 mt-2 text-center italic">3x transactions vs industry baseline</p>
          </div>
        </aside>
        <section className="lg:col-span-8 p-8 relative">
          <div className="flex items-center gap-2 mb-8">
            <RefreshCw className="text-sm text-slate-400" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Automated Upsell Loop</h2>
          </div>
          <div className="relative pl-12">
            <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-gradient-to-b from-emerald-500 via-blue-500 to-violet-500 opacity-30"></div>
            {pathways.map((step, index) => (
              <div key={index} id={`tier-${index + 1}`} className="relative mb-12 scroll-mt-24">
                 <div className={`absolute -left-12 top-0 w-10 h-10 rounded-full flex items-center justify-center font-bold z-10 shadow-lg 
                  ${index === 0 ? 'bg-white/10 border-2 border-primary text-primary shadow-primary/20' : ''} 
                  ${index === 1 ? 'bg-primary text-white neon-glow' : ''} 
                  ${index === 2 ? 'bg-white/10 border-2 border-violet-500 text-violet-500 shadow-violet-500/20' : ''}
                `}>
                  {index + 1}
                </div>
                <div className={`bg-slate-900/70 border border-slate-800 p-5 rounded-2xl flex justify-between items-center
                  ${index === 1 ? 'border-2 border-primary/40 shadow-lg shadow-primary/5' : ''}
                `}>
                  <div>
                    <h3 className="font-bold text-lg text-white">{step.current_stage}</h3>
                    <p className="text-sm text-slate-400 font-mono">Revenue Event: <span className={`font-bold ${tierTextColors[index+1 as keyof typeof tierTextColors]}`}>${step.stage_revenue}</span></p>
                  </div>
                  {index === 0 && <span className="text-[10px] font-bold px-3 py-1 bg-slate-800 text-slate-500 rounded-full uppercase tracking-tighter">Entry Point</span>}
                  {index === 1 && <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span><span className="text-[10px] font-bold text-primary uppercase">Active Segment</span></div>}
                </div>
                {step.automation_delay && (
                  <div className="mt-4 ml-4 flex gap-4 items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${tierBorderColors[index+2 as keyof typeof tierBorderColors] ?? 'border-slate-700'} ${tierBgColors[index+2 as keyof typeof tierBgColors] ?? 'bg-slate-800'}`}>
                       {index === 0 ? <MessageSquare className={`text-sm ${tierTextColors[index+2 as keyof typeof tierTextColors] ?? 'text-slate-400'}`} /> : <Clock className={`text-sm ${tierTextColors[index+2 as keyof typeof tierTextColors] ?? 'text-slate-400'}`} />}
                    </div>
                    <div className={`flex-1 bg-slate-900 border border-dashed ${tierBorderColors[index+2 as keyof typeof tierBorderColors] ?? 'border-slate-700'} p-4 rounded-xl flex justify-between items-center group transition-colors`}>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-black text-white px-2 py-0.5 rounded ${tierColors[index+2 as keyof typeof tierColors] ?? 'bg-slate-700'}`}>TRIGGER: {step.automation_delay}</span>
                                <span className={`text-[10px] font-bold flex items-center gap-1 ${tierTextColors[index+2 as keyof typeof tierTextColors] ?? 'text-slate-400'}`}>
                                    <BarChart2 className="text-[12px]" /> {step.automation_conversion_rate}% Conversion
                                </span>
                            </div>
                            <p className="text-xs italic text-slate-400">"{step.automation_message_hook}"</p>
                        </div>
                        <ArrowDown className={`text-slate-700 group-hover:${tierTextColors[index+2 as keyof typeof tierTextColors] ?? 'text-slate-400'} transition-colors`} />
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div className="mt-12 flex items-center gap-4 text-slate-500">
              <div className="w-10 h-10 -ml-12 rounded-full border-2 border-slate-800 bg-slate-900 flex items-center justify-center">
                <CheckCircle className="text-sm"/>
              </div>
              <span className="text-sm font-medium">Student Lifecycle Complete (Alumni Status)</span>
            </div>
          </div>
        </section>
      </main>
      <footer className="p-4 bg-black/40 flex justify-between items-center border-t border-slate-800">
        <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all cursor-default">
          <span className="text-[10px] font-bold tracking-widest uppercase">Powered by</span>
          <div className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-black italic">Gemini 2.5 Pro</div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-[10px] font-bold uppercase text-slate-400 hover:text-primary transition-colors">Export Strategy</button>
          <button className="bg-primary text-slate-950 px-4 py-2 rounded-lg text-xs font-bold hover:shadow-lg hover:shadow-primary/30 transition-all">Optimize Flow</button>
        </div>
      </footer>
    </div>
  );
}
