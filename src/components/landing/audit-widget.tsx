"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { runFullAudit } from "@/app/actions";

enum AuditState {
  IDLE,
  PROCESSING,
  ERROR,
}

type AuditLog = {
  message: string;
  status: 'info' | 'success' | 'error' | 'warning';
  timestamp: Date;
};

export function AuditWidget() {
  const [rtoCode, setRtoCode] = useState('');
  const [state, setState] = useState<AuditState>(AuditState.IDLE);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const router = useRouter();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string, status: AuditLog['status'] = 'info') => {
    setLogs(prev => [...prev, { message, status, timestamp: new Date() }]);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const handleAudit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!rtoCode) return;

    setState(AuditState.PROCESSING);
    setLogs([]);
    
    addLog(`INITIATING CALIBRATED PRICING AUDIT v4.5...`, 'info');
    await delay(100);
    addLog('[1/5] ANALYZING TGA SCOPE FOR SHORT-FORM CLUSTERS...', 'info');
    
    try {
      const auditPromise = runFullAudit(rtoCode);

      const logPromise = (async () => {
        await delay(1500);
        addLog('[2/5] FETCHING VERIFIED LABOR MARKET DATA...', 'info');
        await delay(1500);
        addLog('[3/5] APPLYING 3-STEP ANCHOR+MULTIPLIER PRICING...', 'warning');
        await delay(1500);
        addLog('[4/5] VALIDATING DATA INTEGRITY PROTOCOLS...', 'info');
        await delay(1500);
      })();

      const [result, _] = await Promise.all([auditPromise, logPromise]);
      
      if (result.error) {
        throw new Error(result.error);
      }
      if (!result.data) {
        throw new Error("Audit did not return any data.");
      }
      
      addLog('[5/5] GENERATING SALES & CURRICULUM BLUEPRINTS...', 'success');
      await delay(500);
      
      localStorage.setItem("auditData", JSON.stringify(result.data));
      router.push(`/dashboard`);

    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      addLog(`FATAL: Engine failed. ${errorMessage}`, 'error');
      setState(AuditState.ERROR);
      // Give user time to see error log
      setTimeout(() => {
        toast({
            title: "Audit Failed",
            description: errorMessage,
            variant: "destructive",
        });
        setState(AuditState.IDLE);
        setLogs([]);
      }, 3000);
    }
  };

  if (state === AuditState.IDLE || state === AuditState.ERROR) {
    return (
      <div className="bg-white rounded-[2.5rem] shadow-2xl p-12 border border-slate-200 max-w-2xl mx-auto transform transition-all hover:border-blue-500/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight italic">Verified Audit AI</h3>
        </div>
        <p className="text-slate-500 mb-10 leading-relaxed text-lg font-medium text-left">
          Our v4.5 engine uses real-time ABS and TGA feeds with <strong>calibrated anchor pricing</strong> to architect high-intent course stacks.
        </p>
        <form onSubmit={handleAudit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="RTO Code (e.g. 90003)"
            value={rtoCode}
            onChange={(e) => setRtoCode(e.target.value)}
            className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-xl transition-all"
            required
            autoFocus
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
        <div ref={scrollRef} className="h-80 overflow-y-auto font-mono text-xs md:text-sm space-y-4 py-2 text-left">
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
          <div className="text-slate-200 pl-4 border-l-2 border-slate-800 ml-1 py-1">
             <div className="cursor-blink bg-blue-400 w-2 h-4"></div>
          </div>
        </div>
      </div>
  );
}
