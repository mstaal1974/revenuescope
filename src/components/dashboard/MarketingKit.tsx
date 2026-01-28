'use client';

import { useState } from 'react';
import { Copy, Check, Image as ImageIcon, Linkedin, Mail, MousePointer2 } from 'lucide-react';
import type { Tier } from '@/ai/types';

export default function MarketingKit({ tierData }: { tierData: Tier }) {
  const [copied, setCopied] = useState<string | null>(null);
  const mk = tierData.marketing_playbook;

  if (!mk) {
    return null;
  }

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="mt-8 bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
      
      {/* HEADER: The Agency Feel */}
      <div className="bg-gray-800 px-6 py-4 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500 p-1.5 rounded-lg">
            <span className="text-white font-bold text-xs">AI</span>
          </div>
          <span className="text-gray-200 font-semibold tracking-wide text-sm">CAMPAIGN KIT GENERATOR</span>
        </div>
        <div className="text-xs text-gray-400 font-mono uppercase">
          Target: <span className="text-blue-400">{mk.target_audience}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        
        {/* LEFT COLUMN: The Visual Ad Preview */}
        <div className="p-6 border-r border-gray-700 bg-gray-900">
          <h4 className="text-gray-500 text-xs font-bold uppercase mb-4 flex items-center gap-2">
            <Linkedin size={14} /> Ad Preview
          </h4>

          {/* The Mockup Card */}
          <div className="bg-white rounded-lg p-4 max-w-sm mx-auto shadow-lg relative">
            {/* Mock User Info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div>
                <div className="h-3 w-24 bg-gray-200 rounded mb-1"></div>
                <div className="h-2 w-16 bg-gray-100 rounded"></div>
              </div>
            </div>

            {/* The Ad Copy */}
            <div className="space-y-2 mb-3">
              <p className="text-sm font-bold text-gray-800 leading-tight">
                {mk.ad_headline}
              </p>
              <p className="text-xs text-gray-600">
                {mk.pain_point} {mk.ad_body_copy}
              </p>
              <p className="text-xs text-blue-600 font-medium">
                {mk.hashtags}
              </p>
            </div>

            {/* The Visual Placeholder */}
            <div className="aspect-video bg-gray-100 rounded border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-4 text-center mb-3 group cursor-help relative">
               <ImageIcon className="text-gray-400 mb-2" />
               <p className="text-[10px] text-gray-500 font-mono uppercase">AI Suggested Visual</p>
               <p className="text-xs text-gray-800 font-medium mt-1">"{mk.ad_creative_visual}"</p>
               
               {/* Tooltip for context */}
               <div className="absolute inset-0 bg-black/5 rounded opacity-0 group-hover:opacity-100 transition-all" />
            </div>

            {/* CTA Button Mockup */}
            <div className="bg-gray-100 p-2 rounded flex justify-between items-center cursor-pointer hover:bg-gray-200 transition-colors">
              <span className="text-xs font-bold text-gray-600">Learn More</span>
              <MousePointer2 size={12} className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: The Copy-Paste Assets */}
        <div className="p-6 bg-gray-800/50">
          <h4 className="text-gray-500 text-xs font-bold uppercase mb-4 flex items-center gap-2">
            <Copy size={14} /> Copy Assets
          </h4>

          <div className="space-y-4">
            
            {/* Asset 1: Headline */}
            <div className="bg-gray-900 p-3 rounded border border-gray-700 group hover:border-blue-500 transition-colors relative">
              <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Headline</label>
              <p className="text-gray-200 text-sm font-medium pr-8">{mk.ad_headline}</p>
              <button 
                onClick={() => handleCopy(mk.ad_headline, 'head')}
                className="absolute right-2 top-2 p-1.5 bg-gray-800 rounded text-gray-400 hover:text-white hover:bg-blue-600 transition-all"
              >
                {copied === 'head' ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>

            {/* Asset 2: Email Subject */}
            <div className="bg-gray-900 p-3 rounded border border-gray-700 group hover:border-purple-500 transition-colors relative">
              <div className="flex items-center gap-2 mb-1">
                <Mail size={10} className="text-purple-400" />
                <label className="text-[10px] text-gray-500 uppercase font-bold">Email Subject Line</label>
              </div>
              <p className="text-gray-200 text-sm font-medium pr-8">{mk.email_subject}</p>
              <button 
                onClick={() => handleCopy(mk.email_subject, 'subj')}
                className="absolute right-2 top-2 p-1.5 bg-gray-800 rounded text-gray-400 hover:text-white hover:bg-purple-600 transition-all"
              >
                {copied === 'subj' ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>

             {/* Asset 3: Creative Brief */}
             <div className="bg-blue-900/20 p-3 rounded border border-blue-500/30">
              <label className="text-[10px] text-blue-400 uppercase font-bold block mb-1">Visual Direction</label>
              <p className="text-blue-100 text-xs italic">
                "Tell your designer to use: {mk.ad_creative_visual}"
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
