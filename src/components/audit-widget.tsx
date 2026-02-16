"use client";

import React, { useState } from 'react';
import { runStage1Action, runStage2Action, runStage3Action, runScopeFallbackAction } from '@/app/actions';
import type { FullAuditInput, FullAuditOutput, RevenueStaircaseInput } from '@/ai/types';
import { Lock, Zap, Loader2, CheckCircle, XCircle, Circle, Rocket, Search, Database, Cpu, ExternalLink, ShieldAlert, Sparkles, User, Mail, Phone, Download } from 'lucide-react';
import { getFirestore, collection, getDocs, query, where, doc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';


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

  // Lead Capture States
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '' });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

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

      // 1. DATABASE LOOKUP logic
      let q = query(qualificationsRef, where("rtoCode", "==", code.trim()));
      querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty && !isNaN(Number(code))) {
          q = query(qualificationsRef, where("rtoCode", "==", Number(code)));
          querySnapshot = await getDocs(q);
      }

      // 2. PROCESS RESULTS OR FALLBACK
      if (querySnapshot && !querySnapshot.empty) {
        updateProgress(0, 'success', isRtoAudit ? `Found ${querySnapshot.size} qualification(s).` : `Located qualification ${code.trim().toUpperCase()}.`, 'db');
        
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

  const handleOpenDashboard = () => {
    const existingLeadId = localStorage.getItem('leadId');
    if (existingLeadId) {
      finalizeAudit();
    } else {
      setShowLeadCapture(true);
    }
  };

  const finalizeAudit = () => {
    if (result) {
      localStorage.setItem("auditData", JSON.stringify(result));
      router.push('/dashboard');
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingLead(true);

    try {
      const db = getFirestore();
      const docRef = doc(collection(db, 'leads'));
      const leadId = docRef.id;

      const leadData = {
        id: leadId,
        name: leadForm.name,
        email: leadForm.email,
        phoneNumber: leadForm.phone,
        rtoCode: result?.rto_id || rtoCode || qualCode || 'N/A',
        createdAt: serverTimestamp(),
        timestamp: new Date().toISOString()
      };

      // Optimistic write
      setDocumentNonBlocking(docRef, leadData, { merge: true });
      localStorage.setItem('leadId', leadId);
      
      finalizeAudit();
    } catch (err) {
      toast({ variant: "destructive", title: "Sync Error", description: "Could not save verification details. Please try again." });
    } finally {
      setIsSubmittingLead(false);
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
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white font-black px-6 py-2.5 rounded-lg transition-all text-base inline-flex items-center justify-center gap-2"
            >
                Reveal Strategy <Rocket size={18} />
            </button>
        </form>
         {auditType === 'qual' && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="text-xs font-medium text-slate-400">Or try an example:</span>
                <button type="button" onClick={() => handleExampleClick('CPC30220')} className="text-xs bg-slate-700/50 text-slate-300 hover:bg-slate-700 px-3 py-1 rounded-full transition-colors font-bold border border-slate-600">Carpentry (CPC30220)</button>
                <button type="button" onClick={() => handleExampleClick('BSB50120')} className="text-xs bg-slate-700/50 text-slate-300 hover:bg-slate-700 px-3 py-1 rounded-full transition-colors font-bold border border-slate-600">Leadership (BSB50120)</button>
                <button type="button" onClick={() => handleExampleClick('CHC33021')} className="text-xs bg-slate-700/50 text-slate-300 hover:bg-slate-700 px-3 py-1 rounded-full transition-colors font-bold border border-slate-600">Individual Support (CHC33021)</button>
            </div>
        )}
      </div>
    );
  }

  if (state === AuditState.PROCESSING || state === AuditState.ERROR) {
    const errorDetails = progressSteps.find(s => s.status === 'error')?.details || "";
    const isBlockedError = errorDetails.includes("403") || errorDetails.toLowerCase().includes("blocked") || errorDetails.toLowerCase().includes("forbidden");

    return (
      <div className="bg-slate-800/50 border border-slate-700 p-8 max-w-lg mx-auto rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 animate-pulse"></div>
        <div className="flex items-center justify-center mb-6">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
           <span className="text-blue-400 text-lg font-black ml-3 tracking-tight">AI Pipeline Active</span>
        </div>
        
        <div className="space-y-2 mb-8 bg-slate-900/50 p-4 rounded-2xl border border-slate-700">
            <Progress value={progress} className="w-full h-3 [&>div]:bg-blue-500" />
            <div className="flex justify-between items-center mt-2 px-1">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Powered by Gemini 2.5 Pro</p>
                <p className="text-xs text-blue-400 font-black">{Math.round(progress)}% Processed</p>
            </div>
        </div>

        <div className="space-y-4">
            {progressSteps.map((step, index) => {
                const isRunning = step.status === 'running';
                const isSuccess = step.status === 'success';
                const isError = step.status === 'error';
                const isPending = step.status === 'pending';
                
                return (
                    <div key={index} className="flex items-start gap-3 transition-all duration-300 text-left">
                        <div className="w-6 h-6 shrink-0 flex items-center justify-center mt-0.5">
                            {isRunning && <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />}
                            {isSuccess && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                            {isError && <XCircle className="w-5 h-5 text-rose-400" />}
                            {isPending && <Circle className="w-5 h-5 text-slate-600" />}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <p className={`font-black text-sm tracking-tight ${isPending ? 'text-slate-500' : 'text-slate-200'}`}>{step.name}</p>
                                {isSuccess && step.source === 'db' && <span className="flex items-center gap-1 text-[9px] font-black bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded-md uppercase border border-emerald-500/20"><Database size={10}/> DB Match</span>}
                                {isSuccess && step.source === 'ai' && <span className="flex items-center gap-1 text-[9px] font-black bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded-md uppercase border border-blue-500/20"><Cpu size={10}/> AI Deep Search</span>}
                            </div>
                            {step.details && <p className={`text-xs mt-1 text-slate-400 font-medium leading-relaxed`}>{step.details}</p>}
                        </div>
                    </div>
                );
            })}
        </div>
        
        {state === AuditState.ERROR && (
          <div className="mt-8 animate-in slide-in-from-bottom-4">
             {isBlockedError ? (
                <div className="bg-rose-950/50 border border-rose-500/50 p-8 rounded-3xl mb-4 text-center shadow-2xl">
                    <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-rose-500/30">
                        <ShieldAlert className="text-rose-500 w-10 h-10" />
                    </div>
                    <h4 className="text-rose-100 font-black text-2xl mb-2 tracking-tight">Gemini API Blocked</h4>
                    <p className="text-rose-200/80 text-sm leading-relaxed mb-8 text-left font-medium">
                        Your Google Cloud Project is blocking requests to the Gemini API.
                    </p>
                    <div className="flex flex-col gap-3">
                        <Button asChild className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-8 rounded-2xl shadow-2xl shadow-blue-900/40 text-lg transition-all active:scale-95">
                            <a 
                                href="https://console.cloud.google.com/apis/credentials" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2"
                            >
                                LIFT KEY RESTRICTIONS <ExternalLink size={20}/>
                            </a>
                        </Button>
                    </div>
                </div>
             ) : (
                <div className="bg-rose-900/50 border border-rose-500/30 p-6 rounded-2xl mb-4 text-left shadow-lg">
                    <p className="text-rose-300 font-black text-sm uppercase tracking-widest mb-2">Error Diagnostic</p>
                    <p className="text-rose-400/80 text-xs mt-1 leading-relaxed font-bold">{errorDetails}</p>
                </div>
             )}
            <button
              onClick={() => setState(AuditState.IDLE)}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-black py-4 px-4 rounded-xl transition-all text-sm uppercase tracking-widest border border-slate-600 shadow-xl"
            >
              Adjust Input & Retry
            </button>
          </div>
        )}
      </div>
    );
  }
  
  if (state === AuditState.RESULTS) {
    if (showLeadCapture) {
        return (
            <div className="bg-slate-800/50 border border-slate-700 p-8 md:p-12 max-w-lg mx-auto text-center relative overflow-hidden animate-in fade-in zoom-in-95 rounded-3xl shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500"></div>
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20 shadow-inner">
                    <Lock className="w-8 h-8 text-blue-400" />
                </div>
                <h5 className="font-black text-2xl text-white mb-2 tracking-tight uppercase italic">Professional Access Required</h5>
                <p className="text-slate-400 text-sm mb-8 font-medium leading-relaxed">
                    Verify your details to unlock the full strategic unbundling report for <b className="text-blue-400">{result?.rto_id || 'your scope'}</b>.
                </p>
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                        <input 
                            type="text" 
                            placeholder="Full Name" 
                            required 
                            className="w-full pl-12 pr-4 py-4 bg-slate-900/80 border-2 border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-bold"
                            value={leadForm.name}
                            onChange={e => setLeadForm({...leadForm, name: e.target.value})}
                        />
                    </div>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                        <input 
                            type="email" 
                            placeholder="Work Email" 
                            required 
                            className="w-full pl-12 pr-4 py-4 bg-slate-900/80 border-2 border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-bold"
                            value={leadForm.email}
                            onChange={e => setLeadForm({...leadForm, email: e.target.value})}
                        />
                    </div>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                        <input 
                            type="tel" 
                            placeholder="Direct Phone" 
                            required 
                            className="w-full pl-12 pr-4 py-4 bg-slate-900/80 border-2 border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-bold"
                            value={leadForm.phone}
                            onChange={e => setLeadForm({...leadForm, phone: e.target.value})}
                        />
                    </div>
                    <Button 
                        type="submit" 
                        disabled={isSubmittingLead} 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-8 rounded-2xl text-xl mt-4 shadow-2xl shadow-blue-900/40 active:scale-95 transition-all group"
                    >
                        {isSubmittingLead ? <Loader2 className="animate-spin h-6 w-6" /> : (
                            <span className="flex items-center gap-2">
                                UNLOCK STRATEGY PACK <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                            </span>
                        )}
                    </Button>
                    <div className="flex items-center justify-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest mt-4">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span>Encrypted via Gemini 2.5 Pro Architecture</span>
                    </div>
                </form>
            </div>
        )
    }

    return (
      <div className="bg-slate-800/50 border border-slate-700 p-10 md:p-16 max-w-lg mx-auto text-center relative overflow-hidden animate-in fade-in zoom-in-95 rounded-3xl shadow-2xl">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-emerald-500/30 shadow-inner">
            <CheckCircle className="w-12 h-12 text-emerald-400" />
        </div>
        <h5 className="font-black text-4xl text-white mb-3 tracking-tighter">Analysis Prepared</h5>
        <p className="text-slate-400 text-xl mb-10 leading-relaxed font-medium">
          Your Go-To-Market logic has been synthesized using Gemini 2.5 Pro. Access your dashboard to reveal the results.
        </p>
        <button
          onClick={handleOpenDashboard}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-6 rounded-2xl transition-all shadow-2xl shadow-blue-500/20 text-lg uppercase tracking-wider group"
        >
          <span className="flex items-center justify-center gap-2">
            Open Intelligence Dashboard <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </span>
        </button>
      </div>
    )
  }

  return null;
};

export default AuditWidget;