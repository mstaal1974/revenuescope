import type { AuditData } from "@/app/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, DollarSign, TrendingUp, Users, CheckCircle, ArrowUp, ArrowDown, Minus } from "lucide-react";

type Sector = AuditData["sector_breakdown"][0];

interface SectorCardProps {
  sector: Sector;
}

const TrendIcon = ({ trend }: { trend: string }) => {
    switch (trend.toLowerCase()) {
        case 'growing':
            return <ArrowUp className="h-4 w-4 text-green-500" />;
        case 'declining':
            return <ArrowDown className="h-4 w-4 text-red-500" />;
        default:
            return <Minus className="h-4 w-4 text-gray-500" />;
    }
};

export function SectorCard({ sector }: SectorCardProps) {
  return (
    <Card className="rounded-2xl shadow-md bg-card/80 backdrop-blur-sm border-border/20 flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-lg font-bold">{sector.sector_name}</CardTitle>
            <Badge variant="secondary" className="whitespace-nowrap">{sector.qualification_count} Quals</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow flex flex-col">
        
        {/* Market Health */}
        <div className="p-3 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Market Health</h4>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                    <p className="font-bold">{sector.market_health.demand_level}</p>
                    <p className="text-muted-foreground">Demand</p>
                </div>
                <div className="flex items-center justify-center">
                    <TrendIcon trend={sector.market_health.trend_direction} />
                    <p className="font-bold ml-1">{sector.market_health.trend_direction}</p>
                </div>
                <div>
                    <p className="font-bold">{sector.market_health.avg_industry_wage}</p>
                    <p className="text-muted-foreground">Avg. Wage</p>
                </div>
            </div>
        </div>

        {/* Financial Opportunity */}
        <div className="p-3 bg-muted/50 rounded-lg">
             <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Financial Opportunity</h4>
             <div className="flex justify-around text-center">
                <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <div>
                        <p className="font-bold text-lg">{sector.financial_opportunity.annual_revenue_gap}</p>
                        <p className="text-xs text-muted-foreground">Annual Revenue Gap</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                        <p className="font-bold text-lg">{sector.financial_opportunity.student_volume_potential.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Student Potential</p>
                    </div>
                </div>
             </div>
        </div>

        {/* Recommended Actions */}
        <div className="space-y-2 mt-auto pt-4">
             <h4 className="text-sm font-semibold text-muted-foreground">Recommended Actions</h4>
             <ul className="space-y-1">
                {(sector.recommended_actions || []).map((action, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{action}</span>
                    </li>
                ))}
             </ul>
        </div>

      </CardContent>
    </Card>
  );
}
