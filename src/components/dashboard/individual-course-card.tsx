"use client";

import React from 'react';
import type { AuditData } from "@/app/actions";
import { cn } from '@/lib/utils';

type Course = AuditData["individual_courses"][0];

interface BadgePreviewProps {
  course: Course;
  view: 'rto' | 'student';
}

const BadgePreview: React.FC<BadgePreviewProps> = ({ course, view }) => {
  const tier = course.tier || '';
  const isGold = tier.toLowerCase().includes('strategic') || tier.toLowerCase().includes('3');
  const isSilver = tier.toLowerCase().includes('practitioner') || tier.toLowerCase().includes('2');
  const badgeName = course.badge_name || course.course_title;

  const styleClasses = isGold ? 'bg-amber-400 border-amber-600 text-amber-900 shadow-amber-500/20' :
                       isSilver ? 'bg-slate-300 border-slate-400 text-slate-800 shadow-slate-400/20' :
                       'bg-orange-200 border-orange-400 text-orange-900 shadow-orange-500/20';

  const innerStyleClasses = isGold ? 'bg-amber-900/10' : isSilver ? 'bg-slate-800/10' : 'bg-orange-950/10';

  return (
    <div className="relative w-28 h-28 shrink-0 perspective-1000 group/badge">
      <div className={cn(
        "w-full h-full rounded-2xl flex flex-col items-center justify-center p-3 text-[7px] font-black text-center uppercase tracking-tighter border-4 shadow-xl transition-all duration-700 group-hover/badge:rotate-12 group-hover/badge:scale-110",
        styleClasses
      )}>
        <div className="mb-1 opacity-50 font-mono">microcredentials.io</div>
        <div className="leading-tight mb-1 px-1 line-clamp-2">{badgeName}</div>
        <div className={cn("px-2 py-0.5 rounded-full mt-auto text-[6px]", innerStyleClasses)}>OFFICIAL CREDENTIAL</div>
      </div>
    </div>
  );
};


interface IndividualCourseCardProps {
    course: Course;
    index: number;
    viewMode: 'rto' | 'student';
    expandedCourse: number | null;
    setExpandedCourse: (index: number | null) => void;
}

export function IndividualCourseCard({ course, index, viewMode, expandedCourse, setExpandedCourse }: IndividualCourseCardProps) {
  const isExpanded = expandedCourse === index;

  const formatValue = (val: string | undefined) => (val === '[REAL_DATA_REQUIRED]' || !val) ? 'DATA UNAVAILABLE' : val;

  const handleToggleExpand = () => {
    setExpandedCourse(isExpanded ? null : index);
  };
  
  if (!course) return null;

  return (
    <div className={cn('bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-200 flex flex-col hover:shadow-2xl hover:border-blue-200 transition-all group relative overflow-hidden', isExpanded ? 'lg:col-span-3 ring-4 ring-blue-500/10' : '')}>
      {/* TOP HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
        <div className="flex-1 text-left">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">{course.tier}</span>
            <div className="flex items-center gap-2">
               <span className="text-xl font-black text-slate-900">{formatValue(course.suggested_price)}</span>
               <span className="text-[8px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-widest font-mono">{course.pricing_tier}</span>
            </div>
          </div>
          <h5 className="text-2xl font-black text-slate-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
            {viewMode === 'student' ? (course.badge_name || course.course_title) : course.course_title}
          </h5>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
            {viewMode === 'student' ? 'EARN DIGITAL CREDENTIAL' : `${course.duration} CONTACT HOURS`}
          </p>
        </div>
        <BadgePreview course={course} view={viewMode} />
      </div>

      {/* MODE SNIPPETS */}
      {!isExpanded && (
        <div className={cn('mb-8 p-6 rounded-2xl border text-left', viewMode === 'rto' ? 'bg-slate-50 border-slate-100' : 'bg-blue-50/50 border-blue-100')}>
           <div className={cn('text-[8px] font-black uppercase tracking-widest mb-2 font-mono', viewMode === 'rto' ? 'text-slate-400' : 'text-blue-400')}>
              {viewMode === 'rto' ? 'Primary Sales Target' : 'Career Impact / RSD'}
           </div>
           <div className="text-sm font-bold text-slate-900 leading-relaxed italic">
              {viewMode === 'rto' ? course.target_student : `"${course.badge_skills?.[0]}"`}
           </div>
        </div>
      )}

      {!isExpanded ? (
        <>
          <p className="text-sm font-medium text-slate-500 mb-8 line-clamp-2 italic text-left">"{course.learning_outcomes?.[0]}..."</p>
          <button 
            onClick={handleToggleExpand}
            className="mt-auto w-full bg-slate-50 hover:bg-slate-100 text-slate-950 font-black py-4 rounded-2xl border border-slate-200 transition-all text-xs uppercase tracking-widest active:scale-95"
          >
            Generate Full Skeleton
          </button>
        </>
      ) : (
        <div className="grid md:grid-cols-2 gap-12 mt-4 animate-in fade-in slide-in-from-top-4 duration-500 relative text-left blueprint-bg">
          {/* EXPANDED BLUEPRINT VIEW */}
          <div className="space-y-10 relative z-10 pt-8">
            <div>
              <h6 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                <span className="w-6 h-6 bg-blue-600 text-white rounded flex items-center justify-center text-[10px] font-black shadow-lg">1</span>
                80% Ready Skeleton
              </h6>
              <div className="space-y-6 relative bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Module Outline</h4>
                <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">{course.module_outline_markdown}</pre>
              </div>
            </div>
            
            <div className="bg-slate-950 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl">
               <h6 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                  <span className="w-6 h-6 bg-blue-900/50 rounded flex items-center justify-center text-[10px] border border-blue-500/30">2</span>
                  B2B Sales Enablement
               </h6>
               <div className="mb-8">
                  <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2 font-mono">Target Student Persona</div>
                  <div className="text-sm font-black text-white">{course.target_student}</div>
               </div>
               <div>
                  <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2 font-mono">Pre-Written Sales Script</div>
                  <p className="text-xs leading-relaxed text-slate-300 font-medium italic">"{course.b2b_pitch_script}"</p>
               </div>
            </div>
          </div>

          <div className="space-y-10 relative z-10 pt-8">
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                <h6 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                    <span className="w-6 h-6 bg-slate-950 text-white rounded flex items-center justify-center text-[10px] font-black">3</span>
                    Digital Badge & RSDs
                </h6>
                <div className="flex gap-6 items-center mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                   <BadgePreview course={course} view={viewMode} />
                   <div>
                      <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 font-mono">Badge Title</div>
                      <div className="text-base font-black text-slate-900 leading-tight">{course.badge_name}</div>
                   </div>
                </div>

                <div className="mb-8">
                    <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-4 font-mono">Badge Skills</div>
                    <div className="space-y-3">
                        {(course.badge_skills || []).map((rsd, idx) => (
                            <div key={idx} className="flex gap-3 items-start p-3 bg-slate-50/50 rounded-xl border border-slate-100 group relative">
                                <div className="w-5 h-5 bg-blue-600 text-white text-[8px] font-black rounded flex items-center justify-center shrink-0">✓</div>
                                <div className="text-[10px] font-bold text-slate-700 leading-tight">{rsd}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-[2rem] p-8 relative overflow-hidden">
                <h6 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded flex items-center justify-center text-[10px] font-black">4</span>
                    Marketing Launch Plan
                </h6>
                <div className="space-y-6">
                   <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm relative">
                      <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[7px] font-black px-2 py-0.5 rounded italic shadow-md uppercase">Ad Creative</div>
                      <div className="text-xs font-black text-slate-950 mb-2 leading-tight">"{course.ad_headline}"</div>
                      <p className="text-[10px] text-slate-500 mb-4 line-clamp-2 font-medium">"{course.ad_body_copy}"</p>
                      <div className="bg-blue-600 text-white text-[9px] font-black py-2 rounded-lg text-center uppercase tracking-widest">{course.ad_cta_button}</div>
                   </div>
                   <button 
                      onClick={handleToggleExpand}
                      className="w-full text-slate-400 hover:text-slate-950 text-[10px] font-black uppercase tracking-widest py-4 border-2 border-dashed border-slate-200 rounded-2xl transition-all font-mono"
                   >
                      Hide Detailed Blueprint
                   </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
