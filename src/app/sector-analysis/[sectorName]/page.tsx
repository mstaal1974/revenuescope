'use client';

import { Suspense, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Header } from "@/components/shared/header";
import { type AuditData, type Sector, runGenerateSectorCampaignKitAction, type SectorCampaignKitOutput } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertTriangle, Loader2, ArrowLeft, Briefcase, Sparkles, Download, CheckCircle } from 'lucide-react';
import FinancialImpactDashboard from '@/components/sector-analysis/FinancialImpactDashboard';
import KpiCard from '@/components/sector-analysis/KpiCard';

function SectorAnalysisContent() {
  const params = useParams();
  const sectorName = params.sectorName ? decodeURIComponent(params.sectorName as string) : null;
  
  const [sectorData, setSectorData] = useState<Sector | null>(null);
  const [campaignKitData, setCampaignKitData] = useState<SectorCampaignKitOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sectorName) {
      setError("No sector specified in the URL.");
      setLoading(false);
      return;
    }

    const dataString = localStorage.getItem("auditData");
    if (!dataString) {
      setError("No audit data found. Please start a new audit from the homepage.");
      setLoading(false);
      return;
    }
    
    try {
      const parsedData: AuditData = JSON.parse(dataString);
      const foundSector = parsedData.sector_breakdown.find(s => s.sector_name === sectorName);
      
      if (!foundSector) {
        setError(`Sector "${sectorName}" not found in the audit data.`);
        setLoading(false);
        return;
      }
      setSectorData(foundSector);

      const generateKit = async () => {
        const response = await runGenerateSectorCampaignKitAction({ sector: foundSector });
        if (response.ok) {
          setCampaignKitData(response.result);
        } else {
          setError(response.error);
        }
        setLoading(false);
      };

      generateKit();

    } catch (e) {
      console.error("Failed to process data:", e);
      setError("There was an issue processing the audit data. It might be corrupted. Please try again.");
      setLoading(false);
    }
  }, [sectorName]);

  const ErrorCard = ({title, message}: {title: string, message: string}) => (
    <div className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-card rounded-[2.5rem] shadow-2xl p-12 border border-border">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-black text-foreground">
                    <AlertTriangle className="text-rose-500" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground">{message}</p>
                <Button asChild className="w-full bg-slate-950 hover:bg-blue-600 text-white font-black px-8 py-5 rounded-2xl transition-all shadow-2xl shadow-slate-900/20 active:scale-[0.98] text-xl">
                  <Link href="/dashboard">Back to Dashboard</Link>
                </Button>
            </CardContent>
        </Card>
    </div>
  );
  
  if (loading) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 bg-blue-500 rounded-full animate-pulse"></div>
                <Loader2 className="absolute inset-0 m-auto h-8 w-8 text-white animate-spin" />
            </div>
            <p className="mt-4 text-white font-medium text-lg">Generating Strategic Campaign Kit...</p>
            <p className="text-slate-400">The AI is analyzing financial multipliers and market strategy.</p>
        </div>
    );
  }

  if (error) {
    return <ErrorCard title="Error Generating Campaign Kit" message={error} />;
  }
  
  if (sectorData && campaignKitData) {
    const kpi = campaignKitData.kpi_metrics;
    const strategy = campaignKitData.the_strategy;

    return (
        <div className='container mx-auto p-4 md:p-8'>
            {/* Header */}
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12'>
                <div>
                    <Button asChild variant="ghost" className='mb-4 pl-0 text-slate-400 hover:text-white'>
                        <Link href="/dashboard"><ArrowLeft size={16} className='mr-2' /> Back to Main Dashboard</Link>
                    </Button>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">ScopeStack Strategic Campaign Kit</h1>
                    <div className='flex items-center gap-3 mt-3'>
                        <Briefcase className='text-blue-400' />
                        <p className="text-xl text-blue-300 font-bold">{sectorData.sector_name}</p>
                    </div>
                </div>
                 <Button size="lg" className='bg-white text-blue-600 hover:bg-slate-200 font-bold shadow-lg'>
                    <Download size={16} className='mr-2'/>
                    Export Kit
                </Button>
            </div>

            {/* Main Content */}
            <FinancialImpactDashboard data={campaignKitData.financial_impact} />

            <div className="my-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="CAC Reduction" value={kpi.cac_reduction_value} subValue={kpi.cac_reduction_percentage} description="Per acquisition" />
                <KpiCard title="LTV Expansion" value={kpi.ltv_expansion_multiplier} subValue="Projected" description="Lifetime value growth" />
                <KpiCard title="Authority Index" value={`${kpi.authority_index_score}/100`} subValue="Industry leader positioning" isGauge={true} gaugeValue={kpi.authority_index_score} />
                <KpiCard title="Lead Volume" value={kpi.monthly_lead_volume} subValue="Monthly" description="Estimated from annual learners" />
            </div>

            <Card className='bg-slate-900 border-slate-800 text-white rounded-3xl p-8 md:p-12'>
                <CardHeader className='p-0 mb-6'>
                    <CardTitle className='text-3xl font-bold flex items-center gap-3'><Sparkles className='text-purple-400'/> The Strategy</CardTitle>
                </CardHeader>
                <CardContent className='p-0 grid md:grid-cols-2 gap-8'>
                    <div className='space-y-6'>
                         <p className="text-lg text-slate-300 leading-relaxed">{strategy.primary_logic}</p>
                         <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-400">
                           "{strategy.market_pivot}"
                         </blockquote>
                         <p className='text-sm text-slate-400'><span className='font-bold text-slate-200'>Target Audience:</span> {strategy.target_audience}</p>
                    </div>
                     <div className='space-y-4 bg-slate-800/50 p-6 rounded-2xl border border-slate-700'>
                        <h4 className='font-bold text-slate-200'>Key Selling Points</h4>
                        {strategy.key_selling_points.map((point, i) => (
                             <div key={i} className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-emerald-400 mt-1 shrink-0" />
                                <span className="text-lg text-slate-300">{point}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

        </div>
    );
  }

  return <ErrorCard title="An Unknown Error Occurred" message="Something went wrong. Please return to the dashboard and try again." />;
}


export default function SectorAnalysisPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background font-body">
            <Header />
            <main className="flex-1 flex flex-col py-8">
              <Suspense fallback={
                <div className="flex-1 flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="mt-4 text-muted-foreground font-medium">Loading...</p>
                </div>
              }>
                <SectorAnalysisContent />
              </Suspense>
            </main>
        </div>
    );
}
