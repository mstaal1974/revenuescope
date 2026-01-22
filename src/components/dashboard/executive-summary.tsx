import type { AuditData } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, LineChart, Zap } from "lucide-react";

interface ExecutiveSummaryProps {
  summary: AuditData["executive_summary"];
}

const StatCard = ({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) => (
  <div className="flex items-center gap-4">
    <div className="bg-primary/10 p-3 rounded-lg">{icon}</div>
    <div>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);

export function ExecutiveSummary({ summary }: ExecutiveSummaryProps) {
  if (!summary) {
    return (
        <Card className="rounded-2xl shadow-lg">
            <CardHeader>
                <CardTitle>Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Executive summary data is not available.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle>Executive Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-3 mb-6">
          <StatCard
            icon={<DollarSign className="h-6 w-6 text-primary" />}
            title="Total Revenue Opportunity"
            value={summary.total_revenue_opportunity}
          />
          <StatCard
            icon={<LineChart className="h-6 w-6 text-primary" />}
            title="Top Performing Sector"
            value={summary.top_performing_sector}
          />
          <StatCard
            icon={<Zap className="h-6 w-6 text-primary" />}
            title="Strategic Advice"
            value="Focus Resources"
          />
        </div>
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-center font-medium text-muted-foreground">
            {summary.strategic_advice}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
