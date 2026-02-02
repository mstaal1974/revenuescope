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
Your primary task is to design a marketable, non-accredited micro-credential based on real-world **industry skills**, not on formal "Units of Competency". The unit code is provided for compliance mapping purposes only, not as the source of the product idea. Your entire creative process must start from the industry need, not the academic unit.

**THE CRITICAL MINDSET SHIFT:**
- **WRONG:** Start with Unit \`BSBFIN301\` -> Create course called "Process Financial Transactions".
- **RIGHT:** Start with industry skill "Retail Cash Management" -> Create course called "Cash Handling & POS Mastery for Retail Staff" -> Map it back to \`BSBFIN301\` as a pathway.

**GENERATION RULES:**
1.  **INDUSTRY SKILL FIRST:** Ignore the Unit title. Analyze the \`unit_title\` and \`qualification_title\` to identify the target **job role** and the **practical, on-the-job skill** someone in that role needs. Think about what a hiring manager would search for.
2.  **PRODUCT, NOT COMPLIANCE:** The micro-credential you design must be a **Non-Accredited Short Course** (2-4 hours) that solves an immediate problem for an employee or employer.
3.  **MARKETABLE NAMING:** Titles must be "Outcome-Based" and use industry language (e.g., "How to Manage Site Safety Checks"), not academic language (e.g., "Applying WHS Policies").
4.  **THE PATHWAY STRATEGY:** After designing the product, explicitly map this industry skill back to the accredited Unit of Competency as a "Stepping Stone" or "Credit Pathway". The value proposition is: *Learn the job skill now, get formal credit towards a full qualification later.*

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
- Unit (for mapping purposes only): \`{{{unit_code}}} - {{{unit_title}}}\`

**TASK:**
Based on the rules and logic above, generate the micro-credential product derived from the **industry skill** implicit in the provided context, AND the associated AI opportunity.
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
