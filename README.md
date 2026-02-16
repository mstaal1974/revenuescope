# ScopeStack AI

This project is a Next.js application integrated with Firebase and Genkit for AI-driven RTO (Registered Training Organisation) audits.

## Target Repository
This code is configured for: **mstaal1974/scopestack-ai**

## Getting Started

1. **Initialize Git:**
   Run the following commands in your terminal to initialize and push to your new repository:
   ```bash
   git init
   git remote add origin https://github.com/mstaal1974/scopestack-ai.git
   git add .
   git commit -m "Initial push: Fixed serialization and lead capture gate"
   git branch -M main
   git push -u origin main
   ```

2. **Recommended Git Configuration:**
   Run this command to ensure standard pull behavior without unnecessary merge commits:
   ```bash
   git config pull.rebase false
   ```

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```

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
- **Database/Auth**: Firebase Firestore & Auth
- **AI**: Genkit with Gemini 2.5 Pro (Optimized for Australian VET markets)
