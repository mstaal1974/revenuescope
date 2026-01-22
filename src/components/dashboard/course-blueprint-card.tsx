import type { AuditData } from "@/app/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
    CircleDollarSign,
    Clock,
    Users,
    TrendingUp,
    Target,
    BookOpen,
    Lightbulb
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


type Course = AuditData["learning_pathway"]["courses"][0];

interface CourseBlueprintCardProps {
  course: Course;
}

const InfoBadge = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
    <div className="flex flex-col items-center text-center">
        <div className="text-primary">{icon}</div>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
        <p className="font-bold text-sm">{value}</p>
    </div>
);

const SkillDemandVisual = ({ trend }: { trend: Course['skill_demand_trend'] }) => {
    if (!trend) return null;

    return (
        <div className="flex items-center gap-3 p-3 bg-green-100/50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/30">
            <div className="text-green-600 dark:text-green-400">
                <TrendingUp size={24} />
            </div>
            <div>
                <p className="font-bold text-green-700 dark:text-green-300">
                    {trend.growth_percentage} YoY Demand
                </p>
                <p className="text-xs text-green-600 dark:text-green-500">{trend.narrative}</p>
            </div>
        </div>
    );
};


export function CourseBlueprintCard({ course }: CourseBlueprintCardProps) {
  return (
    <Card className="rounded-2xl shadow-lg bg-card/70 backdrop-blur-sm border-primary/10">
      <CardHeader>
        <CardTitle>{course.course_title}</CardTitle>
        <CardDescription>
          For: <span className="font-semibold text-primary">{course.target_audience}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2 text-center p-3 bg-muted/50 rounded-lg">
            <InfoBadge icon={<CircleDollarSign size={20} />} label="Price" value={course.suggested_price} />
            <InfoBadge icon={<Clock size={20} />} label="Duration" value={course.duration} />
            <InfoBadge icon={<TrendingUp size={20} />} label="Revenue" value={course.revenue_potential.split(' ')[0]} />
            <InfoBadge icon={<Users size={20} />} label="Audience" value={course.target_audience.split(' ')[0]} />
        </div>
        
        {course.skill_demand_trend && <SkillDemandVisual trend={course.skill_demand_trend} />}
        
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                Marketing Hook
            </h4>
            <p className="text-sm text-muted-foreground italic">"{course.marketing_hook}"</p>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Included Skills
                    </h4>
                </AccordionTrigger>
                <AccordionContent>
                    <ul className="space-y-2 text-sm text-muted-foreground pl-4 mt-2">
                        {(course.included_skills || []).map(skill => (
                           <li key={skill.esco_uri} className="flex items-start gap-2">
                                <Target className="h-4 w-4 text-primary mt-1 shrink-0" />
                                <div>
                                    <span className="font-semibold text-foreground">{skill.skill_name}:</span>
                                    <span className="ml-1">{skill.learning_outcome}</span>
                                </div>
                           </li>
                        ))}
                    </ul>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
