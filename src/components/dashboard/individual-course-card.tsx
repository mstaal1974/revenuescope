import type { AuditData } from "@/app/actions";
import { Star, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Course = AuditData["product_ecosystem"]["individual_courses"][0];
type Stack = AuditData["product_ecosystem"]["stackable_product"];

interface ProductTierCardProps {
  course: Course;
  stack: Stack;
  isHighlighted: boolean;
  tierNumber: number;
}

const tierDescriptions = [
  "Low barrier, high volume acquisition. Designed to capture immediate student intent and build initial trust.",
  "Technical competency and retention layer. Deepens the student relationship by providing core, job-ready skills.",
  "Leadership focus for maximum margin. The strategic final step that creates an expert and unlocks lifetime value."
];

const getTierFeatures = (tierNumber: number) => {
    const staticFeatures = {
        1: ["Foundational Skill", "Digital Badge", "1-Week Access"],
        2: ["Applied Lab", "Practitioner Badge", "Community Access"],
        3: ["Expert Portfolio", "Gold Master Badge", "LTV Multiplier"]
    };
    return staticFeatures[tierNumber as keyof typeof staticFeatures];
}


export function ProductTierCard({ course, stack, isHighlighted, tierNumber }: ProductTierCardProps) {
    const description = tierDescriptions[tierNumber - 1];
    const features = getTierFeatures(tierNumber);

  return (
    <div
      className={cn(
        'relative flex flex-col p-10 rounded-[3rem] border transition-all duration-500 hover:-translate-y-4',
        isHighlighted
          ? 'bg-slate-950 text-white border-slate-800 shadow-2xl scale-105 z-10 hover:shadow-blue-500/20'
          : 'bg-white dark:bg-card text-slate-950 dark:text-slate-50 border-slate-200 dark:border-border shadow-sm hover:shadow-2xl'
      )}
    >
      {isHighlighted && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-2">
          <Star size={12} fill="currentColor" />
          Most Profitable
        </div>
      )}

      <div className="mb-8">
        <span className={cn(
            'text-[10px] font-black uppercase tracking-widest',
             isHighlighted ? 'text-blue-400' : 'text-blue-600 dark:text-blue-400'
        )}>
          {course.tier}
        </span>
        <h3 className="text-3xl font-black tracking-tight mt-2">{course.course_title}</h3>
      </div>

      <div className="mb-8">
        <div className="text-5xl font-black tracking-tighter mb-2">{course.suggested_price}</div>
        <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Per Enrollment</div>
      </div>

      <div className="flex gap-1 mb-10 h-3">
        {[...Array(3)].map((_, idx) => (
          <div
            key={idx}
            className={cn(
                'flex-1 rounded-full transition-all duration-1000',
              idx < tierNumber
                ? (isHighlighted ? 'bg-blue-500' : 'bg-blue-600')
                : (isHighlighted ? 'bg-white/5' : 'bg-slate-100 dark:bg-slate-800')
            )}
          ></div>
        ))}
      </div>

      <p className={cn('text-sm font-medium mb-10 leading-relaxed', isHighlighted ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400')}>
        {description}
      </p>

      <div className="space-y-4 mb-12">
        {(features || []).map((feature, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <CheckCircle2 size={16} className={isHighlighted ? 'text-blue-400' : 'text-blue-600 dark:text-blue-400'} />
            <span className="text-xs font-bold uppercase tracking-wide opacity-80">{feature}</span>
          </div>
        ))}
      </div>

      {isHighlighted && stack && (
        <div className="mt-auto pt-8 border-t border-white/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Old Way</span>
            <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Our Stack</span>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-xl font-bold text-slate-700 line-through">$300</span>
            <div className="text-right">
               <div className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-1">Total Stack Value</div>
               <div className="text-3xl font-black text-white">{stack.total_value}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
