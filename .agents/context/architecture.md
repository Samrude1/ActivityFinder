# Architecture Context

## Stack

| Layer     | Technology                  | Role   |
| --------- | --------------------------- | ------ |
| Framework | React 18 + Vite 5           | Frontend UI and Build Tool |
| Language  | TypeScript                  | Type safety across the stack |
| UI        | Vanilla CSS                 | Styling (Variables & Design System) |
| Maps      | Leaflet.js                  | Interactive map rendering |
| Backend   | Node.js / Express           | API Server |
| Database  | PostgreSQL (Neon.tech) / SQLite | Data persistence |
| Auth      | JWT + bcrypt                | Authentication |

## System Boundaries

- `src/components/` — Core UI components for the application (Free tier).
- `src/contexts/` — Global state management (Auth).
- `src/services/` — API clients for fetching external data.
- `src/tiers/` — Modular Feature Tiers (e.g., Explorer plan specific features).
- `backend/src/controllers/` — API route handlers.
- `backend/src/middleware/` — Authentication and rate limiting logic.
- `backend/src/models/` — Database interactions (PostgreSQL and SQLite wrappers).
- `backend/src/routes/` — Express route definitions.
- `backend/src/tiers/` — Tier-specific backend features.

## Storage Model

- **PostgreSQL / SQLite Database**: Stores user accounts, favorites, custom lists, list items, and search limit tracking.
- **Local Storage**: Currently used for some client-side persistence (implied by standard practices, though DB holds source of truth for favorites).

## Auth and Access Model

- **Authentication**: JWT-based authentication. Users log in with email/password. Passwords hashed via bcrypt.
- **Tiers**: Subscription tiers (Free, Explorer) dictate feature access. Free tier has search limits (50/day) and favorites limits (20 max).
- **Access Control**: Features and routes are gated based on the user's tier.

## Invariants

1. **Modular Tier Architecture**: Features for higher tiers must be isolated in `src/tiers/` and `backend/src/tiers/` to ensure independent development and prevent leaking premium features to the Free tier.
2. **Open Data Usage**: Core discovery uses open APIs (Nominatim, Overpass API, OpenStreetMap). No proprietary API keys required for basic functionality.
