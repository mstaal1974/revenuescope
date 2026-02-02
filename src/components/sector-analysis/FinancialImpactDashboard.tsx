'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { type SectorCampaignKitOutput } from "@/ai/types";
import GrowthProjectionChart from "./GrowthProjectionChart";
import { Info } from "lucide-react";

interface FinancialImpactDashboardProps {
    data: SectorCampaignKitOutput['financial_impact'];
}

export default function FinancialImpactDashboard({ data }: FinancialImpactDashboardProps) {
    return (
        <Card className="bg-slate-900 border-slate-800 text-white rounded-3xl p-8 shadow-2xl shadow-black/20">
            <CardHeader className="p-0 mb-6 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-2xl font-bold flex items-center gap-3">
                        <Info size={20} className="text-blue-500" />
                        Financial Impact Dashboard
                    </CardTitle>
                    <CardDescription className="text-slate-400 mt-1">High-fidelity ROI projections powered by AI.</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="p-0 grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                    <div>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Business Revenue Multiplier</p>
                        <p className="text-6xl font-black text-blue-400 tracking-tighter">{data.business_revenue_multiplier}</p>
                    </div>
                    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Estimated Annual ROI</p>
                        <p className="text-4xl font-black text-white tracking-tight">{data.estimated_annual_roi} <span className="text-2xl text-green-400">{data.annual_roi_percentage}</span></p>
                        <p className="text-xs text-slate-500 mt-1">Based on high-intent lead routing logic</p>
                    </div>
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Growth Projection (12 Months)</h4>
                    <div className="h-[200px] w-full">
                       <GrowthProjectionChart data={data.growth_projection} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
