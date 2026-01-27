

"use client";

import React, { useState, useEffect, useRef } from 'react';
import { runStage1Action, runStage2Action, runStage3Action } from '@/app/actions';
import type { FullAuditInput, FullAuditOutput, } from '@/ai/types';
import { Lock, Zap } from 'lucide-react';
import { SectorCard } from './dashboard/sector-card';
import { SkillsHeatmap } from './dashboard/skills-heatmap';
import { Textarea } from './ui/textarea';
import { OccupationAnalysis } from './dashboard/occupation-analysis';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { Button } from './ui/button';


type AuditResult = FullAuditOutput;
type IndividualCourse = FullAuditOutput['individual_courses'][0];

enum AuditState {
  IDLE,
  PROCESSING,
  ERROR,
  RESULTS,
}

type AuditLog = {
  message: string;
  status: 'info' | 'success' | 'error' | 'warning';
  timestamp: Date;
};

const BadgePreview: React.FC<{ title: string; tier: string; badgeName?: string; }> = ({ title, tier, badgeName }) => {
  const isGold = tier.toLowerCase().includes('strategic') || tier.toLowerCase().includes('3');
  const isSilver = tier.toLowerCase().includes('practitioner') || tier.toLowerCase().includes('2');

  return (
    <div className="relative w-28 h-28 shrink-0 perspective-1000 group">
      <div className={`w-full h-full rounded-2xl flex flex-col items-center justify-center p-3 text-[7px] font-black text-center uppercase tracking-tighter border-4 shadow-xl transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 ${
        isGold ? 'bg-amber-400 border-amber-600 text-amber-900 shadow-amber-500/20' :
        isSilver ? 'bg-slate-300 border-slate-400 text-slate-800 shadow-slate-400/20' :
        'bg-orange-200 border-orange-400 text-orange-900 shadow-orange-500/20'
      }`}>
        <div className="mb-1 opacity-50 font-mono">microcredentials.io</div>
        <div className="leading-tight mb-1 px-1 line-clamp-2">{badgeName || title}</div>
        <div className={`px-2 py-0.5 rounded-full mt-auto text-[6px] ${
          isGold ? 'bg-amber-900/10' : isSilver ? 'bg-slate-800/10' : 'bg-orange-950/10'
        }`}>OFFICIAL CREDENTIAL</div>
      </div>
    </div>
  );
};

const AuditWidget: React.FC = () => {
  const [rtoCode, setRtoCode] = useState('');
  const [state, setState] = useState<AuditState>(AuditState.IDLE);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'rto' | 'student'>('rto');
  const scrollRef = useRef<HTMLDivElement>(null);


  const addLog = (message: string, status: AuditLog['status'] = 'info') => {
    setLogs(prev => [...prev, { message, status, timestamp: new Date() }]);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleAudit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!rtoCode) {
      addLog('RTO Code is required.', 'error');
      return;
    }

    setState(AuditState.PROCESSING);
    setLogs([]);
    addLog(`INITIATING CALIBRATED PRICING AUDIT v5.0...`, 'info');

    try {
      // PHASE 1: Get Scope from Firestore
      addLog(`[1/8] QUERYING FIRESTORE FOR RTO CODE: "${rtoCode}"...`, 'info');
      const db = getFirestore();
      const qualificationsRef = collection(db, "qualifications");
      const q = query(qualificationsRef, where("rtoCode", "==", rtoCode), where("usageRecommendation", "==", "Current"));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error(`RTO ID "${rtoCode}" is invalid or has no 'Current' qualifications in the database.`);
      }
      addLog(`[2/8] SUCCESS: FOUND ${querySnapshot.size} CURRENT QUALIFICATIONS.`, 'success');

      let rtoName = "";
      const scopeItems: string[] = [];
      addLog('[3/8] PARSING QUALIFICATION DATA FROM DATABASE...', 'info');
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (!rtoName && data.rtoLegalName) rtoName = data.rtoLegalName;
        scopeItems.push(`${data.code || ''},${data.title || ''},`);
      });
      const manualScopeDataset = scopeItems.join('\n');
      
      const baseAuditInput: FullAuditInput = { 
        rtoId: rtoCode, 
        rtoName: rtoName,
        manualScopeDataset: manualScopeDataset 
      };

      // PHASE 2: Run Stage 1 AI Analysis
      addLog('[4/8] AI STAGE 1/3: EXECUTING SECTOR & OCCUPATION ANALYSIS...', 'info');
      const stage1Response = await runStage1Action(baseAuditInput);
      if (!stage1Response.ok) throw new Error(`AI Stage 1 Failed: ${stage1Response.error}`);
      const stage1Result = stage1Response.result;
      addLog('[5/8] AI STAGE 1/3: ANALYSIS COMPLETE.', 'success');

      // PHASE 3: Run Stage 2 AI Analysis
      addLog('[6/8] AI STAGE 2/3: GENERATING SKILLS DEMAND HEATMAP...', 'info');
      const stage2Response = await runStage2Action(baseAuditInput);
      if (!stage2Response.ok) throw new Error(`AI Stage 2 Failed: ${stage2Response.error}`);
      const stage2Result = stage2Response.result;
      addLog('[7/8] AI STAGE 2/3: HEATMAP COMPLETE.', 'success');

      // PHASE 4: Run Stage 3 AI Analysis
      const stage3Input = {
        ...baseAuditInput,
        top_performing_sector: stage1Result.executive_summary.top_performing_sector,
        skills_heatmap: stage2Result.skills_heatmap,
      };
      addLog('[8/8] AI STAGE 3/3: ARCHITECTING PRODUCT ECOSYSTEM...', 'info');
      const stage3Response = await runStage3Action(stage3Input);
      if (!stage3Response.ok) {
        addLog(`AI Stage 3 Failed: ${stage3Response.error}`, "error");
        console.error("Stage 3 response:", stage3Response);
        setState(AuditState.ERROR);
        return;
      }
      const stage3Result = stage3Response.result;

      addLog('ALL AI STAGES COMPLETE. MERGING RESULTS...', 'success');

      // PHASE 5: Merge and Finalize
      const fullAuditResult: AuditResult = {
        rto_id: baseAuditInput.rtoId,
        ...stage1Result,
        ...stage2Result,
        ...stage3Result,
      };

      setResult(fullAuditResult);
      localStorage.setItem("auditData", JSON.stringify(fullAuditResult));
      setState(AuditState.RESULTS);
      addLog('AUDIT COMPLETE. REPORT GENERATED.', 'success');

    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "An unknown error occurred.";
      addLog(`ERROR: ${message}`, 'error');
      addLog(`FATAL: An unexpected error occurred. Please check the RTO code or try again later.`, 'error');
      setState(AuditState.ERROR);
    }
  };
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name && phone) {
      console.log('Lead Captured:', { name, email, phone });
      setIsUnlocked(true);
    }
  };

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const formatValue = (val: string | undefined) => (!val || val === '[REAL_DATA_REQUIRED]') ? 'DATA UNAVAILABLE' : val;

  if (state === AuditState.IDLE) {
    return (
      <div className="bg-white rounded-[2.5rem] shadow-2xl p-12 border border-slate-200 max-w-2xl mx-auto transform transition-all hover:border-blue-500/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight italic">Verified Audit AI</h3>
        </div>
        <p className="text-slate-500 mb-10 leading-relaxed text-lg font-medium text-left">
          Our v5.0 engine uses your live scope data with <strong>calibrated anchor pricing</strong> to architect high-intent course stacks.
        </p>
        <form onSubmit={handleAudit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="RTO Code (e.g. 0022)"
            value={rtoCode}
            onChange={(e) => setRtoCode(e.target.value)}
            className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-xl transition-all"
            required
          />
          <button
            type="submit"
            className="w-full bg-slate-950 hover:bg-blue-600 text-white font-black px-8 py-5 rounded-2xl transition-all shadow-2xl shadow-slate-900/20 active:scale-[0.98] text-xl"
          >
            Start Audit
          </button>
        </form>
      </div>
    );
  }

  if (state === AuditState.PROCESSING || state === AuditState.ERROR) {
    return (
      <div className="bg-slate-950 rounded-[2.5rem] shadow-2xl p-10 border border-slate-800 max-w-2xl mx-auto overflow-hidden ring-1 ring-slate-800">
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-2.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80 animate-pulse"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80 animate-pulse delay-75"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 animate-pulse delay-150"></div>
          </div>
          <span className="text-blue-500 text-xs font-black tracking-[0.2em] uppercase italic">Verifying Registry Data...</span>
        </div>
        <div ref={scrollRef} className="h-80 overflow-y-auto font-mono text-xs md:text-sm space-y-4 scrollbar-hide py-2 text-left">
          {logs.map((log, i) => (
            <div key={i} className={`flex gap-4 ${
              log.status === 'success' ? 'text-emerald-400' : 
              log.status === 'error' ? 'text-rose-400' : 
              log.status === 'warning' ? 'text-amber-400' : 'text-blue-400'
            }`}>
              <span className="opacity-40 shrink-0">[{log.timestamp.toLocaleTimeString([], { hour12: false })}]</span>
              <span className="font-bold">{log.message}</span>
            </div>
          ))}
          {state === AuditState.PROCESSING && (
            <div className="text-slate-200 pl-4 border-l-2 border-slate-800 ml-1 py-1">
              <div className="cursor-blink bg-blue-400 w-2 h-4"></div>
            </div>
          )}
        </div>
        
        {state === AuditState.ERROR && (
          <div className="mt-8">
            <button
              onClick={() => setState(AuditState.IDLE)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-black px-8 py-4 rounded-2xl transition-all text-lg active:scale-[0.98]"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    );
  }
  

  if (!result) {
      return (
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-12 border border-slate-200 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-center">No audit data available. Please start a new audit.</h3>
               <button
                  onClick={() => setState(AuditState.IDLE)}
                  className="mt-8 w-full bg-slate-950 hover:bg-blue-600 text-white font-black px-8 py-5 rounded-2xl transition-all shadow-2xl shadow-slate-900/20 active:scale-[0.98] text-xl"
                >
                  Back to Audit
                </button>
          </div>
      )
  }

  const revenues = result.sector_breakdown.map(s => parseFloat(s.financial_opportunity.realistic_annual_revenue.replace(/[^0-9.-]+/g, '')));
  const maxRevenue = Math.max(...revenues);

  return (
    <div className="animate-in fade-in zoom-in-95 duration-1000 max-w-7xl mx-auto">
      {/* 1. EXECUTIVE SUMMARY */}
      <div className="bg-slate-950 text-white text-left relative overflow-hidden p-8 md:p-16 rounded-t-[3rem]">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[180px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-blue-500/20">
            Executive Summary
          </div>
          <h3 className="text-4xl lg:text-6xl font-black mb-10 tracking-tighter text-white leading-tight">
            {!isUnlocked ? 'Significant Growth Potential Identified' : formatValue(result.executive_summary.total_revenue_opportunity)}
          </h3>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
              <p className="font-mono text-xs text-slate-400 uppercase tracking-widest mb-2">Top Performing Sector</p>
              <p className="text-2xl font-black text-white">{formatValue(result.executive_summary.top_performing_sector)}</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
              <p className="font-mono text-xs text-slate-400 uppercase tracking-widest mb-2">Strategic Advice</p>
              <p className="text-base text-white font-medium italic">"{formatValue(result.executive_summary.strategic_advice)}"</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SECTOR BREAKDOWN */}
      {result.sector_breakdown && result.sector_breakdown.length > 0 && (
        <div className="p-8 md:p-16 bg-slate-50 border-y border-slate-200">
          <h4 className="font-black text-3xl text-slate-950 tracking-tight mb-2">Sector-by-Sector Analysis</h4>
          <p className="text-slate-500 mb-12">Opportunities ranked by market demand and revenue potential.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {result.sector_breakdown.map((sector, i) => {
              const revenue = revenues[i];
              const relativeOpportunity = maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;
              return <SectorCard key={i} sector={sector} isLocked={!isUnlocked} relativeOpportunity={relativeOpportunity} />
            })}
          </div>
        </div>
      )}

      {/* 3. SKILLS HEATMAP */}
      {result.skills_heatmap && result.skills_heatmap.length > 0 && (
        <div className="p-8 md:p-16 bg-slate-100/50 border-b border-slate-200">
            <SkillsHeatmap data={result.skills_heatmap} />
        </div>
      )}


      {/* 4. MICRO-STACK ARCHITECT */}
      <div className="bg-white rounded-b-[3rem] overflow-hidden">
        <div className="bg-slate-950 p-8 md:p-16 text-white text-left relative overflow-hidden border-b-2 border-blue-500/10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[180px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <div className="bg-emerald-500/20 text-emerald-400 text-xs font-black px-5 py-2 rounded-full uppercase tracking-[0.3em] border border-emerald-500/30 inline-flex items-center gap-3 shadow-lg shadow-emerald-500/10 mb-10">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
              Deep Dive: Product Ecosystem
            </div>
            
            <h3 className="text-slate-500 text-sm font-black uppercase tracking-[0.2em] mb-4 font-mono">Strategic Product Theme</h3>
            <div className="text-5xl lg:text-7xl font-black mb-10 tracking-tighter text-white leading-none">
              {formatValue(result?.strategic_theme)}
            </div>
            
            <OccupationAnalysis data={result.occupation_analysis} />
          </div>
        </div>

        <div className="p-8 md:p-16 relative bg-slate-50/50">
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

          <div className={`grid lg:grid-cols-3 gap-8 transition-all duration-1000 ${!isUnlocked ? 'filter blur-3xl pointer-events-none' : ''}`}>
            {(result?.individual_courses || []).map((course, i) => (
              <div key={i} className={`bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-200 flex flex-col hover:shadow-2xl hover:border-blue-200 transition-all group relative overflow-hidden ${expandedCourse === i ? 'lg:col-span-3 ring-4 ring-blue-500/10' : ''}`}>
                
                <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">{course.tier}</span>
                      <div className="flex items-center gap-2">
                         <span className="text-xl font-black text-slate-900">{formatValue(course.suggested_price)}</span>
                         <span className="text-[8px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-widest font-mono">{course.pricing_tier}</span>
                      </div>
                    </div>
                    <h5 className="text-2xl font-black text-slate-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                      {viewMode === 'student' ? (course.badge_name || course.course_title) : course.course_title}
                    </h5>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                      {viewMode === 'student' ? 'EARN DIGITAL CREDENTIAL' : `${course.duration} CONTACT HOURS`}
                    </p>
                  </div>
                  <BadgePreview title={course.course_title} tier={course.tier} badgeName={course.badge_name} />
                </div>

                {expandedCourse !== i && (
                  <div className={`mb-8 p-6 rounded-2xl border text-left ${viewMode === 'rto' ? 'bg-slate-50 border-slate-100' : 'bg-blue-50/50 border-blue-100'}`}>
                     <div className={`text-[8px] font-black uppercase tracking-widest mb-2 font-mono ${viewMode === 'rto' ? 'text-slate-400' : 'text-blue-400'}`}>
                        {viewMode === 'rto' ? 'Primary Sales Target' : 'Career Impact / RSD'}
                     </div>
                     <div className="text-sm font-bold text-slate-900 leading-relaxed italic">
                        {viewMode === 'rto' ? course.target_student : `"${course.badge_skills?.[0]}"`}
                     </div>
                  </div>
                )}

                {expandedCourse !== i ? (
                  <>
                    <p className="text-sm font-medium text-slate-500 mb-8 line-clamp-2 italic text-left">"{course.learning_outcomes?.[0]}..."</p>
                    <button 
                      onClick={() => setExpandedCourse(i)}
                      className="mt-auto w-full bg-slate-50 hover:bg-slate-100 text-slate-950 font-black py-4 rounded-2xl border border-slate-200 transition-all text-xs uppercase tracking-widest active:scale-95"
                    >
                      Generate Full Skeleton
                    </button>
                  </>
                ) : (
                  <div className="grid md:grid-cols-2 gap-12 mt-4 animate-in fade-in slide-in-from-top-4 duration-500 relative text-left blueprint-bg">
                    <div className="space-y-10 relative z-10 pt-8">
                      <div>
                        <h6 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                          <span className="w-6 h-6 bg-blue-600 text-white rounded flex items-center justify-center text-[10px] font-black shadow-lg">1</span>
                          80% Ready Skeleton
                        </h6>
                        <div className="space-y-6 relative bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Module Outline</h4>
                           <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">{course.module_outline_markdown}</pre>
                        </div>
                      </div>
                      
                      <div className="bg-slate-950 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl">
                         <h6 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                            <span className="w-6 h-6 bg-blue-900/50 rounded flex items-center justify-center text-[10px] border border-blue-500/30">2</span>
                            B2B Sales Enablement
                         </h6>
                         <div className="mb-8">
                            <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2 font-mono">Target Student Persona</div>
                            <div className="text-sm font-black text-white">{course.target_student}</div>
                         </div>
                         <div>
                            <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2 font-mono">Pre-Written Sales Script</div>
                            <p className="text-xs leading-relaxed text-slate-300 font-medium italic">"{course.b2b_pitch_script}"</p>
                         </div>
                      </div>
                    </div>

                    <div className="space-y-10 relative z-10 pt-8">
                      <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                          <h6 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                              <span className="w-6 h-6 bg-slate-950 text-white rounded flex items-center justify-center text-[10px] font-black">3</span>
                              Digital Badge & RSDs
                          </h6>
                          <div className="flex gap-6 items-center mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                             <BadgePreview title={course.course_title} tier={course.tier} badgeName={course.badge_name} />
                             <div>
                                <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 font-mono">Badge Title</div>
                                <div className="text-base font-black text-slate-900 leading-tight">{course.badge_name}</div>
                             </div>
                          </div>

                          <div className="mb-8">
                              <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-4 font-mono">Badge Skills</div>
                              <div className="space-y-3">
                                  {(course.badge_skills || []).map((rsd, idx) => (
                                      <div key={idx} className="flex gap-3 items-start p-3 bg-slate-50/50 rounded-xl border border-slate-100 group relative">
                                          <div className="w-5 h-5 bg-blue-600 text-white text-[8px] font-black rounded flex items-center justify-center shrink-0">✓</div>
                                          <div className="text-[10px] font-bold text-slate-700 leading-tight">{rsd}</div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-[2rem] p-8 relative overflow-hidden">
                          <h6 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                              <span className="w-6 h-6 bg-blue-600 text-white rounded flex items-center justify-center text-[10px] font-black">4</span>
                              Marketing Launch Plan
                          </h6>
                          <div className="space-y-6">
                             <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm relative">
                                <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[7px] font-black px-2 py-0.5 rounded italic shadow-md uppercase">Ad Creative</div>
                                <div className="text-xs font-black text-slate-950 mb-2 leading-tight">"{course.ad_headline}"</div>
                                <p className="text-[10px] text-slate-500 mb-4 line-clamp-2 font-medium">"{course.ad_body_copy}"</p>
                                <div className="bg-blue-600 text-white text-[9px] font-black py-2 rounded-lg text-center uppercase tracking-widest">{course.ad_cta_button}</div>
                             </div>
                             <button 
                                onClick={() => setExpandedCourse(null)}
                                className="w-full text-slate-400 hover:text-slate-950 text-[10px] font-black uppercase tracking-widest py-4 border-2 border-dashed border-slate-200 rounded-2xl transition-all font-mono"
                             >
                                Hide Detailed Blueprint
                             </button>
                          </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {!isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center p-8 bg-white/40 backdrop-blur-3xl z-50">
              <div className="bg-white p-10 md:p-16 rounded-[4rem] shadow-[0_100px_200px_-50px_rgba(0,0,0,0.3)] border border-slate-100 max-w-2xl text-center relative overflow-hidden">
                <div className="bg-blue-600 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-blue-600/40">
                  <Lock className="w-12 h-12 text-white" />
                </div>
                <h5 className="font-black text-4xl text-slate-950 mb-6 tracking-tight italic">Unlock Full Report</h5>
                <p className="text-slate-500 text-xl mb-12 leading-relaxed font-medium">
                  Get full financial models, course skeletons, and marketing plans by unlocking your report.
                </p>
                <form onSubmit={handleUnlock} className="space-y-4 max-w-md mx-auto">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-[2rem] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-black text-xl text-center transition-all"
                    required
                  />
                  <input
                    type="email"
                    placeholder="rto-manager@training.edu.au"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-[2rem] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-black text-xl text-center transition-all"
                    pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                    title="Please enter a valid email address."
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Your Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-8 py-6 bg-slate-50 border border-slate-200 rounded-[2rem] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-black text-xl text-center transition-all"
                    pattern="[\d\s\+\(\)-]{8,}"
                    title="Please enter a valid phone number."
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-slate-950 hover:bg-blue-600 text-white font-black py-6 rounded-[2rem] transition-all shadow-2xl shadow-slate-950/20 text-xl uppercase tracking-widest"
                  >
                    Unlock Full Financial Modelling
                  </button>
                </form>
                 <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <Button variant="outline" className="w-full py-6 rounded-[2rem] text-base font-bold">Download Board-Ready PDF</Button>
                    <Button variant="outline" className="w-full py-6 rounded-[2rem] text-base font-bold">Book a Strategy Call</Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white px-16 py-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-10 rounded-b-[3rem]">
          <div className="flex flex-col items-start gap-4 text-left">
            <div className="flex items-center gap-4 text-emerald-500 font-black text-[10px] uppercase tracking-[0.2em] font-mono">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Pricing Calibration Active (Base Anchor + Market Multiplier)
            </div>
            {result?.citations && result.citations.length > 0 && (
              <div className="text-[9px] text-slate-400 font-bold max-w-xl leading-relaxed">
                <span className="text-slate-500 font-mono uppercase">Citations:</span> {result.citations.join(' | ')}
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
    </div>
  );
};

export default AuditWidget;

    

    











