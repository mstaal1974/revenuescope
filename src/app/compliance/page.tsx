
'use client';

import React, { useState } from 'react';
import { Header } from '@/components/shared/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  Activity,
  Info,
  TrendingUp
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

// Mock Data for Systematic Monitoring Trend
const monitoringData = [
  { name: 'Oct', adherence: 82, quality: 78 },
  { name: 'Nov', adherence: 80, quality: 76 },
  { name: 'Dec', adherence: 72, quality: 81 },
  { name: 'Jan', adherence: 85, quality: 84 },
  { name: 'Feb', adherence: 88, quality: 86 },
];

// Mock Data for Trainer Integrity
const trainerData = [
  { name: 'Trainer A', passRate: 88, compliance: 92 },
  { name: 'Trainer B', passRate: 98, compliance: 72 },
  { name: 'Trainer C', passRate: 84, compliance: 96 },
  { name: 'Trainer D', passRate: 90, compliance: 89 },
];

// Mock Data for Radar Chart (Validation Gap)
const alignmentData = [
  { subject: 'TGA Mapping', A: 94, fullMark: 100 },
  { subject: 'JSA Alignment', A: 72, fullMark: 100 },
  { subject: 'Evidence', A: 88, fullMark: 100 },
  { subject: 'Assessor Consistency', A: 65, fullMark: 100 },
  { subject: 'Peer Review', A: 82, fullMark: 100 },
];

export default function ComplianceDashboard() {
  const [activeUnit, setActiveUnit] = useState('MEM18001');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-body">
      <Header />
      <main className="flex-1 container mx-auto pt-24 pb-12 px-4 md:px-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tighter">
              RTO SELF-ASSURANCE <span className="text-blue-600 uppercase">Dashboard</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Systematic Monitoring & Predictive Compliance | ASQA 2026 Standards
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white border-slate-200 text-slate-700 font-bold hover:bg-slate-50">
              <FileText className="mr-2 h-4 w-4" /> Generate ASQA Report
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
              Run Validation Cycle
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Alerts and Metrics */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Live Assurance Alerts */}
            <Card className="bg-white border-slate-200 rounded-3xl shadow-sm overflow-hidden">
              <CardHeader className="border-b border-slate-50">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" /> Live Assurance Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="p-4 bg-rose-50 border-l-4 border-rose-500 rounded-r-xl">
                  <p className="text-sm font-bold text-rose-900">
                    ICTPRG431: Assessment judgments deviate 25% from JSA Skills Atlas standards.
                  </p>
                </div>
                <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl">
                  <p className="text-sm font-bold text-amber-900">
                    Trainer B: High grade variance detected. Possible "easy marking" vs unit requirements.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-xl">
                  <p className="text-sm font-bold text-blue-900">
                    Upcoming internal audit cycle for BSB package in 12 days.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Global Health Metrics */}
            <Card className="bg-white border-slate-200 rounded-3xl shadow-sm">
              <CardHeader className="border-b border-slate-50">
                <CardTitle className="text-lg font-bold">Global Health Metrics</CardTitle>
              </CardHeader>
              <CardContent className="p-6 grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-slate-50 rounded-2xl">
                  <p className="text-3xl font-black text-blue-600">84%</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Audit Readiness</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-2xl">
                  <p className="text-3xl font-black text-emerald-600">92%</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Outcome Standard</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-2xl">
                  <p className="text-3xl font-black text-amber-600">68%</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Industry Currency</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-2xl">
                  <p className="text-3xl font-black text-slate-900">0</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Non-Compliances</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Charts and Deep Dives */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Top Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Monitoring Trend */}
              <Card className="bg-white border-slate-200 rounded-3xl shadow-sm overflow-hidden h-[350px]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold">Systematic Monitoring Trend</CardTitle>
                </CardHeader>
                <CardContent className="p-4 h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monitoringData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Line type="monotone" dataKey="adherence" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} />
                      <Line type="monotone" dataKey="quality" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
                    </LineChart>
                  </ResponsiveContainer>
                  <p className="text-[10px] text-slate-400 mt-4 italic text-center">Source: Comparison of Blocksure Assessment Evidence vs JSA Industry Atlas</p>
                </CardContent>
              </Card>

              {/* Trainer Integrity */}
              <Card className="bg-white border-slate-200 rounded-3xl shadow-sm overflow-hidden h-[350px]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold">Trainer Integrity & Variance</CardTitle>
                </CardHeader>
                <CardContent className="p-4 h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trainerData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                      <Tooltip cursor={{fill: '#f8fafc'}} />
                      <Bar dataKey="passRate" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={20} />
                      <Bar dataKey="compliance" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-[10px] text-rose-500 mt-4 italic text-center font-bold">Red flag: Trainer B shows 94% pass rate with only 72% compliance score.</p>
                </CardContent>
              </Card>
            </div>

            {/* Bottom Row: Alignment Deep Dive */}
            <Card className="bg-white border-slate-200 rounded-3xl shadow-sm overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Unit Alignment Deep-Dive: Standards vs Industry Practice</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex flex-wrap gap-2 mb-8">
                  {['ICTPRG431', 'BSBPMG532', 'CPCCWHS1001', 'MEM18001'].map(unit => (
                    <button
                      key={unit}
                      onClick={() => setActiveUnit(unit)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                        activeUnit === unit 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {unit}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <p className="text-sm font-bold text-slate-700 uppercase tracking-tight">Training.gov.au Mapping</p>
                        <p className="text-sm font-black text-slate-900">94%</p>
                      </div>
                      <Progress value={94} className="h-2 [&>div]:bg-blue-600" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <p className="text-sm font-bold text-slate-700 uppercase tracking-tight">JSA / Lightcast Industry Alignment</p>
                        <p className="text-sm font-black text-slate-900">72%</p>
                      </div>
                      <Progress value={72} className="h-2 [&>div]:bg-emerald-500" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <p className="text-sm font-bold text-slate-700 uppercase tracking-tight">Blocksure Evidence (Reality)</p>
                        <p className="text-sm font-black text-slate-900">88%</p>
                      </div>
                      <Progress value={88} className="h-2 [&>div]:bg-indigo-600" />
                    </div>

                    <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-2xl mt-8">
                      <h4 className="text-blue-900 font-bold flex items-center gap-2 mb-2">
                        <Info className="h-4 w-4" /> Assurance Logic
                      </h4>
                      <p className="text-sm text-blue-800 leading-relaxed">
                        The gap between <span className="font-bold">Training.gov.au (94%)</span> and <span className="font-bold">Industry Reality (72%)</span> indicates curriculum drift. In an audit, this unit would be flagged for "Lack of Industry Consultation."
                      </p>
                    </div>
                  </div>

                  <div className="h-[350px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={alignmentData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="subject" tick={{fill: '#64748b', fontSize: 10}} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} axisLine={false} tick={false} />
                        <Radar
                          name="Audit Health"
                          dataKey="A"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.5}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
}
