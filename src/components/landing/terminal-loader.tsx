"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { HardDrive, Loader, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { runFullAudit } from "@/app/actions";

const logs = [
  { text: "Initializing audit sequence...", delay: 100 },
  { text: "Establishing secure connection to TGA...", delay: 200 },
  { text: "Fetching RTO scope from registry by ID...", delay: 500 },
  { text: "Successfully retrieved scope from TGA registry.", delay: 800 },
  { text: "Curriculum scope identified. Beginning analysis.", delay: 200 },
  { text: "Activating Revenue Opportunity Model...", delay: 500 },
  { text: "Analyzing market demand vectors...", delay: 1000 },
  { text: "Cross-referencing skill gap database...", delay: 1200 },
  { text: "Calibrating pricing models...", delay: 600 },
  { text: "Generating multi-perspective report...", delay: 900 },
  { text: "Audit complete. Finalizing dashboard...", delay: 500 },
];

export function TerminalLoader() {
  const [rtoId, setRtoId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [displayedLogs, setDisplayedLogs] = useState<string[]>([]);
  const router = useRouter();
  const { toast } = useToast();
  const logsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading) {
      setDisplayedLogs([]);
      let logIndex = 0;
      const processLogs = () => {
        if (logIndex < logs.length) {
          const log = logs[logIndex];
          setTimeout(() => {
            setDisplayedLogs((prev) => [...prev, log.text]);
            logIndex++;
            processLogs();
          }, log.delay);
        }
      };
      processLogs();
    }
  }, [isLoading]);

  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [displayedLogs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rtoId.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter an RTO ID to begin the audit.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    
    try {
      const result = await runFullAudit(rtoId.trim());
      if (result.error) {
        throw new Error(result.error);
      }
      if (!result.data) {
        throw new Error("Audit did not return any data.");
      }
      
      sessionStorage.setItem("auditData", JSON.stringify(result.data));

      const totalDelay = logs.reduce((acc, log) => acc + log.delay, 0);

      setTimeout(() => {
        router.push(`/dashboard`);
      }, totalDelay + 500);


    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        title: "Audit Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl bg-accent/90 text-accent-foreground backdrop-blur-sm border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] font-code">
      <div className="flex items-center gap-2 p-3 border-b border-white/10">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <p className="ml-auto text-sm text-gray-400">/revenue-audit/v1</p>
      </div>
      <div className="p-4 md:p-6">
        {isLoading ? (
          <div ref={logsContainerRef} className="h-64 overflow-y-auto pr-2 text-sm">
            {displayedLogs.map((log, i) => (
              <p key={i} className="mb-1">
                <span className="text-green-400 mr-2">[INFO]</span>
                {log}
              </p>
            ))}
             {displayedLogs.length > 0 && displayedLogs.length < logs.length && (
               <div className="flex items-center text-gray-400">
                  <Loader className="animate-spin mr-2 h-4 w-4" />
                  <span>Processing...</span>
               </div>
             )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-start gap-3">
              <HardDrive className="h-6 w-6 text-primary mt-2" />
              <div>
                <h3 className="text-lg font-bold">Start Your Revenue Audit</h3>
                <p className="text-sm text-gray-400">
                  Enter the ID of your Registered Training Organisation to begin analysis.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary text-lg font-bold">&gt;</span>
              <Input
                type="text"
                value={rtoId}
                onChange={(e) => setRtoId(e.target.value)}
                placeholder="e.g., '90003'"
                className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500 text-base"
                disabled={isLoading}
                autoFocus
              />
              <span className="cursor-blink bg-primary w-2 h-5"></span>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              <Search className="mr-2 h-4 w-4" />
              Begin Audit
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
