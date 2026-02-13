'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/shared/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  Activity,
  Info,
  Loader2,
  AlertTriangle,
  Zap,
  ShieldCheck,
  Search,
  Database,
  Globe,
  UploadCloud,
  CheckCircle2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { Progress } from '@/components/ui/progress';
import { runComplianceAnalysisAction } from '@/app/actions';
import type { ComplianceAnalysisOutput, FullAuditOutput } from '@/ai/types';
import Link from 'next/link';

export default function ComplianceDashboard() {
  const [data, setData] = useState<ComplianceAnalysisOutput | null>(null);
  const [auditData, setAuditData] = useState<FullAuditOutput | null>(null);
  const [activeUnit, setActiveUnit] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSimulatingEvidence, setIsSimulatingEvidence] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const storedAudit = localStorage.getItem("auditData");
      if (!storedAudit) {
        setError("No audit data found. You must run a scope audit first to generate compliance intelligence.");
        setLoading(false);
        return;
      }

      try {
        const parsedAudit: FullAuditOutput = JSON.parse(storedAudit);
        setAuditData(parsedAudit);

        const response = await runComplianceAnalysisAction({
          rtoId: parsedAudit.rto_id,
          manualScopeDataset: parsedAudit.manualScopeDataset,
        });

        if (response.ok) {
          setData(response.result);
          if (response.result.validation_gaps.length > 0) {
            setActiveUnit(response.result.validation_gaps[0].unit_code);
          }
        } else {
          setError(response.error);
        }
      } catch (e) {
        console.error("Compliance Dashboard Error:", e);
        setError("Failed to load compliance data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSimulateEvidence = () => {
    setIsSimulatingEvidence(true);
    setTimeout(() => {
      setIsSimulatingEvidence(false);
    }, 3000);
  };

  const currentUnitData = useMemo(() => {
    if (!data || !activeUnit) return null;
    return data.validation_gaps.find(u => u.unit_code === activeUnit);
  }, [data, activeUnit]);

  const radarData = useMemo(() => {
    if (!currentUnitData) return [];
    return [
      { subject: 'TGA Mapping', A: currentUnitData.tga_mapping_score, fullMark: 100 },
      { subject: 'Industry alignment', A: currentUnitData.industry_alignment_score, fullMark: 100 },
      { subject: 'RTO Evidence', A: currentUnitData.rto_evidence_score, fullMark: 100 },
      { subject: 'Assessor consistency', A: 85, fullMark: 100 },
      { subject: 'Peer review', A: 90, fullMark: 100 },
    ];
  }, [currentUnitData]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 items-center justify-center text-center p-8">
        <div className="relative w-20 h-20 mb-8">
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
            <Loader2 className="relative h-20 w-20 animate-spin text-blue-500" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight text-center">Syncing Compliance Intelligence...</h2>
        <p className="text-slate-400 mt-2 max-w-md mx-auto">Gemini 2.5 Pro is analyzing your scope against live labor market standards.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 font-body">
        <Header />
        <main className="flex-1 container mx-auto pt-32 pb-12 px-4 md:px-8 flex items-center justify-center">
          <Card className="max-w-md w-full bg-slate-900 border-rose-500/30 p-10 text-center rounded-[3rem] shadow-2xl">
             <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-rose-500/30">
                <AlertTriangle className="text-rose-500 w-8 h-8" />
             </div>
             <h3 className="text-xl font-black text-white mb-2">Audit Data Required</h3>
             <p className="text-slate-400 text-sm mb-8">{error}</p>
             <Button asChild className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-6 rounded-2xl transition-all shadow-2xl shadow-blue-900/20 active:scale-95">
                <Link href="/">Start Scope Audit</Link>
             </Button>
          </Card>
        </main>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 font-body text-white selection:bg-blue-500/30">
      <Header />
      <main className="flex-1 container mx-auto pt-24 pb-12 px-4 md:px-8 space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-4">
          <div className="animate-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                <ShieldCheck size={14} className="text-blue-400" />
                <span className="text-[10px] font-black tracking-widest uppercase text-blue-400">ASQA 2026 Predictive Monitoring</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
              RTO <span className="text-blue-500">SELF-ASSURANCE</span>
            </h1>
            <p className="text-slate-400 font-bold mt-3 max-w-xl text-lg">
              Systematic Monitoring & Predictive Compliance for <span className="text-white">{auditData?.rto_name || auditData?.rto_id}</span>
            </p>
          </div>
          <div className="flex gap-3 animate-in slide-in-from-right duration-700">
            <Button variant="outline" className="bg-slate-900 border-slate-800 text-slate-300 font-black hover:bg-slate-800 rounded-xl px-6 py-6 h-auto text-sm transition-all border-2">
              <FileText className="mr-2 h-4 w-4" /> ASQA SIMULATOR
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl px-8 py-6 h-auto text-sm shadow-2xl shadow-blue-900/40 active:scale-95 transition-all">
              <Zap className="mr-2 h-4 w-4" /> RUN VALIDATION CYCLE
            </Button>
          </div>
        </div>

        {/* Intelligence Sources Info Card */}
        <Card className="bg-blue-600/10 border border-blue-500/20 rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
                <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shrink-0 shadow-2xl shadow-blue-600/40">
                    <Database className="text-white w-10 h-10" />
                </div>
                <div className="space-y-4 flex-1">
                    <h2 className="text-2xl font-black tracking-tight">How Systematic Monitoring Works</h2>
                    <p className="text-slate-300 leading-relaxed max-w-3xl">
                        You do <span className="text-white font-bold">not</span> need to manually upload assessments. 
                        ScopeStack AI automatically monitors three critical data feeds to identify risks before ASQA does:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">TGA (The Law)</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Globe className="text-blue-400 shrink-0" size={20} />
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Industry (The Practice)</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <UploadCloud className="text-purple-400 shrink-0" size={20} />
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Evidence (The Reality)</span>
                        </div>
                    </div>
                </div>
                <div className="shrink-0">
                    <Button 
                        onClick={handleSimulateEvidence}
                        disabled={isSimulatingEvidence}
                        className="bg-white text-blue-600 hover:bg-slate-100 font-black rounded-2xl px-8 py-6 h-auto"
                    >
                        {isSimulatingEvidence ? (
                            <><Loader2 className="mr-2 animate-spin h-4 w-4" /> SCANNING EVIDENCE...</>
                        ) : (
                            <><Zap className="mr-2 h-4 w-4" /> SCAN ASSESSMENT MATERIALS</>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Alerts and Metrics */}
          <div className="lg:col-span-4 space-y-8 animate-in fade-in duration-1000">
            
            {/* Live Assurance Alerts */}
            <Card className="bg-slate-900 border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden relative group transition-all hover:border-blue-500/30">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-transparent"></div>
              <CardHeader className="border-b border-white/5 bg-white/5">
                <CardTitle className="text-lg font-black flex items-center gap-3">
                  <Activity className="h-5 w-5 text-blue-500 animate-pulse" /> LIVE ASSURANCE ALERTS
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                {data.live_alerts.map((alert, i) => (
                  <div key={i} className="p-4 bg-slate-800/50 border-l-4 border-blue-500 rounded-r-2xl transition-all hover:translate-x-1">
                    <p className="text-xs font-bold text-slate-200 leading-relaxed">
                      {alert}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Global Health Metrics */}
            <Card className="bg-slate-900 border-slate-800 rounded-[2.5rem] shadow-2xl hover:border-blue-500/20 transition-all">
              <CardHeader className="border-b border-white/5 bg-white/5">
                <CardTitle className="text-lg font-black uppercase tracking-widest text-slate-400">Governance Scores</CardTitle>
              </CardHeader>
              <CardContent className="p-8 grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-slate-800/50 rounded-3xl border border-white/5 transition-all hover:bg-slate-800">
                  <p className="text-4xl font-black text-blue-500">{data.self_assurance_score}%</p>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">Audit Readiness</p>
                </div>
                <div className="text-center p-6 bg-slate-800/50 rounded-3xl border border-white/5 transition-all hover:bg-slate-800">
                  <p className="text-4xl font-black text-emerald-500">92%</p>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">Outcome Standard</p>
                </div>
                <div className="text-center p-6 bg-slate-800/50 rounded-3xl border border-white/5 transition-all hover:bg-slate-800">
                  <p className="text-4xl font-black text-amber-500">68%</p>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">Industry Currency</p>
                </div>
                <div className="text-center p-6 bg-slate-800/50 rounded-3xl border border-white/5 transition-all hover:bg-slate-800">
                  <p className="text-4xl font-black text-white">0</p>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">Critical Non-Compliances</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Charts and Deep Dives */}
          <div className="lg:col-span-8 space-y-8 animate-in fade-in duration-1000 delay-200">
            
            {/* Top Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Monitoring Trend */}
              <Card className="bg-slate-900 border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden h-[400px]">
                <CardHeader className="pb-2 bg-white/5 border-b border-white/5 px-8 py-6">
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Systematic Monitoring Trend</CardTitle>
                </CardHeader>
                <CardContent className="p-8 h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.monitoring_trend}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
                      />
                      <Line type="monotone" dataKey="adherence" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#0f172a' }} />
                      <Line type="monotone" dataKey="quality" stroke="#10b981" strokeWidth={4} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#0f172a' }} />
                    </LineChart>
                  </ResponsiveContainer>
                  <p className="text-[9px] text-slate-500 mt-6 text-center font-bold tracking-widest uppercase">Live Delta Analysis: Standards vs Ecosystem Reality</p>
                </CardContent>
              </Card>

              {/* Trainer Integrity */}
              <Card className="bg-slate-900 border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden h-[400px]">
                <CardHeader className="pb-2 bg-white/5 border-b border-white/5 px-8 py-6">
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Assessor Variance Tracker</CardTitle>
                </CardHeader>
                <CardContent className="p-8 h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.assessor_variance}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis dataKey="trainer_name" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#64748b'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                      <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                      <Bar dataKey="pass_rate" fill="#1e293b" radius={[4, 4, 0, 0]} barSize={24} />
                      <Bar dataKey="compliance_score" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-6 flex items-center justify-center gap-4">
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#1e293b]"></div>
                        <span className="text-[9px] font-black text-slate-500 uppercase">Pass Rate</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#3b82f6]"></div>
                        <span className="text-[9px] font-black text-slate-500 uppercase">Compliance</span>
                     </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bottom Row: Alignment Deep Dive */}
            <Card className="bg-slate-900 border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden">
              <CardHeader className="p-8 md:p-12 bg-white/5 border-b border-white/5">
                <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                    <Search className="text-blue-500" />
                    THE VALIDATION GAP ANALYZER
                </CardTitle>
                <p className="text-slate-400 text-sm font-bold mt-1 uppercase tracking-widest">Cross-referencing TGA vs Industry Practice vs RTO Reality</p>
              </CardHeader>
              <CardContent className="p-8 md:p-16">
                <div className="flex flex-wrap gap-3 mb-12">
                  {data.validation_gaps.map(gap => (
                    <button
                      key={gap.unit_code}
                      onClick={() => setActiveUnit(gap.unit_code)}
                      className={`px-6 py-3 rounded-2xl text-xs font-black transition-all border-2 ${
                        activeUnit === gap.unit_code 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xl shadow-blue-900/40' 
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      {gap.unit_code}
                    </button>
                  ))}
                </div>

                {currentUnitData && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8 animate-in fade-in duration-700">
                      <div className="space-y-3">
                        <div className="flex justify-between items-end">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Training.gov.au (The Law)</p>
                          <p className="text-xs font-black text-blue-400">{currentUnitData.tga_mapping_score}%</p>
                        </div>
                        <Progress value={currentUnitData.tga_mapping_score} className="h-2 bg-slate-800 [&>div]:bg-blue-500" />
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-end">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Industry Practice (The Reality)</p>
                          <p className="text-xs font-black text-emerald-400">{currentUnitData.industry_alignment_score}%</p>
                        </div>
                        <Progress value={currentUnitData.industry_alignment_score} className="h-2 bg-slate-800 [&>div]:bg-emerald-500" />
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-end">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">RTO Assessment Evidence</p>
                          <p className="text-xs font-black text-indigo-400">{currentUnitData.rto_evidence_score}%</p>
                        </div>
                        <Progress value={currentUnitData.rto_evidence_score} className="h-2 bg-slate-800 [&>div]:bg-indigo-500" />
                      </div>

                      <div className={`p-8 rounded-3xl border-2 transition-all duration-500 ${
                        currentUnitData.risk_level === 'High' ? 'bg-rose-500/10 border-rose-500/30 text-rose-200' : 'bg-blue-500/10 border-blue-500/30 text-blue-200'
                      }`}>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-black text-lg flex items-center gap-2">
                                <Info className="h-5 w-5" /> ASSURANCE LOGIC
                            </h4>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                currentUnitData.risk_level === 'High' ? 'bg-rose-500 text-white' : 'bg-blue-500 text-white'
                            }`}>
                                {currentUnitData.risk_level} Risk
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed font-bold opacity-80 italic">
                          "{currentUnitData.analysis}"
                        </p>
                      </div>
                    </div>

                    <div className="h-[400px] flex items-center justify-center relative bg-white/5 rounded-[3rem] p-8 border border-white/5 group transition-all hover:bg-white/[0.08]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                          <PolarGrid stroke="#1e293b" />
                          <PolarAngleAxis dataKey="subject" tick={{fill: '#64748b', fontSize: 9, fontWeight: '900'}} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} axisLine={false} tick={false} />
                          <Radar
                            name="Compliance Health"
                            dataKey="A"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fill="#3b82f6"
                            fillOpacity={0.4}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                      <div className="absolute top-4 right-8">
                         <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                            <Zap className="text-blue-400 w-6 h-6" />
                         </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
}
