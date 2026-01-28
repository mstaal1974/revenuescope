

"use client";

import { useState } from "react";
import type { AuditData } from "@/app/actions";
import { LeadCaptureOverlay } from "./lead-capture-overlay";
import { OccupationAnalysis } from "./occupation-analysis";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RevenueCalculator } from "./RevenueCalculator";
import { useToast } from "@/hooks/use-toast";
import { Rocket } from "lucide-react";

export function DashboardClient({ data }: { data: AuditData }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [monitoring, setMonitoring] = useState(false);
  const { toast } = useToast();

  const formatValue = (val: string | undefined) => (val === '[REAL_DATA_REQUIRED]' || !val) ? 'DATA UNAVAILABLE' : val;

  return (
    <div className="bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-200 max-w-7xl mx-auto overflow-hidden animate-in fade-in zoom-in-95 duration-1000">
      {/* 1. THE AUDIT HEADER (Summary Data) */}
      <div className="bg-slate-950 p-8 md:p-16 text-white text-left relative overflow-hidden border-b border-slate-800">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[180px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div className="bg-emerald-500/20 text-emerald-400 text-xs font-black px-5 py-2 rounded-full uppercase tracking-[0.3em] border border-emerald-500/30 inline-flex items-center gap-3 shadow-lg shadow-emerald-500/10">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
              Verified 1%-8% Revenue Audit
            </div>
            <button 
              onClick={() => setMonitoring(!monitoring)}
              className={`flex items-center gap-3 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${
                monitoring ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {monitoring ? '✓ Active Market Watch' : 'Monitor Sector Demand'}
            </button>
          </div>
          
          <h3 className="text-slate-500 text-sm font-black uppercase tracking-[0.2em] mb-4 font-mono">Strategy Summary</h3>
            <div className="text-2xl lg:text-4xl font-black mb-10 tracking-tight text-white leading-tight italic">
              "{formatValue(data?.strategy_summary)}"
            </div>
          
          <OccupationAnalysis data={data.occupation_analysis} />

        </div>
      </div>

      <div className="p-8 md:p-16 relative bg-slate-50/50">
        {!isUnlocked && <LeadCaptureOverlay onUnlock={() => setIsUnlocked(true)} data={data} />}

        <div className={`transition-all duration-1000 ${!isUnlocked ? 'filter blur-3xl pointer-events-none' : ''}`}>
          
          {isUnlocked && (
            <div className="mb-12 animate-in fade-in duration-500">
                <div className="flex flex-col sm:flex-row gap-4 p-6 bg-emerald-50 border border-emerald-200 rounded-3xl justify-center items-center">
                    <p className="font-bold text-emerald-900 text-center sm:text-left">✓ Report Unlocked. You can now book a discovery meeting.</p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Button asChild className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 px-8 rounded-2xl text-base animate-pulse-grow shadow-lg shadow-emerald-500/30">
                        <Link href="https://outlook.office.com/bookwithme/user/a656a2e7353645d98cae126f07ebc593@blocksure.com.au/meetingtype/OAyzW_rOmEGxuBmLJElpTw2?anonymous&ismsaljsauthenabled&ep=mlink" target="_blank">Book Discovery Meeting</Link>
                        </Button>
                    </div>
                </div>
            </div>
          )}

          {data.tiers && <RevenueCalculator tiers={data.tiers} />}
        </div>
      </div>

      <div className="bg-white px-8 md:px-16 py-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex flex-col items-start gap-4 text-left">
          <div className="flex items-center gap-4 text-emerald-500 font-black text-[10px] uppercase tracking-[0.2em] font-mono">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Pricing Calibration Active (Base Anchor + Market Multiplier)
          </div>
          {data.citations && data.citations.length > 0 && (
            <div className="text-[9px] text-slate-400 font-bold max-w-xl leading-relaxed">
              <span className="text-slate-500 font-mono uppercase">Citations:</span> {data.citations.join(' | ')}
            </div>
          )}
        </div>
        <div className="flex gap-12">
          <div className="flex flex-col text-left">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 font-mono">Modeling Basis</span>
             <span className="text-xs font-black text-slate-900">ABS Labor Market Stats 2024</span>
          </div>
          <div className="flex flex-col text-left">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 font-mono">Forecast Range</span>
             <span className="text-xs font-black text-slate-900 text-blue-600 italic">1% — 8% Target Capture</span>
          </div>
        </div>
      </div>
    </div>
  );
}
