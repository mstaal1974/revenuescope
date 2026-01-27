'use server';
/**
 * @fileOverview This file defines a flow for generating a marketable, non-accredited micro-credential from a formal Unit of Competency.
 */

import { ai } from '@/ai/genkit';
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
    model: 'googleai/gemini-2.5-flash',
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

**INPUT DATA:**
- Qualification: \`{{{qualification_code}}} - {{{qualification_title}}}\`
- Unit: \`{{{unit_code}}} - {{{unit_title}}}\`

**TASK:**
Based on the rules and logic above, generate a single JSON object for the micro-credential product derived from the provided Unit of Competency.

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
  }
}
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
      throw new Error("AI returned no valid output for Micro-credential generation.");
    }
    return output;
  }
);
