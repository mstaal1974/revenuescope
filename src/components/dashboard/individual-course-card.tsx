"use client";

import React, { useState } from 'react';
import type { AuditData } from "@/app/actions";
import { runGenerateCourseTimelineAction, type CourseTimelineActionResult } from '@/app/actions';
import { cn } from '@/lib/utils';
import { CourseTimeline } from '../CourseBuilder/CourseTimeline';
import { type CourseTimelineOutput as CourseTimelineData } from '@/ai/types';
import { useToast } from '@/hooks/use-toast';


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
  const [timelineData, setTimelineData] = useState<CourseTimelineData | null>(null);
  const [isTimelineLoading, setIsTimelineLoading] = useState(false);
  
  const { toast } = useToast();
  const isExpanded = expandedCourse === index;

  const formatValue = (val: string | undefined) => (val === '[REAL_DATA_REQUIRED]' || !val) ? 'DATA UNAVAILABLE' : val;

  const handleGenerateTimeline = async () => {
    setIsTimelineLoading(true);
    setTimelineData(null);

    const result = await runGenerateCourseTimelineAction({
      course_title: course.course_title,
      learning_outcomes: course.learning_outcomes,
    });

    setIsTimelineLoading(false);
    if (result.ok) {
      setTimelineData(result.result);
    } else {
      toast({
        variant: "destructive",
        title: "Timeline Generation Failed",
        description: result.error,
      });
    }
  }

  const handleToggleExpand = () => {
    if (isExpanded) {
      setExpandedCourse(null);
      setTimelineData(null); // Reset on collapse
    } else {
      setExpandedCourse(index);
      handleGenerateTimeline(); // Trigger on expand
    }
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
            Generate Visual Outline
          </button>
        </>
      ) : (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500 relative text-left">
          <CourseTimeline data={timelineData} isLoading={isTimelineLoading} />
          <div className="flex gap-4 mt-8">
            <button 
              onClick={handleToggleExpand}
              className="w-full text-slate-400 hover:text-slate-950 text-[10px] font-black uppercase tracking-widest py-4 border-2 border-dashed border-slate-200 rounded-2xl transition-all font-mono"
            >
              Hide Visual Outline
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
