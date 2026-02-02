'use server';
/**
 * @fileOverview This file defines a flow for generating a marketable, non-accredited micro-credential from a formal Unit of Competency.
 */

import { ai, auditModel } from '@/ai/genkit';
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
    output: { schema: MicrocredentialOutputSchema },
    model: auditModel,
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
Based on the rules and logic above, generate the micro-credential product derived from the provided Unit of Competency AND the associated AI opportunity.
`,
});

const generateMicrocredentialFlow = ai.defineFlow(
  {
    name: 'generateMicrocredentialFlow',
    inputSchema: MicrocredentialInputSchema,
    outputSchema: MicrocredentialOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    
    if (!output) {
      throw new Error("AI returned no structured output for Micro-credential generation.");
    }
    
    return output;
  }
);
