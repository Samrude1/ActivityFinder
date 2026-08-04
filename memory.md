# Memory — AI Concierge Integration & Security Audit Fixes

Last updated: 2026-08-04

## What was built

- **Backend (OpenRouter & AI Routes):**
  - Implemented `backend/src/services/aiConcierge.js` using OpenRouter API (`openai/gpt-4o-mini`) with structured JSON itinerary formatting and a smart fallback engine.
  - Implemented `backend/src/routes/ai.js` providing `/api/ai/concierge` endpoint with Free Tier rate-limiting (3 prompts/day) and unlimited access for Explorer Tier.
  - Mounted `/api/ai` in `backend/src/server.js`.
- **Frontend (React AI Concierge UI):**
  - Created `src/services/aiService.ts` for client API calls.
  - Created `src/components/AiConciergeModal.tsx` and `src/components/AiConciergeModal.css` for interactive AI travel assistant modal with prompt chips, duration & style filters, loading skeleton, schedule timeline, and activity cards.
  - Added gradient **AI Concierge 🪄** button in search tabs on `src/components/HomePage.tsx`.
- **Security Audit & Remediation:**
  - Audited code for IDOR, SQL injection, secrets, rate-limiting, and CORS configurations. Verified all pass security checks.
  - Overrode nested `tar` package in backend dependencies to `^7.5.7` to patch path traversal and arbitrary file overwrite issues. Backend is now 100% clean (0 vulnerabilities).
  - Overrode `minimatch` dependency to `^9.0.5` and upgraded `react-router-dom` to `^7.18.2` in frontend root dependencies to patch ReDoS and open redirect vulnerabilities.
  - Upgraded `@vitejs/plugin-react` to `^6.0.5` in root `package.json` to resolve build tool warnings/conflicts ("Invalid key: Expected never but received 'jsx'") with Vite 8.
  - Verified compilation (`npx tsc --noEmit`) and production builds (`npm run build`) complete successfully with no errors or warnings.
- **Translation Config Updates:**
  - Enabled `supportedLngs` and `nonExplicitSupportedLngs` in `src/i18n.ts` to map specific regional locales (like `fi-FI`) to their base languages (like `fi`), resolving a JSON parsing error in the browser caused by 404 HTML fallback redirects.
- **Documentation:**
  - Updated `README.md` to reflect AI Concierge capability.
  - Created `security-report.md` and `walkthrough.md` artifacts.

## Decisions made

- **OpenRouter API with gpt-4o-mini Model**: Used `openai/gpt-4o-mini` via OpenRouter endpoint for cost efficiency, fast response times, and structured JSON output.
- **Smart Fallback Engine**: If `OPENROUTER_API_KEY` is missing or temporarily fails, the backend seamlessly generates a fallback itinerary using actual local search data without crashing.
- **Tier Gating**: Free Tier users get 3 prompts per day, while Explorer Tier users get unlimited requests.
- **Upgraded React Router to v7.18.2**: Enabled full remediation of open redirect bypasses. Standard React Router v6 code matches React Router v7 APIs cleanly, maintaining compatibility.

## Problems solved

- Resolved TypeScript prop typing issue (`Location` vs `{ name, lat, lng }`) in `AiConciergeModal`.
- Resolved peer dependency conflicts in root npm updates by using `--legacy-peer-deps`.
- Resolved Vite 8 build warnings and "Invalid key: jsx" issues by upgrading `@vitejs/plugin-react` to v6.0.5.
- Resolved browser i18next translation loading crash for country-specific locales (e.g. `fi-FI` -> `fi` fallback).
- Checked and verified 0 TypeScript compilation errors (`npx tsc --noEmit`).

## Current state

- Codebase is fully audited, security patches applied, translation errors resolved, and compilation is healthy. AI Concierge is functional.

## Next session starts with

- Testing the live frontend UI in dev mode (`npm run dev`) or implementing additional Explorer tier features (such as exporting itineraries as Custom Lists or PDF).

## Open questions

- None.
