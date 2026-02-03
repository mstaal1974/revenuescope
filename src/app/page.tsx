
'use client';

import AuditWidget from "@/components/audit-widget";
import { Header } from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CircleX, CircleCheckBig, Zap, ShieldCheck, Target } from "lucide-react";
import Image from 'next/image';
import { Footer } from "@/components/shared/footer";
import Link from 'next/link';


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


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-body strategic-theme-glow">
      <Header />
      <main className="flex-1 flex flex-col items-center p-4 md:p-8 text-center overflow-x-hidden">
        
        <section className="container mx-auto py-16 md:py-24 animate-in fade-in duration-1000">
          <div className="grid gap-12 items-center">
              <div className="text-center">
                  <div className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">Powered by Gemini 2.5 Pro</div>
                  <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground">
                    Turn One Qualification into <span className="text-primary">Three Revenue Streams.</span>
                  </h1>
                  <p className="mt-6 text-lg md:text-lg text-muted-foreground max-w-xl mx-auto">
                    Stop selling generic Diplomas to cold traffic. Paste any Qualification Code below. We will use AI to unbundle it into a high-converting 3-Tier Revenue Staircase in 30 seconds.
                  </p>
                  <div className="mt-8">
                    <AuditWidget />
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">✓ Access analysis of immediate market's needs.</p>
              </div>
          </div>
        </section>

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
        
        <section className="w-full py-16 md:py-24 relative">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-4">This isn't just a list of units.</h2>
            <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto">It's a complete Go-To-Market strategy, delivered in seconds.</p>
            <div className="max-w-4xl mx-auto relative">
                <Image
                    src="https://raw.githubusercontent.com/mstaal1974/Brand-Guide-/main/assets/Gemini_Generated_Image_iytrfmiytrfmiytr.png"
                    alt="AI-generated Go-To-Market strategy dashboard"
                    width={1200}
                    height={800}
                    className="rounded-3xl border-2 border-slate-800 shadow-2xl shadow-blue-500/10"
                />
            </div>
        </section>
      </main>

      <footer className="w-full py-16 md:py-24">
          <div className="bg-blue-600/10 border border-blue-500/20 rounded-3xl p-12 max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-black text-white">Your Scope of Registration is a Goldmine.</h2>
              <p className="text-xl text-slate-300 mt-4 mb-8">Stop sitting on it.</p>
              <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-slate-200 font-bold text-lg px-8 py-6 rounded-2xl shadow-lg shadow-white/10"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                  Start Free Audit
              </Button>
          </div>
          <div className="text-center mt-8">
             <Link href="/admin" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
                Admin Login
             </Link>
          </div>
      </footer>
    </div>
  );
}
