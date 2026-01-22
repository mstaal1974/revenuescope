# **App Name**: RevenueScope AI

## Core Features:

- Revenue Audit Engine: Use the Gemini API to analyze an RTO's curriculum scope and identify revenue opportunities.
- Pricing Calibration Tool: Apply a 3-step pricing calibration model based on intensity tagging and market multipliers to determine audit pricing.
- Curriculum Content Blueprint Tool: Leverage Gemini to create content blueprints, sales kits, and badge previews for individual courses. The LLM uses reasoning as a tool to determine whether information should be included in its response.
- RTO Scope Fetcher: Fetch RTO scope from the TGA registry, with a Gemini Search fallback if the direct registry fails.
- Multi-Perspective Dashboard: Display audit results in a split-view dashboard with perspectives for both RTOs (LTV/Sales) and students (Skills/Career Impact).
- Interactive UI: Landing page will have a terminal-style interface, glassmorphism, and animated transitions.
- Lead Capture Overlay: Implement a 'locked' overlay on the audit results that requires an email input to 'Unlock Full Data'.

## Style Guidelines:

- Primary color: Vibrant Blue (#4169E1), echoing the 'High-End Fintech' aesthetic for trustworthiness and forward-thinking innovation.
- Background color: Very light desaturated blue (#F0F8FF) for a clean and professional feel.
- Accent color: Deep slate (#2F4F4F) to provide contrast and ground the interface, ensuring key elements stand out clearly.
- Primary font: 'Inter' (sans-serif) for headlines and body text, weights 400, 500 and 900. Note: currently only Google Fonts are supported.
- Secondary font: 'JetBrains Mono' (monospace) for data and technical elements. Note: currently only Google Fonts are supported.
- Aggressive rounding (rounded-[3rem] for sections, rounded-2xl for cards). Floating shadows (shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)]).
- Subtle slide-ins, fade-ins, and a 'Terminal Cursor' blinking effect for loading logs.