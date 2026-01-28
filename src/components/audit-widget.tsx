

"use client";

import React, { useState, useEffect, useRef } from 'react';
import { runStage1Action, runStage2Action, runStage3Action, runGenerateCourseTimelineAction } from '@/app/actions';
import type { FullAuditInput, FullAuditOutput, CourseTimelineData } from '@/ai/types';
import { Lock, Zap, FileText, Loader2, CheckCircle, XCircle, Circle } from 'lucide-react';
import { SectorCard } from './dashboard/sector-card';
import { SkillsHeatmap } from './dashboard/skills-heatmap';
import { OccupationAnalysis } from './dashboard/occupation-analysis';
import { getFirestore, collection, getDocs, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from './ui/button';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { CourseTimeline } from './CourseBuilder/CourseTimeline';
import { cn } from '@/lib/utils';


type AuditResult = FullAuditOutput;

enum AuditState {
  IDLE,
  PROCESSING,
  ERROR,
  RESULTS,
}

type ProgressStep = {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  details?: string;
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
  const [result, setResult] = useState<AuditResult | null>(null);
  const [competitorData, setCompetitorData] = useState<{ qualTitle: string; count: number } | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'rto' | 'student'>('rto');
  const { toast } = useToast();

  const [timelineData, setTimelineData] = useState<CourseTimelineData | null>(null);
  const [isTimelineLoading, setIsTimelineLoading] = useState(false);
  
  const initialProgress: ProgressStep[] = [
    { name: 'Connecting to National Register...', status: 'pending' },
    { name: 'Analysing Scope & Competitors...', status: 'pending' },
    { name: 'AI Stage 1: Sector & Occupation Analysis', status: 'pending' },
    { name: 'AI Stage 2: Skills Demand Heatmap', status: 'pending' },
    { name: 'AI Stage 3: Product Ecosystem Architecture', status: 'pending' },
    { name: 'Finalizing Report...', status: 'pending' },
  ];
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>(initialProgress);

  const updateProgress = (stepIndex: number, status: ProgressStep['status'], details?: string) => {
      setProgressSteps(prev => {
          const newSteps = [...prev];
          newSteps[stepIndex] = { ...newSteps[stepIndex], status, details };
          if (status === 'running') {
              for (let i = stepIndex + 1; i < newSteps.length; i++) {
                  newSteps[i].status = 'pending';
              }
          }
          return newSteps;
      });
  };

  const handleAudit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!rtoCode) {
      updateProgress(0, 'error', 'RTO Code is required.');
      return;
    }

    setState(AuditState.PROCESSING);
    setProgressSteps(initialProgress);
    setCompetitorData(null);
    
    try {
      // PHASE 1: Get Scope from Firestore
      updateProgress(0, 'running');
      const db = getFirestore();
      const qualificationsRef = collection(db, "qualifications");
      const q = query(qualificationsRef, where("rtoCode", "==", rtoCode), where("usageRecommendation", "==", "Current"));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error(`RTO ID "${rtoCode}" is invalid or has no 'Current' qualifications in the database.`);
      }
      updateProgress(0, 'success', `Found ${querySnapshot.size} current qualifications on scope.`);
      
      // PHASE 2: Analyze scope and competitors
      updateProgress(1, 'running');
      const allQualifications = querySnapshot.docs.map(doc => doc.data());
      
      try {
          const firstQual = querySnapshot.docs[0]?.data();
          if (firstQual && firstQual.code) {
              const competitorQuery = query(collection(db, "qualifications"), where("code", "==", firstQual.code));
              const competitorSnapshot = await getDocs(competitorQuery);
              const competitorCount = competitorSnapshot.size > 1 ? competitorSnapshot.size - 1 : 0;
              setCompetitorData({ qualTitle: firstQual.title, count: competitorCount });
              updateProgress(1, 'running', `Competitor Spy: Found ${competitorCount} rivals with qualification ${firstQual.code}.`);
          }
      } catch (spyError) {
          updateProgress(1, 'running', `Competitor spy module failed. Continuing...`);
      }

      const sectorCounts: { [key: string]: number } = {};
      allQualifications.forEach(qual => {
          const sectorCode = qual.code?.substring(0, 3);
          if (sectorCode) {
              sectorCounts[sectorCode] = (sectorCounts[sectorCode] || 0) + 1;
          }
      });

      const sortedSectors = Object.keys(sectorCounts).sort((a, b) => sectorCounts[b] - sectorCounts[a]);
      
      let filteredQualifications = allQualifications;
      let rtoName = filteredQualifications.length > 0 ? (filteredQualifications[0] as any).rtoLegalName : "";

      if (sortedSectors.length > 5) {
          const top5Sectors = sortedSectors.slice(0, 5);
          filteredQualifications = allQualifications.filter(qual => {
              const sectorCode = qual.code?.substring(0, 3);
              return sectorCode && top5Sectors.includes(sectorCode);
          });
           updateProgress(1, 'success', `Prioritized Top 5 of ${sortedSectors.length} sectors for analysis.`);
      } else {
           updateProgress(1, 'success', `Analyzed all ${sortedSectors.length} sectors.`);
      }
      
      const scopeItems: string[] = [];
      filteredQualifications.forEach((data: any) => {
        if (!rtoName && data.rtoLegalName) rtoName = data.rtoLegalName;
        scopeItems.push(`${data.code || ''},${data.title || ''},`);
      });
      const manualScopeDataset = scopeItems.join('\n');
      
      const baseAuditInput: FullAuditInput = { 
        rtoId: rtoCode, 
        rtoName: rtoName,
        manualScopeDataset: manualScopeDataset 
      };

      // PHASE 3: Run Stage 1 AI Analysis
      updateProgress(2, 'running', 'Model is analyzing market health and financial opportunities...');
      const stage1Response = await runStage1Action(baseAuditInput);
      if (!stage1Response.ok) throw new Error(`AI Stage 1 Failed: ${stage1Response.error}`);
      const stage1Result = stage1Response.result;
      updateProgress(2, 'success', `Identified ${stage1Result.executive_summary.top_performing_sector} as top sector.`);

      // PHASE 4: Run Stage 2 AI Analysis
      updateProgress(3, 'running', 'Model is mapping all skills to current employer demand...');
      const stage2Response = await runStage2Action(baseAuditInput);
      if (!stage2Response.ok) throw new Error(`AI Stage 2 Failed: ${stage2Response.error}`);
      const stage2Result = stage2Response.result;
      updateProgress(3, 'success', `Generated heatmap with ${stage2Result.skills_heatmap.length} unique skills.`);

      // PHASE 5: Run Stage 3 AI Analysis
      const stage3Input = {
        ...baseAuditInput,
        top_performing_sector: stage1Result.executive_summary.top_performing_sector,
        skills_heatmap: stage2Result.skills_heatmap,
      };
      updateProgress(4, 'running', 'Model is designing a full product-suite with pricing...');
      const stage3Response = await runStage3Action(stage3Input);
      if (!stage3Response.ok) {
        throw new Error(`AI Stage 3 Failed: ${stage3Response.error}`);
      }
      const stage3Result = stage3Response.result;
      updateProgress(4, 'success', 'Product architecture and revenue model complete.');

      // PHASE 6: Merge and Finalize
      updateProgress(5, 'running');
      const fullAuditResult: AuditResult = {
        rto_id: baseAuditInput.rtoId,
        ...stage1Result,
        ...stage2Result,
        ...stage3Result,
      };

      setResult(fullAuditResult);
      localStorage.setItem("auditData", JSON.stringify(fullAuditResult));
      updateProgress(5, 'success');
      setState(AuditState.RESULTS);

    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "An unknown error occurred.";
      const runningStepIndex = progressSteps.findIndex(step => step.status === 'running');
      if (runningStepIndex !== -1) {
          updateProgress(runningStepIndex, 'error', message);
      }
      setState(AuditState.ERROR);
    }
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name && phone) {
      try {
        const db = getFirestore();
        await addDoc(collection(db, "leads"), {
          name,
          email,
          phone,
          createdAt: serverTimestamp(),
        });
        toast({
          title: "Information Submitted",
          description: "Thank you! The full report is now unlocked.",
        });
        setIsUnlocked(true);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: "There was a problem submitting your information. Please try again.",
        });
      }
    }
  };

  const handleGenerateTimeline = async (course: AuditResult["individual_courses"][0]) => {
    setIsTimelineLoading(true);
    setTimelineData(null);

    const result = await runGenerateCourseTimelineAction({
      course_title: course.course_title,
      learning_outcomes: course.learning_outcomes,
    });

    setIsTimelineLoading(false);
    if (result.ok) {
      setTimelineData(result.result);
    } else {
      toast({
        variant: "destructive",
        title: "Timeline Generation Failed",
        description: result.error,
      });
    }
  }

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
        <div className="space-y-6 py-2">
            {progressSteps.map((step, index) => {
                const isRunning = step.status === 'running';
                const isSuccess = step.status === 'success';
                const isError = step.status === 'error';
                const isPending = step.status === 'pending';
                
                const statusColor = isSuccess ? 'text-emerald-400' : isError ? 'text-rose-400' : isRunning ? 'text-blue-400' : 'text-slate-500';

                return (
                    <div key={index} className="flex items-start gap-4 transition-all duration-300">
                        <div className="w-5 h-5 shrink-0 flex items-center justify-center mt-0.5">
                            {isRunning && <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />}
                            {isSuccess && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                            {isError && <XCircle className="w-5 h-5 text-rose-400" />}
                            {isPending && <Circle className="w-5 h-5 text-slate-700" />}
                        </div>
                        <div className="flex-1">
                            <p className={`font-bold ${statusColor}`}>{step.name}</p>
                            {step.details && <p className="text-xs text-slate-400 mt-1 font-mono">{step.details}</p>}
                        </div>
                    </div>
                );
            })}
        </div>
        
        {state === AuditState.ERROR && (
          <div className="mt-8">
             <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl mb-6">
                <p className="text-rose-400 font-bold text-sm">An Error Occurred</p>
                <p className="text-rose-400/80 text-xs mt-1 font-mono">{progressSteps.find(s => s.status === 'error')?.details}</p>
             </div>
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

      {/* NEW: COMPETITOR SPY WIDGET */}
      {competitorData && !isUnlocked && (
        <div className="p-8 md:p-16 bg-white border-y border-slate-200 animate-in fade-in duration-1000">
          <div className="max-w-4xl mx-auto text-center p-8 rounded-3xl bg-amber-50 border-2 border-dashed border-amber-300">
              <h4 className="font-black text-2xl text-amber-900 tracking-tight mb-2">⚠️ Competitor Alert for "{competitorData.qualTitle}"</h4>
              <p className="text-amber-800 text-lg font-medium max-w-2xl mx-auto">
                  Our intel shows <span className="font-black">{competitorData.count} other providers</span> hold this on scope. We've identified <span className="font-black">at least 3 marketing competing micro-credentials</span> for these skills.
              </p>
              <p className="mt-4 text-sm font-bold text-amber-600">Unlock the full report for competitive analysis and market positioning strategies.</p>
          </div>
        </div>
      )}

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
          
          {/* ACTION BUTTONS */}
          {isUnlocked && (
           <div className="mb-12 animate-in fade-in duration-500">
               <div className="flex flex-col sm:flex-row gap-4 p-6 bg-emerald-50 border border-emerald-200 rounded-3xl justify-center items-center">
                   <p className="font-bold text-emerald-900 text-center sm:text-left">✓ Report Unlocked. You can now book a meeting.</p>
                   <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                       <Button asChild className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 px-8 rounded-2xl text-base animate-pulse-grow shadow-lg shadow-emerald-500/30">
                         <Link href="https://outlook.office.com/bookwithme/user/a656a2e7353645d98cae126f07ebc593@blocksure.com.au/meetingtype/OAyzW_rOmEGxuBmLJElpTw2?anonymous&ismsaljsauthenabled&ep=mlink" target="_blank">Book Discovery Meeting</Link>
                       </Button>
                   </div>
               </div>
           </div>
          )}

          <div className={`grid lg:grid-cols-3 gap-8 transition-all duration-1000 ${!isUnlocked ? 'filter blur-3xl pointer-events-none' : ''}`}>
            {(result?.individual_courses || []).map((course, i) => {
              const isExpanded = expandedCourse === i;
              
              const handleToggleExpand = () => {
                if (isExpanded) {
                  setExpandedCourse(null);
                  setTimelineData(null);
                } else {
                  setExpandedCourse(i);
                  handleGenerateTimeline(course);
                }
              };

              return (
              <div key={i} className={`bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-200 flex flex-col hover:shadow-2xl hover:border-blue-200 transition-all group relative overflow-hidden ${isExpanded ? 'lg:col-span-3 ring-4 ring-blue-500/10' : ''}`}>
                
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

                {!isExpanded && (
                  <div className={`mb-8 p-6 rounded-2xl border text-left ${viewMode === 'rto' ? 'bg-slate-50 border-slate-100' : 'bg-blue-50/50 border-blue-100'}`}>
                     <div className={`text-[8px] font-black uppercase tracking-widest mb-2 font-mono ${viewMode === 'rto' ? 'text-slate-400' : 'text-blue-400'}`}>
                        {viewMode === 'rto' ? 'Primary Sales Target' : 'Career Impact / RSD'}
                     </div>
                     <div className="text-sm font-bold text-slate-900 leading-relaxed italic">
                        {viewMode === 'rto' ? course.target_student : `"${course.badge_skills?.[0]}"`}
                     </div>
                  </div>
                )}

                {!isExpanded ? (
                  <>
                    <p className="text-sm font-medium text-slate-500 mb-8 line-clamp-2 italic text-left">"{course.learning_outcomes?.[0]}..."</p>
                    <button 
                      onClick={handleToggleExpand}
                      className="mt-auto w-full bg-slate-50 hover:bg-slate-100 text-slate-950 font-black py-4 rounded-2xl border border-slate-200 transition-all text-xs uppercase tracking-widest active:scale-95"
                    >
                      Generate Visual Outline
                    </button>
                  </>
                ) : (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-500 relative text-left">
                    <CourseTimeline data={timelineData} isLoading={isTimelineLoading} />
                    <button 
                      onClick={handleToggleExpand}
                      className="w-full mt-8 text-slate-400 hover:text-slate-950 text-[10px] font-black uppercase tracking-widest py-4 border-2 border-dashed border-slate-200 rounded-2xl transition-all font-mono"
                    >
                      Hide Visual Outline
                    </button>
                  </div>
                )}
              </div>
            )})}
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

    