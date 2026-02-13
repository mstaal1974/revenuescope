'use server';
/**
 * @fileOverview This file defines a flow for generating a compliance self-assurance analysis.
 */

import { ai, auditModel } from '@/ai/genkit';
import { 
  FullAuditInputSchema, 
  ComplianceAnalysisOutputSchema, 
  type FullAuditInput, 
  type ComplianceAnalysisOutput 
} from '@/ai/types';

export async function generateComplianceAnalysis(
  input: FullAuditInput
): Promise<ComplianceAnalysisOutput> {
  return generateComplianceAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'complianceAnalysisPrompt',
  input: { schema: FullAuditInputSchema },
  output: { schema: ComplianceAnalysisOutputSchema },
  model: auditModel,
  prompt: `
    You are a Senior RTO Compliance Consultant specializing in ASQA Self-Assurance Standards.
    
    TASK:
    Analyze the provided RTO Scope data to generate a "Self-Assurance Health Dashboard".
    You must identify "Validation Gaps" where industry demand signals (from your training data on Australian labor markets) might be misaligned with standard VET delivery.
    
    INPUT DATA:
    - RTO ID: {{rtoId}}
    - Scope Dataset: {{manualScopeDataset}}
    
    REQUIRED OUTPUT LOGIC:
    1. self_assurance_score: An aggregate score (0-100) based on the complexity and regulatory risk of the training packages in scope.
    2. validation_gaps: Analyze 3-4 specific units from the scope. Compare "TGA Mapping" (Academic) vs "Industry Alignment" (Live Job Skills). 
       Identify if the RTO is likely assessing skills that are becoming obsolete or missing critical tech requirements.
    3. assessor_variance: Generate 4 simulated trainer profiles. Assign pass rates and compliance scores. 
       Flag at least one trainer where a high pass rate (>95%) correlates with a lower compliance score, suggesting marking inflation.
    4. monitoring_trend: Generate 5 months of trend data for "Adherence" and "Quality".
    5. live_alerts: Generate 3 sharp, urgent compliance alerts based on the specific Training Packages in the dataset (e.g., if ICT is present, alert about Cyber Security unit currency).
    
    Accuracy regarding Australian VET standards is critical. Ensure the output is strictly valid JSON.
  `,
});

const generateComplianceAnalysisFlow = ai.defineFlow(
  {
    name: 'generateComplianceAnalysisFlow',
    inputSchema: FullAuditInputSchema,
    outputSchema: ComplianceAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("AI could not generate compliance analysis.");
    }
    return output;
  }
);
