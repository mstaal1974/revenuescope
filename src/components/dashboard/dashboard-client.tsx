"use client";

import { useState } from "react";
import type { AuditData } from "@/app/actions";
import { LeadCaptureOverlay } from "./lead-capture-overlay";
import { IndividualCourseCard } from "./individual-course-card";

export function DashboardClient({ data }: { data: AuditData }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'rto' | 'student'>('rto');
  const [monitoring, setMonitoring] = useState(false);

  const formatValue = (val: string | undefined) => (val === '[REAL_DATA_REQUIRED]' || !val) ? 'DATA UNAVAILABLE' : val;

  const handleDownloadPdf = () => {
    localStorage.setItem('auditData', JSON.stringify(data));
    window.open('/dashboard/report', '_blank');
  };

  return (
    <div className="bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-200 max-w-7xl mx-auto overflow-hidden animate-in fade-in zoom-in-95 duration-1000">
      {/* 1. THE AUDIT HEADER (Summary Data) */}
      <div className="bg-slate-950 p-8 md:p-16 text-white text-left relative overflow-hidden border-b border-slate-800">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[180px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div className="bg-emerald-500/20 text-emerald-400 text-xs font-black px-5 py-2 rounded-full uppercase tracking-[0.3em] border border-emerald-500/30 inline-flex items-center gap-3 shadow-lg shadow-emerald-500/10">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
              Verified 2%-10% Revenue Audit
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
          
          <h3 className="text-slate-500 text-sm font-black uppercase tracking-[0.2em] mb-4 font-mono">Strategic Product Theme</h3>
          <div className="text-5xl lg:text-7xl font-black mb-10 tracking-tighter text-white leading-none">
            {formatValue(data.strategic_theme)}
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6 text-left">
              <p className="text-xl text-slate-400 leading-relaxed font-medium italic">
                {formatValue(data.market_justification)}
              </p>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                 <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 italic font-mono">Acquisition Model (2% - 10%)</div>
                 <div className="text-3xl font-black text-white">
                    {formatValue(data.revenue_opportunity?.conservative_capture)} — {formatValue(data.revenue_opportunity?.ambitious_capture)}
                 </div>
                 <p className="text-xs text-slate-500 mt-2 font-bold leading-relaxed">{formatValue(data.revenue_opportunity?.acquisition_rationale)}</p>
              </div>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/10 text-left">
               <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 font-mono text-left">Total Niche Workforce (TAM)</div>
               <div className="text-5xl font-black text-white tracking-tighter mb-4 text-left">{formatValue(data.revenue_opportunity?.total_market_size)}</div>
               <p className="text-slate-400 font-medium italic mb-10 leading-relaxed text-left">"{data.stackable_product?.marketing_pitch}"</p>
               <button 
                  onClick={handleDownloadPdf}
                  className="w-full bg-blue-600 hover:bg-white hover:text-blue-600 text-white font-black py-6 rounded-3xl transition-all shadow-2xl shadow-blue-600/20 active:scale-95 text-xl uppercase tracking-widest">
                  Download Cited Audit PDF
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 md:p-16 relative bg-slate-50/50">
        {!isUnlocked && <LeadCaptureOverlay onUnlock={() => setIsUnlocked(true)} />}

        <div className={`transition-all duration-1000 ${!isUnlocked ? 'filter blur-3xl pointer-events-none' : ''}`}>
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-16">
            <div className="text-left">
              <h4 className="font-black text-4xl text-slate-950 tracking-tight underline decoration-blue-500/20 decoration-8 underline-offset-8 mb-2">Micro-Stack Architect</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Calibrated Sequential Pathway v4.5</p>
            </div>
            
            <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center shadow-inner relative">
              <div className={`absolute inset-y-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm transition-all duration-500 ease-out ${viewMode === 'rto' ? 'left-1.5' : 'left-[calc(50%+1.5px)]'}`}></div>
              <button 
                onClick={() => setViewMode('rto')}
                className={`relative z-10 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  viewMode === 'rto' ? 'text-slate-950' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                RTO Perspective
              </button>
              <button 
                onClick={() => setViewMode('student')}
                className={`relative z-10 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  viewMode === 'student' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Student Perspective
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {(data.individual_courses || []).map((course, i) => (
              <IndividualCourseCard 
                key={i} 
                course={course}
                index={i}
                viewMode={viewMode}
                expandedCourse={expandedCourse}
                setExpandedCourse={setExpandedCourse}
              />
            ))}
          </div>
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
             <span className="text-xs font-black text-slate-900 text-blue-600 italic">2% — 10% Target Capture</span>
          </div>
        </div>
      </div>
    </div>
  );
}
