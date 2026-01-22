'use client';

import { useEffect, useState } from 'react';
import type { AuditData } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Printer, AlertTriangle } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { Separator } from '@/components/ui/separator';

export default function ReportPage() {
  const [data, setData] = useState<AuditData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState('');


  useEffect(() => {
    // This code runs only on the client
    const dataString = sessionStorage.getItem('auditData');
    if (dataString) {
      try {
        setData(JSON.parse(dataString));
      } catch (e) {
        setError('Failed to parse audit data.');
      }
    } else {
      setError('No audit data found in session.');
    }
    setDate(new Date().toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }));
  }, []);
  
  if (error) {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center p-8">
            <AlertTriangle className="w-16 h-16 text-rose-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Error Loading Report</h1>
            <p className="text-slate-600 max-w-md mb-8">{error} Please generate a new audit and try again.</p>
             <Button onClick={() => window.close()}>Close Tab</Button>
        </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>Loading report data...</p>
      </div>
    );
  }
  
  const formatValue = (val: string | undefined | number) => {
    if (val === '[REAL_DATA_REQUIRED]' || !val) return 'DATA UNAVAILABLE';
    if(typeof val === 'number') return val.toLocaleString();
    return val;
  }

  return (
    <div className="bg-white text-slate-900 font-body print:shadow-none print:border-0">
        <style jsx global>{`
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .no-print {
                display: none !important;
              }
              .print-break-before {
                page-break-before: always;
              }
            }
        `}</style>
      <header className="no-print sticky top-0 bg-white/80 backdrop-blur-lg border-b border-slate-200 p-4 flex justify-between items-center z-50">
        <Logo />
        <div className="flex items-center gap-4">
            <p className="text-sm font-bold text-slate-500">RTO ID: {data.rto_id}</p>
            <Button onClick={() => window.print()}>
                <Printer className="mr-2" />
                Print or Save as PDF
            </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-8 md:p-12">
        {/* Page 1: Cover */}
        <section className="text-center">
            <div className="inline-block bg-blue-600 text-white p-6 rounded-2xl mb-8">
                <Logo />
            </div>
            <h1 className="text-5xl font-black tracking-tighter">Strategic Audit Report</h1>
            <p className="text-2xl text-slate-500 mt-4">Prepared for RTO: {data.rto_id}</p>
            <p className="text-lg text-slate-500 mt-2">Date: {date}</p>
        </section>

        <Separator className="my-12" />

        {/* Page 2: Executive Summary & Sector Breakdown */}
        <section className="print-break-before">
            <h2 className="text-3xl font-black tracking-tight border-b-4 border-blue-200 pb-2 mb-8">Executive Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-slate-50 p-6 rounded-2xl">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Total Revenue Opportunity</p>
                    <p className="text-4xl font-black text-blue-600">{formatValue(data.executive_summary.total_revenue_opportunity)}</p>
                </div>
                 <div className="bg-slate-50 p-6 rounded-2xl">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Top Performing Sector</p>
                    <p className="text-4xl font-black">{formatValue(data.executive_summary.top_performing_sector)}</p>
                </div>
            </div>
            <div className="bg-slate-900 text-white p-8 rounded-2xl">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Strategic Advice</p>
                <p className="text-xl font-medium italic">"{formatValue(data.executive_summary.strategic_advice)}"</p>
            </div>
        </section>

        {data.sector_breakdown && data.sector_breakdown.length > 0 && (
            <section className="mt-12">
                 <h3 className="text-2xl font-black mb-6">Sector-by-Sector Analysis</h3>
                 <div className="space-y-4">
                     {data.sector_breakdown.map((sector, i) => (
                         <div key={i} className="p-4 border border-slate-200 rounded-lg">
                             <h4 className="font-bold text-lg">{sector.sector_name}</h4>
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                                 <div><span className="font-bold">Quals:</span> {sector.qualification_count}</div>
                                 <div><span className="font-bold">Demand:</span> {sector.market_health.demand_level}</div>
                                 <div><span className="font-bold">Trend:</span> {sector.market_health.trend_direction}</div>
                                 <div><span className="font-bold">Revenue Gap:</span> {sector.financial_opportunity.annual_revenue_gap}</div>
                             </div>
                         </div>
                     ))}
                 </div>
            </section>
        )}

        {/* Page 3: Skills Heatmap */}
        {data.skills_heatmap && data.skills_heatmap.length > 0 && (
             <section className="print-break-before">
                <h2 className="text-3xl font-black tracking-tight border-b-4 border-blue-200 pb-2 mb-8">Skill Demand Heatmap</h2>
                <p className="text-slate-600 mb-6">This heatmap analyzes every skill within the RTO's current scope, using the Validated Data Chain to identify which are most in-demand by employers right now.</p>
                <div className="flex flex-wrap gap-2">
                    {data.skills_heatmap.map((skill, index) => (
                        <span key={index} className={`px-3 py-1 text-sm font-bold rounded-full ${
                            skill.demand_level === 'High' ? 'bg-emerald-100 text-emerald-800' :
                            skill.demand_level === 'Medium' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-600'
                        }`}>{skill.skill_name}</span>
                    ))}
                </div>
            </section>
        )}

        {/* Page 4: Micro-Stack */}
        <section className="print-break-before">
            <h2 className="text-3xl font-black tracking-tight border-b-4 border-blue-200 pb-2 mb-8">Micro-Stack Product Ecosystem</h2>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Strategic Theme</p>
            <h3 className="text-4xl font-black text-blue-600 mb-4">{formatValue(data.strategic_theme)}</h3>
            <p className="italic text-slate-600 mb-8">"{formatValue(data.market_justification)}"</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-center">
                 <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm font-bold text-slate-500">Total Market Size</p>
                    <p className="text-2xl font-black">{formatValue(data.revenue_opportunity.total_market_size)}</p>
                </div>
                 <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm font-bold text-slate-500">Conservative Capture</p>
                    <p className="text-2xl font-black text-emerald-600">{formatValue(data.revenue_opportunity.conservative_capture)}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm font-bold text-slate-500">Ambitious Capture</p>
                    <p className="text-2xl font-black text-emerald-600">{formatValue(data.revenue_opportunity.ambitious_capture)}</p>
                </div>
            </div>

            <div className="space-y-8">
                {data.individual_courses.map((course, i) => (
                    <div key={i} className="p-6 border-2 border-slate-100 rounded-2xl bg-white print-break-inside-avoid">
                        <div className="flex justify-between items-start">
                             <div>
                                <p className="font-bold text-blue-600">{course.tier}</p>
                                <h4 className="text-2xl font-black">{course.course_title}</h4>
                             </div>
                             <p className="text-2xl font-black">{course.suggested_price}</p>
                        </div>
                         <Separator className="my-4" />
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                             <div>
                                 <h5 className="font-bold mb-2">Learning Outcomes</h5>
                                 <ul className="list-disc list-inside space-y-1">
                                     {course.content_blueprint.learning_outcomes.map((outcome, j) => <li key={j}>{outcome}</li>)}
                                 </ul>
                             </div>
                             <div>
                                 <h5 className="font-bold mb-2">Modules</h5>
                                 <ul className="list-disc list-inside space-y-1">
                                     {course.content_blueprint.modules.map((mod, j) => <li key={j}><strong>{mod.title}:</strong> {mod.topic}</li>)}
                                 </ul>
                             </div>
                         </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-8 bg-slate-900 text-white p-8 rounded-2xl text-center print-break-inside-avoid">
                <h4 className="text-2xl font-black">{data.stackable_product.bundle_title}</h4>
                <p className="text-amber-400 font-bold mt-2">Save {data.stackable_product.discount_applied} with this bundle!</p>
                <div className="flex justify-center items-center gap-4 mt-4">
                     <p className="text-xl line-through text-slate-400">{data.stackable_product.total_value}</p>
                     <p className="text-4xl font-black">{data.stackable_product.bundle_price}</p>
                </div>
            </div>
        </section>

        <Separator className="my-12" />

        <footer className="text-center text-sm text-slate-500">
            <p><strong>Citations:</strong> {data.citations.join(' | ')}</p>
            <p className="mt-4">This report was generated by RevenueScope AI on {date}. The information contained herein is for strategic planning and marketing purposes and is based on publicly available data from government sources.</p>
        </footer>
      </main>
    </div>
  );
}
