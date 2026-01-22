import type { AuditData } from "@/app/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, CheckCircle, ChevronRight, Clock, DollarSign, Users, Target, ClipboardList, Megaphone, Rocket, Award } from "lucide-react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

type Course = AuditData["product_ecosystem"]["individual_courses"][0];

interface IndividualCourseCardProps {
  course: Course;
  view: 'rto' | 'student';
  isExpanded: boolean;
  onExpand: () => void;
  className?: string;
}

const tierDetails = {
    '1': { name: "TIER_1", color: "orange", badgeBg: "bg-orange-200", badgeText: "text-orange-800" },
    '2': { name: "TIER_2", color: "slate", badgeBg: "bg-slate-300", badgeText: "text-slate-800" },
    '3': { name: "TIER_3", color: "amber", badgeBg: "bg-amber-400", badgeText: "text-amber-800" },
};

const getTierNumber = (tier: string) => tier.match(/\d+/)?.[0] || '1';

const BadgePreview = ({ course, view }: { course: Course; view: 'rto' | 'student' }) => {
    const tierNumber = getTierNumber(course.tier);
    const tierInfo = tierDetails[tierNumber as keyof typeof tierDetails];

    return (
        <div className="perspective-1000">
            <div className={`relative w-64 h-40 rounded-2xl ${tierInfo.badgeBg} flex flex-col justify-between p-4 text-sm transition-transform duration-300 transform-gpu hover:rotate-y-12`}>
                <div className="flex justify-between items-start">
                    <div>
                        <p className={`font-bold text-xs ${tierInfo.badgeText} opacity-70`}>MICROCREDENTIALS.IO</p>
                        <p className={`font-bold ${tierInfo.badgeText}`}>{view === 'student' ? course.badge.title : course.course_title}</p>
                    </div>
                    <Award className={`h-8 w-8 ${tierInfo.badgeText}`} />
                </div>
                <div>
                    <p className={`font-bold text-xs ${tierInfo.badgeText} opacity-70`}>VERIFIED SKILL</p>
                    <p className={`font-semibold text-xs ${tierInfo.badgeText}`}>{course.key_skill}</p>
                </div>
            </div>
        </div>
    );
}

export function IndividualCourseCard({ course, view, isExpanded, onExpand, className }: IndividualCourseCardProps) {
    const tierNumber = getTierNumber(course.tier);
    const tierInfo = tierDetails[tierNumber as keyof typeof tierDetails];
    const tierStyles = {
        '1': 'border-tier-1-fg/20 bg-tier-1-bg/50 text-tier-1-fg',
        '2': 'border-tier-2-fg/20 bg-tier-2-bg/50 text-tier-2-fg',
        '3': 'border-tier-3-fg/20 bg-tier-3-bg/50 text-tier-3-fg',
    }[tierNumber] || 'border-border bg-card';
    const tierPillStyles = `bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300`;

    if (isExpanded) {
        return (
          <Card className={cn("lg:col-span-3 rounded-[2.5rem] shadow-2xl border-blue-200/50 w-full overflow-hidden blueprint-grid-expanded", className)}>
            <div className="p-6">
                <button onClick={onExpand} className="flex items-center text-sm text-primary font-semibold mb-4">
                    <ChevronRight className="h-4 w-4 rotate-180 mr-1"/>
                    Back to Pathway
                </button>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3 space-y-6">
                        <div className="flex items-center gap-4">
                            <Badge className={cn(tierPillStyles, "font-code text-xs")}>{tierInfo.name}</Badge>
                            <h2 className="text-2xl font-bold font-headline">{view === 'student' ? course.badge.title : course.course_title}</h2>
                        </div>
                        <p className="text-muted-foreground">
                            {view === 'rto' 
                                ? `A ${course.duration} course designed for ${course.target_student}, focusing on the key skill of ${course.key_skill}.`
                                : `Achieve mastery in ${course.key_skill} and earn a verified digital badge.`
                            }
                        </p>
                        
                        <Separator />
                        
                        <div className="font-code text-sm space-y-4">
                             <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">SUGGESTED PRICE</span>
                                <span className="font-bold text-lg">{course.suggested_price}</span>
                             </div>
                             <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">CONTACT HOURS</span>
                                <span className="font-bold">{course.duration}</span>
                             </div>
                             {view === 'rto' && (
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">TARGET PERSONA</span>
                                    <span className="font-bold">{course.sales_kit.target_personas.join(', ')}</span>
                                </div>
                             )}
                             {view === 'student' && (
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">CAREER ROI</span>
                                    <span className="font-bold">{course.career_roi}</span>
                                </div>
                             )}
                        </div>

                        <Separator />

                         <div>
                            <h4 className="font-bold font-headline mb-2">{view === 'student' ? 'Rich Skill Descriptors' : 'Learning Outcomes'}</h4>
                            <ul className="space-y-2">
                                {(view === 'student' ? course.badge.rich_skill_descriptors : course.learning_outcomes).map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* Sales Enablement Kit */}
                        <div className="bg-slate-950 text-slate-100 rounded-2xl p-4">
                             <h4 className="font-bold font-headline mb-2 text-slate-300">Sales Enablement Kit</h4>
                             <p className="text-sm font-medium italic text-slate-400">"{course.sales_kit.b2b_pitch}"</p>
                        </div>
                        {/* Marketing Launch Unit */}
                        <div className="border rounded-2xl p-4 space-y-4">
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold font-headline">Marketing Launch Unit</h4>
                                <Badge variant="outline">AD UNIT</Badge>
                            </div>
                            <div className="bg-muted p-4 rounded-lg">
                                <p className="text-sm font-medium">{course.marketing_launch_unit.ad_copy}</p>
                                <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700 text-white">Learn More</Button>
                            </div>
                            <div>
                                 <h5 className="font-semibold text-xs text-muted-foreground mb-2">LAUNCH TIMELINE</h5>
                                 <ul className="space-y-1">
                                    {course.marketing_launch_unit.launch_timeline.map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm font-code">
                                            <span className="text-muted-foreground">{i+1}.</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                 </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </Card>
        );
    }

    return (
      <Card
        onClick={onExpand}
        className={cn(
          "rounded-[2.5rem] bg-white dark:bg-card shadow-sm hover:shadow-2xl hover:border-primary/20 border border-transparent transition-all cursor-pointer",
          className
        )}
      >
        <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <Badge className={cn(tierPillStyles, 'font-code text-xs mb-2')}>{tierInfo.name}</Badge>
                    <CardTitle className="text-lg font-bold font-headline">{course.course_title}</CardTitle>
                </div>
                <div className="text-right">
                    <p className="font-bold text-lg">{course.suggested_price}</p>
                    <p className="text-xs text-muted-foreground">/ per student</p>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-center">
                <BadgePreview course={course} view={view} />
            </div>
            <div className="text-center">
                <p className="font-semibold">{view === 'student' ? 'Key Skill' : 'Primary Focus'}</p>
                <p className="text-muted-foreground text-sm">{course.key_skill}</p>
            </div>
          <Button variant="outline" className="w-full">
              View Blueprint <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardContent>
      </Card>
    );
}
