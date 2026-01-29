

"use client";

import React, { useState, useEffect, useRef } from 'react';
import { runStage1Action, runStage2Action, runStage3Action } from '@/app/actions';
import type { FullAuditInput, FullAuditOutput, RevenueStaircaseInput } from '@/ai/types';
import { Lock, Zap, Loader2, CheckCircle, XCircle, Circle, Rocket } from 'lucide-react';
import { SectorCard } from './dashboard/sector-card';
import { SkillsHeatmap } from './dashboard/skills-heatmap';
import { OccupationAnalysis } from './dashboard/occupation-analysis';
import { getFirestore, collection, getDocs, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { RevenueCalculator } from './dashboard/RevenueCalculator';
import { useRouter } from 'next/navigation';


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


const AuditWidget: React.FC = () => {
  const [rtoCode, setRtoCode] = useState('');
  const [state, setState] = useState<AuditState>(AuditState.IDLE);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const { toast } = useToast();
  const router = useRouter();
  
  const initialProgress: ProgressStep[] = [
    { name: 'Connecting to National Register...', status: 'pending' },
    { name: 'Analysing Scope & Competitors...', status: 'pending' },
    { name: 'AI Stage 1: Sector & Occupation Analysis', status: 'pending' },
    { name: 'AI Stage 2: Skills Demand Heatmap', status: 'pending' },
    { name: 'AI Stage 3: 3-Tier Revenue Staircase Design', status: 'pending' },
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
    
    // Fake 3-second delay to build anticipation
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
      updateProgress(0, 'running');
      const db = getFirestore();
      const qualificationsRef = collection(db, "qualifications");
      const q = query(qualificationsRef, where("rtoCode", "==", rtoCode), where("usageRecommendation", "==", "Current"));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error(`RTO ID "${rtoCode}" is invalid or has no 'Current' qualifications. Please check the RTO code and try again.`);
      }
      updateProgress(0, 'success', `Found ${querySnapshot.size} current qualifications on scope.`);
      
      updateProgress(1, 'running');
      const allQualifications = querySnapshot.docs.map(doc => doc.data());
      const rtoName = allQualifications.length > 0 ? (allQualifications[0] as any).rtoLegalName : "";
      
      const scopeItems: string[] = [];
      allQualifications.forEach((data: any) => {
        scopeItems.push(`${data.code || ''},${data.title || ''},`);
      });
      const manualScopeDataset = scopeItems.join('\n');
      
      const baseAuditInput: FullAuditInput = { 
        rtoId: rtoCode, 
        rtoName: rtoName,
        manualScopeDataset: manualScopeDataset 
      };
      updateProgress(1, 'success', `Analyzing ${rtoName}...`);

      updateProgress(2, 'running', 'Model is analyzing market health and financial opportunities...');
      const stage1Response = await runStage1Action(baseAuditInput);
      if (!stage1Response.ok) throw new Error(`AI Stage 1 Failed: ${stage1Response.error}`);
      const stage1Result = stage1Response.result;
      updateProgress(2, 'success', `Identified ${stage1Result.executive_summary.top_performing_sector} as top sector.`);

      updateProgress(3, 'running', 'Model is mapping all skills to current employer demand...');
      const stage2Response = await runStage2Action(baseAuditInput);
      if (!stage2Response.ok) throw new Error(`AI Stage 2 Failed: ${stage2Response.error}`);
      const stage2Result = stage2Response.result;
      updateProgress(3, 'success', `Generated heatmap with ${stage2Result.skills_heatmap.length} unique skills.`);

      const stage3Input: RevenueStaircaseInput = {
        ...baseAuditInput,
        top_performing_sector: stage1Result.executive_summary.top_performing_sector,
        skills_heatmap: stage2Result.skills_heatmap,
      };
      updateProgress(4, 'running', 'Model is designing a 3-tier revenue staircase...');
      const stage3Response = await runStage3Action(stage3Input);
      if (!stage3Response.ok) throw new Error(`AI Stage 3 Failed: ${stage3Response.error}`);
      const stage3Result = stage3Response.result;
      updateProgress(4, 'success', '3-Tier product architecture and revenue model complete.');

      updateProgress(5, 'running');
      const fullAuditResult: AuditResult = {
        rto_id: baseAuditInput.rtoId,
        ...stage1Result,
        ...stage2Result,
        ...stage3Result,
      };

      setResult(fullAuditResult);
      setState(AuditState.RESULTS);
      updateProgress(5, 'success');

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

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name && phone && result) {
      try {
        const db = getFirestore();
        const docRef = await addDoc(collection(db, "leads"), {
          name,
          email,
          phone,
          rtoCode: result.rto_id,
          createdAt: serverTimestamp(),
        });
        localStorage.setItem('leadId', docRef.id);
        localStorage.setItem("auditData", JSON.stringify(result));
        toast({
          title: "Success! Your Report is Ready.",
          description: "Redirecting you to the dashboard now.",
        });
        router.push('/dashboard');
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: "There was a problem submitting your information. Please try again.",
        });
      }
    }
  };

  if (state === AuditState.IDLE) {
    return (
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleAudit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Enter your RTO Number (e.g., 45123, 91398)..."
            value={rtoCode}
            onChange={(e) => setRtoCode(e.target.value)}
            className="flex-grow px-6 py-5 bg-slate-800/50 border border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-bold text-xl text-white transition-all text-center sm:text-left"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-5 rounded-2xl transition-all shadow-lg shadow-blue-900/50 active:scale-[0.98] text-xl inline-flex items-center justify-center gap-2"
          >
            Reveal Revenue Strategy <Rocket className="w-5 h-5" />
          </button>
        </form>
      </div>
    );
  }

  if (state === AuditState.PROCESSING || state === AuditState.ERROR) {
    return (
      <div className="bg-slate-900 rounded-[2.5rem] shadow-2xl p-10 border border-slate-800 max-w-2xl mx-auto overflow-hidden ring-1 ring-slate-800">
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-2.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80 animate-pulse"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80 animate-pulse delay-75"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 animate-pulse delay-150"></div>
          </div>
          <span className="text-blue-500 text-xs font-black tracking-[0.2em] uppercase italic">Analyzing National Register...</span>
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
  
  if (state === AuditState.RESULTS) {
    return (
      <div className="bg-slate-900/50 p-10 md:p-16 rounded-[4rem] shadow-2xl border border-slate-800 max-w-2xl text-center relative overflow-hidden animate-in fade-in zoom-in-95">
        <h5 className="font-black text-4xl text-white mb-6 tracking-tight">Strategy Ready!</h5>
        <p className="text-slate-400 text-xl mb-12 leading-relaxed font-medium">
          Where should we send the full Go-To-Market report?
        </p>
        <form onSubmit={handleLeadSubmit} className="space-y-4 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-8 py-6 bg-slate-800 border border-slate-700 rounded-[2rem] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-xl text-center transition-all text-white"
            required
          />
          <input
            type="email"
            placeholder="Work Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-8 py-6 bg-slate-800 border border-slate-700 rounded-[2rem] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-xl text-center transition-all text-white"
            pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
            title="Please enter a valid email address."
            required
          />
          <input
            type="tel"
            placeholder="Your Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-8 py-6 bg-slate-800 border border-slate-700 rounded-[2rem] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-xl text-center transition-all text-white"
            pattern="[\d\s\+\(\)-]{8,}"
            title="Please enter a valid phone number."
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-6 rounded-[2rem] transition-all shadow-2xl shadow-blue-900/50 text-xl uppercase tracking-widest"
          >
            Go to Dashboard
          </button>
        </form>
      </div>
    )
  }

  return null;
};

export default AuditWidget;
