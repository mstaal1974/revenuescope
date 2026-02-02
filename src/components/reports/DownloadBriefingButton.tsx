'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { FileText, Loader2 } from 'lucide-react';
import { BoardBriefingPDF } from './BoardBriefingPDF';

// IMPORTANT: PDFDownloadLink fails in Next.js Server Components if not loaded dynamically
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => <div className="flex items-center gap-2 text-slate-500 text-sm py-4"><Loader2 className="h-4 w-4 animate-spin" /> Initializing PDF Engine...</div> }
);

interface StrategyData {
  qualCode: string;
  revenueUplift: number;
  cacOffset: string;
  clusterCount: number;
  clusters: Array<{ name: string; revenue: number }>;
}

export default function DownloadBriefingButton({ strategyData }: { strategyData: StrategyData | null }) {
  // Ensure we have minimal data to prevent crash
  const safeData = strategyData || { 
    qualCode: 'DEMO', 
    revenueUplift: 0, 
    cacOffset: '0', 
    clusterCount: 3,
    clusters: [] 
  };

  return (
    <div className="no-print">
      <PDFDownloadLink
        document={<BoardBriefingPDF data={safeData} />}
        fileName={`Board_Briefing_${safeData.qualCode}.pdf`}
      >
        {({ blob, url, loading, error }) => (
          <button 
            disabled={loading || !strategyData}
            className={`
              w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold shadow-lg transition-all
              ${loading ? 'bg-slate-700 cursor-wait' : 'bg-emerald-600 hover:bg-emerald-700 hover:scale-105 active:scale-95'}
              text-white
            `}
          >
            {loading ? <Loader2 className="animate-spin" /> : <FileText />}
            {loading ? 'Generating Briefing...' : 'Download Board Briefing (PDF)'}
          </button>
        )}
      </PDFDownloadLink>
      <p className="text-slate-500 text-[10px] mt-3 text-center uppercase tracking-widest font-bold">
        Generates 2-Page Executive Briefing
      </p>
    </div>
  );
}
