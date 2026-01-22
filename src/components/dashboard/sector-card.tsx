import type { AuditData } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  TrendingUp,
  Briefcase,
  DollarSign,
  Users,
  CheckCircle,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Sector = AuditData["sector_breakdown"][0];

interface SectorCardProps {
  sector: Sector;
}

const getTrendColor = (trend: string) => {
  if (trend === "Growing") return "text-green-500";
  if (trend === "Declining") return "text-red-500";
  return "text-yellow-500";
};

const getDemandColor = (demand: string) => {
  if (demand === "High")
    return "bg-green-500/10 text-green-500 border-green-500/20";
  if (demand === "Med")
    return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
  return "bg-red-500/10 text-red-500 border-red-500/20";
};

export function SectorCard({ sector }: SectorCardProps) {
  return (
    <Card className="rounded-2xl shadow-lg flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{sector.sector_name}</span>
          <Badge variant="secondary">{sector.qualification_count} Quals</Badge>
        </CardTitle>
        <CardDescription>Market & Financial Analysis</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="space-y-4">
          {/* Market Health */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Market Health</h4>
            <div className="flex justify-between items-center text-sm p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp
                  className={cn(
                    "h-4 w-4",
                    getTrendColor(sector.market_health.trend_direction)
                  )}
                />
                <span>{sector.market_health.trend_direction}</span>
              </div>
              <Badge
                variant="outline"
                className={getDemandColor(sector.market_health.demand_level)}
              >
                {sector.market_health.demand_level} Demand
              </Badge>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>{sector.market_health.avg_industry_wage}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Financial Opportunity */}
          <div>
            <h4 className="text-sm font-semibold mb-2">
              Financial Opportunity
            </h4>
            <div className="flex justify-around text-center">
              <div>
                <p className="text-xs text-muted-foreground">
                  Annual Revenue Gap
                </p>
                <p className="text-lg font-bold flex items-center justify-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {sector.financial_opportunity.annual_revenue_gap}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Student Volume</p>
                <p className="text-lg font-bold flex items-center justify-center gap-1">
                  <Users className="h-4 w-4" />
                  {sector.financial_opportunity.student_volume_potential}
                </p>
              </div>
            </div>
          </div>
        </div>

        {(sector.key_skills_in_demand || []).length > 0 && (
          <>
            <Separator className="my-4" />
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Key Skills in Demand
              </h4>
              <div className="flex flex-wrap gap-2">
                {(sector.key_skills_in_demand || []).map((skill, i) => (
                    <Badge key={i} variant="outline" className="font-normal">{skill}</Badge>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator className="my-4" />

        {/* Recommended Actions */}
        <div className="flex-grow">
          <h4 className="text-sm font-semibold mb-2">Recommended Actions</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {sector.recommended_actions.map((action, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
