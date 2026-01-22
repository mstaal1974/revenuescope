import type { AuditData } from "@/app/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Package, Percent, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Stack = AuditData["product_ecosystem"]["stackable_product"];

interface MasterStackCardProps {
  stack: Stack;
  view: 'rto' | 'student';
  className?: string;
}

export function MasterStackCard({ stack, view, className }: MasterStackCardProps) {
  if (!stack) {
    return null;
  }
  
  return (
    <Card className={cn("rounded-3xl shadow-2xl bg-card border-2 border-primary/80 relative overflow-hidden", className)}>
        <div className="absolute top-2 right-2">
            <div className="flex items-center gap-1 text-xs bg-primary text-primary-foreground font-semibold px-3 py-1 rounded-full">
                <Star className="h-4 w-4" />
                <span>{view === 'rto' ? 'Highest Revenue' : 'Best Value'}</span>
            </div>
        </div>
      <CardHeader className="text-center pt-10">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-3">
                <Package className="h-10 w-10 text-primary" />
            </div>
        <CardTitle className="text-2xl font-black">{stack.bundle_title}</CardTitle>
        <CardDescription className="max-w-xs mx-auto">{stack.marketing_pitch}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center items-baseline gap-2">
            <span className="text-4xl font-bold text-primary">{stack.bundle_price}</span>
            <span className="text-xl font-medium text-muted-foreground line-through">{stack.total_value}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">You Save</p>
                <p className="text-lg font-bold flex items-center justify-center gap-1">
                    <Percent className="h-4 w-4" />
                    {stack.discount_applied}
                </p>
            </div>
             <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Badges Issued</p>
                 <div className="flex justify-center gap-2 mt-1 perspective-1000">
                    {Array.from({ length: stack.badges_issued }).map((_, i) => (
                        <div key={i} className="p-1 rounded-full bg-tier-3-bg transition-transform duration-300 transform-gpu hover:-translate-y-1 hover:rotate-y-12">
                            <Award className="h-5 w-5 text-tier-3-fg" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <Button size="lg" className="w-full h-12 text-base font-bold">
            Draft Full Pathway
        </Button>
      </CardContent>
    </Card>
  );
}
