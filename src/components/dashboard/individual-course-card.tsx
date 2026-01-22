import type { AuditData } from "@/app/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, DollarSign, Target, User } from "lucide-react";
import { Badge } from "../ui/badge";

type Course = AuditData["individual_courses"][0];

interface IndividualCourseCardProps {
  course: Course;
}

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
    <div className="flex items-center gap-2 text-sm">
        <div className="text-muted-foreground">{icon}</div>
        <span className="font-semibold">{label}:</span>
        <span className="text-muted-foreground">{value}</span>
    </div>
);


export function IndividualCourseCard({ course }: IndividualCourseCardProps) {
  return (
    <Card className="rounded-2xl shadow-md bg-card/80 backdrop-blur-sm border-border/20">
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold">{course.course_title}</CardTitle>
            <Badge variant="secondary">{course.tier}</Badge>
        </div>
        <CardDescription>
          For: <span className="font-semibold text-primary">{course.target_student}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm p-3 bg-muted/50 rounded-lg">
            <InfoItem icon={<DollarSign size={16} />} label="Price" value={course.suggested_price} />
            <InfoItem icon={<Clock size={16} />} label="Duration" value={course.duration} />
            <InfoItem icon={<Target size={16} />} label="Student" value={course.target_student} />
            <InfoItem icon={<CheckCircle size={16} />} label="Skill" value={course.key_skill} />
        </div>
        
        <Button variant="outline" className="w-full">
            Buy Individually ({course.suggested_price})
        </Button>
      </CardContent>
    </Card>
  );
}
