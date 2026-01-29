
"use client";

import AuditWidget from "@/components/audit-widget";
import { Header } from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { Box, Map, DollarSign, Lock } from "lucide-react";
import Image from 'next/image';

const EvidenceStep = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
  <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 text-left h-full">
    <div className="flex items-center gap-4">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600/20 text-blue-400 rounded-2xl border border-blue-500/20">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
    </div>
    <p className="text-slate-400 mt-4">{children}</p>
  </div>
);

const BeforeVisual = () => (
  <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-6 space-y-3 h-full text-left">
    <div className="font-mono text-xs text-slate-500 p-3 bg-slate-900 rounded-lg">CPCCWHS1001 - Prepare to work safely in the construction industry</div>
    <div className="font-mono text-xs text-slate-500 p-3 bg-slate-900 rounded-lg">CPCCOM1012 - Work effectively and sustainably in the construction industry</div>
    <div className="font-mono text-xs text-slate-500 p-3 bg-slate-900 rounded-lg">CPCCOM1014 - Conduct workplace communication</div>
    <div className="font-mono text-xs text-slate-500 p-3 bg-slate-900 rounded-lg">CPCCOM1015 - Carry out measurements and calculations</div>
    <div className="font-mono text-xs text-slate-500 p-3 bg-slate-900 rounded-lg">CPCCCM2001 - Read and interpret plans and specifications</div>
  </div>
);

const AfterVisual = () => (
    <div className="bg-slate-900/30 border border-blue-500/30 rounded-3xl p-6 h-full flex flex-col justify-center items-center">
        <div className="space-y-4 w-full max-w-xs">
            {/* Line 1 */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-500/20">1</div>
                <div className="h-1.5 flex-1 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full"></div>
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-amber-500/20">2</div>
            </div>
            {/* Vertical connector */}
            <div className="flex justify-end pr-2">
                 <div className="w-1.5 h-10 bg-amber-500"></div>
            </div>
            {/* Line 2 */}
            <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-rose-500/20">3</div>
                 <div className="h-1.5 flex-1 bg-gradient-to-r from-rose-500 to-amber-500 rounded-full"></div>
                 <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-dashed border-slate-500 flex items-center justify-center text-slate-400">
                     <Lock size={14}/>
                 </div>
            </div>
        </div>
        <p className="text-blue-300 text-sm font-bold mt-6">...and 5 more unlockable stages.</p>
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
            Stop selling generic Diplomas to cold traffic. Paste any RTO Number below. We will use AI to unbundle it into a high-converting 3-Tier Revenue Staircase in 30 seconds.
          </p>
          <div className="mt-12">
            <AuditWidget />
          </div>
        </section>

        {/* 3-STEP EVIDENCE BAR */}
        <section className="w-full max-w-6xl mx-auto pb-16 md:pb-24">
            <div className="grid md:grid-cols-3 gap-8">
                <EvidenceStep icon={<Box size={20} />} title="1. We Unbundle Your Scope">
                    Our AI analyzes your entire scope of registration to find the most commercially viable qualifications to unbundle.
                </EvidenceStep>
                <EvidenceStep icon={<Map size={20} />} title="2. We Visualize the Path">
                    We transform boring compliance documents into a gamified visual roadmap that students actually want to complete.
                </EvidenceStep>
                <EvidenceStep icon={<DollarSign size={20} />} title="3. We Automate the Upsell">
                    Our 3-Tier model creates a "revenue staircase" that turns low-cost introductory courses into high-value diploma sales.
                </EvidenceStep>
            </div>
        </section>
        
        {/* VISUAL PATHWAY SECTION */}
        <section className="w-full max-w-6xl mx-auto py-16 md:py-24">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">Your students don't read PDFs. They follow paths.</h2>
            <p className="text-lg text-slate-400 mb-12 max-w-3xl mx-auto">We automatically turn your boring Training Strategy into a gamified Visual Roadmap that students actually want to finish.</p>
            <div className="grid md:grid-cols-2 gap-8 items-stretch">
                <div>
                    <h3 className="font-bold text-rose-300 mb-4 text-left text-lg">Confusing Compliance</h3>
                    <BeforeVisual />
                </div>
                <div>
                    <h3 className="font-bold text-emerald-300 mb-4 text-left text-lg">Compelling Career</h3>
                    <AfterVisual />
                </div>
            </div>
        </section>

        {/* LIFETIME LOOP SECTION */}
        <section className="w-full max-w-6xl mx-auto py-16 md:py-24">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">Stop paying for the same student twice.</h2>
             <p className="text-lg text-slate-400 mb-12 max-w-3xl mx-auto">
                Most RTOs sell a qualification and say goodbye. The ScopeStack Loop uses Tier 1 to pay for ads, Tier 2 to generate cash, and Tier 3 to maximize profit—all from one student.
            </p>
            <div className="relative w-full max-w-4xl mx-auto bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
                 <Image 
                    src="https://raw.githubusercontent.com/mstaal1974/Brand-Guide-/main/assets/Lifetime%20skill.jpg" 
                    alt="Student Lifetime Loop Diagram"
                    width={1024}
                    height={768}
                    className="rounded-xl"
                  />
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
