
"use client";

import AuditWidget from "@/components/audit-widget";
import { Header } from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CircleCheckBig, CircleX, Zap, ShieldCheck } from "lucide-react";
import Image from 'next/image';

const PainPoint = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-start gap-3">
        <CircleX className="w-5 h-5 text-rose-400 mt-1 shrink-0" />
        <span className="text-lg text-slate-300">{children}</span>
    </div>
)

const GainPoint = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-start gap-3">
        <CircleCheckBig className="w-5 h-5 text-emerald-400 mt-1 shrink-0" />
        <span className="text-lg text-slate-100 font-medium">{children}</span>
    </div>
)

const LogicProof = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 text-left">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600/20 text-blue-400 rounded-2xl mb-4 border border-blue-500/20">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400">{children}</p>
    </div>
);

const FloatingLabel = ({ text, className }: { text: string, className?: string }) => (
  <div className={cn("absolute p-4 rounded-full text-xs font-bold bg-slate-900/50 text-white backdrop-blur-sm border border-slate-700 whitespace-nowrap shadow-lg", className)}>
      <div className="absolute -inset-1 bg-blue-500/50 rounded-full blur-lg -z-10 animate-pulse-grow" />
      {text}
  </div>
);


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-body strategic-theme-glow">
      <Header />
      <main className="flex-1 flex flex-col items-center p-4 md:p-8 text-center overflow-x-hidden">
        
        {/* HERO SECTION */}
        <section className="w-full max-w-4xl mx-auto py-16 md:py-24 animate-in fade-in duration-1000">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-slate-50 to-slate-400">
            Turn One Qualification into Three Revenue Streams.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-3xl mx-auto">
            Stop selling generic Diplomas to cold traffic. Enter an RTO number for a full scope audit, or a single qualification code to see its potential. Our AI will unbundle it into a high-converting 3-Tier Revenue Staircase in 30 seconds.
          </p>
          <div className="mt-12">
            <AuditWidget />
          </div>
        </section>
        
        {/* PAIN VS GAIN SECTION */}
        <section className="w-full max-w-6xl mx-auto py-16 md:py-24">
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
                <div className="bg-rose-900/20 border border-rose-500/20 rounded-3xl p-8 space-y-6 text-left">
                    <h2 className="text-2xl font-bold text-rose-300">The Old RTO Model (You Now)</h2>
                    <PainPoint><b>High Risk:</b> Selling $5k courses to cold leads.</PainPoint>
                    <PainPoint><b>Slow Cash:</b> Wait 12 months for completion payments.</PainPoint>
                    <PainPoint><b>Commodity:</b> Competing on price with everyone else.</PainPoint>
                </div>
                <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-3xl p-8 space-y-6 text-left">
                     <h2 className="text-2xl font-bold text-emerald-300">The ScopeStack Model (You Tomorrow)</h2>
                     <GainPoint><b>Zero Risk:</b> Leads pay for themselves (Tier 1).</GainPoint>
                     <GainPoint><b>Fast Cash:</b> Get paid in 7 days (Tier 2).</GainPoint>
                     <GainPoint><b>Monopoly:</b> Selling unique "Career Pathways."</GainPoint>
                </div>
            </div>
        </section>

        {/* LOGIC PROOF SECTION */}
        <section className="w-full max-w-6xl mx-auto py-16 md:py-24">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-4">Why RTOs use ScopeStack.ai</h2>
            <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">It's not magic, it's just better commercial logic.</p>
            <div className="grid md:grid-cols-3 gap-8">
                <LogicProof icon={<Zap />} title="⚡ Speed to Market">
                    Launch new products next week, not next year. We map the compliance for you.
                </LogicProof>
                <LogicProof icon={<ShieldCheck />} title="🎯 CAC Reduction">
                    Slash your Cost Per Lead. Sell a $97 Tier 1 product to acquire customers for free.
                </LogicProof>
                <LogicProof icon={<ShieldCheck />} title="🛡️ Audit Ready">
                    Every strategy is mapped to specific Units of Competency. ASQA-friendly unbundling.
                </LogicProof>
            </div>
        </section>

        
        {/* TEASE SECTION */}
        <section className="w-full py-16 md:py-24 relative">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-4">This isn't just a list of units.</h2>
            <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">It's a complete Go-To-Market strategy, delivered in seconds.</p>

            <div className="max-w-4xl mx-auto relative">
                {/* Blurred background mockup */}
                <div className="relative aspect-[4/3] sm:aspect-video rounded-3xl bg-slate-900 border-2 border-slate-800 p-4 flex flex-col gap-2 filter blur-sm opacity-60">
                    <div className="flex gap-2">
                        <div className="w-1/4 h-20 bg-slate-800 rounded-lg"></div>
                        <div className="w-3/4 h-20 bg-slate-800 rounded-lg"></div>
                    </div>
                    <div className="w-full h-full bg-slate-800 rounded-lg"></div>
                </div>

                {/* Floating Labels */}
                <FloatingLabel text="💰 $145k Opportunity Found" className="top-1/4 left-1/4 -translate-x-1/2" />
                <FloatingLabel text="📉 Marketing Ad Copy Included" className="top-1/2 right-1/4 translate-x-1/2" />
                <FloatingLabel text="🗺️ Student Visual Pathway" className="bottom-1/4 left-1/2 -translate-x-1/2" />
            </div>
        </section>


        {/* FINAL CTA */}
        <footer className="w-full py-16 md:py-24">
            <div className="bg-blue-600/10 border border-blue-500/20 rounded-3xl p-12 max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-black text-white">Your Scope of Registration is a Goldmine.</h2>
                <p className="text-xl text-slate-300 mt-4 mb-8">Stop sitting on it.</p>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-200 font-bold text-lg px-8 py-6 rounded-2xl shadow-lg shadow-white/10" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    Start Free Audit
                </Button>
            </div>
        </footer>
      </main>
    </div>
  );
}
