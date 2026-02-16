"use server";

import { generateStage1Analysis } from "@/ai/flows/generate-stage1-analysis";
import { generateSkillsHeatmap } from "@/ai/flows/generate-skills-heatmap";
import { generateProductEcosystem } from "@/ai/flows/generate-product-ecosystem";
import { generateMicrocredential } from "@/ai/flows/generate-microcredential";
import { generateCourseTimeline } from "@/ai/flows/generate-course-timeline";
import { generateLearningOutcomes } from "@/ai/flows/generate-learning-outcomes";
import { generateSectorCampaignKit } from "@/ai/flows/generate-sector-campaign-kit";
import { fetchScopeFallback } from "@/ai/flows/fetch-scope-fallback";
import { generateComplianceAnalysis } from "@/ai/flows/generate-compliance-analysis";

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
  type ScopeFallbackOutput,
  type ComplianceAnalysisOutput
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

export type ComplianceActionResult = 
  | { ok: true; result: ComplianceAnalysisOutput }
  | { ok: false; error: string };


const checkApiKey = () => {
    const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
    if (!key) {
      throw new Error(
        "AI configuration is missing. Please ensure your GEMINI_API_KEY is set in the environment variables."
      );
    }
}

/**
 * CRITICAL UTILITY: Ensures data is strictly serializable for Next.js.
 * Server Actions fail with "Unexpected response" if non-serializable 
 * objects (like raw Errors or Class instances) are returned.
 */
function sanitize<T>(data: T): T {
  if (data === null || data === undefined) return data;
  try {
    // Deep clone via JSON stringify/parse to strip any hidden class methods or non-plain-obj data
    // This is the safest way to ensure serializability across the server-client boundary
    return JSON.parse(JSON.stringify(data));
  } catch (e) {
    console.error("Critical: Serialization failed in sanitize helper", e);
    // Return a safe version of the data if stringify fails (e.g. circular refs)
    return (Array.isArray(data) ? [] : {}) as T;
  }
}

// STAGE 1 ACTION
export async function runStage1Action(
  input: FullAuditInput
): Promise<Stage1ActionResult> {
  try {
    checkApiKey();
    if (!input?.rtoId || !input?.manualScopeDataset) {
      throw new Error("RTO ID and Scope data are required for Stage 1.");
    }
    const result = await generateStage1Analysis(input);
    if (!result) throw new Error("Stage 1 analysis returned no data.");
    return { ok: true, result: sanitize(result) };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("runStage1Action failed:", message);
    return { ok: false, error: message };
  }
}

// STAGE 2 ACTION
export async function runStage2Action(
  input: FullAuditInput
): Promise<Stage2ActionResult> {
  try {
    checkApiKey();
     if (!input?.rtoId || !input?.manualScopeDataset) {
      throw new Error("RTO ID and Scope data are required for Stage 2.");
    }
    const result = await generateSkillsHeatmap(input);
    if (!result) throw new Error("Skills heatmap generation returned no data.");
    return { ok: true, result: sanitize(result) };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("runStage2Action failed:", message);
    return { ok: false, error: message };
  }
}

// STAGE 3 ACTION
export async function runStage3Action(
  input: RevenueStaircaseInput
): Promise<Stage3ActionResult> {
  try {
    checkApiKey();
    if (!input?.top_performing_sector || !input?.skills_heatmap) {
        throw new Error("Top sector and skills heatmap are required for Stage 3.");
    }
    const result = await generateProductEcosystem(input);
    if (!result) throw new Error("Revenue staircase generation returned no data.");
    return { ok: true, result: sanitize(result) };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("runStage3Action failed:", message);
    return { ok: false, error: message };
  }
}

// MICRO-CREDENTIAL ACTION
export async function runMicrocredentialAction(
  input: MicrocredentialInput
): Promise<MicrocredentialActionResult> {
  try {
    checkApiKey();
    if (!input?.unit_code || !input?.qualification_code) {
      throw new Error("Unit and Qualification codes are required.");
    }
    const result = await generateMicrocredential(input);
    return { ok: true, result: sanitize(result) };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("runMicrocredentialAction failed:", message);
    return { ok: false, error: message };
  }
}

// LEARNING OUTCOMES ACTION
export async function runGenerateLearningOutcomesAction(
  input: LearningOutcomesInput
): Promise<LearningOutcomesActionResult> {
  try {
    checkApiKey();
    if (!input?.course_title) {
      throw new Error("Course Title is required.");
    }
    const result = await generateLearningOutcomes(input);
    return { ok: true, result: sanitize(result) };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("runGenerateLearningOutcomesAction failed:", message);
    return { ok: false, error: message };
  }
}

// COURSE TIMELINE ACTION
export async function runGenerateCourseTimelineAction(
  input: CourseTimelineInput
): Promise<CourseTimelineActionResult> {
  try {
    checkApiKey();
    if (!input?.course_title || !input?.learning_outcomes) {
      throw new Error("Course Title and Learning Outcomes are required.");
    }
    const result = await generateCourseTimeline(input);
    return { ok: true, result: sanitize(result) };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("runGenerateCourseTimelineAction failed:", message);
    return { ok: false, error: message };
  }
}

// SECTOR CAMPAIGN KIT ACTION
export async function runGenerateSectorCampaignKitAction(
  input: SectorCampaignKitInput
): Promise<SectorCampaignKitActionResult> {
  try {
    checkApiKey();
    if (!input?.sector) {
      throw new Error("Sector data is required.");
    }
    const result = await generateSectorCampaignKit(input);
    return { ok: true, result: sanitize(result) };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("runGenerateSectorCampaignKitAction failed:", message);
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
    return { ok: true, result: sanitize(result) };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("runScopeFallbackAction failed:", message);
    return { ok: false, error: message };
  }
}

// COMPLIANCE ACTION
export async function runComplianceAnalysisAction(
  input: FullAuditInput
): Promise<ComplianceActionResult> {
  try {
    checkApiKey();
    if (!input?.rtoId || !input?.manualScopeDataset) {
      throw new Error("RTO ID and Scope data are required for Compliance analysis.");
    }
    const result = await generateComplianceAnalysis(input);
    return { ok: true, result: sanitize(result) };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("runComplianceAnalysisAction failed:", message);
    return { ok: false, error: message };
  }
}
