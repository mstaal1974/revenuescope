'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, TrendingUp, TrendingDown, RefreshCw, Clock, Wallet, CheckCircle, BarChart, FileText } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const mockData = {
  qualCode: 'BSB50120',
  qualTitle: 'Diploma of Leadership and Management',
  rtoName: 'Australian Skills Academy',
  date: new Date().toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' }),
  revenueUplift: 1988,
  ltvExpansion: '4.1x',
  cacOffset: '-$127',
  timeToValue: '14 Days',
  executiveSummary: "By unbundling the BSB50120 Diploma of Leadership and Management into a 3-Tier Revenue Staircase, Australian Skills Academy can capture a wider market, increase revenue per student by $1,988, and significantly reduce customer acquisition costs. The strategy pivots from selling a high-cost qualification to offering accessible, skills-based entry products that create an automated upsell pathway towards the full diploma.",
  keyInsight: "The highest immediate demand is not for the full diploma, but for the 'Accredited Team Leader Skill Set' (Tier 2), indicating a strong market for mid-level management skills.",
  revenueBridge: [
    { name: 'Standard Diploma', value: 3500 },
    { name: 'Tier 1 Micro-Course', value: 97 },
    { name: 'Tier 2 Skill Set', value: 1891 },
    { name: 'New Total Revenue', value: 5488 },
  ],
  tiers: [
    { level: 1, title: 'AI for Managers Toolkit', price: 97, description: 'A 2-hour online workshop on using AI for productivity.' },
    { level: 2, title: 'Accredited Team Leader Skill Set', price: 1891, description: 'A 3-day intensive covering core management competencies.' },
    { level: 3, title: 'Diploma of Leadership & Management', price: 3500, description: 'The full qualification for senior leadership roles.' },
  ]
};

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
  const handlePrint = () => {
    window.print();
  };

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
              <p className="text-slate-500">Commercial Strategy for {mockData.qualCode}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-slate-800">{mockData.rtoName}</p>
              <p className="text-sm text-slate-500">{mockData.date}</p>
            </div>
          </header>

          <main className="flex-grow mt-8">
            <section className="no-break">
              <h2 className="text-lg font-bold text-slate-800 mb-2 uppercase tracking-wider">Executive Summary</h2>
              <p className="text-slate-600 leading-relaxed">{mockData.executiveSummary}</p>
              
              <div className="my-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800">
                <h3 className="font-bold">Key Strategic Insight</h3>
                <p className="mt-1 text-sm">{mockData.keyInsight}</p>
              </div>
            </section>
            
            <section className="no-break my-8">
              <h2 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wider">Key Performance Indicators</h2>
              <div className="grid grid-cols-2 gap-4">
                <KeyMetricCard icon={<TrendingUp />} title="Revenue Uplift" value={`+$${mockData.revenueUplift.toLocaleString()}`} subtext="Per student vs. standard model" />
                <KeyMetricCard icon={<RefreshCw />} title="Lifetime Value (LTV)" value={mockData.ltvExpansion} subtext="Increase in student value" />
                <KeyMetricCard icon={<TrendingDown />} title="CAC Offset" value={mockData.cacOffset} subtext="Reduction in acquisition cost" />
                <KeyMetricCard icon={<Clock />} title="Time-to-Value" value={mockData.timeToValue} subtext="From lead to first payment" />
              </div>
            </section>

            <section className="no-break mt-8">
               <h2 className="text-lg font-bold text-slate-800 mb-2 uppercase tracking-wider">Revenue Bridge</h2>
               <div className="h-64 w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart data={mockData.revenueBridge} margin={{ top: 20, right: 0, left: -20, bottom: 5 }}>
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
                {mockData.tiers.map(tier => (
                  <div key={tier.level} className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl shrink-0">{tier.level}</div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-slate-800">{tier.title}</h3>
                        <p className="font-bold text-blue-600 text-lg">${tier.price}</p>
                      </div>
                      <p className="text-sm text-slate-500">{tier.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="no-break mt-8">
              <h2 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wider">Go-to-Market Playbook (Tier 1 Example)</h2>
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-base">Playbook: "AI for Managers Toolkit"</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-4">
                  <div className="flex gap-4">
                    <div className="w-1/2 bg-slate-50 p-3 rounded-md">
                      <h4 className="font-semibold text-slate-600 mb-1">Target Audience</h4>
                      <p className="text-slate-500">Existing managers in non-tech fields feeling overwhelmed by admin tasks.</p>
                    </div>
                    <div className="w-1/2 bg-slate-50 p-3 rounded-md">
                      <h4 className="font-semibold text-slate-600 mb-1">Primary Channel</h4>
                      <p className="text-slate-500">LinkedIn Ads & targeted email campaigns.</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-md">
                    <h4 className="font-semibold text-slate-600 mb-1">Core Message Hook</h4>
                    <p className="text-slate-500 italic">"Stop drowning in paperwork. Spend 2 hours with us and learn how to automate 80% of your admin with AI, no coding required."</p>
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
