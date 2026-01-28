'use client';

import React, { useState, useMemo } from 'react';
import type { Tier } from '@/ai/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { DollarSign, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RevenueCalculatorProps {
  tiers: Tier[];
}

const theme = {
    1: "border-green-500/50",
    2: "border-blue-500/50",
    3: "border-purple-500/50",
};

const themeBg = {
    1: "bg-green-500/10",
    2: "bg-blue-500/10",
    3: "bg-purple-500/10",
}

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
    <Card className="mt-16 p-8 bg-slate-100/50 border-2 border-dashed border-slate-300 rounded-3xl">
      <CardHeader className="text-center p-0 mb-8">
        <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">Interactive Revenue Calculator</CardTitle>
        <p className="text-slate-500 font-medium">Adjust learner numbers to forecast your potential annual revenue.</p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-8 mb-8">
          {tierCalculations.map((tier, index) => (
            <div key={tier.tier_level} className={cn("p-6 rounded-2xl border-2", theme[tier.tier_level as keyof typeof theme], themeBg[tier.tier_level as keyof typeof themeBg])}>
              <h4 className="font-bold text-slate-800 mb-1">{tier.title}</h4>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">TIER {tier.tier_level}</p>
              
              <div className="grid md:grid-cols-3 gap-6 items-center mt-4">
                <div className="flex items-center gap-4">
                  <Users className="h-6 w-6 text-slate-500" />
                  <div>
                    <label htmlFor={`learners-${index}`} className="text-xs font-bold text-slate-500">Learners</label>
                    <Input
                      id={`learners-${index}`}
                      type="number"
                      value={tier.learners}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-24 h-10 text-lg font-bold"
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
          ))}
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-2xl flex justify-between items-center shadow-2xl">
          <h4 className="text-2xl font-black tracking-tight">Total Estimated Annual Revenue</h4>
          <p className="text-4xl font-black text-emerald-400">
            ${totalRevenue.toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
