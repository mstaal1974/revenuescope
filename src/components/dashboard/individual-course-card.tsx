import type { AuditData } from "@/app/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, CheckCircle, Clock, DollarSign, TrendingUp } from "lucide-react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

type Course = AuditData["product_ecosystem"]["individual_courses"][0];

interface IndividualCourseCardProps {
  course: Course;
  view: 'rto' | 'student';
}

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
    <div className="flex items-center gap-2 text-sm">
        <div className="text-muted-foreground">{icon}</div>
        <span className="font-semibold">{label}:</span>
        <span className="text-muted-foreground">{value}</span>
    </div>
);


export function IndividualCourseCard({ course, view }: IndividualCourseCardProps) {
    const tierNumber = course.tier.match(/\d+/)?.[0] || '2';

    const tierStyles = {
        '1': 'border-tier-1-fg/50 bg-tier-1-bg text-tier-1-fg',
        '2': 'border-tier-2-fg/50 bg-tier-2-bg text-tier-2-fg',
        '3': 'border-tier-3-fg/50 bg-tier-3-bg text-tier-3-fg',
    }[tierNumber] || 'border-border bg-card';
    
    const tierBadgeStyles = {
        '1': 'bg-tier-1-fg/10 text-tier-1-fg',
        '2': 'bg-tier-2-fg/10 text-tier-2-fg',
        '3': 'bg-tier-3-fg/10 text-tier-3-fg',
    }[tierNumber] || 'bg-secondary';


  return (
    <Card className={cn("rounded-2xl shadow-md backdrop-blur-sm transition-all", tierStyles)}>
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold">{course.course_title}</CardTitle>
            <Badge className={cn("border-none", tierBadgeStyles)}>{course.tier}</Badge>
        </div>
        <CardDescription className="text-current/80">
          For: <span className="font-semibold text-current">{course.target_student}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm p-3 bg-white/5 rounded-lg">
            <InfoItem icon={<DollarSign size={16} />} label="Price" value={course.suggested_price} />
            <InfoItem icon={<Clock size={16} />} label="Duration" value={course.duration} />
            {view === 'rto' && course.revenue_potential && (
              <InfoItem icon={<TrendingUp size={16} />} label="Revenue" value={course.revenue_potential} />
            )}
            {view === 'student' && course.career_roi && (
              <InfoItem icon={<Briefcase size={16} />} label="Career ROI" value={course.career_roi} />
            )}
            <InfoItem icon={<CheckCircle size={16} />} label="Key Skill" value={course.key_skill} />
        </div>
        
        <Button variant="outline" className="w-full bg-background/50 hover:bg-background/80">
            Buy Individually ({course.suggested_price})
        </Button>
      </CardContent>
    </Card>
  );
}
