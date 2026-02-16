# ScopeStack AI

This project is a Next.js application integrated with Firebase and Genkit for AI-driven RTO (Registered Training Organisation) audits.

## Getting Started

1. Clone the repository from GitHub.
2. Install dependencies: `npm install`.
3. Set up your environment variables in `.env.local`.
4. Run the development server: `npm run dev`.

## Deployment (GitHub Actions)

This project is configured to deploy to Firebase via GitHub Actions. To enable this:

1. Go to your GitHub Repository > Settings > Secrets and variables > Actions.
2. Add the following **Secrets**:
   - `FIREBASE_SERVICE_ACCOUNT`: The JSON key of your Firebase Service Account.
   - `FIREBASE_PROJECT_ID`: Your Firebase Project ID.
   - `GEMINI_API_KEY`: Your Google AI Studio API Key.
   - `NEXT_PUBLIC_FIREBASE_API_KEY`: Your Firebase Web API Key.
   - (And other `NEXT_PUBLIC_FIREBASE_*` variables from your config).

3. Push to the `main` branch to trigger a deployment.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS & Shadcn/UI
- **Database/Auth**: Firebase
- **AI**: Genkit with Gemini 2.5 Pro
