'use client';

import React from 'react';
import { PlayCircle, FileText, Award, CheckSquare, Lock, Loader2 } from 'lucide-react';
import type { CourseTimelineOutput as CourseTimelineData } from '@/ai/types';

const getIcon = (type: 'video' | 'resource' | 'award' | 'quiz') => {
  switch (type) {
    case 'video':
      return <PlayCircle className="w-5 h-5 text-slate-600" />;
    case 'resource':
      return <FileText className="w-5 h-5 text-slate-600" />;
    case 'award':
      return <Award className="w-5 h-5 text-orange-500" />;
    case 'quiz':
      return <CheckSquare className="w-5 h-5 text-emerald-600" />;
    default:
      return <Lock className="w-4 h-4 text-slate-400" />;
  }
};

export const CourseTimeline: React.FC<{
  data: CourseTimelineData | null;
  isLoading: boolean;
}> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="text-center p-10">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-500" />
        <p className="mt-4 font-semibold text-slate-600">
          Building visual course outline...
        </p>
      </div>
    );
  }

  if (!data || !data.modules || data.modules.length === 0) {
    return (
      <div className="text-center p-10 text-slate-500">
        No course data available to build a timeline.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-black text-slate-900 mb-2">
        {data.courseTitle}
      </h3>

      {data.modules.map((module, moduleIndex) => (
        <div key={moduleIndex} className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden font-sans">
          
          {/* HEADER */}
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-800">{module.title}</h2>
              <p className="text-sm text-slate-500">{module.items.length} Lectures • {module.total_duration}</p>
            </div>
          </div>

          {/* LIST ITEMS */}
          <div className="divide-y divide-slate-100">
            {module.items.map((item) => (
              <div 
                key={item.id} 
                className="group flex items-start gap-4 p-5 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                {/* Left: Icon */}
                <div className="mt-1 flex-shrink-0">
                  {getIcon(item.type)}
                </div>

                {/* Middle: Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-semibold text-slate-800 group-hover:text-blue-700">
                      {item.title}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">{item.duration}</span>
                  </div>
                  
                  <p className="text-xs text-slate-500 leading-relaxed mb-2">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                      <PlayCircle className="w-3 h-3" /> Start Lecture
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
