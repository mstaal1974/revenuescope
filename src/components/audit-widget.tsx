
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { runStage1Action, runStage2Action, runStage3Action } from '@/app/actions';
import type { FullAuditInput, FullAuditOutput, RevenueStaircaseInput } from '@/ai/types';
import { Lock, Zap, Loader2, CheckCircle, XCircle, Circle, Rocket, Search } from 'lucide-react';
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
      <div className="w-full">
        <form onSubmit={handleAudit}>
            <Tabs defaultValue="qual" onValueChange={(value) => setAuditType(value as 'qual' | 'rto')} className="w-full">
                <TabsList className="mb-2 bg-transparent p-0 justify-start gap-4">
                    <TabsTrigger value="qual" className="text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none p-0 h-auto text-sm font-bold data-[state=active]:border-b-2 border-primary rounded-none">Single Qualification</TabsTrigger>
                    <TabsTrigger value="rto" className="text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none p-0 h-auto text-sm font-bold data-[state=active]:border-b-2 border-primary rounded-none">Full Scope Audit</TabsTrigger>
                </TabsList>
                
                <div className="flex flex-col sm:flex-row gap-2 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    {auditType === 'rto' ? (
                        <input
                            type="text"
                            placeholder="Enter your RTO Number (e.g., 45123)..."
                            value={rtoCode}
                            onChange={(e) => setRtoCode(e.target.value)}
                            className="flex-grow pl-12 pr-4 py-3 bg-input border border-border rounded-md focus:ring-2 focus:ring-primary outline-none text-base text-foreground placeholder:text-muted-foreground"
                        />
                    ) : (
                        <input
                            type="text"
                            placeholder="Enter Qualification Code (e.g., RII30820)..."
                            value={qualCode}
                            onChange={(e) => setQualCode(e.target.value)}
                            className="flex-grow pl-12 pr-4 py-3 bg-input border border-border rounded-md focus:ring-2 focus:ring-primary outline-none text-base text-foreground placeholder:text-muted-foreground"
                        />
                    )}
                    <button
                        type="submit"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-3 rounded-md transition-all text-base inline-flex items-center justify-center gap-2"
                    >
                        Audit Now
                    </button>
                </div>
            </Tabs>
        </form>
      </div>
    );
  }

  if (state === AuditState.PROCESSING || state === AuditState.ERROR) {
    return (
      <div className="bg-card border border-border p-8 max-w-lg mx-auto rounded-lg">
        <div className="flex items-center justify-center mb-6">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
           <span className="text-primary text-sm font-bold ml-2">Analyzing...</span>
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
                            {isRunning && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
                            {isSuccess && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                            {isError && <XCircle className="w-4 h-4 text-rose-400" />}
                            {isPending && <Circle className="w-4 h-4 text-muted-foreground" />}
                        </div>
                        <div className="flex-1">
                            <p className={`font-medium text-sm text-foreground`}>{step.name}</p>
                            {step.details && <p className={`text-xs mt-1 text-muted-foreground`}>{step.details}</p>}
                        </div>
                    </div>
                );
            })}
        </div>
        
        {state === AuditState.ERROR && (
          <div className="mt-6">
             <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-md mb-4 text-left">
                <p className="text-destructive font-bold text-sm">An Error Occurred</p>
                <p className="text-destructive/80 text-xs mt-1">{progressSteps.find(s => s.status === 'error')?.details}</p>
             </div>
            <button
              onClick={() => setState(AuditState.IDLE)}
              className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold py-2 px-4 rounded-md transition-all text-sm"
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
      <div className="bg-card border border-border p-8 md:p-12 max-w-lg text-center relative overflow-hidden animate-in fade-in zoom-in-95 rounded-lg shadow-2xl">
        <h5 className="font-black text-3xl text-foreground mb-4 tracking-tight">Strategy Ready!</h5>
        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
          Where should we send the full Go-To-Market report?
        </p>
        <form onSubmit={handleLeadSubmit} className="space-y-4 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-input border border-border rounded-md focus:ring-2 focus:ring-primary outline-none font-bold text-base text-center transition-all text-foreground placeholder:text-muted-foreground"
            required
          />
          <input
            type="email"
            placeholder="Work Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-input border border-border rounded-md focus:ring-2 focus:ring-primary outline-none font-bold text-base text-center transition-all text-foreground placeholder:text-muted-foreground"
            pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
            title="Please enter a valid email address."
            required
          />
          <input
            type="tel"
            placeholder="Your Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 bg-input border border-border rounded-md focus:ring-2 focus:ring-primary outline-none font-bold text-base text-center transition-all text-foreground placeholder:text-muted-foreground"
            pattern="[\\d\\s\\+\\(\\)-]{8,}"
            title="Please enter a valid phone number."
            required
          />
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black py-4 rounded-md transition-all shadow-lg text-base uppercase tracking-wider"
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
