
"use client";

import { useState, useEffect } from "react";
import type { AuditData } from "@/app/actions";
import { LeadCaptureOverlay } from "./lead-capture-overlay";
import { IndividualCourseCard } from "./individual-course-card";
import { OccupationAnalysis } from "./occupation-analysis";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { BoardReportPDF, type MappedPdfData } from "../BoardReportPDF";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function DashboardClient({ data }: { data: AuditData }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'rto' | 'student'>('rto');
  const [monitoring, setMonitoring] = useState(false);
  const [pdfData, setPdfData] = useState<MappedPdfData | null>(null);

  useEffect(() => {
    if (data) {
        const parseCurrency = (val: string) => parseFloat(val?.replace(/[^0-9.]/g, '') || '0');
        
        const traditional = parseCurrency(data.stackable_product?.bundle_price);
        const unbundled = parseCurrency(data.stackable_product?.total_value);
        let increase = '0';
        if (traditional > 0 && unbundled > traditional) {
             increase = (((unbundled - traditional) / traditional) * 100).toFixed(0);
        }

        const mappedData: MappedPdfData = {
            strategy_summary: data.executive_summary.strategic_advice,
            revenue_comparison: {
                traditional_model: data.stackable_product.bundle_price,
                unbundled_model: data.stackable_product.total_value,
                increase_percentage: `+${increase}%`
            },
            tiers: data.individual_courses.map(course => ({
                level: course.tier,
                product_name: course.course_title,
                price: course.suggested_price,
                tactic: course.target_student
            })),
            ai_opportunity: undefined 
        };
        setPdfData(mappedData);
    }
  }, [data]);


  const formatValue = (val: string | undefined) => (val === '[REAL_DATA_REQUIRED]' || !val) ? 'DATA UNAVAILABLE' : val;

  return (
    <div className="bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-200 max-w-7xl mx-auto overflow-hidden animate-in fade-in zoom-in-95 duration-1000">
      {/* 1. THE AUDIT HEADER (Summary Data) */}
      <div className="bg-slate-950 p-8 md:p-16 text-white text-left relative overflow-hidden border-b border-slate-800">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[180px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div className="bg-emerald-500/20 text-emerald-400 text-xs font-black px-5 py-2 rounded-full uppercase tracking-[0.3em] border border-emerald-500/30 inline-flex items-center gap-3 shadow-lg shadow-emerald-500/10">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
              Verified 1%-8% Revenue Audit
            </div>
            <button 
              onClick={() => setMonitoring(!monitoring)}
              className={`flex items-center gap-3 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${
                monitoring ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {monitoring ? '✓ Active Market Watch' : 'Monitor Sector Demand'}
            </button>
          </div>
          
          <h3 className="text-slate-500 text-sm font-black uppercase tracking-[0.2em] mb-4 font-mono">Strategic Product Theme</h3>
          <div className="text-5xl lg:text-7xl font-black mb-10 tracking-tighter text-white leading-none">
            {formatValue(data.strategic_theme)}
          </div>
          
          <OccupationAnalysis data={data.occupation_analysis} />

        </div>
      </div>

      <div className="p-8 md:p-16 relative bg-slate-50/50">
        {!isUnlocked && <LeadCaptureOverlay onUnlock={() => setIsUnlocked(true)} data={data} />}

        <div className={`transition-all duration-1000 ${!isUnlocked ? 'filter blur-3xl pointer-events-none' : ''}`}>
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-16">
            <div className="text-left">
              <h4 className="font-black text-4xl text-slate-950 tracking-tight underline decoration-blue-500/20 decoration-8 underline-offset-8 mb-2">Micro-Stack Architect</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Calibrated Sequential Pathway v4.5</p>
            </div>
            
            <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center shadow-inner relative">
              <div className={`absolute inset-y-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm transition-all duration-500 ease-out ${viewMode === 'rto' ? 'left-1.5' : 'left-[calc(50%+1.5px)]'}`}></div>
              <button 
                onClick={() => setViewMode('rto')}
                className={`relative z-10 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  viewMode === 'rto' ? 'text-slate-950' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                RTO Perspective
              </button>
              <button 
                onClick={() => setViewMode('student')}
                className={`relative z-10 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  viewMode === 'student' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Student Perspective
              </button>
            </div>
          </div>
          
          {isUnlocked && pdfData && (
            <div className="mb-12 animate-in fade-in duration-500">
                <div className="flex flex-col sm:flex-row gap-4 p-6 bg-emerald-50 border border-emerald-200 rounded-3xl justify-center items-center">
                    <p className="font-bold text-emerald-900 text-center sm:text-left">✓ Report Unlocked. You can now download your report.</p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <PDFDownloadLink
                        document={<BoardReportPDF data={pdfData} rtoCode={data.rto_id} rtoName={data.rtoName || data.executive_summary.top_performing_sector} />}
                        fileName="ScopeStack_Board_Report.pdf"
                        className="w-full sm:w-auto text-center items-center justify-center flex gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-2xl text-sm"
                        >
                        {({ loading }) => (loading ? 'Generating PDF...' : '📄 Download Board Report (PDF)')}
                        </PDFDownloadLink>
                        <Button asChild variant="outline" className="w-full sm:w-auto bg-white/80 py-4 px-6 rounded-2xl text-sm font-bold">
                        <Link href="https://outlook.office.com/bookwithme/user/a656a2e7353645d98cae126f07ebc593@blocksure.com.au/meetingtype/OAyzW_rOmEGxuBmLJElpTw2?anonymous&ismsaljsauthenabled&ep=mlink" target="_blank">Book Discovery Meeting</Link>
                        </Button>
                    </div>
                </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {(data.individual_courses || []).map((course, i) => (
              <IndividualCourseCard 
                key={i} 
                course={course}
                index={i}
                viewMode={viewMode}
                expandedCourse={expandedCourse}
                setExpandedCourse={setExpandedCourse}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white px-8 md:px-16 py-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex flex-col items-start gap-4 text-left">
          <div className="flex items-center gap-4 text-emerald-500 font-black text-[10px] uppercase tracking-[0.2em] font-mono">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Pricing Calibration Active (Base Anchor + Market Multiplier)
          </div>
          {data.citations && data.citations.length > 0 && (
            <div className="text-[9px] text-slate-400 font-bold max-w-xl leading-relaxed">
              <span className="text-slate-500 font-mono uppercase">Citations:</span> {data.citations.join(' | ')}
            </div>
          )}
        </div>
        <div className="flex gap-12">
          <div className="flex flex-col text-left">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 font-mono">Modeling Basis</span>
             <span className="text-xs font-black text-slate-900">ABS Labor Market Stats 2024</span>
          </div>
          <div className="flex flex-col text-left">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 font-mono">Forecast Range</span>
             <span className="text-xs font-black text-slate-900 text-blue-600 italic">1% — 8% Target Capture</span>
          </div>
        </div>
      </div>
    </div>
  );
}
