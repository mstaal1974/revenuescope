'use client';

import { useState, useEffect } from 'react';
import type { FullAuditOutput } from '@/ai/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, TrendingUp, TrendingDown, RefreshCw, Clock, Wallet, CheckCircle, BarChart, FileText, Loader2, AlertTriangle } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const KeyMetricCard = ({ icon, title, value, subtext }: { icon: React.ReactNode, title: string, value: string, subtext: string }) => (
  <div className="bg-slate-50 p-4 rounded-lg">
    <div className="flex items-center gap-3 mb-2">
      <div className="text-blue-600">{icon}</div>
      <h3 className="font-semibold text-slate-600">{title}</h3>
    </div>
    <p className="text-3xl font-bold text-slate-900">{value}</p>
    <p className="text-xs text-slate-500">{subtext}</p>
  </div>
);

export default function PrintReportPage() {
  const [data, setData] = useState<FullAuditOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const dataString = localStorage.getItem("auditData");
      if (!dataString) {
        throw new Error("No audit data found in your session. Please run an audit first.");
      }
      const parsedData = JSON.parse(dataString);
      setData(parsedData);
    } catch (e) {
      console.error("Failed to load audit data:", e);
      setError(e instanceof Error ? e.message : "Could not load audit data.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="bg-slate-100 min-h-screen flex items-center justify-center text-center">
        <div>
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <h2 className="mt-4 text-xl font-semibold text-slate-700">Loading Report Data...</h2>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-slate-100 min-h-screen flex items-center justify-center text-center p-8">
        <div className="bg-white p-10 rounded-lg shadow-md max-w-lg">
           <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
           <h2 className="mt-4 text-xl font-bold text-slate-800">Could not generate report</h2>
           <p className="mt-2 text-slate-600">{error || "The audit data seems to be missing or corrupted."}</p>
           <Button onClick={() => window.location.href = '/'} className="mt-6">Go to Homepage</Button>
        </div>
      </div>
    );
  }

  // --- Data Calculations ---
  const standardRevenue = data.tiers[2].price;
  const clusteredRevenue = data.tiers[0].price + data.tiers[1].price + data.tiers[2].price;
  const revenueUplift = clusteredRevenue - standardRevenue;
  const ltvExpansion = standardRevenue > 0 ? (clusteredRevenue / standardRevenue).toFixed(1) + 'x' : 'N/A';
  
  const topSectorData = data.sector_breakdown.find(s => s.sector_name === data.executive_summary.top_performing_sector);
  const cacOffset = topSectorData?.business_multipliers?.marketing_cac_label || 'N/A';
  const timeToValue = data.tiers[1].commercial_leverage.speed_to_revenue || 'N/A';

  const executiveSummary = data.executive_summary.strategic_advice;
  const keyInsight = `The highest immediate demand is not for the full diploma, but for the '${data.tiers[1].title}', indicating a strong market for mid-level management skills.`;
  
  const revenueBridge = [
    { name: 'Standard Diploma', value: standardRevenue },
    { name: 'Tier 1 Micro-Course', value: data.tiers[0].price },
    { name: 'Tier 2 Skill Set', value: data.tiers[1].price },
    { name: 'New Total Revenue', value: clusteredRevenue },
  ];
  
  const qualTitle = data.tiers[2].title;
  const rtoName = data.rto_name || 'Your RTO';
  const gtmPlaybook = data.tiers[0].marketing_playbook;

  return (
    <div className="bg-slate-100 font-serif">
      <Button onClick={handlePrint} className="no-print fixed bottom-8 right-8 z-50 shadow-lg" size="lg">
        <Download className="mr-2 h-5 w-5" />
        Download as PDF
      </Button>

      {/* PAGE 1 */}
      <div className="print-page">
        <div className="print-container">
          <header className="flex justify-between items-center pb-4 border-b border-slate-200">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Board-Ready Report</h1>
              <p className="text-slate-500">Commercial Strategy for {qualTitle}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-slate-800">{rtoName}</p>
              <p className="text-sm text-slate-500">{new Date().toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </header>

          <main className="flex-grow mt-8">
            <section className="no-break">
              <h2 className="text-lg font-bold text-slate-800 mb-2 uppercase tracking-wider">Executive Summary</h2>
              <p className="text-slate-600 leading-relaxed">{executiveSummary}</p>
              
              <div className="my-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800">
                <h3 className="font-bold">Key Strategic Insight</h3>
                <p className="mt-1 text-sm">{keyInsight}</p>
              </div>
            </section>
            
            <section className="no-break my-8">
              <h2 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wider">Key Performance Indicators</h2>
              <div className="grid grid-cols-2 gap-4">
                <KeyMetricCard icon={<TrendingUp />} title="Revenue Uplift" value={`+$${revenueUplift.toLocaleString()}`} subtext="Per student vs. standard model" />
                <KeyMetricCard icon={<RefreshCw />} title="Lifetime Value (LTV)" value={ltvExpansion} subtext="Increase in student value" />
                <KeyMetricCard icon={<TrendingDown />} title="CAC Offset" value={cacOffset} subtext="Reduction in acquisition cost" />
                <KeyMetricCard icon={<Clock />} title="Time-to-Value" value={timeToValue} subtext="From lead to first payment" />
              </div>
            </section>

            <section className="no-break mt-8">
               <h2 className="text-lg font-bold text-slate-800 mb-2 uppercase tracking-wider">Revenue Bridge</h2>
               <div className="h-64 w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart data={revenueBridge} margin={{ top: 20, right: 0, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis unit="$" />
                            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                            <Bar dataKey="value" fill="#2563eb" />
                        </RechartsBarChart>
                    </ResponsiveContainer>
               </div>
            </section>
          </main>

          <footer className="text-center text-xs text-slate-400 pt-4 border-t border-slate-200">
            <p>ScopeStack.ai • Confidential Internal Document • Page 1 of 2</p>
          </footer>
        </div>
      </div>

      {/* PAGE 2 */}
      <div className="print-page">
        <div className="print-container">
          <header className="flex justify-between items-center pb-4 border-b border-slate-200">
            <h1 className="text-3xl font-bold text-slate-900">Execution Plan</h1>
            <p className="text-slate-500">Product & Go-to-Market Strategy</p>
          </header>

          <main className="flex-grow mt-8">
            <section className="no-break">
              <h2 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wider">3-Tier Revenue Staircase</h2>
              <div className="space-y-4">
                {data.tiers.map(tier => (
                  <div key={tier.tier_level} className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl shrink-0">{tier.tier_level}</div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-slate-800">{tier.title}</h3>
                        <p className="font-bold text-blue-600 text-lg">${tier.price}</p>
                      </div>
                      <p className="text-sm text-slate-500">{tier.marketing_hook}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="no-break mt-8">
              <h2 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wider">Go-to-Market Playbook (Tier 1 Example)</h2>
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-base">Playbook: "{data.tiers[0].title}"</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-4">
                  <div className="flex gap-4">
                    <div className="w-1/2 bg-slate-50 p-3 rounded-md">
                      <h4 className="font-semibold text-slate-600 mb-1">Target Audience</h4>
                      <p className="text-slate-500">{gtmPlaybook.target_audience}</p>
                    </div>
                    <div className="w-1/2 bg-slate-50 p-3 rounded-md">
                      <h4 className="font-semibold text-slate-600 mb-1">Primary Channel</h4>
                      <p className="text-slate-500">{gtmPlaybook.channel}</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-md">
                    <h4 className="font-semibold text-slate-600 mb-1">Core Message Hook</h4>
                    <p className="text-slate-500 italic">"{gtmPlaybook.ad_headline} {gtmPlaybook.ad_body_copy}"</p>
                  </div>
                </CardContent>
              </Card>
            </section>
          </main>

          <footer className="text-center text-xs text-slate-400 pt-4 border-t border-slate-200">
            <p>ScopeStack.ai • Confidential Internal Document • Page 2 of 2</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
