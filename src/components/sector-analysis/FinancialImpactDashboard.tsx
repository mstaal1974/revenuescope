'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { type SectorCampaignKitOutput } from "@/ai/types";
import GrowthProjectionChart from "./GrowthProjectionChart";
import { Info, Calculator } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";


interface FinancialImpactDashboardProps {
    data: SectorCampaignKitOutput['financial_impact'];
    learners: number;
    setLearners: (value: number) => void;
    avgYield: number;
    setAvgYield: (value: number) => void;
}

export default function FinancialImpactDashboard({ data, learners, setLearners, avgYield, setAvgYield }: FinancialImpactDashboardProps) {

    if (!data.growth_projection) {
        return (
            <Card className="bg-slate-900 border-slate-800 text-white rounded-3xl p-8 shadow-2xl shadow-black/20">
                <CardHeader>
                    <CardTitle>Financial Impact Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Growth projection data is not available. Please re-run the audit.</p>
                </CardContent>
            </Card>
        )
    }
    
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
            <CardContent className="p-0 grid md:grid-cols-2 gap-8 items-start">
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
                    
                    {/* Financial Assumptions Calculator */}
                    <div className="bg-slate-800/50 p-6 rounded-2xl border-2 border-dashed border-slate-700">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-4"><Calculator size={16}/> Financial Assumptions</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="learners" className="text-xs font-bold text-slate-300">Est. Annual Learners</Label>
                                <Input 
                                    id="learners" 
                                    type="number" 
                                    value={learners}
                                    onChange={(e) => setLearners(Number(e.target.value))}
                                    className="bg-slate-900 border-slate-600 font-bold text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="yield" className="text-xs font-bold text-slate-300">Average Course Yield</Label>
                                 <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                    <Input 
                                        id="yield" 
                                        type="number"
                                        value={avgYield}
                                        onChange={(e) => setAvgYield(Number(e.target.value))}
                                        className="bg-slate-900 border-slate-600 font-bold text-white pl-7"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                     <Tabs defaultValue="12m" className="w-full">
                        <div className="flex justify-between items-center mb-2">
                             <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Growth Projection</h4>
                             <TabsList>
                                <TabsTrigger value="12m">12 Months</TabsTrigger>
                                {data.five_year_growth_projection && <TabsTrigger value="5y">5 Years</TabsTrigger>}
                            </TabsList>
                        </div>
                       
                        <TabsContent value="12m">
                             <div className="h-[200px] w-full">
                                <GrowthProjectionChart data={data.growth_projection} yAxisFormatter={(value) => `$${Number(value) / 1000}k`} />
                             </div>
                        </TabsContent>
                         {data.five_year_growth_projection && (
                            <TabsContent value="5y">
                                <div className="h-[200px] w-full">
                                    <GrowthProjectionChart data={data.five_year_growth_projection} yAxisFormatter={(value) => `$${(Number(value) / 1000000).toFixed(1)}m`} />
                                </div>
                            </TabsContent>
                         )}
                    </Tabs>
                </div>
            </CardContent>
        </Card>
    )
}
