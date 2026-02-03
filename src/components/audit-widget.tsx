"use client";

import React, { useState, useEffect, useRef } from 'react';
import { runStage1Action, runStage2Action, runStage3Action, runScopeFallbackAction } from '@/app/actions';
import type { FullAuditInput, FullAuditOutput, RevenueStaircaseInput } from '@/ai/types';
import { Lock, Zap, Loader2, CheckCircle, XCircle, Circle, Rocket, Search, Database, Cpu, ExternalLink, AlertCircle, ShieldAlert } from 'lucide-react';
import { getFirestore, collection, getDocs, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';


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
  source?: 'db' | 'ai';
};


const AuditWidget: React.FC = () => {
  const [auditType, setAuditType] = useState<'qual' | 'rto'>('qual');
  const [rtoCode, setRtoCode] = useState('');
  const [qualCode, setQualCode] = useState('');

  const [state, setState] = useState<AuditState>(AuditState.IDLE);
  const [result, setResult] = useState<AuditResult | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([]);
  const [progress, setProgress] = useState(0);

  const updateProgress = (stepIndex: number, status: ProgressStep['status'], details?: string, source?: 'db' | 'ai') => {
      setProgressSteps(prev => {
          const newSteps = [...prev];
          if (!newSteps[stepIndex]) return prev;
          newSteps[stepIndex] = { ...newSteps[stepIndex], status, details, source };
          if (status === 'running') {
              for (let i = stepIndex + 1; i < newSteps.length; i++) {
                  newSteps[i].status = 'pending';
              }
          }
          const completedSteps = newSteps.filter(s => s.status === 'success').length;
          const progressPercentage = (completedSteps / newSteps.length) * 100;
          setProgress(progressPercentage);
          return newSteps;
      });
  };

  const handleAudit = async (e?: React.FormEvent, override?: {auditType: 'qual' | 'rto', code: string}) => {
    e?.preventDefault();
    
    const isRtoAudit = override ? override.auditType === 'rto' : auditType === 'rto';
    const code = override ? override.code : (isRtoAudit ? rtoCode : qualCode);

    if (isRtoAudit && !code) {
      toast({ variant: "destructive", title: "RTO Number Required", description: "Please enter an RTO number to start the audit." });
      return;
    }
    if (!isRtoAudit && !code) {
      toast({ variant: "destructive", title: "Qualification Code Required", description: "Please enter a qualification code to start the analysis." });
      return;
    }

    const initialProgressRTO: ProgressStep[] = [
      { name: 'Connecting to Database...', status: 'pending' },
      { name: 'Gathering RTO Scope Data...', status: 'pending' },
      { name: 'AI Stage 1: Sector & Occupation Analysis', status: 'pending' },
      { name: 'AI Stage 2: Skills Demand Heatmap', status: 'pending' },
      { name: 'AI Stage 3: 3-Tier Revenue Staircase Design', status: 'pending' },
      { name: 'Finalizing Report...', status: 'pending' },
    ];

    const initialProgressQual: ProgressStep[] = [
      { name: 'Looking up Qualification...', status: 'pending' },
      { name: 'Preparing AI Dataset...', status: 'pending' },
      { name: 'AI Stage 1: Market & Occupation Analysis', status: 'pending' },
      { name: 'AI Stage 2: Core Skills Analysis', status: 'pending' },
      { name: 'AI Stage 3: 3-Tier Revenue Staircase Design', status: 'pending' },
      { name: 'Finalizing Report...', status: 'pending' },
    ];
    
    const steps = isRtoAudit ? initialProgressRTO : initialProgressQual;
    setProgressSteps(steps);
    setProgress(0);
    setState(AuditState.PROCESSING);

    try {
      updateProgress(0, 'running');
      const db = getFirestore();
      const qualificationsRef = collection(db, "qualifications");
      
      let querySnapshot = null;
      let rtoIdForAudit: string = code.trim();
      let manualScopeDataset: string = "";
      let rtoName: string = "";
      let dataSource: 'db' | 'ai' = 'db';

      // 1. DATABASE LOOKUP
      if (isRtoAudit) {
        // Multi-stage database query for RTO ID
        let q = query(qualificationsRef, where("rtoCode", "==", code.trim()), where("usageRecommendation", "==", "Current"));
        querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            q = query(qualificationsRef, where("rtoCode", "==", code.trim()));
            querySnapshot = await getDocs(q);
        }

        if (querySnapshot.empty && !isNaN(Number(code))) {
             q = query(qualificationsRef, where("rtoCode", "==", Number(code)));
             querySnapshot = await getDocs(q);
        }
      } else {
        // Qualification Code Lookup
        const q = query(qualificationsRef, where("code", "==", code.trim().toUpperCase()));
        querySnapshot = await getDocs(q);
      }

      // 2. PROCESS RESULTS OR FALLBACK
      if (querySnapshot && !querySnapshot.empty) {
        updateProgress(0, 'success', isRtoAudit ? `Found ${querySnapshot.size} local qualification(s).` : `Located qualification ${code.trim().toUpperCase()}.`, 'db');
        
        updateProgress(1, 'running');
        const allQualifications = querySnapshot.docs.map(doc => doc.data());
        rtoName = allQualifications.length > 0 ? (allQualifications[0] as any).rtoLegalName || (allQualifications[0] as any).rtoName : "";
        rtoIdForAudit = isRtoAudit ? code.trim() : (allQualifications[0] as any).rtoCode;
        
        const scopeData = isRtoAudit ? allQualifications : [allQualifications[0]];
        const scopeItems: string[] = scopeData.map((data: any) => {
          return `${data.code || ''},${data.title || ''},${data.anzsco || ''}`;
        });
        manualScopeDataset = scopeItems.join('\n');
        
        updateProgress(1, 'success', `Analysing scope for: ${rtoName || rtoIdForAudit}...`);
      } else {
        // FALLBACK: AI Search
        dataSource = 'ai';
        updateProgress(0, 'running', 'No local records found. Initializing AI Deep Search...', 'ai');
        const fallbackResponse = await runScopeFallbackAction({ code, isRtoAudit });
        
        if (fallbackResponse.ok && fallbackResponse.result.manualScopeDataset) {
            manualScopeDataset = fallbackResponse.result.manualScopeDataset;
            rtoName = fallbackResponse.result.rtoName;
            rtoIdForAudit = isRtoAudit ? code.trim() : fallbackResponse.result.rtoCode;
            updateProgress(0, 'success', `AI identified ${fallbackResponse.result.count} qualifications.`, 'ai');
            updateProgress(1, 'success', `Using AI-retrieved scope for: ${rtoName}...`);
        } else {
            const identifier = isRtoAudit ? `RTO ID "${code}"` : `Qualification Code "${code}"`;
            throw new Error(`${identifier} could not be found in local records or via AI Search. Please verify the code.`);
        }
      }

      // 3. AI AUDIT STAGES
      const baseAuditInput: FullAuditInput = { 
        rtoId: rtoIdForAudit, 
        rtoName: rtoName,
        manualScopeDataset: manualScopeDataset 
      };

      // AI Stage 1
      updateProgress(2, 'running', 'Analyzing market health and ROI potential...');
      const stage1Response = await runStage1Action(baseAuditInput);
      if (!stage1Response.ok) throw new Error(`AI Stage 1 Failed: ${stage1Response.error}`);
      const stage1Result = stage1Response.result;
      updateProgress(2, 'success', `Top Sector: ${stage1Result.executive_summary.top_performing_sector}`);

      // AI Stage 2
      updateProgress(3, 'running', 'Mapping skills to employer demand signals...');
      const stage2Response = await runStage2Action(baseAuditInput);
      if (!stage2Response.ok) throw new Error(`AI Stage 2 Failed: ${stage2Response.error}`);
      const stage2Result = stage2Response.result;
      updateProgress(3, 'success', `Analyzed ${stage2Result.skills_heatmap.length} unique skills.`);

      // AI Stage 3
      const stage3Input: RevenueStaircaseInput = {
        ...baseAuditInput,
        top_performing_sector: stage1Result.executive_summary.top_performing_sector,
        skills_heatmap: stage2Result.skills_heatmap,
      };
      updateProgress(4, 'running', 'Designing tiered product architecture...');
      const stage3Response = await runStage3Action(stage3Input);
      if (!stage3Response.ok) throw new Error(`AI Stage 3 Failed: ${stage3Response.error}`);
      const stage3Result = stage3Response.result;
      updateProgress(4, 'success', 'Revenue staircase design complete.');

      updateProgress(5, 'running');
      const fullAuditResult: AuditResult = {
        rto_id: baseAuditInput.rtoId,
        rto_name: baseAuditInput.rtoName,
        manualScopeDataset: baseAuditInput.manualScopeDataset,
        ...stage1Result,
        ...stage2Result,
        ...stage3Result,
      };

      setResult(fullAuditResult);
      setState(AuditState.RESULTS);
      updateProgress(5, 'success');

    } catch (err) {
      console.error(err);
      let message = err instanceof Error ? err.message : "An unknown error occurred.";
      const runningStepIndex = progressSteps.findIndex(step => step.status === 'running');
      
      if (runningStepIndex !== -1) {
          updateProgress(runningStepIndex, 'error', message);
      } else {
          const firstPending = progressSteps.findIndex(step => step.status === 'pending');
          if (firstPending !== -1) updateProgress(firstPending, 'error', message);
      }
      setState(AuditState.ERROR);
    }
  };
  
  const handleExampleClick = (code: string) => {
    setAuditType('qual');
    setQualCode(code);
    handleAudit(undefined, { auditType: 'qual', code });
  };

  if (state === AuditState.IDLE) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-2 flex items-center gap-2 mb-4">
            <Tabs value={auditType} onValueChange={(value) => setAuditType(value as 'qual' | 'rto')} className="w-full">
                <TabsList className="bg-transparent p-0 justify-start gap-4">
                    <TabsTrigger value="qual" className="text-slate-400 data-[state=active]:text-white data-[state=active]:bg-slate-700/50 px-4 py-2 rounded-lg text-sm font-bold data-[state=active]:shadow-none h-auto transition-all">Single Qualification</TabsTrigger>
                    <TabsTrigger value="rto" className="text-slate-400 data-[state=active]:text-white data-[state=active]:bg-slate-700/50 px-4 py-2 rounded-lg text-sm font-bold data-[state=active]:shadow-none h-auto transition-all">Full Scope Audit</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
        <form onSubmit={handleAudit} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            {auditType === 'rto' ? (
                <input
                    type="text"
                    placeholder="Enter your RTO Number (e.g., 45123)..."
                    value={rtoCode}
                    onChange={(e) => setRtoCode(e.target.value)}
                    className="w-full pl-12 pr-44 py-4 bg-slate-800/80 border-2 border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base text-white placeholder:text-slate-400"
                />
            ) : (
                <input
                    type="text"
                    placeholder="Enter Qualification Code (e.g., RII30820)..."
                    value={qualCode}
                    onChange={(e) => setQualCode(e.target.value)}
                    className="w-full pl-12 pr-44 py-4 bg-slate-800/80 border-2 border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base text-white placeholder:text-slate-400"
                />
            )}
            <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-lg transition-all text-base inline-flex items-center justify-center gap-2"
            >
                Reveal Revenue Strategy <Rocket className="inline-block" />
            </button>
        </form>
         {auditType === 'qual' && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="text-xs font-medium text-slate-400">Or try an example:</span>
                <button type="button" onClick={() => handleExampleClick('CPC30220')} className="text-xs bg-slate-700/50 text-slate-300 hover:bg-slate-700 px-3 py-1 rounded-full transition-colors">Try 'Carpentry' (CPC30220)</button>
                <button type="button" onClick={() => handleExampleClick('BSB50120')} className="text-xs bg-slate-700/50 text-slate-300 hover:bg-slate-700 px-3 py-1 rounded-full transition-colors">Try 'Leadership' (BSB50120)</button>
                <button type="button" onClick={() => handleExampleClick('CHC33021')} className="text-xs bg-slate-700/50 text-slate-300 hover:bg-slate-700 px-3 py-1 rounded-full transition-colors">Try 'Individual Support' (CHC33021)</button>
            </div>
        )}
      </div>
    );
  }

  if (state === AuditState.PROCESSING || state === AuditState.ERROR) {
    const errorDetails = progressSteps.find(s => s.status === 'error')?.details || "";
    // Check for 403 Forbidden or "Blocked" message which indicates API restriction settings
    const isBlockedError = errorDetails.includes("403") || errorDetails.toLowerCase().includes("blocked") || errorDetails.toLowerCase().includes("forbidden");

    return (
      <div className="bg-slate-800/50 border border-slate-700 p-8 max-w-lg mx-auto rounded-lg">
        <div className="flex items-center justify-center mb-4">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
           <span className="text-blue-400 text-sm font-bold ml-2">Audit Pipeline Active...</span>
        </div>
        
        <div className="space-y-2 mb-6">
            <Progress value={progress} className="w-full h-2 [&>div]:bg-blue-500" />
            <p className="text-xs text-slate-400 font-medium text-right">{Math.round(progress)}% Processed</p>
        </div>

        <div className="space-y-4">
            {progressSteps.map((step, index) => {
                const isRunning = step.status === 'running';
                const isSuccess = step.status === 'success';
                const isError = step.status === 'error';
                const isPending = step.status === 'pending';
                
                return (
                    <div key={index} className="flex items-start gap-3 transition-all duration-300 text-left">
                        <div className="w-5 h-5 shrink-0 flex items-center justify-center mt-0.5">
                            {isRunning && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
                            {isSuccess && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                            {isError && <XCircle className="w-4 h-4 text-rose-400" />}
                            {isPending && <Circle className="w-4 h-4 text-slate-600" />}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <p className={`font-bold text-sm ${isPending ? 'text-slate-500' : 'text-slate-200'}`}>{step.name}</p>
                                {isSuccess && step.source === 'db' && <span className="flex items-center gap-1 text-[9px] font-black bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded uppercase"><Database size={10}/> DB Match</span>}
                                {isSuccess && step.source === 'ai' && <span className="flex items-center gap-1 text-[9px] font-black bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded uppercase"><Cpu size={10}/> AI Search</span>}
                            </div>
                            {step.details && <p className={`text-xs mt-1 text-slate-400`}>{step.details}</p>}
                        </div>
                    </div>
                );
            })}
        </div>
        
        {state === AuditState.ERROR && (
          <div className="mt-6">
             {isBlockedError ? (
                <div className="bg-rose-950/50 border border-rose-500/50 p-6 rounded-xl mb-4 text-center">
                    <div className="w-12 h-12 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldAlert className="text-rose-500 w-8 h-8" />
                    </div>
                    <h4 className="text-rose-100 font-black text-xl mb-2">Gemini API Blocked</h4>
                    <p className="text-rose-200/80 text-sm leading-relaxed mb-6 text-left">
                        Your Google Cloud Project is blocking requests to the Gemini API. This is usually due to <b>API Restrictions</b> on your key.
                        <br/><br/>
                        <b>How to Fix:</b>
                        <br/>1. Go to <b>Credentials</b> in Google Cloud.
                        <br/>2. Edit your API Key.
                        <br/>3. Set "API restrictions" to <b>"Don't restrict key"</b> OR add <b>"Generative Language API"</b> to the allowed list.
                    </p>
                    <div className="flex flex-col gap-3">
                        <Button asChild className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-6 rounded-xl shadow-xl shadow-blue-900/40">
                            <a 
                                href="https://console.cloud.google.com/apis/credentials?project=851458267599" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 text-lg"
                            >
                                LIFT KEY RESTRICTIONS <ExternalLink size={20}/>
                            </a>
                        </Button>
                        <Button asChild variant="outline" className="w-full border-white/20 text-slate-300 hover:bg-white/10 font-bold py-4 rounded-xl">
                            <a 
                                href="https://console.developers.google.com/apis/api/generativelanguage.googleapis.com/overview?project=851458267599" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2"
                            >
                                ENABLE API OVERVIEW <ExternalLink size={16}/>
                            </a>
                        </Button>
                    </div>
                </div>
             ) : (
                <div className="bg-rose-900/50 border border-rose-500/30 p-4 rounded-md mb-4 text-left">
                    <p className="text-rose-300 font-bold text-sm">Error Details</p>
                    <p className="text-rose-400/80 text-xs mt-1 leading-relaxed">{errorDetails}</p>
                </div>
             )}
            <button
              onClick={() => setState(AuditState.IDLE)}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-xl transition-all text-sm uppercase tracking-widest"
            >
              Adjust Input & Retry
            </button>
          </div>
        )}
      </div>
    );
  }
  
  if (state === AuditState.RESULTS) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 p-8 md:p-12 max-w-lg text-center relative overflow-hidden animate-in fade-in zoom-in-95 rounded-lg shadow-2xl">
        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
        </div>
        <h5 className="font-black text-3xl text-white mb-2 tracking-tight">Strategy Unlocked</h5>
        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
          Your Go-To-Market analysis is ready for review.
        </p>
        <button
          onClick={() => {
            if (result) {
              localStorage.setItem("auditData", JSON.stringify(result));
              router.push('/dashboard');
            } else {
              toast({
                variant: "destructive",
                title: "Error",
                description: "Could not finalize audit results.",
              });
            }
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-md transition-all shadow-lg text-base uppercase tracking-wider"
        >
          Access Dashboard
        </button>
      </div>
    )
  }

  return null;
};

export default AuditWidget;
