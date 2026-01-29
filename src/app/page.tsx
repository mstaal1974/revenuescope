"use client";

import AuditWidget from "@/components/audit-widget";
import { Header } from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { Package, Map, DollarSign } from "lucide-react";
import Image from 'next/image';

const EvidenceStep = ({ icon, children }: { icon: React.ReactNode, children: React.ReactNode }) => (
    <div className="flex items-center gap-4 text-left">
        <div className="flex-shrink-0 w-16 h-16 bg-white/60 border border-white/30 backdrop-blur-xl rounded-2xl flex items-center justify-center text-blue-500 shadow-md">
            {icon}
        </div>
        <div>
            <p className="font-bold text-lg text-slate-800">{children}</p>
        </div>
    </div>
);


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-body strategic-theme-glow">
      <Header />
      <main className="flex-1 flex flex-col items-center p-4 md:p-8 text-center overflow-x-hidden">
        
        {/* HERO SECTION */}
        <section className="w-full max-w-4xl mx-auto py-16 md:py-24 animate-in fade-in duration-1000">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-700">
            Turn One Qualification into Three Revenue Streams.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            Stop selling generic Diplomas to cold traffic. Paste any RTO Number below. We will use AI to unbundle it into a high-converting 3-Tier Revenue Staircase in 30 seconds.
          </p>
          <div className="mt-12">
            <AuditWidget />
          </div>
        </section>

        {/* 3-STEP EVIDENCE BAR */}
        <section className="w-full max-w-5xl mx-auto pt-8 pb-16 md:pb-24">
            <div className="grid md:grid-cols-3 gap-8">
                <EvidenceStep icon={<Package className="w-8 h-8" />}>We Unbundle your Scope.</EvidenceStep>
                <EvidenceStep icon={<Map className="w-8 h-8" />}>We Visualize the Path.</EvidenceStep>
                <EvidenceStep icon={<DollarSign className="w-8 h-8" />}>We Automate the Upsell.</EvidenceStep>
            </div>
        </section>
        
        {/* VISUAL PATHWAY SECTION */}
        <section className="w-full max-w-6xl mx-auto py-16 md:py-24">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-4">Your students don't read PDFs. They follow paths.</h2>
            <div className="mt-12 grid md:grid-cols-2 gap-8 items-center">
                <div className="glass-card p-6 text-left">
                    <h3 className="font-bold text-slate-700 mb-4 text-center">Confusing Compliance</h3>
                    <div className="p-4 bg-slate-100/50 rounded-lg border border-slate-200 text-sm text-slate-500 font-mono shadow-inner">
                        CPCCWHS1001 - Prepare to work safely...<br/>
                        CPCCOM1012 - Work effectively and sustainably...<br/>
                        CPCCOM1014 - Conduct workplace communication...<br/>
                        CPCCOM1015 - Carry out measurements...<br/>
                        ...and 25 more boring documents.
                    </div>
                </div>
                <div className="glass-card p-6 text-left">
                    <h3 className="font-bold text-emerald-600 mb-4 text-center">Compelling Career</h3>
                    <div className="p-4 bg-emerald-50/50 rounded-lg border border-emerald-200/80 shadow-inner">
                        {/* Placeholder for metro map visual */}
                        <p className="text-emerald-800 text-center font-medium">A vibrant "Metro Map" visual would go here, showing a gamified, clear path for students.</p>
                    </div>
                </div>
            </div>
            <p className="text-lg text-slate-600 mt-12 max-w-3xl mx-auto">We automatically turn your boring Training Strategy into a gamified Visual Roadmap that students actually want to finish.</p>
        </section>

        {/* STUDENT LIFETIME LOOP SECTION */}
        <section className="w-full max-w-6xl mx-auto py-16 md:py-24">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-12">Stop paying for the same student twice.</h2>
            <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="text-left glass-card p-10 h-full">
                    <h3 className="font-bold text-2xl text-slate-900 mb-4">The ScopeStack Flywheel</h3>
                    <p className="text-slate-700 text-lg">Most RTOs sell a qualification and say goodbye. The ScopeStack Loop uses Tier 1 to pay for ads, Tier 2 to generate cash, and Tier 3 to maximize profit—all from one student.</p>
                </div>
                <div className="glass-card p-4">
                    <Image
                        src="https://raw.githubusercontent.com/mstaal1974/Brand-Guide-/main/assets/Lifetime%20skill.jpg"
                        alt="Student Lifetime Loop"
                        width={600}
                        height={600}
                        className="rounded-2xl shadow-xl"
                    />
                </div>
            </div>
        </section>

        {/* FINAL CTA */}
        <footer className="w-full py-16 md:py-24">
            <div className="glass-card p-12 max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900">Your Scope of Registration is a Goldmine.</h2>
                <p className="text-xl text-slate-600 mt-4 mb-8">Stop sitting on it.</p>
                <Button size="lg" variant="default" className="font-bold text-lg px-8 py-6 rounded-2xl shadow-lg shadow-black/10" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    Start Free Audit
                </Button>
            </div>
        </footer>
      </main>
    </div>
  );
}
