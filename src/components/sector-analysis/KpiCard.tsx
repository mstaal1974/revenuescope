'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface KpiCardProps {
    title: string;
    value: string;
    subValue?: string;
    description?: string;
    isGauge?: boolean;
    gaugeValue?: number;
}

export default function KpiCard({ title, value, subValue, description, isGauge, gaugeValue = 0 }: KpiCardProps) {
    return (
        <Card className="bg-slate-900 border-slate-800 text-white rounded-3xl p-6 shadow-xl">
            <CardContent className="p-0">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{title}</p>
                <p className={cn(
                    "font-black tracking-tighter my-2",
                     isGauge ? "text-4xl" : "text-5xl"
                )}>
                    {value}
                </p>
                {isGauge ? (
                    <>
                        <Progress value={gaugeValue} className="h-2 [&>div]:bg-primary" />
                        <p className="text-xs text-slate-500 mt-2">{subValue}</p>
                    </>
                ) : (
                    <div className="flex items-baseline gap-2">
                        <p className="text-sm text-slate-500 font-medium">{description}</p>
                        {subValue && <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">{subValue}</span>}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
