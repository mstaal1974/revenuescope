import type { AuditData } from "@/app/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, BarChart3 } from "lucide-react";

interface AnalysisSummaryProps {
  summary: AuditData["analysis_summary"];
}

export function AnalysisSummary({ summary }: AnalysisSummaryProps) {
  if (!summary) {
    return (
        <Card className="rounded-2xl shadow-lg">
            <CardHeader>
                <CardTitle>Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Analysis summary data is not available.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="rounded-2xl shadow-lg bg-card/50 backdrop-blur-sm border-primary/20">
        <CardHeader>
            <CardTitle className="text-3xl font-black font-headline">Product Blueprint Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
             <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                <div className="bg-primary/10 p-3 rounded-lg mt-1">
                    <Layers className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-muted-foreground">Anchor Qualification</p>
                    <p className="text-lg font-bold">{summary.parent_qualification_used}</p>
                </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                <div className="bg-primary/10 p-3 rounded-lg mt-1">
                    <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-muted-foreground">Market Context</p>
                    <p className="text-base text-foreground">{summary.market_context}</p>
                </div>
            </div>
        </CardContent>
    </Card>
  );
}
