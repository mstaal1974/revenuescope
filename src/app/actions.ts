"use server";

import { generateStage1Analysis } from "@/ai/flows/generate-stage1-analysis";
import { generateSkillsHeatmap } from "@/ai/flows/generate-skills-heatmap";
import { generateProductEcosystem } from "@/ai/flows/generate-product-ecosystem";

import { 
  type FullAuditInput, 
  type Stage1Output,
  type SkillsHeatmapOutput,
  type ProductEcosystemInput,
  type ProductEcosystemOutput,
  type FullAuditOutput
} from "@/ai/types";

export type AuditData = FullAuditOutput;

// Action Result types
export type Stage1ActionResult = 
  | { ok: true; result: Stage1Output }
  | { ok: false; error: string };

export type Stage2ActionResult = 
  | { ok: true; result: SkillsHeatmapOutput }
  | { ok: false; error: string };

export type Stage3ActionResult = 
  | { ok: true; result: ProductEcosystemOutput }
  | { ok: false; error: string };


const checkApiKey = () => {
    if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_GENAI_API_KEY) {
      throw new Error(
        "AI account configuration is missing. Please create a file named `.env` in the root of your project and add your API key."
      );
    }
}

// STAGE 1 ACTION
export async function runStage1Action(
  input: FullAuditInput
): Promise<Stage1ActionResult> {
  try {
    checkApiKey();
    if (!input.rtoId || !input.manualScopeDataset) {
      throw new Error("RTO ID and Scope data are required for Stage 1.");
    }
    const result = await generateStage1Analysis(input);
    return { ok: true, result };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("runStage1Action failed:", e);
    return { ok: false, error: message };
  }
}

// STAGE 2 ACTION
export async function runStage2Action(
  input: FullAuditInput
): Promise<Stage2ActionResult> {
  try {
    checkApiKey();
     if (!input.rtoId || !input.manualScopeDataset) {
      throw new Error("RTO ID and Scope data are required for Stage 2.");
    }
    const result = await generateSkillsHeatmap(input);
    return { ok: true, result };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("runStage2Action failed:", e);
    return { ok: false, error: message };
  }
}

// STAGE 3 ACTION
export async function runStage3Action(
  input: ProductEcosystemInput
): Promise<Stage3ActionResult> {
  try {
    checkApiKey();
    if (!input.top_performing_sector || !input.skills_heatmap) {
        throw new Error("Top sector and skills heatmap are required for Stage 3.");
    }
    const result = await generateProductEcosystem(input);
    return { ok: true, result };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("runStage3Action failed:", e);
    return { ok: false, error: message };
  }
}
