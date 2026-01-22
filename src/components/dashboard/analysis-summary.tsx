import type { AuditData } from "@/app/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, BarChart3, Lightbulb } from "lucide-react";

interface AnalysisSummaryProps {
  theme: string;
  justification: string;
}

export function AnalysisSummary({ theme, justification }: AnalysisSummaryProps) {
  return (
    <Card className="rounded-2xl shadow-lg bg-card/50 backdrop-blur-sm border-primary/20">
        <CardHeader>
            <div className="bg-primary/10 p-3 rounded-lg w-fit mb-2">
                <Lightbulb className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-black font-headline">Strategic Product Theme</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
             <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                <div className="bg-primary/10 p-3 rounded-lg mt-1">
                    <Layers className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-muted-foreground">Theme</p>
                    <p className="text-xl font-bold">{theme}</p>
                </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                <div className="bg-primary/10 p-3 rounded-lg mt-1">
                    <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-muted-foreground">Market Justification</p>
                    <p className="text-base text-foreground">{justification}</p>
                </div>
            </div>
        </CardContent>
    </Card>
  );
}
