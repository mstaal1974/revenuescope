'use client';

import React, { useState, useMemo } from 'react';
import type { Tier } from '@/ai/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DollarSign, Users, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';
import MarketingKit from './MarketingKit';

interface RevenueCalculatorProps {
  tiers: Tier[];
}

const tierThemes = {
  1: {
    card: "bg-green-50 border-green-400",
    calculator: "bg-green-100/50 border-green-300",
    button: "bg-green-600 hover:bg-green-700",
  },
  2: {
    card: "bg-blue-50 border-blue-400",
    calculator: "bg-blue-100/50 border-blue-300",
    button: "bg-blue-600 hover:bg-blue-700",
  },
  3: {
    card: "bg-purple-50 border-purple-400",
    calculator: "bg-purple-100/50 border-purple-300",
    button: "bg-purple-600 hover:bg-purple-700",
  },
};


export function RevenueCalculator({ tiers }: RevenueCalculatorProps) {
  const [learnerCounts, setLearnerCounts] = useState<number[]>([150, 50, 15]);

  const handleSliderChange = (tierIndex: number, value: number[]) => {
    const newCounts = [...learnerCounts];
    newCounts[tierIndex] = value[0];
    setLearnerCounts(newCounts);
  };
  
  const handleInputChange = (tierIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const newCounts = [...learnerCounts];
    const value = parseInt(event.target.value, 10);
    newCounts[tierIndex] = isNaN(value) ? 0 : value;
    setLearnerCounts(newCounts);
  };

  const tierCalculations = useMemo(() => {
    return tiers.map((tier, index) => {
      const revenue = learnerCounts[index] * tier.price;
      return {
        ...tier,
        learners: learnerCounts[index],
        revenue,
      };
    });
  }, [tiers, learnerCounts]);

  const totalRevenue = useMemo(() => {
    return tierCalculations.reduce((acc, tier) => acc + tier.revenue, 0);
  }, [tierCalculations]);

  return (
    <Card className="mt-16 bg-transparent border-none shadow-none">
      <CardHeader className="text-center p-0 mb-12">
        <CardTitle className="text-4xl font-black text-white tracking-tight underline decoration-blue-500/20 decoration-8 underline-offset-8 mb-2">Commercial Product Stack</CardTitle>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Unbundled from Top Performing Sector</p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="bg-slate-900 text-white p-8 rounded-2xl flex justify-between items-center shadow-2xl mb-12">
          <h4 className="text-2xl font-black tracking-tight">Total Estimated Annual Revenue</h4>
          <p className="text-4xl font-black text-emerald-400">
            ${totalRevenue.toLocaleString()}
          </p>
        </div>

        <div className="space-y-8">
          {tierCalculations.map((tier, index) => {
            const theme = tierThemes[tier.tier_level as keyof typeof tierThemes];
            return (
                <div key={tier.tier_level} id={`tier-${tier.tier_level}`} className={cn("scroll-mt-24 rounded-3xl border-l-8 shadow-lg p-8", theme.card)}>
                    {/* HEADER: The Product */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                        <span className="text-xs font-bold uppercase tracking-widest opacity-60">
                            Tier {tier.tier_level} Strategy
                        </span>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">
                            {tier.title}
                        </h3>
                        <p className="text-sm text-gray-600">{tier.format}</p>
                        </div>
                        <div className="text-3xl font-black text-gray-800">
                        ${tier.price}
                        </div>
                    </div>

                    {/* THE OPPORTUNITY DATA (The "Why") */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                        {Object.entries(tier.commercial_leverage).map(([key, value]) => (
                        <div key={key} className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm text-center">
                            <div className="text-[10px] uppercase text-gray-400 font-bold mb-1">
                            {key.replace(/_/g, ' ')}
                            </div>
                            <div className="text-xs font-bold text-gray-700 leading-tight">
                            {value as string}
                            </div>
                        </div>
                        ))}
                    </div>

                    {/* THE MARKETING HOOK */}
                    <div className="bg-white/50 p-4 rounded-lg italic text-gray-600 text-sm border-l-4 border-gray-300 mb-8">
                        "📣 {tier.marketing_hook}"
                    </div>

                    {/* INTERACTIVE CALCULATOR PART */}
                    <div className={cn("p-6 rounded-2xl border-2 border-dashed", theme.calculator)}>
                      <h4 className="font-bold text-slate-800 mb-4 text-center">Revenue Calculator</h4>
                      <div className="grid md:grid-cols-3 gap-6 items-center">
                          <div className="flex items-center gap-4">
                              <Users className="h-6 w-6 text-slate-500" />
                              <div>
                                  <label htmlFor={`learners-${index}`} className="text-xs font-bold text-slate-500">Learners</label>
                                  <Input
                                      id={`learners-${index}`}
                                      type="number"
                                      value={tier.learners}
                                      onChange={(e) => handleInputChange(index, e)}
                                      className="w-28 h-10 text-lg font-bold bg-white text-slate-900"
                                      max={tier.tier_level === 1 ? 2000 : tier.tier_level === 2 ? 500 : 100}
                                  />
                              </div>
                          </div>

                          <div className="md:col-span-2 flex items-center gap-4">
                              <Slider
                                  value={[tier.learners]}
                                  onValueChange={(value) => handleSliderChange(index, value)}
                                  max={tier.tier_level === 1 ? 2000 : tier.tier_level === 2 ? 500 : 100}
                                  step={1}
                              />
                              <div className="flex items-center gap-4">
                                  <DollarSign className="h-6 w-6 text-emerald-600"/>
                                  <div>
                                      <p className="text-lg font-black text-emerald-800">
                                          ${tier.revenue.toLocaleString()}
                                      </p>
                                      <p className="text-xs font-bold text-slate-500">Sub-Total</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                    </div>
                    
                    {/* MARKETING ACTION BOX */}
                    {tier.marketing_playbook && (
                      <MarketingKit tierData={tier} />
                    )}
                    
                    {/* COURSE BUILDER CTA */}
                    <div className="mt-8 text-center">
                        <Button asChild className={cn("text-white font-bold px-8 py-5 rounded-xl transition-all shadow-lg active:scale-[0.98] text-base inline-flex items-center gap-2", theme.button)}>
                            <Link href={`/course-builder?title=${encodeURIComponent(tier.title)}`}>
                                Launch Course Builder <Rocket />
                            </Link>
                        </Button>
                    </div>
                </div>
            )
        })}
        </div>
      </CardContent>
    </Card>
  );
}
