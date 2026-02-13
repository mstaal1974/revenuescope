'use server';
import '@/ai/genkit';

// Import flows so ai.defineFlow() runs and registers them
import '@/ai/flows/generate-stage1-analysis';
import '@/ai/flows/generate-skills-heatmap';
import '@/ai/flows/generate-product-ecosystem';
import '@/ai/flows/generate-microcredential';
import '@/ai/flows/generate-course-timeline';
import '@/ai/flows/generate-learning-outcomes';
import '@/ai/flows/generate-sector-campaign-kit';
import '@/ai/flows/fetch-scope-fallback';
import '@/ai/flows/generate-compliance-analysis';
