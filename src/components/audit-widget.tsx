
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { runStage1Action, runStage2Action, runStage3Action } from '@/app/actions';
import type { FullAuditInput, FullAuditOutput, RevenueStaircaseInput } from '@/ai/types';
import { Lock, Zap, Loader2, CheckCircle, XCircle, Circle, Rocket } from 'lucide-react';
import { getFirestore, collection, getDocs, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


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
  const [auditType, setAuditType] = useState<'qual' | 'rto'>('qual');
  const [rtoCode, setRtoCode] = useState('');
  const [qualCode, setQualCode] = useState('');

  const [state, setState] = useState<AuditState>(AuditState.IDLE);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const { toast } = useToast();
  const router = useRouter();
  
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([]);

  const updateProgress = (stepIndex: number, status: ProgressStep['status'], details?: string) => {
      setProgressSteps(prev => {
          const newSteps = [...prev];
          if (!newSteps[stepIndex]) return prev;
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
    
    const isRtoAudit = auditType === 'rto';

    if (isRtoAudit && !rtoCode) {
      toast({ variant: "destructive", title: "RTO Number Required", description: "Please enter an RTO number to start the audit." });
      return;
    }
    if (!isRtoAudit && !qualCode) {
      toast({ variant: "destructive", title: "Qualification Code Required", description: "Please enter a qualification code to start the analysis." });
      return;
    }

    const initialProgressRTO: ProgressStep[] = [
      { name: 'Connecting to National Register...', status: 'pending' },
      { name: 'Analysing Full Scope & Competitors...', status: 'pending' },
      { name: 'AI Stage 1: Sector & Occupation Analysis', status: 'pending' },
      { name: 'AI Stage 2: Skills Demand Heatmap', status: 'pending' },
      { name: 'AI Stage 3: 3-Tier Revenue Staircase Design', status: 'pending' },
      { name: 'Finalizing Report...', status: 'pending' },
    ];

    const initialProgressQual: ProgressStep[] = [
      { name: 'Looking up Qualification details...', status: 'pending' },
      { name: 'Preparing for AI Analysis...', status: 'pending' },
      { name: 'AI Stage 1: Market & Occupation Analysis', status: 'pending' },
      { name: 'AI Stage 2: Core Skills Analysis', status: 'pending' },
      { name: 'AI Stage 3: 3-Tier Revenue Staircase Design', status: 'pending' },
      { name: 'Finalizing Report...', status: 'pending' },
    ];
    
    const steps = isRtoAudit ? initialProgressRTO : initialProgressQual;
    setProgressSteps(steps);
    setState(AuditState.PROCESSING);
    
    // Fake 3-second delay to build anticipation
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
      updateProgress(0, 'running');
      const db = getFirestore();
      const qualificationsRef = collection(db, "qualifications");
      
      let querySnapshot;
      let rtoIdForAudit: string;

      if (isRtoAudit) {
        const q = query(qualificationsRef, where("rtoCode", "==", rtoCode.trim()), where("usageRecommendation", "==", "Current"));
        querySnapshot = await getDocs(q);
        rtoIdForAudit = rtoCode.trim();
      } else { // auditType === 'qual'
        const q = query(qualificationsRef, where("code", "==", qualCode.trim().toUpperCase()), where("usageRecommendation", "==", "Current"));
        querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            rtoIdForAudit = querySnapshot.docs[0].data().rtoCode;
        } else {
            rtoIdForAudit = 'N/A'; // Will throw error below
        }
      }

      if (querySnapshot.empty) {
        const identifier = isRtoAudit ? `RTO ID "${rtoCode}"` : `Qualification Code "${qualCode}"`;
        throw new Error(`${identifier} is invalid or has no 'Current' qualifications. Please check the code and try again.`);
      }

      const successMessage1 = isRtoAudit 
        ? `Found ${querySnapshot.size} current qualification(s) on scope.`
        : `Successfully located qualification ${qualCode.trim().toUpperCase()}.`;
      updateProgress(0, 'success', successMessage1);
      
      updateProgress(1, 'running');
      const allQualifications = querySnapshot.docs.map(doc => doc.data());
      const rtoName = allQualifications.length > 0 ? (allQualifications[0] as any).rtoLegalName : "";
      
      const scopeData = isRtoAudit ? allQualifications : [allQualifications[0]];
      
      const scopeItems: string[] = scopeData.map((data: any) => {
        return `${data.code || ''},${data.title || ''},`;
      });
      const manualScopeDataset = scopeItems.join('\n');
      
      const baseAuditInput: FullAuditInput = { 
        rtoId: rtoIdForAudit, 
        rtoName: rtoName,
        manualScopeDataset: manualScopeDataset 
      };
      
      const successMessage2 = isRtoAudit
        ? `Analyzing ${rtoName}...`
        : `Analyzing single qualification for RTO: ${rtoName || rtoIdForAudit}...`;
      updateProgress(1, 'success', successMessage2);

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
        <form onSubmit={handleAudit}>
            <Tabs defaultValue="qual" onValueChange={(value) => setAuditType(value as 'qual' | 'rto')} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 bg-slate-800/50 border-slate-700 text-slate-400">
                    <TabsTrigger value="qual">Single Qualification</TabsTrigger>
                    <TabsTrigger value="rto">Full Scope Audit</TabsTrigger>
                </TabsList>
                
                <div className="flex flex-col sm:flex-row gap-4">
                    {auditType === 'rto' ? (
                        <input
                            type="text"
                            placeholder="Enter your RTO Number (e.g., 45123)..."
                            value={rtoCode}
                            onChange={(e) => setRtoCode(e.target.value)}
                            className="flex-grow px-6 py-5 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-bold text-xl text-white transition-all text-center sm:text-left placeholder:text-slate-400"
                        />
                    ) : (
                        <input
                            type="text"
                            placeholder="Enter Qualification Code (e.g., RII30820)..."
                            value={qualCode}
                            onChange={(e) => setQualCode(e.target.value)}
                            className="flex-grow px-6 py-5 bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-bold text-xl text-white transition-all text-center sm:text-left placeholder:text-slate-400"
                        />
                    )}
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-5 rounded-2xl transition-all shadow-lg shadow-blue-500/30 active:scale-[0.98] text-xl inline-flex items-center justify-center gap-2"
                    >
                        Reveal Revenue Strategy <Rocket className="w-5 h-5" />
                    </button>
                </div>
            </Tabs>
        </form>
      </div>
    );
  }

  if (state === AuditState.PROCESSING || state === AuditState.ERROR) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 backdrop-blur-md p-10 max-w-2xl mx-auto rounded-3xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-2.5">
            <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: '0.2s'}}></div>
          </div>
          <span className="text-blue-400 text-xs font-black tracking-[0.2em] uppercase italic">Analyzing...</span>
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
                            {isPending && <Circle className="w-5 h-5 text-slate-600" />}
                        </div>
                        <div className="flex-1 text-left">
                            <p className={`font-bold text-slate-100`}>{step.name}</p>
                            {step.details && <p className={`text-xs mt-1 font-mono ${statusColor}`}>{step.details}</p>}
                        </div>
                    </div>
                );
            })}
        </div>
        
        {state === AuditState.ERROR && (
          <div className="mt-8">
             <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl mb-6 text-left">
                <p className="text-rose-300 font-bold text-sm">An Error Occurred</p>
                <p className="text-rose-400/80 text-xs mt-1 font-mono">{progressSteps.find(s => s.status === 'error')?.details}</p>
             </div>
            <button
              onClick={() => setState(AuditState.IDLE)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-100 font-black px-8 py-4 rounded-2xl transition-all text-lg active:scale-[0.98]"
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
      <div className="bg-white/80 border border-slate-200 backdrop-blur-md p-10 md:p-16 max-w-2xl text-center relative overflow-hidden animate-in fade-in zoom-in-95 rounded-3xl shadow-2xl">
        <h5 className="font-black text-4xl text-slate-900 mb-6 tracking-tight">Strategy Ready!</h5>
        <p className="text-slate-600 text-xl mb-12 leading-relaxed font-medium">
          Where should we send the full Go-To-Market report?
        </p>
        <form onSubmit={handleLeadSubmit} className="space-y-4 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-8 py-6 bg-white/50 border-2 border-slate-200 rounded-[2rem] focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-bold text-xl text-center transition-all text-slate-900 placeholder:text-slate-400"
            required
          />
          <input
            type="email"
            placeholder="Work Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-8 py-6 bg-white/50 border-2 border-slate-200 rounded-[2rem] focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-bold text-xl text-center transition-all text-slate-900 placeholder:text-slate-400"
            pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
            title="Please enter a valid email address."
            required
          />
          <input
            type="tel"
            placeholder="Your Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-8 py-6 bg-white/50 border-2 border-slate-200 rounded-[2rem] focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-bold text-xl text-center transition-all text-slate-900 placeholder:text-slate-400"
            pattern="[\d\s\+\(\)-]{8,}"
            title="Please enter a valid phone number."
            required
          />
          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-blue-600 text-white font-black py-6 rounded-[2rem] transition-all shadow-2xl shadow-slate-900/30 text-xl uppercase tracking-widest"
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
