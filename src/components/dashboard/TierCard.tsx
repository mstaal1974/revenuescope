"use client";

import React from 'react';
import type { Tier } from '@/ai/types';
import { cn } from '@/lib/utils';

interface TierCardProps {
    tierData: Tier;
}

export function TierCard({ tierData }: TierCardProps) {
  const theme = {
    1: "border-green-400 bg-green-50",
    2: "border-blue-400 bg-blue-50",
    3: "border-purple-400 bg-purple-50"
  }[tierData.tier_level];

  return (
    <div className={cn("rounded-xl border-l-4 shadow-md p-6 mb-6", theme)}>
      
      {/* HEADER: The Product */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest opacity-60">
            Tier {tierData.tier_level} Strategy
          </span>
          <h3 className="text-2xl font-bold text-gray-800 mt-1">
            {tierData.title}
          </h3>
          <p className="text-sm text-gray-600">{tierData.format}</p>
        </div>
        <div className="text-3xl font-black text-gray-800">
          ${tierData.price}
        </div>
      </div>

      {/* THE OPPORTUNITY DATA (The "Why") */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {Object.entries(tierData.commercial_leverage).map(([key, value]) => (
          <div key={key} className="bg-white rounded p-2 border border-gray-100 shadow-sm text-center">
            <div className="text-[10px] uppercase text-gray-400 font-bold mb-1">
              {key.replace(/_/g, ' ')}
            </div>
            <div className="text-xs font-bold text-gray-700 leading-tight">
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* THE MARKETING HOOK */}
      <div className="bg-white/50 p-3 rounded-lg italic text-gray-600 text-sm border-l-2 border-gray-300">
        "📣 {tierData.marketing_hook}"
      </div>
      
    </div>
  );
}
