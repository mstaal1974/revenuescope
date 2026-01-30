"use client";

import AuditWidget from "@/components/audit-widget";
import { Header } from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CircleCheckBig, CircleX, Zap, ShieldCheck, Milestone, Box, Repeat, DollarSign } from "lucide-react";
import Image from 'next/image';

const PainPoint = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-start gap-3">
        <CircleX className="w-5 h-5 text-rose-400 mt-1 shrink-0" />
        <span className="text-lg text-slate-600">{children}</span>
    </div>
)

const GainPoint = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-start gap-3">
        <CircleCheckBig className="w-5 h-5 text-emerald-400 mt-1 shrink-0" />
        <span className="text-lg text-slate-800 font-medium">{children}</span>
    </div>
)

const EvidenceStep = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-4 border-2 border-slate-200 shadow-inner">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="text-slate-500">{children}</p>
    </div>
);


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-body bg-slate-50">
      <Header />
      <main className="flex-1 flex flex-col items-center p-4 md:p-8 text-center overflow-x-hidden">
        
        {/* HERO SECTION */}
        <section className="w-full max-w-4xl mx-auto py-16 md:py-24 animate-in fade-in duration-1000">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900">
            Turn One Qualification into Three Revenue Streams.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-500 max-w-3xl mx-auto">
            Stop selling generic Diplomas to cold traffic. Enter an RTO number for a full scope audit, or a single qualification code to see its potential. Our AI will unbundle it into a high-converting 3-Tier Revenue Staircase in 30 seconds.
          </p>
          <div className="mt-12">
            <AuditWidget />
          </div>
        </section>

        {/* 3-STEP EVIDENCE BAR */}
        <section className="w-full max-w-5xl mx-auto py-16 md:py-24">
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                <EvidenceStep icon={<Box className="w-8 h-8 text-blue-500" />} title="Unbundle your Scope.">
                    We deconstruct complex qualifications into marketable skill sets.
                </EvidenceStep>
                <EvidenceStep icon={<Milestone className="w-8 h-8 text-blue-500" />} title="Visualize the Path.">
                    We turn boring compliance docs into a gamified student roadmap.
                </EvidenceStep>
                <EvidenceStep icon={<div className="relative"><DollarSign className="w-8 h-8 text-blue-500" /><Repeat className="w-4 h-4 text-blue-500 absolute -bottom-1 -right-1" /></div>} title="Automate the Upsell.">
                    We build a revenue flywheel from one student acquisition.
                </EvidenceStep>
            </div>
        </section>

        
        {/* VISUAL PATHWAY SECTION */}
        <section className="w-full max-w-6xl mx-auto py-16 md:py-24">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Your students don't read PDFs. They follow paths.</h2>
                <p className="text-lg text-slate-500 mt-4 max-w-3xl mx-auto">We automatically turn your boring Training Strategy into a gamified Visual Roadmap that students actually want to finish.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-0 items-center bg-white rounded-3xl shadow-2xl border-2 border-slate-100 overflow-hidden">
                <div className="p-8 text-left">
                    <h3 className="font-bold text-slate-500 mb-4 uppercase tracking-widest">Confusing Compliance</h3>
                    <ul className="space-y-2 text-slate-400 font-mono text-sm">
                        <li>CPCCWHS1001 - Prepare to work safely...</li>
                        <li>CPCCOM1012 - Work effectively and sustainably...</li>
                        <li>CPCCOM1014 - Conduct workplace communication...</li>
                        <li>CPCCCM2006 - Apply basic levelling procedures...</li>
                        <li className="opacity-50">CPCCCA2011A - Handle carpentry materials...</li>
                        <li className="opacity-30">CPCCCA3002A - Carry out setting out...</li>
                    </ul>
                </div>
                <div className="p-8 bg-slate-100/50">
                     <h3 className="font-bold text-blue-600 mb-4 uppercase tracking-widest text-left">Compelling Career</h3>
                     <Image src="https://raw.githubusercontent.com/mstaal1974/Brand-Guide-/main/assets/Lifetime%20skill.jpg" alt="Visual Student Pathway" width={600} height={400} className="rounded-xl shadow-lg" />
                </div>
            </div>
        </section>

        {/* STUDENT LIFETIME LOOP (REVENUE LOGIC) */}
        <section className="w-full max-w-6xl mx-auto py-16 md:py-24">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Stop paying for the same student twice.</h2>
                <p className="text-lg text-slate-500 mt-4 max-w-3xl mx-auto">The ScopeStack Loop uses Tier 1 to pay for ads, Tier 2 to generate cash, and Tier 3 to maximize profit—all from one student.</p>
            </div>
             <div className="relative max-w-4xl mx-auto">
                <Image src="https://raw.githubusercontent.com/mstaal1974/Brand-Guide-/main/assets/Lifetime%20skill.jpg" alt="Student Lifetime Loop" width={800} height={600} className="rounded-3xl" />
            </div>
        </section>

        {/* PAIN VS GAIN SECTION */}
        <section className="w-full max-w-6xl mx-auto py-16 md:py-24">
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
                <div className="glass-card p-8 space-y-6 text-left border-rose-500/20">
                    <h2 className="text-2xl font-bold text-rose-800">The Old RTO Model</h2>
                    <PainPoint><b>High Risk:</b> Selling $5k courses to cold leads.</PainPoint>
                    <PainPoint><b>Slow Cash:</b> Wait 12 months for completion payments.</PainPoint>
                    <PainPoint><b>Commodity:</b> Competing on price with everyone else.</PainPoint>
                </div>
                <div className="glass-card p-8 space-y-6 text-left border-emerald-500/20">
                     <h2 className="text-2xl font-bold text-emerald-800">The ScopeStack Model</h2>
                     <GainPoint><b>Zero Risk:</b> Leads pay for themselves (Tier 1).</GainPoint>
                     <GainPoint><b>Fast Cash:</b> Get paid in 7 days (Tier 2).</GainPoint>
                     <GainPoint><b>Monopoly:</b> Selling unique "Career Pathways."</GainPoint>
                </div>
            </div>
        </section>
        
        {/* FINAL CTA */}
        <footer className="w-full py-16 md:py-24">
            <div className="glass-card p-12 max-w-4xl mx-auto border-blue-500/20">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900">Your Scope of Registration is a Goldmine.</h2>
                <p className="text-xl text-slate-600 mt-4 mb-8">Stop sitting on it.</p>
                <Button size="lg" className="bg-slate-900 text-white hover:bg-blue-600 font-bold text-lg px-8 py-6 rounded-2xl shadow-lg shadow-slate-900/10" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    Start Free Audit
                </Button>
            </div>
        </footer>
      </main>
    </div>
  );
}
    