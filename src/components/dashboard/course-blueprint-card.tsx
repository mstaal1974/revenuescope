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
    Lightbulb,
    ShieldCheck,
    ShieldAlert,
    ShieldX
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

const MarketCompetitionVisual = ({ competition }: { competition: Course['market_competition'] }) => {
    if (!competition) return null;

    const level = (competition.level || 'Medium').toLowerCase();

    const competitionMeta = {
        low: {
            icon: <ShieldCheck size={24} />,
            color: "text-green-600 dark:text-green-400",
            bgColor: "bg-green-100/50 dark:bg-green-900/20",
            borderColor: "border-green-200 dark:border-green-800/30",
            title: "Low Competition",
            titleColor: "text-green-700 dark:text-green-300",
            textColor: "text-green-600 dark:text-green-500"
        },
        medium: {
            icon: <ShieldAlert size={24} />,
            color: "text-yellow-600 dark:text-yellow-400",
            bgColor: "bg-yellow-100/50 dark:bg-yellow-900/20",
            borderColor: "border-yellow-200 dark:border-yellow-800/30",
            title: "Medium Competition",
            titleColor: "text-yellow-700 dark:text-yellow-300",
            textColor: "text-yellow-600 dark:text-yellow-500"
        },
        high: {
            icon: <ShieldX size={24} />,
            color: "text-red-600 dark:text-red-400",
            bgColor: "bg-red-100/50 dark:bg-red-900/20",
            borderColor: "border-red-200 dark:border-red-800/30",
            title: "High Competition",
            titleColor: "text-red-700 dark:text-red-300",
            textColor: "text-red-600 dark:text-red-500"
        },
    }[level];

    if (!competitionMeta) return null;

    return (
        <div className={`flex items-start gap-3 p-3 rounded-lg border ${competitionMeta.bgColor} ${competitionMeta.borderColor}`}>
            <div className={competitionMeta.color}>
                {competitionMeta.icon}
            </div>
            <div>
                <p className={`font-bold ${competitionMeta.titleColor}`}>
                    {competitionMeta.title}
                </p>
                <p className={`text-xs ${competitionMeta.textColor}`}>{competition.narrative}</p>
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
            <InfoBadge icon={<Users size={20} />} label="Audience" value={course.target_audience} />
        </div>
        
        <div className="grid gap-2">
            {course.skill_demand_trend && <SkillDemandVisual trend={course.skill_demand_trend} />}
            {course.market_competition && <MarketCompetitionVisual competition={course.market_competition} />}
        </div>
        
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
