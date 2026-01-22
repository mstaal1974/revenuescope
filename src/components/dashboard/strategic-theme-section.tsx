import type { AuditData } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Target } from "lucide-react";

interface StrategicThemeSectionProps {
  analysis: AuditData["analysis"];
}

const StatCard = ({ icon, title, value, description }: { icon: React.ReactNode, title: string, value: string, description: string }) => (
    <Card className="bg-card/5 backdrop-blur-sm border-primary/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-3xl font-bold text-white">{value}</div>
            <p className="text-xs text-white/60">{description}</p>
        </CardContent>
    </Card>
);

export function StrategicThemeSection({ analysis }: StrategicThemeSectionProps) {
  return (
    <div className="relative overflow-hidden rounded-[3rem] bg-accent text-accent-foreground p-8 md:p-12 border border-primary/20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)]">
        <div className="absolute inset-0 strategic-theme-glow"></div>
        <div className="relative z-10 text-center">
            <div className="flex flex-wrap justify-center items-center gap-4 mb-4">
                 <Badge variant="outline" className="border-green-400/50 bg-green-900/50 text-green-300">
                    Active Market Watch
                </Badge>
                 <Badge variant="outline" className="border-blue-400/50 bg-blue-900/50 text-blue-300">
                    Verified 2%-9% Revenue Audit
                </Badge>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-white font-headline">
                {analysis.strategicTheme}
            </h2>
        </div>
        <div className="relative z-10 mt-12 grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-2 rounded-2xl bg-black/20 p-6 flex flex-col justify-center">
                <h3 className="font-bold text-lg text-white mb-2">Market Justification</h3>
                <p className="text-accent-foreground/80">{analysis.marketJustification}</p>
            </div>
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <StatCard 
                    icon={<Target className="h-4 w-4 text-white/60" />}
                    title="Total Addressable Market"
                    value={analysis.totalAddressableMarket}
                    description="Estimated size of this specialized market in Australia."
                />
                 <StatCard 
                    icon={<DollarSign className="h-4 w-4 text-white/60" />}
                    title="Market Capture (2% - 10%)"
                    value={`${analysis.acquisitionModelLowEnd} - ${analysis.acquisitionModelHighEnd}`}
                    description="Projected annual revenue by capturing a small market share."
                />
            </div>
        </div>
    </div>
  );
}
