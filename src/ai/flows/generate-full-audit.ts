'use server';
/**
 * @fileOverview This file defines the master function for generating a full strategic audit for an RTO.
 * It orchestrates multiple sub-flows to generate the analysis in stages.
 */

import { FullAuditInputSchema, FullAuditOutputSchema, type FullAuditInput, type FullAuditOutput } from '@/ai/types';
import { generateStage1Analysis } from './generate-stage1-analysis';
import { generateSkillsHeatmap } from './generate-skills-heatmap';
import { generateProductEcosystem } from './generate-product-ecosystem';


export async function generateFullAudit(
  input: FullAuditInput
): Promise<FullAuditOutput> {
    
    const rtoName = input.rtoName || `RTO ${input.rtoId}`;
    
    const scopeLines = (input.manualScopeDataset || '').split('\n');

    const scope = scopeLines.map(line => {
        const parts = line.split(',').map(s => s.trim());
        const [Code, Name, Anzsco] = parts;
        if (!Code || !Name) return null;
        return { Code, Name, Anzsco: Anzsco || null };
    }).filter((item): item is { Code: string; Name: string; Anzsco: string | null } => item !== null);

    const scopeString = `
RTO Name: ${rtoName} (${input.rtoId})
Verified Scope of Registration & ANZSCO Mappings:
${scope.map(item => `  - Qualification: ${item.Code} ${item.Name}\n    - ANZSCO Match: ${item.Anzsco || 'Not Found'}`).join("\n")}
`;
    
    const flowInput = { ...input, manualScopeDataset: scopeString };

    // Run stages sequentially to avoid server overload
    console.log("Starting Stage 1: Sector & Occupation Analysis");
    const stage1Result = await generateStage1Analysis(flowInput);
    console.log("Completed Stage 1");

    console.log("Starting Stage 2: Skills Heatmap");
    const skillsHeatmapResult = await generateSkillsHeatmap(flowInput);
    console.log("Completed Stage 2");

    // Prepare input for Stage 3
    const productEcosystemInput = {
      ...flowInput,
      top_performing_sector: stage1Result.executive_summary.top_performing_sector,
      skills_heatmap: skillsHeatmapResult.skills_heatmap,
    };
    
    console.log("Starting Stage 3: Product Ecosystem");
    const productEcosystemResult = await generateProductEcosystem(productEcosystemInput);
    console.log("Completed Stage 3");

    // Merge results
    const fullAudit = {
      rto_id: input.rtoId,
      ...stage1Result,
      ...skillsHeatmapResult,
      ...productEcosystemResult,
    };
    
    // Final validation
    const validation = FullAuditOutputSchema.safeParse(fullAudit);
    if (!validation.success) {
      console.error("Final merged audit output failed Zod validation:", validation.error.flatten());
      console.error("Invalid merged data:", fullAudit);
      throw new Error("The merged audit response did not match the required data structure.");
    }

    return validation.data;
}
