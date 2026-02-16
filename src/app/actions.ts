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

import type { 
  FullAuditInput, 
  RevenueStaircaseInput,
  MicrocredentialInput,
  CourseTimelineInput,
  LearningOutcomesInput,
  SectorCampaignKitInput,
  ScopeFallbackInput,
  Stage1ActionResult,
  Stage2ActionResult,
  Stage3ActionResult,
  MicrocredentialActionResult,
  LearningOutcomesActionResult,
  CourseTimelineActionResult,
  SectorCampaignKitActionResult,
  ScopeFallbackActionResult,
  ComplianceActionResult,
  FullAuditOutput
} from "@/ai/types";

/**
 * CRITICAL ATOMIC SERIALIZATION UTILITY
 * Forces a deep-clone via JSON round-trip to strip all non-serializable properties
 * (prototypes, methods, symbols, undefined) that cause Next.js action crashes.
 */
function atomicSafe<T>(data: T): T {
  if (data === undefined || data === null) return null as unknown as T;
  try {
    return JSON.parse(JSON.stringify(data, (_, value) => 
      value === undefined ? null : value
    ));
  } catch (e) {
    console.error("SERVER ACTION: Atomic serialization failed", e);
    // Return a guaranteed serializable fallback structure
    return { ok: false, error: "Critical data serialization failure on server." } as unknown as T;
  }
}

const checkApiKey = () => {
    const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
    if (!key) {
      throw new Error(
        "AI configuration is missing. Please contact support to restore API access."
      );
    }
}

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
    return atomicSafe({ ok: true, result });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return atomicSafe({ ok: false, error: message });
  }
}

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
    return atomicSafe({ ok: true, result });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return atomicSafe({ ok: false, error: message });
  }
}

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
    return atomicSafe({ ok: true, result });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return atomicSafe({ ok: false, error: message });
  }
}

export async function runMicrocredentialAction(
  input: MicrocredentialInput
): Promise<MicrocredentialActionResult> {
  try {
    checkApiKey();
    if (!input?.unit_code || !input?.qualification_code) {
      throw new Error("Unit and Qualification codes are required.");
    }
    const result = await generateMicrocredential(input);
    return atomicSafe({ ok: true, result });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return atomicSafe({ ok: false, error: message });
  }
}

export async function runGenerateLearningOutcomesAction(
  input: LearningOutcomesInput
): Promise<LearningOutcomesActionResult> {
  try {
    checkApiKey();
    if (!input?.course_title) {
      throw new Error("Course Title is required.");
    }
    const result = await generateLearningOutcomes(input);
    return atomicSafe({ ok: true, result });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return atomicSafe({ ok: false, error: message });
  }
}

export async function runGenerateCourseTimelineAction(
  input: CourseTimelineInput
): Promise<CourseTimelineActionResult> {
  try {
    checkApiKey();
    if (!input?.course_title || !input?.learning_outcomes) {
      throw new Error("Course Title and Learning Outcomes are required.");
    }
    const result = await generateCourseTimeline(input);
    return atomicSafe({ ok: true, result });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return atomicSafe({ ok: false, error: message });
  }
}

export async function runGenerateSectorCampaignKitAction(
  input: SectorCampaignKitInput
): Promise<SectorCampaignKitActionResult> {
  try {
    checkApiKey();
    if (!input?.sector) {
      throw new Error("Sector data is required.");
    }
    const result = await generateSectorCampaignKit(input);
    return atomicSafe({ ok: true, result });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return atomicSafe({ ok: false, error: message });
  }
}

export async function runScopeFallbackAction(
  input: ScopeFallbackInput
): Promise<ScopeFallbackActionResult> {
  try {
    checkApiKey();
    const result = await fetchScopeFallback(input);
    return atomicSafe({ ok: true, result });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return atomicSafe({ ok: false, error: message });
  }
}

export async function runComplianceAnalysisAction(
  input: FullAuditInput
): Promise<ComplianceActionResult> {
  try {
    checkApiKey();
    if (!input?.rtoId || !input?.manualScopeDataset) {
      throw new Error("RTO ID and Scope data are required for Compliance analysis.");
    }
    const result = await generateComplianceAnalysis(input);
    return atomicSafe({ ok: true, result });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return atomicSafe({ ok: false, error: message });
  }
}
