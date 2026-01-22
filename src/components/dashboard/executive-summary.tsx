import type { AuditData } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, LineChart, Target, Info } from "lucide-react";

type Summary = AuditData["executive_summary"];

interface ExecutiveSummaryProps {
  summary: Summary;
}

const StatCard = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) => (
    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="bg-primary/10 p-3 rounded-lg">
            {icon}
        </div>
        <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-xl font-bold">{value}</p>
        </div>
    </div>
);


export function ExecutiveSummary({ summary }: ExecutiveSummaryProps) {
    if (!summary) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Executive Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Summary data is not available.</p>
                </CardContent>
            </Card>
        );
    }
    
  return (
    <Card className="rounded-2xl shadow-lg bg-card/50 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Executive Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
            <StatCard
                icon={<DollarSign className="h-6 w-6 text-primary" />}
                title="Total Revenue Opportunity"
                value={summary.total_revenue_opportunity}
            />
            <StatCard
                icon={<Target className="h-6 w-6 text-primary" />}
                title="Top Performing Sector"
                value={summary.top_performing_sector}
            />
        </div>
        <div className="flex items-start gap-4 p-4 rounded-lg bg-blue-100/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30">
            <div className="text-blue-600 dark:text-blue-400 mt-1">
                <Info className="h-5 w-5" />
            </div>
            <div>
                <p className="font-bold text-blue-700 dark:text-blue-300">Strategic Advice</p>
                <p className="text-sm text-blue-600 dark:text-blue-500">{summary.strategic_advice}</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
