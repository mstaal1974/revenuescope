'use server';
/**
 * @fileOverview This file defines a flow for generating a marketable, non-accredited micro-credential from a formal Unit of Competency.
 */

import { ai, MODEL_NAME } from '@/ai/genkit';
import {
  MicrocredentialInputSchema,
  MicrocredentialOutputSchema,
  type MicrocredentialInput,
  type MicrocredentialOutput,
} from '@/ai/types';

export async function generateMicrocredential(
  input: MicrocredentialInput
): Promise<MicrocredentialOutput> {
  return generateMicrocredentialFlow(input);
}

const prompt = ai.definePrompt({
    name: 'microcredentialPrompt',
    input: { schema: MicrocredentialInputSchema },
    model: `googleai/${MODEL_NAME}`,
    prompt: `
**CORE DIRECTIVE:**
You are prohibited from simply treating a "Unit of Competency" (e.g., *BSBOPS301*) as a Microcredential.
Real microcredentials are **Job Skills**, not **Compliance Codes**.

**THE LOGIC SHIFT:**
- **OLD WAY (Forbidden):** Input: \`BSBFIN301\`. Output: "Process Financial Transactions".
- **NEW WAY (Required):** Input: \`BSBFIN301\`. Output: "Cash Handling & POS Mastery for Retail Staff".

**GENERATION RULES:**
1.  **Deconstruct, Don't Replicate:** Look at the *Elements & Performance Criteria* of the Unit. Extract the specific **occupational skill** a worker needs on Tuesday morning.
2.  **Non-Accredited First:** The product you generate must be a **Non-Accredited Short Course** (2-4 hours).
3.  **The Pathway Strategy:** Explicitly map this skill back to the accredited Unit as a "Stepping Stone." The logic is: *Learn the skill now -> Get the full Unit later.*
4.  **Naming Convention:** Titles must be "Outcome-Based" (e.g., "How to X"), not "Competency-Based" (e.g., "Operate X").

**ADDITIONAL TASK: THE "AI PRODUCTIVITY" LAYER**
You must identify one specific "AI Productivity Skill" tailored to the target occupation from the microcredential you just designed.
1.  **Identify the Pain:** What is the most hated administrative, creative, or repetitive task this worker does? (e.g., Site Reports, Client Emails, Menu Planning, Lesson Plans).
2.  **Apply the Tool:** Select a specific, accessible AI tool (e.g., ChatGPT, Otter.ai, Canva Magic) that solves this pain.
3.  **Create the Microcredential:** Title it based on the *result*, not the technology.

**CONSTRAINT:**
- Do NOT suggest "General AI" or "Coding".
- The suggestion must be "Blue Collar / Frontline Friendly" (No technical background required).


**INPUT DATA:**
- Qualification: \`{{{qualification_code}}} - {{{qualification_title}}}\`
- Unit: \`{{{unit_code}}} - {{{unit_title}}}\`

**TASK:**
Based on the rules and logic above, generate a single raw JSON object for the micro-credential product derived from the provided Unit of Competency AND the associated AI opportunity.

**REQUIRED JSON OUTPUT FORMAT (This is an example, you must generate real data based on the INPUT DATA):**
{
  "microcredential_product": {
    "market_title": "Laser & Spirit Level Basics for Site Hands",
    "target_occupation": "Construction Laborer / Apprentice",
    "skill_focus": "Setting up a laser level and checking heights accurately.",
    "format": "Non-Accredited (Industry Skill Badge)",
    "duration": "3 Hours (Online + Practical Video)",
    "pathway_mapping": {
      "leads_to_unit": "CPCCCM2006",
      "leads_to_qual": "CPC30220",
      "value_prop": "Complete this to gain confidence before starting your apprenticeship."
    }
  },
  "ai_opportunity": {
    "product_title": "Automating Site Safety Reports with Voice-to-Text",
    "target_tool": "ChatGPT Mobile & Otter.ai",
    "pain_point_solved": "Supervisors currently spend 2 hours a night typing reports. This cuts it to 15 mins.",
    "marketing_hook": "Get off the laptop and get back on the tools. Learn to write reports with your voice."
  }
}
`,
});

const generateMicrocredentialFlow = ai.defineFlow(
  {
    name: 'generateMicrocredentialFlow',
    inputSchema: MicrocredentialInputSchema,
    // outputSchema: MicrocredentialOutputSchema,
  },
  async (input) => {
    const response = await prompt(input);
    const rawText = response.text;

    if (!rawText) {
      throw new Error("AI returned no text output for Micro-credential generation.");
    }
    
    const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    let parsedJson: any;
    
    try {
        parsedJson = JSON.parse(cleanJson);
    } catch (e) {
        console.error("Failed to parse JSON from AI for Microcredential:", e, "\nRaw text:", rawText);
        throw new Error("AI returned malformed JSON for Micro-credential generation.");
    }
    
    const validationResult = MicrocredentialOutputSchema.safeParse(parsedJson);
    if (validationResult.success) {
      return validationResult.data;
    }

    console.error("AI output for Microcredential failed validation.", validationResult.error);
    throw new Error(`AI output for Microcredential failed validation: ${validationResult.error.message}`);
  }
);
