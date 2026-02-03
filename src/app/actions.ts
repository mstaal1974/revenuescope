"use server";

import { generateStage1Analysis } from "@/ai/flows/generate-stage1-analysis";
import { generateSkillsHeatmap } from "@/ai/flows/generate-skills-heatmap";
import { generateProductEcosystem } from "@/ai/flows/generate-product-ecosystem";
import { generateMicrocredential } from "@/ai/flows/generate-microcredential";
import { generateCourseTimeline } from "@/ai/flows/generate-course-timeline";
import { generateLearningOutcomes } from "@/ai/flows/generate-learning-outcomes";
import { generateSectorCampaignKit } from "@/ai/flows/generate-sector-campaign-kit";
import { fetchScopeFallback } from "@/ai/flows/fetch-scope-fallback";

import { 
  type FullAuditInput, 
  type Stage1Output,
  type SkillsHeatmapOutput,
  type RevenueStaircaseInput,
  type RevenueStaircaseOutput,
  type FullAuditOutput,
  type MicrocredentialInput,
  type MicrocredentialOutput,
  type CourseTimelineInput,
  type CourseTimelineOutput,
  type LearningOutcomesInput,
  type LearningOutcomesOutput,
  type SectorCampaignKitInput,
  type SectorCampaignKitOutput,
  type ScopeFallbackInput,
  type ScopeFallbackOutput
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
  | { ok: true; result: RevenueStaircaseOutput }
  | { ok: false; error: string };

export type MicrocredentialActionResult =
  | { ok: true; result: MicrocredentialOutput }
  | { ok: false; error: string };

export type LearningOutcomesActionResult =
  | { ok: true; result: LearningOutcomesOutput }
  | { ok: false; error: string };

export type CourseTimelineActionResult =
  | { ok: true; result: CourseTimelineOutput }
  | { ok: false; error: string };

export type SectorCampaignKitActionResult =
  | { ok: true; result: SectorCampaignKitOutput }
  | { ok: false; error: string };

export type ScopeFallbackActionResult = 
  | { ok: true; result: ScopeFallbackOutput }
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
  input: RevenueStaircaseInput
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

// MICRO-CREDENTIAL ACTION
export async function runMicrocredentialAction(
  input: MicrocredentialInput
): Promise<MicrocredentialActionResult> {
  try {
    checkApiKey();
    if (!input.unit_code || !input.qualification_code) {
      throw new Error("Unit and Qualification codes are required.");
    }
    const result = await generateMicrocredential(input);
    return { ok: true, result };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("runMicrocredentialAction failed:", e);
    return { ok: false, error: message };
  }
}

// LEARNING OUTCOMES ACTION
export async function runGenerateLearningOutcomesAction(
  input: LearningOutcomesInput
): Promise<LearningOutcomesActionResult> {
  try {
    checkApiKey();
    if (!input.course_title) {
      throw new Error("Course Title is required.");
    }
    const result = await generateLearningOutcomes(input);
    return { ok: true, result };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("runGenerateLearningOutcomesAction failed:", e);
    return { ok: false, error: message };
  }
}

// COURSE TIMELINE ACTION
export async function runGenerateCourseTimelineAction(
  input: CourseTimelineInput
): Promise<CourseTimelineActionResult> {
  try {
    checkApiKey();
    if (!input.course_title || !input.learning_outcomes) {
      throw new Error("Course Title and Learning Outcomes are required.");
    }
    const result = await generateCourseTimeline(input);
    return { ok: true, result };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("runGenerateCourseTimelineAction failed:", e);
    return { ok: false, error: message };
  }
}

// SECTOR CAMPAIGN KIT ACTION
export async function runGenerateSectorCampaignKitAction(
  input: SectorCampaignKitInput
): Promise<SectorCampaignKitActionResult> {
  try {
    checkApiKey();
    if (!input.sector) {
      throw new Error("Sector data is required.");
    }
    const result = await generateSectorCampaignKit(input);
    return { ok: true, result };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("runGenerateSectorCampaignKitAction failed:", e);
    return { ok: false, error: message };
  }
}

// SCOPE FALLBACK ACTION
export async function runScopeFallbackAction(
  input: ScopeFallbackInput
): Promise<ScopeFallbackActionResult> {
  try {
    checkApiKey();
    const result = await fetchScopeFallback(input);
    return { ok: true, result };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("runScopeFallbackAction failed:", e);
    return { ok: false, error: message };
  }
}
