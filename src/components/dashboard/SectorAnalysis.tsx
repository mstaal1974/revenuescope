'use client';
import { type Sector } from "@/ai/types";
import SectorAnalysisCard from "./SectorAnalysisCard";

interface SectorAnalysisProps {
    sectors: Sector[];
}

export default function SectorAnalysis({ sectors }: SectorAnalysisProps) {
    if (!sectors || sectors.length === 0) {
        return null;
    }

    return (
        <div>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
                Sector-by-Sector <span className="text-primary">Analysis</span>
              </h2>
              <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                A breakdown of each training package on your scope, with AI-suggested opportunities and strategic multipliers.
              </p>
            </div>
            <div className="space-y-8">
              {sectors.map((sector) => (
                <SectorAnalysisCard key={sector.sector_name} sector={sector} />
              ))}
            </div>
        </div>
    );
}
