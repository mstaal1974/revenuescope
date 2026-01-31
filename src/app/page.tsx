"use client";

import AuditWidget from "@/components/audit-widget";
import { Header } from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Box, Milestone, Repeat, DollarSign, X } from "lucide-react";
import Image from 'next/image';
import { Footer } from "@/components/shared/footer";

const EvidenceStep = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="bg-card p-6 rounded-lg border border-border">
        <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary p-2 rounded-md">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
        </div>
        <p className="text-muted-foreground mt-2 text-sm">{children}</p>
    </div>
);

const RTOModelPoint = ({ children, isOld }: { children: React.ReactNode, isOld: boolean }) => (
    <div className="flex items-start gap-3">
        {isOld ? <X className="w-5 h-5 text-rose-400 mt-1 shrink-0" /> : <Check className="w-5 h-5 text-emerald-400 mt-1 shrink-0" />}
        <span className="text-sm text-muted-foreground">{children}</span>
    </div>
)


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-body bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center p-4 md:p-8 text-center overflow-x-hidden">
        
        {/* HERO SECTION */}
        <section className="container mx-auto py-16 md:py-24 animate-in fade-in duration-1000">
          <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-left">
                  <div className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full mb-4">POWERED BY GEMINI AI</div>
                  <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground">
                    Turn One Qualification into <span className="text-primary">Three Revenue Streams.</span>
                  </h1>
                  <p className="mt-6 text-lg md:text-lg text-muted-foreground max-w-xl">
                    Unbundle your RTO qualifications into high-margin micro-credentials. Stop paying for the same student twice and start building high-converting career pathways.
                  </p>
                  <div className="mt-8">
                    <AuditWidget />
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">✓ Access analysis of immediate market's needs.</p>
              </div>
              <div className="hidden md:block">
                  <div className="bg-card p-4 rounded-lg border border-border shadow-2xl shadow-primary/5">
                      <div className="flex justify-between items-center mb-4">
                          <h3 className="text-sm font-bold text-foreground">AI Unbundling</h3>
                          <p className="text-xs text-muted-foreground">Last 30 Days</p>
                      </div>
                      <div className="h-48 bg-background rounded-md flex items-end gap-2 p-2 border border-border/50">
                          {[...Array(12)].map((_, i) => (
                            <div key={i} className="w-full bg-primary/20 rounded-t-sm" style={{height: `${Math.random() * 80 + 10}%`}}></div>
                          ))}
                      </div>
                      <div className="mt-4 p-3 bg-background rounded-md border border-border/50">
                          <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">BSB50120 Analysis</span>
                              <span className="text-sm font-bold text-emerald-400">85% Match</span>
                          </div>
                          <div className="w-full bg-border rounded-full h-2">
                              <div className="bg-emerald-400 h-2 rounded-full w-[85%]"></div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        </section>

        {/* 3-STEP EVIDENCE BAR */}
        <section className="container mx-auto py-16 md:py-24">
            <div className="text-center mb-12">
                 <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">3-Step Evidence to Revenue</h2>
                 <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">Our AI-driven workflow transforms your static training packages into a dynamic revenue engine.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                <EvidenceStep icon={<Box className="w-6 h-6" />} title="Unbundle">
                    Break down monolithic training packages into blended, marketable micro-processes students actually want.
                </EvidenceStep>
                <EvidenceStep icon={<Milestone className="w-6 h-6" />} title="Visualize">
                    Map complex compliance zones into compelling visual career roadmaps that convert prospects at first sight.
                </EvidenceStep>
                <EvidenceStep icon={<div className="relative"><DollarSign className="w-6 h-6" /></div>} title="Automate">
                    Generate high converting marketing collateral and sales funnels instantly with GenAI integration.
                </EvidenceStep>
            </div>
        </section>

        
        {/* VISUAL PATHWAY SECTION */}
        <section className="container mx-auto py-16 md:py-24">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">Visual Pathway: Compliance vs. Career</h2>
                <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">Stop selling codes. Start selling futures.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="text-sm font-bold text-muted-foreground mb-4">CONFUSING COMPLIANCE (OLD)</div>
                    <ul className="space-y-2 text-sm">
                        <li className="bg-background border border-border p-3 rounded-md text-muted-foreground">BSBPEF501 - Manage personal and professional development</li>
                        <li className="bg-background border border-border p-3 rounded-md text-muted-foreground">BSBCRT511 - Develop critical thinking in others</li>
                        <li className="bg-background border border-border p-3 rounded-md text-muted-foreground opacity-70">BSBFIN501 - Manage budgets and financial plans</li>
                        <li className="bg-background border border-border p-3 rounded-md text-muted-foreground opacity-50">BSBOPS501 - Manage business resources</li>
                    </ul>
                </div>
                <div className="bg-card border-2 border-primary rounded-lg p-6 shadow-2xl shadow-primary/10">
                     <div className="text-sm font-bold text-primary mb-4">COMPELLING CAREER (SCOPESTACK)</div>
                     <Image src="https://raw.githubusercontent.com/mstaal1974/Brand-Guide-/main/assets/Lifetime%20skill.jpg" alt="Visual Student Pathway" width={600} height={400} className="rounded-md" />
                </div>
            </div>
        </section>

        {/* STUDENT LIFETIME LOOP (REVENUE LOGIC) */}
        <section className="container mx-auto py-16 md:py-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="text-left">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">Stop paying for the same student twice.</h2>
                    <p className="text-lg text-muted-foreground mt-4">Most RTOs lose 90% of students after graduation. ScopeStack creates a continuous learning loop, mapping current units to future credentials, keeping students in your ecosystem for life.</p>
                </div>
                <div className="relative">
                    <Image src="https://raw.githubusercontent.com/mstaal1974/Brand-Guide-/main/assets/Lifetime%20skill.jpg" alt="Student Lifetime Loop" width={800} height={600} className="rounded-lg" />
                </div>
            </div>
        </section>

        {/* PAIN VS GAIN SECTION */}
        <section className="w-full max-w-5xl mx-auto py-16 md:py-24">
             <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">Why Leading RTOs are Switching</h2>
             </div>
            <div className="grid md:grid-cols-2 gap-8 items-stretch">
                <div className="border border-border bg-card p-8 rounded-lg text-left space-y-4">
                    <h3 className="font-bold text-rose-400">The Old RTO Model</h3>
                    <RTOModelPoint isOld={true}>Low margins due to high CAC and manual student support.</RTOModelPoint>
                    <RTOModelPoint isOld={true}>One-off qualification sales with zero follow-up strategy.</RTOModelPoint>
                    <RTOModelPoint isOld={true}>Manual marketing asset creation takes weeks or months.</RTOModelPoint>
                </div>
                <div className="border-2 border-primary bg-card p-8 rounded-lg text-left space-y-4 shadow-2xl shadow-primary/10">
                     <h3 className="font-bold text-primary">The ScopeStack Model</h3>
                     <RTOModelPoint isOld={false}>High margin unbundled micro-credentials sold at premium.</RTOModelPoint>
                     <RTOModelPoint isOld={false}>Recurring revenue through automated student lifecycle loops.</RTOModelPoint>
                     <RTOModelPoint isOld={false}>AI generates landing pages, emails, and ads in seconds.</RTOModelPoint>
                </div>
            </div>
        </section>
        
        {/* FINAL CTA */}
        <section className="container mx-auto my-16">
            <div className="bg-primary rounded-lg p-12 text-center">
                <h2 className="text-3xl md:text-4xl font-black text-primary-foreground">Your Scope is a Goldmine.</h2>
                <p className="text-xl text-primary-foreground/80 mt-4 mb-8 max-w-2xl mx-auto">Run a free audit today and discover how much untapped revenue is sitting in your current training packages.</p>
                <div className="flex gap-4 justify-center">
                    <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 font-bold text-lg px-8 py-6 rounded-lg" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        Start Free Audit
                    </Button>
                     <Button size="lg" variant="outline" className="bg-transparent text-white border-white/50 hover:bg-white/10 hover:text-white font-bold text-lg px-8 py-6 rounded-lg">
                        Talk to Sales
                    </Button>
                </div>
                <p className="text-xs text-primary-foreground/50 mt-4">Calculate cash-positive student acquisition models.</p>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
    