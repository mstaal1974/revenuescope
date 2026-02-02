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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sectors.map((sector) => (
                <SectorAnalysisCard key={sector.sector_name} sector={sector} />
              ))}
            </div>
        </div>
    );
}
